"use client"
import { useState } from "react"
import KNNVisualizer from "./knn-visualizer"
import NeuralLite from "./neural-lite"
import Link from 'next/link'

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />

      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="relative h-auto w-full shrink-0 border-r border-outline-variant/15 bg-surface-container-low md:min-h-screen md:w-64">
          <div
            className="absolute right-0 top-0 h-4 w-4 bg-primary"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />
          <header className="flex items-center gap-3 border-b border-outline-variant/15 px-6 py-5">
            <div className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              terminal
            </div>
            <h2 className="truncate font-headline text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Tactical Hub</h2>
          </header>

          <div className="grow flex-col gap-6 p-4 md:flex">
            <div className="flex items-center gap-3 border border-outline-variant/15 bg-surface-container-highest/50 p-3">
              <div
                className="h-10 w-10 border border-primary/50 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzWuohGT5HLdmrP0yK6BPgggL6vEoeGf6eWvIXH4E9-z8zuZWjLeVxHHHNWlCnT36D4fkwTI9yR73n7eUF8Wo2Whwnzg-Sa6TpLs-GcVoKNt1zolk3vzAnuE6C-JiR3Frkwnb2iU0irjt_eMksxfZD1cQOSVPH8roMdOYEZGyl-N1W3nUfd18Bxdf1Fnbs9z7N8-oHiysMpUYyncvYt26u2TS_Un1nV0OIQe9F-9daRHYK9IJkCGHao4t3q6W_yhR_JuRehxluVxY")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">Agent 47</h1>
                <p className="font-mono text-[10px] uppercase text-secondary">Rank: Elite</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <Link className="group flex items-center gap-3 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary" href="/dashboard">
                <span className="material-symbols-outlined text-[20px]">house</span>
                <p className="font-headline text-sm font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1">Home</p>
              </Link>
              <Link className="group flex items-center gap-3 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary" href="/quiz">
                <span className="material-symbols-outlined z-10 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  crossword
                </span>
                <p className="z-10 font-headline text-sm font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1">Missions</p>
              </Link>
              <Link className="group relative flex items-center gap-3 border-l-2 border-primary bg-surface-container-highest px-3 py-2 text-primary" href="/games">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <p className="font-headline text-sm font-bold uppercase tracking-wider">Armory</p>
              </Link>
            </nav>
          </div>

          <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/15 p-4 font-mono text-[10px] text-on-surface-variant">
            <div className="flex justify-between">
              <span>SYS.STATUS:</span>
              <span className="text-primary">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>UPLINK:</span>
              <span>SECURE</span>
            </div>
          </div>
        </aside>

        <main className="relative z-10 flex flex-1 flex-col gap-10 overflow-y-auto p-6 md:p-10">
          <header className="mb-4">
            <h1 className="font-headline text-4xl font-bold uppercase tracking-[0.05em] text-on-surface">Game Zone</h1>
            <p className="mt-2 flex items-center gap-2 font-mono text-sm text-primary">
              <span className="material-symbols-outlined text-[16px]">subdirectory_arrow_right</span>
              Tactical Mini-Games Directory
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
    </div>
  );
}
