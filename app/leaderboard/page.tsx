"use client"
import { useEffect, useState } from "react"
import type { LeaderboardEntry } from "@/types"
import { Trophy, Medal, Target, Shield, Zap, Info } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(d => {
        setData(d.leaderboard || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Leaderboard fetch failed:", err)
        setLoading(false)
      })
  }, [])

  const topThree = data.slice(0, 3)
  const remainder = data.slice(3)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        {/* Tactical Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Global_Operator_Rankings // Live_Uplink
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
              Neural_Hub <span className="text-emerald-500">Command</span>
            </h1>
          </div>
          <div className="flex gap-8 text-right font-mono">
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Active Operatives</p>
              <p className="text-2xl text-emerald-400 font-bold">{data.length.toString().padStart(3, '0')}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Node Status</p>
              <p className="text-2xl text-emerald-400 font-bold">NOMINAL</p>
            </div>
          </div>
        </div>

        {/* Podium Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {topThree.map((op, i) => (
            <div key={op.name} className={`relative p-8 border ${
              i === 0 ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "border-slate-800 bg-slate-900/40"
            } overflow-hidden group hover:scale-[1.02] transition-all`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {i === 0 ? <Trophy size={80} /> : <Medal size={80} />}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`size-10 flex items-center justify-center font-black text-xl ${
                    i === 0 ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}>
                    {op.rank}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-emerald-400/60 uppercase">Rank_Class</p>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">{op.level}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 truncate">{op.name}</h3>
                
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-emerald-400 tabular-nums">{op.xp}</span>
                  <span className="text-slate-500 text-xs font-mono uppercase mb-2">XP_Points</span>
                </div>

                <div className="mt-6 flex gap-2">
                  {op.badges.slice(0, 3).map(b => (
                    <div key={b} className="px-2 py-1 bg-slate-800 text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical List */}
        <div className="bg-slate-900/20 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase">Rank</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase">Operative</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase">Level</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase text-right">Telemetry_XP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-800/50">
                    <td colSpan={4} className="h-16 px-6 bg-slate-800/10"></td>
                  </tr>
                ))
              ) : (
                remainder.map((op) => (
                  <tr key={op.name} className="border-b border-slate-800/50 hover:bg-emerald-500/5 transition-colors group">
                    <td className="px-6 py-5 font-mono text-emerald-400 font-bold">#{op.rank.toString().padStart(2, '0')}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-slate-800 flex items-center justify-center text-[10px] font-mono">
                          {op.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-white font-bold tracking-tight">{op.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-slate-800/50 text-[10px] font-mono text-slate-400 uppercase">
                        {op.level}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-white text-lg tabular-nums">
                      {op.xp.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-12 flex items-center gap-4 text-slate-500 italic text-sm">
           <Zap size={16} className="text-emerald-500" />
           <span>XP is synchronized in real-time across the Neural Link. Keep training to ascend.</span>
        </div>
      </main>
    </div>
  )
}
