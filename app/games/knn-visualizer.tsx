"use client"
import { useRef, useEffect, useState, useCallback } from "react"

type Dot = { x: number; y: number; cls: 0 | 1 }

const COLORS = {
  A: { dot: "#a855f7", bg: "147,51,234" },   // Purple
  B: { dot: "#f97316", bg: "249,115,22" },   // Orange
}

function knnClassify(dots: Dot[], px: number, py: number, k: number): 0 | 1 {
  if (dots.length === 0) return 0
  const sorted = dots
    .map(d => ({ cls: d.cls, dist: Math.hypot(d.x - px, d.y - py) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k)
  const votes = sorted.reduce((sum, d) => sum + d.cls, 0)
  return votes >= k / 2 ? 1 : 0
}

export default function KNNVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dots, setDots] = useState<Dot[]>([])
  const [k, setK] = useState(3)
  const [placing, setPlacing] = useState<0 | 1>(0)
  const animFrameRef = useRef<number>()

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const step = 6

    // Draw background heat map
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (dots.length > 0) {
          const cls = knnClassify(dots, x, y, Math.min(k, dots.length))
          const col = cls === 0 ? COLORS.A.bg : COLORS.B.bg
          ctx.fillStyle = `rgba(${col},0.18)`
        } else {
          ctx.fillStyle = "rgba(30,30,50,0.6)"
        }
        ctx.fillRect(x, y, step, step)
      }
    }

    // Draw dots
    dots.forEach(d => {
      ctx.beginPath()
      ctx.arc(d.x, d.y, 9, 0, Math.PI * 2)
      ctx.fillStyle = d.cls === 0 ? COLORS.A.dot : COLORS.B.dot
      ctx.shadowColor = d.cls === 0 ? COLORS.A.dot : COLORS.B.dot
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = "rgba(255,255,255,0.6)"
      ctx.lineWidth = 1.5
      ctx.stroke()
    })
  }, [dots, k])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(drawCanvas)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [drawCanvas])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setDots(prev => [...prev, { x, y, cls: placing }])
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <div className="flex gap-2">
          <button
            onClick={() => setPlacing(0)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${placing === 0 ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
          >
            <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" /> Class A
          </button>
          <button
            onClick={() => setPlacing(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${placing === 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
          >
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Class B
          </button>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg">
          <span className="text-slate-400 text-sm font-medium">K =</span>
          <input
            type="range" min={1} max={15} value={k}
            onChange={e => setK(Number(e.target.value))}
            className="w-28 accent-purple-500"
          />
          <span className="text-white font-bold text-lg w-6 text-center">{k}</span>
        </div>

        <button
          onClick={() => setDots([])}
          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-red-900/50 hover:text-red-300 transition-all"
        >
          Clear
        </button>

        <span className="text-slate-500 text-xs">{dots.length} points</span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/50">
        <canvas
          ref={canvasRef}
          width={520} height={420}
          onClick={handleClick}
          className="cursor-crosshair bg-slate-900 block"
        />
        {dots.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-500 text-sm">Click to place dots · Toggle class above</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-slate-400">
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" />
          Class A (Purple) — {dots.filter(d => d.cls === 0).length} dots
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />
          Class B (Orange) — {dots.filter(d => d.cls === 1).length} dots
        </span>
      </div>
    </div>
  )
}
