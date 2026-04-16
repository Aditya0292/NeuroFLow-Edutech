"use client"

const skillMap = [
  { key: "python", label: "Python", angle: 0 },
  { key: "tf", label: "TensorFlow", angle: 60 },
  { key: "pytorch", label: "PyTorch", angle: 120 },
  { key: "nlp", label: "NLP", angle: 180 },
  { key: "cv", label: "Computer Vision", angle: 240 },
  { key: "data_eng", label: "Data Eng", angle: 300 },
];

export default function SkillRadar({ skills }: { skills?: any }) {
  const CENTER = 140;
  const MAX_RADIUS = 120;

  const points = skillMap.map((s) => {
    // Current proficiency (0 to 1 range), default 30% for empty
    const val = (skills?.[s.key] || 0.3) * MAX_RADIUS;
    const rad = (s.angle - 90) * (Math.PI / 180);
    return {
      cx: CENTER + val * Math.cos(rad),
      cy: CENTER + val * Math.sin(rad),
      label: s.label,
      angle: s.angle
    };
  });

  const polygonPoints = points.map((p) => `${p.cx},${p.cy}`).join(" ");

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
      </div>

      {/* Radar */}
      <div className="w-full flex justify-center items-center py-8 min-h-[300px] relative z-10">
        <div className="relative size-[280px]">
          {/* Concentric rings */}
          {[120, 90, 60, 30].map((r) => (
            <div 
              key={r} 
              className="absolute rounded-full border border-outline-variant/20 flex items-center justify-center" 
              style={{ 
                width: `${r * 2}px`, 
                height: `${r * 2}px`,
                left: `${CENTER - r}px`,
                top: `${CENTER - r}px`
              }} 
            />
          ))}

          {/* Axes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {skillMap.map((s) => (
              <div 
                key={s.key} 
                className="w-[1px] h-[240px] bg-outline-variant/20 absolute" 
                style={{ 
                   transform: `rotate(${s.angle}deg)`,
                }} 
              />
            ))}
          </div>

          {/* Data polygon */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280">
            <polygon 
              fill="rgba(105, 246, 184, 0.1)" 
              points={polygonPoints} 
              stroke="#69f6b8" 
              strokeWidth="2" 
              className="transition-all duration-1000 ease-in-out" 
            />
            {points.map((p) => (
              <circle 
                key={p.label} 
                cx={p.cx} 
                cy={p.cy} 
                fill="#b2f746" 
                r="3" 
                className="transition-all duration-1000 ease-in-out glow-emerald shadow-[0_0_10px_#b2f746]" 
              />
            ))}
          </svg>

          {/* Labels */}
          {points.map((p) => {
             const rad = (p.angle - 90) * (Math.PI / 180);
             const lx = CENTER + (MAX_RADIUS + 20) * Math.cos(rad);
             const ly = CENTER + (MAX_RADIUS + 20) * Math.sin(rad);
             return (
              <div 
                key={p.label} 
                className="absolute text-primary font-mono text-[9px] uppercase tracking-tighter" 
                style={{
                    left: `${lx}px`,
                    top: `${ly}px`,
                    transform: 'translate(-50%, -50%)'
                }}
              >
                {p.label}
              </div>
             )
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-8 flex items-center gap-3">
         <div className="h-[2px] w-8 bg-emerald-500/20" />
         <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest italic">Heuristic_Biometrics_Synced</span>
      </div>
    </div>
  );
}
