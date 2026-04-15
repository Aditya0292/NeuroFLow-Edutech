const radarPoints = [
  { cx: 140, cy: 20, label: "Python", labelPos: "top-[-25px] left-1/2 -translate-x-1/2" },
  { cx: 220, cy: 90, label: "TensorFlow", labelPos: "top-[80px] right-[-45px]" },
  { cx: 240, cy: 180, label: "PyTorch", labelPos: "bottom-[80px] right-[-35px]" },
  { cx: 160, cy: 240, label: "NLP", labelPos: "bottom-[-25px] left-1/2 -translate-x-1/2" },
  { cx: 60, cy: 200, label: "Computer Vision", labelPos: "bottom-[80px] left-[-35px]" },
  { cx: 40, cy: 110, label: "Data Eng", labelPos: "top-[80px] left-[-45px]" },
];

const polygonPoints = radarPoints
  .map((p) => `${p.cx},${p.cy}`)
  .join(" ");

export default function SkillRadar() {
  return (
    <div className="bg-surface-container-low p-6 lg:p-8 ghost-border clipped-tr relative overflow-hidden group">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-on-surface-variant font-mono text-xs uppercase mb-1">Telemetry</h3>
          <h2 className="text-2xl font-headline font-bold uppercase tracking-wide text-on-surface">
            Skill Radar{" "}
            <span className="text-primary font-mono text-sm ml-2">[ML CAPABILITIES]</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant font-mono text-xs uppercase mb-1">Current Level</p>
          <p className="text-secondary font-headline font-bold text-3xl">42</p>
        </div>
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[50px] pointer-events-none" />

      {/* Radar */}
      <div className="w-full flex justify-center items-center py-8 min-h-[300px] relative z-10">
        <div className="relative size-[280px]">
          {/* Concentric rings */}
          {[0, 35, 70, 105].map((inset) => (
            <div
              key={inset}
              className="absolute rounded-full border border-outline-variant/30"
              style={{ inset: `${inset}px` }}
            />
          ))}

          {/* Axes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 45, 90, -45].map((deg) => (
              <div
                key={deg}
                className="w-full h-[1px] bg-outline-variant/30 absolute"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>

          {/* Data polygon */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280">
            <polygon
              fill="rgba(105, 246, 184, 0.15)"
              points={polygonPoints}
              stroke="#69f6b8"
              strokeWidth="2"
            />
            {radarPoints.map((p) => (
              <circle key={p.label} cx={p.cx} cy={p.cy} fill="#b2f746" r="4" />
            ))}
          </svg>

          {/* Labels */}
          {radarPoints.map((p) => (
            <div
              key={p.label}
              className={`absolute text-primary font-mono text-[10px] uppercase ${p.labelPos}`}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
          <span className="text-on-surface-variant font-mono text-xs">
            +15% EFFICIENCY THIS CYCLE
          </span>
        </div>
        <button className="bg-primary text-on-primary font-headline uppercase font-bold text-sm px-6 py-2 btn-kinetic transition-all hover:shadow-[0_0_4px_#69f6b8] hover:border-b-2 hover:border-secondary">
          Calibrate
        </button>
      </div>
    </div>
  );
}
