"use client"
import { useEffect, useRef, useState, useCallback } from "react"

type ActivationFn = "relu" | "sigmoid"
type Dataset = "circle" | "cross"

function relu(x: number) { return Math.max(0, x) }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)) }
function activate(x: number, fn: ActivationFn) { return fn === "relu" ? relu(x) : sigmoid(x) }

function circleLabel(x: number, y: number) {
  return (x * x + y * y) < 0.4 ? 1 : 0
}
function crossLabel(x: number, y: number) {
  return (Math.abs(x) < 0.25 || Math.abs(y) < 0.25) ? 1 : 0
}

function randomWeights(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * 2)
  )
}

type Network = {
  w1: number[][]
  b1: number[]
  w2: number[][]
  b2: number[]
  w3?: number[][]
  b3?: number[]
}

function buildNet(layers: 1 | 2): Network {
  const h = 8
  if (layers === 1) {
    return {
      w1: randomWeights(h, 2),
      b1: Array(h).fill(0),
      w2: randomWeights(1, h),
      b2: [0]
    }
  }
  return {
    w1: randomWeights(h, 2),
    b1: Array(h).fill(0),
    w2: randomWeights(h, h),
    b2: Array(h).fill(0),
    w3: randomWeights(1, h),
    b3: [0]
  }
}

function forward(net: Network, x: number, y: number, act: ActivationFn): number {
  const inp = [x, y]
  const h1 = net.w1.map((row, i) => activate(row[0] * inp[0] + row[1] * inp[1] + net.b1[i], act))
  if (!net.w2 || !net.b2) return 0.5
  if (net.w3 && net.b3) {
    const h2 = net.w2.map((row, i) => activate(row.reduce((s, w, j) => s + w * h1[j], 0) + net.b2[i], act))
    const out = net.w3[0].reduce((s, w, j) => s + w * h2[j], 0) + net.b3[0]
    return sigmoid(out)
  }
  const out = net.w2[0].reduce((s, w, j) => s + w * h1[j], 0) + net.b2[0]
  return sigmoid(out)
}

function trainStep(net: Network, act: ActivationFn, dataset: Dataset, lr = 0.15): number {
  let loss = 0
  const N = 40
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * 2
    const label = dataset === "circle" ? circleLabel(x, y) : crossLabel(x, y)
    const pred = forward(net, x, y, act)
    loss += -label * Math.log(pred + 1e-8) - (1 - label) * Math.log(1 - pred + 1e-8)
    // Nudge all weights by gradient (simplified sgd)
    const err = pred - label
    net.w1.forEach(row => { row[0] -= lr * err * x * 0.1; row[1] -= lr * err * y * 0.1 })
    net.b1.forEach((_, i) => { net.b1[i] -= lr * err * 0.05 })
    if (net.w3) {
      net.w3[0].forEach((_, j) => { net.w3![0][j] -= lr * err * 0.1 })
      net.b3![0] -= lr * err * 0.05
    } else {
      net.w2[0].forEach((_, j) => { net.w2[0][j] -= lr * err * 0.1 })
      net.b2[0] -= lr * err * 0.05
    }
  }
  return loss / N
}

export default function NeuralLite() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const netRef = useRef<Network | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [layers, setLayers] = useState<1 | 2>(1)
  const [act, setAct] = useState<ActivationFn>("relu")
  const [dataset, setDataset] = useState<Dataset>("circle")
  const [running, setRunning] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState<number | null>(null)

  const drawHeatMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !netRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const step = 5
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const x = (px / W) * 2 - 1
        const y = (py / H) * 2 - 1
        const pred = forward(netRef.current, x, y, act)
        const r = Math.round(249 * pred + 147 * (1 - pred))
        const g = Math.round(115 * pred + 51 * (1 - pred))
        const b = Math.round(22 * pred + 234 * (1 - pred))
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`
        ctx.fillRect(px, py, step, step)
      }
    }
    // Draw decision boundary overlay dots
    const label = dataset === "circle" ? circleLabel : crossLabel
    for (let i = 0; i < 80; i++) {
      const nx = Math.random(), ny = Math.random()
      const lx = nx * 2 - 1, ly = ny * 2 - 1
      const cls = label(lx, ly)
      ctx.beginPath()
      ctx.arc(nx * W, ny * H, 4, 0, Math.PI * 2)
      ctx.fillStyle = cls === 1 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.5)"
      ctx.fill()
    }
  }, [act, dataset])

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    stop()
    netRef.current = buildNet(layers)
    setEpoch(0)
    setLoss(null)
    setRunning(true)
    let ep = 0
    timerRef.current = setInterval(() => {
      if (!netRef.current) return
      const l = trainStep(netRef.current, act, dataset)
      ep++
      setEpoch(ep)
      setLoss(l)
      drawHeatMap()
      if (ep >= 200) stop()
    }, 40)
  }, [layers, act, dataset, drawHeatMap, stop])

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (!running) drawHeatMap()
  }, [running, drawHeatMap])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Hidden Layers</label>
          <div className="flex gap-2">
            {([1, 2] as const).map(l => (
              <button key={l} onClick={() => { setLayers(l); stop() }}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${layers === l ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
              >{l}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Activation</label>
          <div className="flex gap-2">
            {(["relu", "sigmoid"] as const).map(a => (
              <button key={a} onClick={() => { setAct(a); stop() }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${act === a ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
              >{a.charAt(0).toUpperCase() + a.slice(1)}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Dataset</label>
          <div className="flex gap-2">
            {(["circle", "cross"] as const).map(d => (
              <button key={d} onClick={() => { setDataset(d); stop() }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${dataset === d ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
              >{d.charAt(0).toUpperCase() + d.slice(1)}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/50">
        <canvas ref={canvasRef} width={520} height={420} className="bg-slate-900 block" />
        {!running && epoch === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-400 text-sm">Press <span className="text-green-400 font-bold">Go</span> to start training</p>
          </div>
        )}
      </div>

      {/* Stats + Go */}
      <div className="flex items-center gap-6">
        <button onClick={running ? stop : start}
          className={`px-8 py-3 rounded-xl font-bold text-base transition-all ${running
            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30"
            : "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/30 scale-105"}`}
        >
          {running ? "⏹ Stop" : "▶ Go"}
        </button>
        <div className="text-sm text-slate-400 space-y-0.5">
          <div>Epoch: <span className="text-white font-semibold">{epoch}</span> / 200</div>
          {loss !== null && <div>Loss: <span className="text-cyan-400 font-semibold">{loss.toFixed(3)}</span></div>}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-slate-500">
        <span><span className="inline-block w-3 h-3 rounded-full bg-white mr-1 align-middle" />Positive class</span>
        <span><span className="inline-block w-3 h-3 rounded-full bg-black border border-slate-600 mr-1 align-middle" />Negative class</span>
        <span><span className="inline-block w-3 h-3 bg-orange-500 mr-1 align-middle" />Predicted positive</span>
        <span><span className="inline-block w-3 h-3 bg-purple-700 mr-1 align-middle" />Predicted negative</span>
      </div>
    </div>
  )
}
