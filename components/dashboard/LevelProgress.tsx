const TOTAL_SEGMENTS = 20;
const FILLED_SEGMENTS = 15; // 75% of 20

export default function LevelProgress() {
  return (
    <div className="bg-surface-container-low p-6 ghost-border">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide">
            Level 42 Advancement
          </h3>
          <p className="text-on-surface-variant font-mono text-xs mt-1">
            XP REQ FOR LVL 43:{" "}
            <span className="text-secondary">2500</span>
          </p>
        </div>
        <span className="text-primary font-mono text-xl">75%</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-[2px] h-3">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${
              i < FILLED_SEGMENTS ? "bg-secondary" : "bg-surface-container-highest"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
