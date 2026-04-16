import { calculateLevel, getProgressToNextLevel } from "@/lib/xp";

export default function LevelProgress({ xp, level }: { xp: number, level?: string }) {
  const TOTAL_SEGMENTS = 20;
  const { percentage: progressPercent } = getProgressToNextLevel(xp);
  const filledSegments = Math.floor((progressPercent / 100) * TOTAL_SEGMENTS);

  return (
    <div className="bg-surface-container-low p-6 ghost-border">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide">
             {level || "Beginner"} RANK Advancement
          </h3>
          <p className="text-on-surface-variant font-mono text-xs mt-1">
            CURRENT XP:{" "}
            <span className="text-secondary">{xp.toLocaleString()}</span>
          </p>
        </div>
        <span className="text-primary font-mono text-xl">{Math.floor(progressPercent)}%</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-[2px] h-3">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${
              i < filledSegments ? "bg-secondary" : "bg-surface-container-highest"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
