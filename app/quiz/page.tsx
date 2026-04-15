"use client"
import QuizBlitz from "./quiz-blitz"

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ⚡ Quiz Arena
          </h1>
          <p className="text-slate-400 text-sm">AI-generated · 5 questions · 15 seconds each · Earn XP</p>
        </div>

        {/* Badge row */}
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { icon: "🤖", text: "AI-generated questions" },
            { icon: "⏱", text: "15s per question" },
            { icon: "⚡", text: "+50 XP per correct answer" },
          ].map(b => (
            <span key={b.text} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              {b.icon} {b.text}
            </span>
          ))}
        </div>

        {/* Quiz component */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <QuizBlitz />
        </div>

      </div>
    </main>
  )
}
