"use client"
import { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from "react"

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

function getDataset(type: Dataset, n = 200) {
  const points: { x: number; y: number; label: number }[] = []
  for (let i = 0; i < n; i++) {
    let x = (Math.random() - 0.5) * 2; let y = (Math.random() - 0.5) * 2
    let label = 0
    if (datasetLogic[type]) label = datasetLogic[type](x, y, i, n)
    points.push({ x, y, label })
  }
  return points
}

const datasetLogic: Record<string, any> = {
  circle: (x: number, y: number) => x * x + y * y < 0.36 ? 1 : 0,
  xor: (x: number, y: number) => x * y > 0 ? 1 : 0,
  gaussian: (x: number, y: number) => x > 0 ? 1 : 0,
  spiral: (x: number, y: number, i: number, n: number) => {
    const r = i / n * 1; const t = 1.75 * i / n * 2 * Math.PI + (i % 2 === 0 ? 0 : Math.PI)
    const sx = r * Math.sin(t) + (Math.random() - 0.5) * 0.1
    const sy = r * Math.cos(t) + (Math.random() - 0.5) * 0.1
    return i % 2 === 0 ? 1 : 0
  }
}

class Layer {
  weights: number[][]; biases: number[]; inputs: number[] = []; outputs: number[] = []
  constructor(inSize: number, outSize: number) {
    this.weights = Array.from({ length: outSize }, () => Array.from({ length: inSize }, () => (Math.random() - 0.5) * 0.4))
    this.biases = Array(outSize).fill(0).map(() => (Math.random() - 0.5) * 0.1)
  }
  forward(inputs: number[], activation: ActivationFn) {
    this.inputs = inputs
    this.outputs = this.weights.map((row, i) => {
      const sum = row.reduce((s, w, j) => s + w * inputs[j], 0) + this.biases[i]
      return activate(sum, activation)
    })
    return this.outputs
  }
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

const NodeHeatmap = ({ valFn, size = 32, label }: { valFn: (x: number, y: number) => number, size?: number, label?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const s = 32; const res = 4; ctx.clearRect(0,0,s,s)
    for (let i = 0; i < s; i += res) {
      for (let j = 0; j < s; j += res) {
        const x = (i / s) * 2 - 1; const y = (j / s) * 2 - 1
        const val = valFn(x, y); const alpha = Math.abs(val) * 1.0
        ctx.fillStyle = val > 0 ? `rgba(105, 246, 184, ${alpha})` : `rgba(255, 84, 73, ${alpha})`
        ctx.fillRect(i, j, res, res)
      }
    }
  }, [valFn])
  return (
    <div className={`size-8 border border-outline-variant/30 bg-[#0d1326] relative overflow-hidden group node-anchor shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all hover:scale-110 hover:border-primary/50`}>
      <canvas ref={canvasRef} width={32} height={32} className="w-full h-full object-cover" />
      {label && <div className="absolute inset-0 flex items-center justify-center pointer-events-none font-mono text-[7px] text-white/40 group-hover:text-white transition-colors">{label}</div>}
    </div>
  )
}

export default function NeuralLite() {
  const canvasRef = useRef<HTMLCanvasElement>(null); const archRef = useRef<HTMLDivElement>(null)
  const [layers, setLayers] = useState<number[]>([4, 4]); const [running, setRunning] = useState(false)
  const [features, setFeatures] = useState({ x1: true, x2: true, x1sq: false, x2sq: false, x1x2: false, sinx1: false, sinx2: false })
  const [activation, setActivation] = useState<ActivationFn>("tanh"); const [datasetType, setDatasetType] = useState<Dataset>("circle")
  const [learningRate, setLearningRate] = useState(0.03); const [epoch, setEpoch] = useState(0); const [loss, setLoss] = useState(0)
  const [weightsVersion, setWeightsVersion] = useState(0); const networkRef = useRef<Layer[]>([]); const datasetRef = useRef(getDataset("circle")); const timerRef = useRef<any>(null)

  const activeFeatures = useMemo(() => Object.entries(features).filter(([_, v]) => v).map(([k]) => k), [features])
  const getFeatureVal = (k: string, x: number, y: number) => {
    switch (k) {
      case "x1": return x; case "x2": return y; case "x1sq": return x * x; case "x2sq": return y * y; case "x1x2": return x * y; case "sinx1": return Math.sin(x); case "sinx2": return Math.sin(y); default: return 0
    }
  }
  const getAllFeatures = (x: number, y: number) => activeFeatures.map(f => getFeatureVal(f, x, y))

  const buildNetwork = useCallback(() => {
    const inSize = activeFeatures.length; const net: Layer[] = []; let currentIn = inSize
    for (const size of layers) { net.push(new Layer(currentIn, size)); currentIn = size }
    net.push(new Layer(currentIn, 1)); networkRef.current = net
    setEpoch(0); setLoss(0); setWeightsVersion(v => v + 1)
  }, [layers, activeFeatures])

  const forwardPass = (x: number, y: number, stopAt?: { layer: number, node: number }) => {
    let current = getAllFeatures(x, y)
    for (let i = 0; i < networkRef.current.length; i++) {
        const layer = networkRef.current[i]; const isLast = i === networkRef.current.length - 1
        current = layer.forward(current, isLast ? "sigmoid" : activation)
        if (stopAt && stopAt.layer === i) return current[stopAt.node]
    }
    return current[0]
  }

  const step = useCallback(() => {
    if (networkRef.current.length === 0) return
    let totalLoss = 0; const batch = 8;
    for (let i = 0; i < batch; i++) {
      const p = datasetRef.current[Math.floor(Math.random() * datasetRef.current.length)]
      const pred = forwardPass(p.x, p.y); const error = pred - p.label; totalLoss += error * error; let deltas = [error]
      for (let j = networkRef.current.length - 1; j >= 0; j--) {
        const isLast = j === networkRef.current.length - 1; deltas = networkRef.current[j].backward(deltas, learningRate, isLast ? "sigmoid" : activation)
      }
    }
    setLoss(totalLoss / batch); setEpoch(e => e + 1); if (epoch % 3 === 0) setWeightsVersion(v => v + 1)
  }, [activation, learningRate, epoch])

  const drawMainCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const W = canvas.width, H = canvas.height; ctx.clearRect(0,0,W,H); const res = 12
    for(let i=0; i<W; i+=res) {
      for(let j=0; j<H; j+=res) {
        const x = (i/W)*2 - 1; const y = (j/H)*2 - 1
        const pred = forwardPass(x, y); const alpha = Math.abs(pred - 0.5) * 0.45
        ctx.fillStyle = pred > 0.5 ? `rgba(105, 246, 184, ${alpha})` : `rgba(255, 84, 73, ${alpha})`
        ctx.fillRect(i, j, res, res)
      }
    }
    datasetRef.current.forEach(p => {
      ctx.beginPath(); ctx.arc((p.x + 1)/2 * W, (p.y + 1)/2 * H, 4, 0, Math.PI*2); ctx.fillStyle = p.label === 1 ? "#69f6b8" : "#ff5449"
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1; ctx.fill(); ctx.stroke()
    })
  }, [features, layers, activation])

  useEffect(() => { buildNetwork(); datasetRef.current = getDataset(datasetType) }, [buildNetwork, datasetType])
  useEffect(() => {
    if (running) { timerRef.current = setInterval(() => { step(); drawMainCanvas(); }, 40) }
    else { clearInterval(timerRef.current); drawMainCanvas() }
    return () => clearInterval(timerRef.current)
  }, [running, step, drawMainCanvas])

  const [nodeCenters, setNodeCenters] = useState<any[]>([])
  const updateCenters = useCallback(() => {
    if (!archRef.current) return
    const archRect = archRef.current.getBoundingClientRect(); const anchors = archRef.current.querySelectorAll('.node-anchor')
    setNodeCenters(Array.from(anchors).map(el => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left - archRect.left + rect.width / 2, y: rect.top - archRect.top + rect.height / 2 }
    }))
  }, [layers, activeFeatures])

  useLayoutEffect(() => { updateCenters(); window.addEventListener('resize', updateCenters); return () => window.removeEventListener('resize', updateCenters) }, [updateCenters])

  const connections = useMemo(() => {
    if (nodeCenters.length === 0 || networkRef.current.length === 0) return []
    const lines: any[] = []; let currentIdx = 0; const inputCount = activeFeatures.length
    const firstLayerCount = layers.length > 0 ? layers[0] : 1; const weights1 = networkRef.current[0].weights
    for (let i = 0; i < inputCount; i++) {
      for (let j = 0; j < firstLayerCount; j++) {
        lines.push({ x1: nodeCenters[i]?.x, y1: nodeCenters[i]?.y, x2: nodeCenters[inputCount + j]?.x, y2: nodeCenters[inputCount + j]?.y, weight: weights1[j][i] })
      }
    }
    currentIdx = inputCount
    for (let l = 0; l < networkRef.current.length - 1; l++) {
        const fromCount = l === 0 ? layers[0] : layers[l-1]; const toCount = l + 1 === networkRef.current.length - 1 ? 1 : layers[l+1]; const weights = networkRef.current[l+1].weights
        for (let i = 0; i < fromCount; i++) {
            for (let j = 0; j < toCount; j++) {
                lines.push({ x1: nodeCenters[currentIdx + i]?.x, y1: nodeCenters[currentIdx + i]?.y, x2: nodeCenters[currentIdx + fromCount + j]?.x, y2: nodeCenters[currentIdx + fromCount + j]?.y, weight: weights[j][i] })
            }
        }
        currentIdx += fromCount
    }
    return lines
  }, [nodeCenters, weightsVersion])

  return (
    <div className="flex flex-col gap-6 bg-[#040812] p-8 border border-outline-variant/10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-secondary/40" />

      {/* Control Surface */}
      <div className="flex flex-wrap gap-12 items-start relative z-20">
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-mono text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2">
             <div className="size-1 bg-primary animate-pulse" /> TARGET_DATASET
          </label>
          <div className="flex gap-2">
            {(["circle", "xor", "gaussian", "spiral"] as Dataset[]).map(t => (
              <button key={t} onClick={() => setDatasetType(t)} className={`px-4 py-2 text-[10px] font-mono uppercase border transition-all ${datasetType === t ? "bg-primary text-on-primary border-primary shadow-[0_0_20px_rgba(105,246,184,0.3)]" : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-white"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-mono text-primary/60 uppercase tracking-[0.2em]">EXTRACT_FEATURES</label>
          <div className="flex flex-wrap gap-2 max-w-[340px]">
            {Object.keys(features).map(f => (
              <button key={f} onClick={() => { setFeatures(prev => ({...prev, [f]: !prev[(f as any)]})); setRunning(false); }} className={`px-3 py-1.5 text-[10px] font-mono uppercase border transition-all ${features[f as keyof typeof features] ? "bg-primary/10 border-primary text-primary" : "border-outline-variant/20 text-on-surface-variant opacity-40 hover:opacity-100"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex gap-12 text-right">
           <div>
             <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Iter.Epoch</p>
             <p className="text-3xl font-headline font-black text-on-surface tabular-nums">{epoch.toLocaleString().padStart(6, '0')}</p>
           </div>
           <div>
             <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Grad.Loss</p>
             <p className="text-3xl font-headline font-black text-secondary tabular-nums">{loss.toFixed(6)}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative z-10 mt-4">
        {/* Network Graph */}
        <div ref={archRef} className="flex-1 bg-surface-container-low/20 border border-outline-variant/10 p-12 min-h-[460px] relative overflow-hidden flex items-center justify-center">
           <div className="absolute top-4 left-4 text-[9px] font-mono text-primary/20 uppercase">Tactical_Architecture_Map // v10.2</div>
           
           <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             <defs>
               <filter id="glow">
                 <feGaussianBlur stdDeviation="1" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
             </defs>
             {connections.map((c, i) => {
               const absWeight = Math.abs(c.weight); if (isNaN(c.x1)) return null
               return (
                 <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} 
                   stroke={c.weight > 0 ? "#69f6b8" : "#ff5449"} 
                   strokeWidth={Math.max(0.4, absWeight * 7)} 
                   strokeOpacity={Math.min(0.7, 0.1 + absWeight)}
                   className={`transition-all duration-300 ${running ? "animate-pulse" : ""}`}
                 />
               )
             })}
           </svg>

           <div className="flex gap-24 items-center relative z-10 w-full justify-between">
              <div className="flex flex-col gap-5">
                <span className="text-[9px] font-mono text-primary/40 uppercase mb-2 text-center">In_Feat</span>
                {activeFeatures.map((f) => (
                  <div key={f} className="group flex flex-col items-center gap-1.5 transition-all">
                    <NodeHeatmap valFn={(x, y) => getFeatureVal(f, x, y)} label={f} />
                  </div>
                ))}
              </div>

              {layers.map((n, li) => (
                <div key={li} className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-primary/40 uppercase mb-4">Hid_L{li+1}</span>
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: n }).map((_, ni) => (
                      <NodeHeatmap key={ni} valFn={(x, y) => forwardPass(x, y, { layer: li, node: ni })} />
                    ))}
                  </div>
                  <div className="mt-8 flex gap-1.5">
                    <button onClick={() => { const next = [...layers]; next[li] = Math.max(1, next[li]-1); setLayers(next); setRunning(false); }} className="size-6 bg-[#0d1326] border border-outline-variant/30 hover:border-primary/50 flex items-center justify-center text-[14px] text-on-surface-variant hover:text-white transition-all shadow-inner border-corner-tl">-</button>
                    <button onClick={() => { const next = [...layers]; next[li] = Math.min(6, next[li]+1); setLayers(next); setRunning(false); }} className="size-6 bg-[#0d1326] border border-outline-variant/30 hover:border-primary/50 flex items-center justify-center text-[14px] text-on-surface-variant hover:text-white transition-all shadow-inner border-corner-tr">+</button>
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono text-secondary/40 uppercase mb-4">Result_Out</span>
                <NodeHeatmap valFn={(x, y) => forwardPass(x, y)} size={48} label="Ω" />
              </div>
           </div>

           <div className="absolute bottom-6 flex gap-6">
              <button onClick={() => { if(layers.length < 4) setLayers([...layers, 4]); setRunning(false); }} className="px-6 py-2 bg-surface-container/60 border border-outline-variant/20 text-[10px] font-mono uppercase hover:bg-primary/20 hover:border-primary/40 transition-all font-bold tracking-widest">+ Layer_Integrate</button>
              <button onClick={() => { if(layers.length > 0) setLayers(layers.slice(0, -1)); setRunning(false); }} className="px-6 py-2 bg-surface-container/60 border border-outline-variant/20 text-[10px] font-mono uppercase hover:bg-error/20 hover:border-error/40 transition-all font-bold tracking-widest">- Layer_Detach</button>
           </div>
        </div>

        {/* Holistic Heatmap */}
        <div className="w-full lg:w-[460px] flex flex-col gap-8">
           <div className="aspect-square bg-[#080d19] border border-outline-variant/10 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
              <canvas ref={canvasRef} width={460} height={460} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 pointer-events-none border border-primary/10 shadow-[inner_0_0_60px_rgba(0,0,0,0.8)]" />
              <div className="absolute top-5 right-5 flex flex-col gap-1 items-end pointer-events-none">
                <div className="bg-surface/90 border border-outline-variant/20 p-4 backdrop-blur-md flex flex-col items-end gap-1 shadow-2xl">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="size-1 rounded-full bg-secondary animate-ping" />
                      <span className="text-[11px] font-mono text-on-surface uppercase tracking-widest font-black">SYTH_CORE_v10</span>
                   </div>
                   <span className={`text-[10px] font-mono uppercase font-bold tracking-widest ${running ? "text-primary" : "text-on-surface-variant"}`}>
                     {running ? "Simulating_Heuristics..." : "Engine_Bypassed"}
                   </span>
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setRunning(!running)} className={`flex-1 py-5 font-headline font-black uppercase tracking-[0.4em] text-sm transition-all shadow-2xl relative overflow-hidden group ${running ? "bg-error text-white hover:bg-error/80" : "bg-primary text-on-primary hover:bg-primary-dim shadow-primary/20"}`}>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                {running ? "Terminate_Neural_Link" : "Initiate_Link_Sync"}
              </button>
              <button onClick={() => { setRunning(false); buildNetwork(); }} className="px-6 py-5 bg-surface-container-high hover:bg-white/10 border border-outline-variant/20 text-on-surface transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] hover:rotate-180 transition-transform duration-500">sync</span>
              </button>
           </div>
        </div>
      </div>

      {/* Param Surface */}
      <div className="mt-8 pt-8 border-t border-outline-variant/10 flex flex-wrap gap-16 items-center relative z-20">
         <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono uppercase text-primary/40 tracking-[0.2em] font-bold">Act.Pipeline</span>
            <div className="flex border border-outline-variant/20 rounded-sm overflow-hidden p-1.5 bg-surface-container-low shadow-inner">
               {["relu", "tanh", "sigmoid"].map(f => (
                 <button key={f} onClick={() => { setActivation(f as any); setRunning(false); }} className={`px-5 py-2 text-[10px] font-mono uppercase transition-all font-bold ${activation === f ? "bg-primary text-on-primary shadow-xl scale-[1.05]" : "text-on-surface-variant hover:text-white"}`}>{f}</button>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-6 flex-1 max-w-sm">
            <span className="text-[11px] font-mono uppercase text-primary/40 tracking-[0.2em] font-bold">L.Sensitivity</span>
            <div className="flex-1 flex items-center gap-6 group bg-surface-container/30 p-2 border border-outline-variant/10">
               <input type="range" min={0.001} max={0.2} step={0.001} value={learningRate} onChange={(e) => setLearningRate(Number(e.target.value))} className="flex-1 accent-primary h-1 bg-surface-container-highest rounded-none appearance-none cursor-pointer" />
               <span className="text-[14px] font-mono text-primary font-black w-12 text-right tabular-nums">{learningRate.toFixed(3)}</span>
            </div>
         </div>
         <div className="ml-auto flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
            <p className="text-[11px] font-mono text-on-surface-variant uppercase tracking-widest font-bold">Neural_Architecture: Institutional</p>
            <p className="text-[10px] font-mono text-primary uppercase tracking-widest italic font-bold">Heuristic_Engine_State: Nominal</p>
         </div>
      </div>
    </div>
  )
}
