"use client"
import { useState } from "react"
import KNNVisualizer from "./knn-visualizer"
import NeuralLite from "./neural-lite"

type Tab = "knn" | "neural"

const TABS: { id: Tab; label: string; icon: string; subtitle: string }[] = [
  { id: "knn", label: "Neighbor Matcher", icon: "🎯", subtitle: "K-Nearest Neighbors" },
  { id: "neural", label: "Pattern Matcher", icon: "🧠", subtitle: "Neural Lite Trainer" },
]

export default function GamesPage() {
  const [tab, setTab] = useState<Tab>("knn")

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ML Playgrounds
          </h1>
          <p className="text-slate-400 text-sm">Interact with real ML algorithms — no math required</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-purple-700 to-cyan-700 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              <span className="text-lg">{t.icon}</span>
              <div className="text-left">
                <div>{t.label}</div>
                <div className={`text-xs font-normal ${tab === t.id ? "text-slate-300" : "text-slate-600"}`}>{t.subtitle}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Info card */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          {tab === "knn" ? (
            <div className="space-y-1">
              <p className="font-semibold text-purple-300">🎯 How it works</p>
              <p className="text-slate-400 text-sm">Click to place <span className="text-purple-400 font-medium">Purple (Class A)</span> or <span className="text-orange-400 font-medium">Orange (Class B)</span> dots. The background instantly updates to show which class any new dot would belong to based on its nearest neighbors. Use the <span className="text-white font-medium">K slider</span> to see how smoother or sharper boundaries get.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-semibold text-cyan-300">🧠 How it works</p>
              <p className="text-slate-400 text-sm">Pick the number of hidden layers and an activation function, then choose a dataset shape. Hit <span className="text-green-400 font-medium">Go</span> and watch the neural network heat map slowly learn to separate the two classes — no training data setup needed.</p>
            </div>
          )}
        </div>

        {/* Game area */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
          {tab === "knn" ? <KNNVisualizer /> : <NeuralLite />}
        </div>

      </div>
    </main>
  )
}
