"use client"
import { useState, useEffect, useCallback } from "react"
import type { QuizQuestion } from "@/lib/gemini"

const TOPICS = ["Machine Learning", "Neural Networks", "KNN", "Decision Trees", "Random Forest", "SVM", "Clustering"]
const BLITZ_TIME = 15 // seconds per question

type Phase = "intro" | "loading" | "playing" | "result"

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const r = 36, c = 2 * Math.PI * r
  return (
    <svg width="90" height="90" className="rotate-[-90deg]">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#a855f7" strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round" className="transition-all duration-300" />
      <text x="45" y="45" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="18" fontWeight="bold" className="rotate-90 origin-center"
        style={{ transform: "rotate(90deg)", transformOrigin: "45px 45px" }}>
        {label}
      </text>
    </svg>
  )
}

export default function QuizBlitz() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [topic, setTopic] = useState("Machine Learning")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(BLITZ_TIME)
  const [xpEarned, setXpEarned] = useState(0)
  const [error, setError] = useState("")

  const question = questions[current]

  const submitAnswer = useCallback((ans: number | null) => {
    setAnswers(prev => {
      const next = [...prev]
      next[current] = ans
      return next
    })
    if (current + 1 >= questions.length) {
      setPhase("result")
    } else {
      setSelected(null)
      setTimeLeft(BLITZ_TIME)
      setCurrent(c => c + 1)
    }
  }, [current, questions.length])

  // Timer
  useEffect(() => {
    if (phase !== "playing" || selected !== null) return
    if (timeLeft <= 0) { submitAnswer(null); return }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, selected, submitAnswer])

  // Calculate XP on result
  useEffect(() => {
    if (phase !== "result") return
    const correct = answers.filter((a, i) => a === questions[i]?.correct).length
    setXpEarned(correct * 50)
  }, [phase, answers, questions])

  const startQuiz = async () => {
    setPhase("loading")
    setError("")
    try {
      const res = await fetch(`/api/quiz?topic=${encodeURIComponent(topic)}&difficulty=intermediate`)
      if (!res.ok) throw new Error("Failed to fetch quiz")
      const json = await res.json()
      const data: QuizQuestion[] = json.questions ?? json
      if (!data || data.length === 0) throw new Error("No questions returned")
      setQuestions(data.slice(0, 5))
      setAnswers([])
      setCurrent(0)
      setSelected(null)
      setTimeLeft(BLITZ_TIME)
      setPhase("playing")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
      setPhase("intro")
    }
  }

  const reset = () => {
    setPhase("intro")
    setQuestions([])
    setAnswers([])
    setCurrent(0)
    setSelected(null)
    setXpEarned(0)
  }

  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">⚡ Quiz Blitz</h2>
        <p className="text-slate-400 text-sm max-w-sm">5 questions · 15 seconds each · AI-generated · Earn XP</p>
      </div>
      <div className="w-full max-w-xs space-y-3">
        <label className="text-slate-400 text-sm font-medium">Choose Topic</label>
        <div className="flex flex-wrap gap-2 justify-center">
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                topic === t ? "bg-purple-600 text-white shadow shadow-purple-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}>{t}</button>
          ))}
        </div>
      </div>
      {error && <p className="text-red-400 text-sm bg-red-950/40 px-4 py-2 rounded-lg">{error}</p>}
      <button onClick={startQuiz}
        className="px-10 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-base rounded-xl shadow-xl shadow-purple-500/30 hover:scale-105 transition-transform">
        Start Blitz ⚡
      </button>
    </div>
  )

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Generating questions with AI…</p>
    </div>
  )

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === "result") return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-extrabold text-white">Results 🏁</h2>
      <ProgressRing pct={(correctCount / 5) * 100} label={`${correctCount}/5`} />
      <div className="text-center space-y-1">
        <p className="text-slate-400 text-sm">XP Earned</p>
        <p className="text-4xl font-extrabold text-purple-400">+{xpEarned} XP</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        {questions.map((q, i) => {
          const ua = answers[i]
          const correct = ua === q.correct
          return (
            <div key={i} className={`p-4 rounded-xl border text-sm space-y-1 ${correct ? "border-green-700/60 bg-green-950/30" : "border-red-700/60 bg-red-950/30"}`}>
              <p className="text-white font-medium">{i + 1}. {q.question}</p>
              <p className={correct ? "text-green-400" : "text-red-400"}>
                {correct ? "✓" : "✗"} Your answer: {ua !== null ? q.options[ua] : "Timed out"}
              </p>
              {!correct && <p className="text-slate-300">Correct: {q.options[q.correct]}</p>}
              <p className="text-slate-500 text-xs italic">{q.explanation}</p>
            </div>
          )
        })}
      </div>
      <button onClick={reset}
        className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl transition-all">
        Play Again
      </button>
    </div>
  )

  // ── PLAYING ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <span className="text-slate-400 text-sm font-medium">Q {current + 1} / 5</span>
        <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
          timeLeft <= 5 ? "text-red-400 bg-red-950/50 animate-pulse" : "text-white bg-slate-800"
        }`}>⏱ {timeLeft}s</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < current ? (answers[i] === questions[i]?.correct ? "bg-green-500" : "bg-red-500") :
              i === current ? "bg-purple-500" : "bg-slate-700"
            }`} />
          ))}
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 5 ? "bg-red-500" : "bg-purple-500"}`}
          style={{ width: `${(timeLeft / BLITZ_TIME) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 w-full">
        <p className="text-white font-semibold text-base leading-relaxed">{question?.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {question?.options.map((opt, idx) => {
          let style = "bg-slate-800 border-slate-700 text-slate-200 hover:border-purple-500 hover:bg-slate-700"
          if (selected !== null) {
            if (idx === question.correct) style = "bg-green-900/50 border-green-500 text-green-300"
            else if (idx === selected) style = "bg-red-900/50 border-red-500 text-red-300"
            else style = "bg-slate-800/40 border-slate-700 text-slate-500"
          }
          return (
            <button key={idx} disabled={selected !== null}
              onClick={() => {
                setSelected(idx)
                setTimeout(() => submitAnswer(idx), 900)
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${style}`}>
              <span className="font-bold mr-2 text-slate-500">{["A","B","C","D"][idx]}.</span> {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
