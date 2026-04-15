"use client"
import KNNVisualizer from "./knn-visualizer"
import NeuralLite from "./neural-lite"
import Sidebar from "@/components/dashboard/Sidebar"

export default function GamesPage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />
      
      <Sidebar />
      
      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col gap-8 min-h-screen relative z-10">
        <header className="mb-4">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-[0.05em] text-on-surface">Neural Hub</h1>
          <p className="mt-2 flex items-center gap-2 font-mono text-sm text-primary">
            <span className="material-symbols-outlined text-[16px]">subdirectory_arrow_right</span>
            Tactical Machine Learning Directory
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-secondary">KNN Matcher</h2>
            <span className="border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-mono text-xs text-secondary">
              MODULE_01
            </span>
          </div>
          <div className="game-corner-br game-corner-tl relative border border-outline-variant/15 bg-surface-container-low p-4">
            <KNNVisualizer />
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-tertiary">Neural Playground</h2>
            <span className="border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 font-mono text-xs text-tertiary">
              MODULE_02
            </span>
          </div>
          <div className="game-corner-tl relative border border-outline-variant/15 bg-surface-container-low p-4">
             <NeuralLite />
          </div>
        </section>

        <div className="h-10" />
      </main>
    </div>
  );
}
