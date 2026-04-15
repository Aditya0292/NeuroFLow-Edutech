"use client"
import { useRef, useEffect, useState, useCallback } from "react"

type Dot = { x: number; y: number; cls: 0 | 1 }

const COLORS = {
  A: { dot: "#69f6b8", bg: "105,246,184" },   // Primary (Friendly)
  B: { dot: "#ff5449", bg: "255,84,73" },     // Error (Hostile)
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
    const step = 8 // Increased for more pixelated pixel-art look

    ctx.clearRect(0, 0, W, H)

    // Draw background grid lines (Tactical UI)
    ctx.strokeStyle = "rgba(255,255,255,0.05)"
    ctx.lineWidth = 1
    for(let x=0; x<W; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=0; y<H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Draw background heat map
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (dots.length > 0) {
          const cls = knnClassify(dots, x + step/2, y + step/2, Math.min(k, dots.length))
          const col = cls === 0 ? COLORS.A.bg : COLORS.B.bg
          ctx.fillStyle = `rgba(${col},0.08)`
          ctx.fillRect(x, y, step, step)
        }
      }
    }

    // Draw dots as squares (Tactical Radar style)
    dots.forEach(d => {
      ctx.fillStyle = d.cls === 0 ? COLORS.A.dot : COLORS.B.dot
      ctx.shadowColor = d.cls === 0 ? COLORS.A.dot : COLORS.B.dot
      ctx.shadowBlur = 10
      ctx.fillRect(d.x - 4, d.y - 4, 8, 8)
      ctx.shadowBlur = 0
    })

    // Draw radar crosshair in center
    ctx.strokeStyle = "rgba(105,246,184,0.3)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H)
    ctx.moveTo(0, H/2); ctx.lineTo(W, H/2)
    ctx.stroke()

    // Overlay scan square
    const time = Date.now() / 1500
    const scanSize = 120
    const sx = W/2 - scanSize/2
    const sy = H/2 - scanSize/2
    ctx.strokeStyle = "rgba(105,246,184,0.4)"
    ctx.strokeRect(sx, sy, scanSize, scanSize)
    
    // Scanline sweep
    const sweepY = sy + ((Math.sin(time) + 1) / 2) * scanSize
    ctx.fillStyle = "rgba(105,246,184,0.2)"
    ctx.fillRect(sx, sy, scanSize, sweepY - sy)
    ctx.fillStyle = "rgba(105,246,184,0.8)"
    ctx.fillRect(sx, sweepY, scanSize, 2)

  }, [dots, k])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(drawCanvas)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [drawCanvas])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setDots(prev => [...prev, { x, y, cls: placing }]);
  }

  // Calculate target data for UI
  const latestTarget = dots.length > 0 ? dots[dots.length - 1] : null
  const targetDist = latestTarget ? Math.hypot(latestTarget.x - 260, latestTarget.y - 210).toFixed(1) : "---"

  return (
    <div className="flex flex-col gap-0 w-full relative">
      
      {/* Target Data Floating Box */}
      <div className="absolute right-6 top-6 z-10 bg-surface-container-highest border border-outline-variant/30 p-4 w-48 text-on-surface-variant font-mono text-[10px] uppercase shadow-xl hidden md:block">
        <h4 className="text-secondary font-bold mb-3 border-b border-outline-variant/30 pb-1">TARGET_DATA</h4>
        <div className="flex justify-between mb-1.5 hover:text-on-surface transition-colors">
          <span>DIST:</span><span className="text-on-surface text-right">{targetDist}u</span>
        </div>
        <div className="flex justify-between mb-1.5 hover:text-on-surface transition-colors">
          <span>TYPE:</span><span className={latestTarget?.cls === 1 ? "text-error text-right" : "text-primary text-right"}>{latestTarget ? (latestTarget.cls === 1 ? "HOSTILE" : "FRIENDLY") : "---"}</span>
        </div>
        <div className="flex justify-between hover:text-on-surface transition-colors">
          <span>PROB:</span><span className="text-on-surface text-right">{latestTarget ? "87.4%" : "---"}</span>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative overflow-hidden w-full h-[420px] bg-[#040812] border border-outline-variant/20 flex flex-col items-center justify-center">
         <canvas
            ref={canvasRef}
            width={800} height={420}
            onClick={handleClick}
            className="cursor-crosshair absolute inset-0 w-full h-full object-cover"
          />
          {dots.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
              <p className="font-mono text-xs text-primary/50 uppercase tracking-widest bg-surface/80 p-2 border border-primary/20">Click anywhere to deploy units</p>
            </div>
          )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-surface-container-high border-x border-b border-outline-variant/20 flex flex-col md:flex-row items-center justify-between p-3 gap-4">
        
        {/* Toggle & Stats */}
        <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[10px] uppercase flex-wrap">
          <span className="opacity-50 hidden sm:inline">AWAITING_INPUT_</span>
          
          <div className="flex items-center gap-2 border border-outline-variant/30 p-1">
             <button
              onClick={() => setPlacing(0)}
              className={`px-3 py-1 font-bold transition-all ${placing === 0 ? "bg-primary/20 text-primary border border-primary/50" : "hover:text-primary hover:bg-surface-container-highest border border-transparent"}`}
             >
                Friendly Unit
             </button>
             <button
              onClick={() => setPlacing(1)}
              className={`px-3 py-1 font-bold transition-all ${placing === 1 ? "bg-error/20 text-error border border-error/50" : "hover:text-error hover:bg-surface-container-highest border border-transparent"}`}
             >
                Hostile Unit
             </button>
          </div>

          <div className="flex items-center gap-2 px-2">
            <span>K_SETTING:</span>
            <input type="range" min={1} max={9} step={2} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-16 h-1 bg-surface-container-highest rounded-none appearance-none accent-primary cursor-pointer"/>
            <span className="text-primary w-2">{k}</span>
          </div>
          
          <span className="ml-4 tabular-nums w-12 text-right">{dots.length} DEPLOYED</span>
        </div>

        {/* Clear Button (Execute Sweep) */}
        <button
          onClick={() => setDots([])}
          className="bg-primary hover:bg-primary-dim text-on-primary font-headline uppercase font-bold text-sm px-6 py-2 transition-all shrink-0 game-corner-br"
        >
          Execute Sweep
        </button>

      </div>
    </div>
  )
}
