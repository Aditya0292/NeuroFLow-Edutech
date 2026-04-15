export default function HeroContent() {
  const stats = [
    { value: "1.2ms", label: "Latency" },
    { value: "99.9%", label: "Uptime" },
    { value: "42TB", label: "Processed" },
  ];

  return (
    <div className="w-full lg:w-1/2 space-y-8">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-mono text-xs tracking-tighter">
        <span className="w-2 h-2 bg-primary animate-pulse" />
        SYSTEM STATUS: ACTIVE
      </div>

      {/* Headline */}
      <h1 className="text-6xl lg:text-8xl font-headline font-black uppercase tracking-tighter leading-none glitch-text">
        MASTER THE <span className="text-primary">MACHINE</span>
      </h1>

      {/* Subtext */}
      <p className="text-on-surface-variant text-lg max-w-xl font-body leading-relaxed border-l-2 border-primary/20 pl-6">
        Deploy high-frequency neural architectures in a sovereign tactical
        environment. Neural flow is the new standard for autonomous operator
        control.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="group relative px-8 py-4 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(105,246,184,0.5)] transition-all">
          <span className="relative z-10">Initialize Shell</span>
          <div className="absolute inset-0 bg-secondary translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
        </button>
        <button className="px-8 py-4 border border-outline text-on-surface font-headline font-bold uppercase tracking-widest hover:bg-surface-variant transition-all">
          View Protocols
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6 pt-12 border-t border-outline-variant/30">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-mono text-primary text-2xl font-bold">
              {stat.value}
            </div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
