"use client";
import Link from "next/link";
import { useState } from "react";

// ── Skill Radar SVG ────────────────────────────────────────────────────────
function SkillRadar() {
  return (
    <div className="relative size-[280px] mx-auto">
      {/* Concentric rings */}
      {[0, 35, 70, 105].map((inset) => (
        <div key={inset} className="absolute rounded-full border border-outline-variant/30"
          style={{ inset }} />
      ))}
      {/* Axes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 45, 90, 135].map((deg) => (
          <div key={deg} className="absolute w-full h-px bg-outline-variant/30"
            style={{ transform: `rotate(${deg}deg)` }} />
        ))}
      </div>
      {/* Data polygon */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280">
        <polygon
          points="140,20 220,90 240,180 160,240 60,200 40,110"
          fill="rgba(105,246,184,0.15)" stroke="#69f6b8" strokeWidth="2"
        />
        {[[140,20],[220,90],[240,180],[160,240],[60,200],[40,110]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} fill="#b2f746" />
        ))}
      </svg>
      {/* Labels */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary font-mono text-[10px] uppercase">Python</div>
      <div className="absolute top-[76px] -right-12 text-primary font-mono text-[10px] uppercase">TensorFlow</div>
      <div className="absolute bottom-[76px] -right-10 text-primary font-mono text-[10px] uppercase">PyTorch</div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-primary font-mono text-[10px] uppercase">NLP</div>
      <div className="absolute bottom-[76px] -left-12 text-primary font-mono text-[10px] uppercase">Computer Vision</div>
      <div className="absolute top-[76px] -left-12 text-primary font-mono text-[10px] uppercase">Data Eng</div>
    </div>
  );
}

// ── Segmented Progress Bar ─────────────────────────────────────────────────
function SegmentedBar({ filled, total = 20 }: { filled: number; total?: number }) {
  return (
    <div className="flex gap-0.5 h-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`flex-1 ${i < filled ? "bg-secondary" : "bg-surface-container-highest"}`} />
      ))}
    </div>
  );
}

// ── Mission Log Item ───────────────────────────────────────────────────────
type MissionStatus = "Success" | "Failed";
type Mission = { title: string; desc: string; status: MissionStatus; xp: number; time: string };

function MissionItem({ m }: { m: Mission }) {
  const borderColor = m.status === "Success" ? "border-secondary" : "border-error";
  const statusColor = m.status === "Success" ? "text-secondary" : "text-error";
  return (
    <div className={`bg-surface-container-highest p-4 border-l-2 ${borderColor} relative group cursor-pointer hover:bg-surface-bright transition-colors`}>
      <div className="absolute top-2 right-2 text-on-surface-variant font-mono text-[10px]">{m.time}</div>
      <h4 className={`text-on-surface font-headline font-medium text-sm mb-1 group-hover:${statusColor} transition-colors`}>{m.title}</h4>
      <p className="text-on-surface-variant text-xs mb-3">{m.desc}</p>
      <div className="flex gap-2">
        <span className={`bg-surface p-1 text-[10px] font-mono ${statusColor} uppercase border border-outline-variant/20`}>{m.status}</span>
        <span className="bg-surface p-1 text-[10px] font-mono text-tertiary-fixed uppercase border border-outline-variant/20">+{m.xp} XP</span>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard", active: true },
  { label: "Missions", icon: "track_changes", href: "/quiz" },
  { label: "Armory", icon: "bolt", href: "/games" },
  { label: "Comms", icon: "forum", href: "#" },
];

function Sidebar() {
  return (
    <div className="glass-panel w-72 h-screen fixed left-0 top-0 border-r border-primary/20 flex flex-col justify-between p-6 z-10 hidden md:flex">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <header className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-on-surface text-xl font-headline font-bold uppercase tracking-[0.05em]">Cmd_Center</h2>
        </header>

        {/* User */}
        <div className="flex gap-4 items-center bg-surface-container-high p-4 border-l-2 border-primary">
          <div className="size-12 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono text-xl font-bold">
            OP
          </div>
          <div className="flex flex-col">
            <h1 className="text-on-surface font-headline font-medium uppercase text-sm tracking-wider">Operative 01</h1>
            <p className="text-secondary font-mono text-xs">SYS.ADMIN</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-4 px-4 py-3 border-l-2 group transition-all ${
                item.active
                  ? "bg-surface-container-highest border-primary"
                  : "border-transparent hover:bg-surface-container-high hover:border-outline-variant"
              }`}>
              <span className={`material-symbols-outlined ${item.active ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"}`}
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className={`font-headline uppercase text-sm tracking-wide ${item.active ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Status footer */}
      <div className="pt-6 border-t border-outline-variant/20">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-on-surface-variant">SYS_STAT:</span>
          <span className="text-secondary">ONLINE</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono mt-2">
          <span className="text-on-surface-variant">UPLINK:</span>
          <span className="text-primary">SECURE</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ────────────────────────────────────────────────────
const MISSIONS: Mission[] = [
  { title: "Neural Net Optimization", desc: "Reduced model latency by 18% during inference phase.", status: "Success", xp: 450, time: "T-MINUS 2D" },
  { title: "Data Pipeline Refactoring", desc: "Streamlined ETL processes for unstructured training sets.", status: "Success", xp: 600, time: "T-MINUS 5D" },
  { title: "Hyperparameter Tuning", desc: "Convergence failed on primary cluster. Rollback initiated.", status: "Failed", xp: 50, time: "T-MINUS 8D" },
  { title: "Computer Vision Module", desc: "Deployed anomaly detection for edge devices.", status: "Success", xp: 850, time: "T-MINUS 12D" },
];

export default function DashboardPage() {
  const [cmd, setCmd] = useState("");

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="scanlines" />

      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col gap-8 min-h-screen">
        {/* Top bar */}
        <div className="flex justify-between items-center w-full pb-4 border-b border-outline-variant/20">
          <h1 className="text-3xl font-headline font-bold uppercase tracking-[0.05em] text-on-surface md:hidden">Dashboard</h1>
          {/* Terminal prompt */}
          <div className="hidden md:flex items-center gap-2 border-b border-outline-variant/50 focus-within:border-primary pb-1 w-64 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
            <input
              className="bg-transparent border-none text-on-surface font-mono text-sm focus:ring-0 w-full p-0 placeholder-on-surface-variant/50 outline-none"
              placeholder="Enter command..."
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface md:hidden">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left/Center: Skill Radar + Progress */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Skill Radar */}
            <div className="bg-surface-container-low p-6 lg:p-8 border border-outline-variant/15 relative overflow-hidden"
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary" />
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[50px] pointer-events-none" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-on-surface-variant font-mono text-xs uppercase mb-1">Telemetry</h3>
                  <h2 className="text-2xl font-headline font-bold uppercase tracking-wide text-on-surface">
                    Skill Radar <span className="text-primary font-mono text-sm ml-2">[ML CAPABILITIES]</span>
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant font-mono text-xs uppercase mb-1">Current Level</p>
                  <p className="text-secondary font-headline font-bold text-3xl">42</p>
                </div>
              </div>

              <div className="w-full flex justify-center items-center py-8 min-h-[300px] relative z-10">
                <SkillRadar />
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/20 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
                  <span className="text-on-surface-variant font-mono text-xs">+15% EFFICIENCY THIS CYCLE</span>
                </div>
                <Link href="/games"
                  className="bg-primary text-on-primary font-headline uppercase font-bold text-sm px-6 py-2 hover:shadow-[0_0_8px_rgba(105,246,184,0.4)] hover:border-b-2 hover:border-secondary transition-all">
                  Calibrate
                </Link>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-surface-container-low p-6 border border-outline-variant/15">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide">Level 42 Advancement</h3>
                  <p className="text-on-surface-variant font-mono text-xs mt-1">
                    XP REQ FOR LVL 43: <span className="text-secondary">2500</span>
                  </p>
                </div>
                <span className="text-primary font-mono text-xl">75%</span>
              </div>
              <SegmentedBar filled={15} total={20} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Start Quiz", icon: "quiz", href: "/quiz", color: "text-primary" },
                { label: "Play Games", icon: "sports_esports", href: "/games", color: "text-secondary" },
                { label: "Leaderboard", icon: "leaderboard", href: "/leaderboard", color: "text-tertiary" },
              ].map((a) => (
                <Link key={a.label} href={a.href}
                  className="bg-surface-container-low border border-outline-variant/15 p-5 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-surface-container transition-all group">
                  <span className={`material-symbols-outlined text-3xl ${a.color} group-hover:scale-110 transition-transform`}>{a.icon}</span>
                  <span className="font-headline uppercase text-xs tracking-widest text-on-surface-variant group-hover:text-on-surface">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Mission Log */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-low h-full border border-outline-variant/15 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/30">
                <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                  Mission Log
                </h3>
                <span className="bg-primary/10 text-primary font-mono text-[10px] px-2 py-1 uppercase border border-primary/20">Archived</span>
              </div>

              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
                {MISSIONS.map((m, i) => <MissionItem key={i} m={m} />)}
              </div>

              <button className="w-full mt-4 py-3 border border-outline-variant/50 text-on-surface-variant font-mono text-xs uppercase hover:bg-surface-container-highest hover:text-on-surface transition-colors">
                Access Full Archive
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .glass-panel {
          background-color: rgba(12,19,38,0.7);
          backdrop-filter: blur(20px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #070d1f; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #41475b; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #69f6b8; }
      `}</style>
    </div>
  );
}
