"use client"
import { useEffect, useRef, useState, useCallback } from "react"

type ActivationFn = "relu" | "tanh" | "sigmoid"
type Dataset = "circle" | "xor" | "gaussian" | "spiral"

// --- Math Helpers ---
const relu = (x: number) => Math.max(0, x)
const drelu = (x: number) => (x > 0 ? 1 : 0)
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
const dsigmoid = (x: number) => sigmoid(x) * (1 - sigmoid(x))
const tanh = (x: number) => Math.tanh(x)
const dtanh = (x: number) => 1 - Math.pow(Math.tanh(x), 2)

const activate = (x: number, fn: ActivationFn) => {
  if (fn === "relu") return relu(x)
  if (fn === "tanh") return tanh(x)
  return sigmoid(x)
}

const derActivate = (x: number, fn: ActivationFn) => {
  if (fn === "relu") return drelu(x)
  if (fn === "tanh") return dtanh(x)
  return dsigmoid(x)
}

// --- Data Generation ---
function getDataset(type: Dataset, n = 200) {
  const points: { x: number; y: number; label: number }[] = []
  for (let i = 0; i < n; i++) {
    let x = (Math.random() - 0.5) * 2
    let y = (Math.random() - 0.5) * 2
    let label = 0
    if (type === "circle") {
      label = x * x + y * y < 0.36 ? 1 : 0
    } else if (type === "xor") {
      label = x * y > 0 ? 1 : 0
    } else if (type === "gaussian") {
      label = x > 0 ? 1 : 0
    } else if (type === "spiral") {
      const r = i / n * 1
      const t = 1.75 * i / n * 2 * Math.PI + (i % 2 === 0 ? 0 : Math.PI)
      x = r * Math.sin(t) + (Math.random() - 0.5) * 0.1
      y = r * Math.cos(t) + (Math.random() - 0.5) * 0.1
      label = i % 2 === 0 ? 1 : 0
    }
    points.push({ x, y, label })
  }
  return points
}

// --- Neural Engine ---
class Layer {
  weights: number[][]
  biases: number[]
  inputs: number[] = []
  outputs: number[] = []
  gradsW: number[][]
  gradsB: number[]

  constructor(inSize: number, outSize: number) {
    this.weights = Array.from({ length: outSize }, () =>
      Array.from({ length: inSize }, () => (Math.random() - 0.5) * 0.5)
    )
    this.biases = Array(outSize).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    this.gradsW = Array.from({ length: outSize }, () => Array(inSize).fill(0))
    this.gradsB = Array(outSize).fill(0)
  }

  forward(inputs: number[], activation: ActivationFn) {
    this.inputs = inputs
    this.outputs = this.weights.map((row, i) => {
      const sum = row.reduce((s, w, j) => s + w * inputs[j], 0) + this.biases[i]
      return activate(sum, activation)
    })
    return this.outputs
  }

  // Simplified backprop for interactive playground
  backward(deltas: number[], lr: number, activation: ActivationFn) {
    const nextDeltas = Array(this.inputs.length).fill(0)
    for (let i = 0; i < this.weights.length; i++) {
      const d = deltas[i] * derActivate(this.outputs[i], activation)
      for (let j = 0; j < this.weights[i].length; j++) {
        nextDeltas[j] += d * this.weights[i][j]
        this.weights[i][j] -= lr * d * this.inputs[j]
      }
      this.biases[i] -= lr * d
    }
    return nextDeltas
  }
}

// --- Main Component ---
export default function NeuralLite() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layers, setLayers] = useState<number[]>([4, 4]) // Neurons per hidden layer
  const [features, setFeatures] = useState({
    x1: true, x2: true, x1sq: false, x2sq: false, x1x2: false, sinx1: false, sinx2: false
  })
  const [activation, setActivation] = useState<ActivationFn>("tanh")
  const [datasetType, setDatasetType] = useState<Dataset>("circle")
  const [learningRate, setLearningRate] = useState(0.03)
  const [running, setRunning] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState(0)
  
  const networkRef = useRef<Layer[]>([])
  const datasetRef = useRef(getDataset("circle"))
  const timerRef = useRef<any>(null)

  const getFeatures = (x: number, y: number) => {
    const vals: number[] = []
    if (features.x1) vals.push(x)
    if (features.x2) vals.push(y)
    if (features.x1sq) vals.push(x * x)
    if (features.x2sq) vals.push(y * y)
    if (features.x1x2) vals.push(x * y)
    if (features.sinx1) vals.push(Math.sin(x))
    if (features.sinx2) vals.push(Math.sin(y))
    return vals
  }

  const buildNetwork = useCallback(() => {
    const inSize = Object.values(features).filter(Boolean).length
    const net: Layer[] = []
    let currentIn = inSize
    for (const size of layers) {
      net.push(new Layer(currentIn, size))
      currentIn = size
    }
    net.push(new Layer(currentIn, 1)) // Output layer
    networkRef.current = net
    setEpoch(0)
    setLoss(0)
  }, [layers, features])

  const forwardPass = (x: number, y: number) => {
    let current = getFeatures(x, y)
    networkRef.current.forEach((layer, i) => {
      const isLast = i === networkRef.current.length - 1
      current = layer.forward(current, isLast ? "sigmoid" : activation)
    })
    return current[0]
  }

  const step = useCallback(() => {
    if (networkRef.current.length === 0) return
    let totalLoss = 0
    const batch = 10
    for (let i = 0; i < batch; i++) {
      const p = datasetRef.current[Math.floor(Math.random() * datasetRef.current.length)]
      const pred = forwardPass(p.x, p.y)
      const error = pred - p.label
      totalLoss += error * error
      
      // Backward
      let deltas = [error]
      for (let j = networkRef.current.length - 1; j >= 0; j--) {
        const isLast = j === networkRef.current.length - 1
        deltas = networkRef.current[j].backward(deltas, learningRate, isLast ? "sigmoid" : activation)
      }
    }
    setLoss(totalLoss / batch)
    setEpoch(prev => prev + 1)
  }, [activation, learningRate])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    
    // Background mesh
    const res = 8
    for(let i=0; i<W; i+=res) {
      for(let j=0; j<H; j+=res) {
        const x = (i/W)*2 - 1
        const y = (j/H)*2 - 1
        const pred = forwardPass(x, y)
        const alpha = Math.abs(pred - 0.5) * 0.4
        ctx.fillStyle = pred > 0.5 ? `rgba(105, 246, 184, ${alpha})` : `rgba(255, 84, 73, ${alpha})`
        ctx.fillRect(i, j, res, res)
      }
    }

    // Dataset points
    datasetRef.current.forEach(p => {
      ctx.beginPath()
      ctx.arc((p.x + 1)/2 * W, (p.y + 1)/2 * H, 3, 0, Math.PI*2)
      ctx.fillStyle = p.label === 1 ? "#69f6b8" : "#ff5449"
      ctx.strokeStyle = "white"
      ctx.lineWidth = 0.5
      ctx.fill()
      ctx.stroke()
    })
  }, [features, layers, activation])

  useEffect(() => {
    buildNetwork()
    datasetRef.current = getDataset(datasetType)
  }, [buildNetwork, datasetType])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        step()
        draw()
      }, 30)
    } else {
      clearInterval(timerRef.current)
      draw()
    }
    return () => clearInterval(timerRef.current)
  }, [running, step, draw])

  // --- UI Helpers ---
  const toggleFeature = (f: keyof typeof features) => {
    setFeatures(prev => {
      const next = { ...prev, [f]: !prev[f] }
      if (Object.values(next).filter(Boolean).length === 0) return prev
      return next
    })
    setRunning(false)
  }

  const addLayer = () => {
    if (layers.length < 4) setLayers([...layers, 4])
    setRunning(false)
  }
  const removeLayer = () => {
    if (layers.length > 0) setLayers(layers.slice(0, -1))
    setRunning(false)
  }
  const updateNeurons = (idx: number, delta: number) => {
    const next = [...layers]
    next[idx] = Math.max(1, Math.min(8, next[idx] + delta))
    setLayers(next)
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-6 bg-surface-container-low p-6 border border-outline-variant/15 relative overflow-hidden clipped-tr">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary" />

      {/* Top Controls */}
      <div className="flex flex-wrap gap-8 items-start relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-mono text-on-surface-variant tracking-widest">Dataset</label>
          <div className="flex gap-1 bg-surface-container p-1 border border-outline-variant/10">
            {(["circle", "xor", "gaussian", "spiral"] as Dataset[]).map(t => (
              <button key={t} onClick={() => setDatasetType(t)} className={`px-2 py-1 text-[10px] font-mono uppercase transition-all ${datasetType === t ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-mono text-on-surface-variant tracking-widest">Features</label>
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {Object.keys(features).map(f => (
              <button key={f} onClick={() => toggleFeature(f as any)} className={`px-2 py-1 text-[9px] font-mono uppercase border transition-all ${features[f as keyof typeof features] ? "bg-primary/20 border-primary text-primary" : "border-outline-variant/30 text-on-surface-variant opacity-50"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-10">
           <div className="text-right">
             <p className="text-[10px] uppercase font-mono text-on-surface-variant">Epoch</p>
             <p className="text-2xl font-headline font-bold text-on-surface">{epoch.toLocaleString().padStart(6, '0')}</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] uppercase font-mono text-on-surface-variant">Loss</p>
             <p className="text-2xl font-headline font-bold text-secondary">{loss.toFixed(4)}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Network Map */}
        <div className="flex-1 bg-black/40 border border-outline-variant/10 p-4 min-size-[300px] relative overflow-hidden flex flex-col items-center justify-center">
           <div className="absolute top-2 left-2 text-[8px] font-mono text-primary/40 uppercase">Architecture_Visualization</div>
           
           <div className="flex gap-12 items-center">
              {/* Features Input List */}
              <div className="flex flex-col gap-2">
                {Object.entries(features).filter(([_, v]) => v).map(([k]) => (
                  <div key={k} className="size-8 border border-primary/40 bg-primary/5 flex items-center justify-center text-[8px] font-mono text-primary uppercase">{k}</div>
                ))}
              </div>

              {/* Hidden Layers */}
              <div className="flex gap-8">
                {layers.map((n, li) => (
                  <div key={li} className="flex flex-col gap-1 items-center">
                    <div className="flex flex-col gap-1">
                      {Array.from({ length: n }).map((_, ni) => (
                        <div key={ni} className="size-6 border border-primary bg-black/80 flex items-center justify-center text-[8px] font-mono text-primary shadow-[0_0_8px_rgba(105,246,184,0.1)]">
                          {running ? <div className="size-1 rounded-full bg-primary animate-ping" /> : null}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button onClick={() => updateNeurons(li, -1)} className="size-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-center text-[10px]">-</button>
                      <button onClick={() => updateNeurons(li, 1)} className="size-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-center text-[10px]">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Output Layer */}
              <div className="size-10 border-2 border-secondary bg-secondary/5 flex items-center justify-center text-[10px] font-mono text-secondary">OUT</div>
           </div>

           {/* Layer Controls Underneath */}
           <div className="mt-8 flex gap-4">
              <button onClick={addLayer} className="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-[10px] font-mono uppercase">+ Add Layer</button>
              <button onClick={removeLayer} className="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-[10px] font-mono uppercase">- Remove Layer</button>
           </div>
        </div>

        {/* Dynamic Heatmap Output */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
           <div className="aspect-square bg-[#0d1326] border border-outline-variant/20 relative group overflow-hidden">
              <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
                <span className="text-[8px] font-mono text-on-surface-variant uppercase">Decision_Map_v3.2</span>
                <span className="text-[8px] font-mono text-primary/50 uppercase">Sync: Stable</span>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setRunning(!running)} className={`flex-1 py-3 font-headline font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${running ? "bg-error text-white shadow-error/20" : "bg-primary text-on-primary shadow-primary/20 hover:scale-[1.02]"}`}>
                {running ? "Halt Simulation" : "Initiate Training"}
              </button>
              <button onClick={() => { setRunning(false); buildNetwork(); }} className="px-4 py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 transition-all text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
           </div>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="mt-4 pt-4 border-t border-outline-variant/10 flex flex-wrap gap-8 items-center relative z-10">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant">Activation:</span>
            <select value={activation} onChange={(e) => setActivation(e.target.value as any)} className="bg-surface-container-high border-none text-[10px] font-mono uppercase text-primary focus:ring-0 cursor-pointer">
              <option value="relu">ReLU</option>
              <option value="tanh">Tanh</option>
              <option value="sigmoid">Sigmoid</option>
            </select>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant">Rate:</span>
            <input type="range" min={0.001} max={0.3} step={0.001} value={learningRate} onChange={(e) => setLearningRate(Number(e.target.value))} className="w-24 accent-primary h-1 bg-surface-container-high rounded-none appearance-none cursor-pointer" />
            <span className="text-[10px] font-mono text-primary w-8">{learningRate.toFixed(3)}</span>
         </div>
         <p className="ml-auto text-[10px] font-mono text-on-surface-variant italic opacity-50">HEURISTIC_ENGINE_v4_ACTIVE</p>
      </div>
    </div>
  )
}
