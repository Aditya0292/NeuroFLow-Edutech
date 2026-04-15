type MissionStatus = "Success" | "Failed";

interface Mission {
  id: number;
  time: string;
  title: string;
  description: string;
  status: MissionStatus;
  xp: number;
  dim?: boolean;
}

const missions: Mission[] = [
  {
    id: 1,
    time: "T-MINUS 2D",
    title: "Neural Net Optimization",
    description: "Reduced model latency by 18% during inference phase.",
    status: "Success",
    xp: 450,
  },
  {
    id: 2,
    time: "T-MINUS 5D",
    title: "Data Pipeline Refactoring",
    description: "Streamlined ETL processes for unstructured training sets.",
    status: "Success",
    xp: 600,
  },
  {
    id: 3,
    time: "T-MINUS 8D",
    title: "Hyperparameter Tuning",
    description: "Convergence failed on primary cluster. Rollback initiated.",
    status: "Failed",
    xp: 50,
  },
  {
    id: 4,
    time: "T-MINUS 12D",
    title: "Computer Vision Module",
    description: "Deployed anomaly detection for edge devices.",
    status: "Success",
    xp: 850,
    dim: true,
  },
];

export default function MissionLog() {
  return (
    <div className="bg-surface-container-low h-full ghost-border p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/30">
        <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
          Mission Log
        </h3>
        <span className="bg-primary/10 text-primary font-mono text-[10px] px-2 py-1 uppercase border border-primary/20">
          Archived
        </span>
      </div>

      {/* Entries */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {missions.map((mission) => {
          const isSuccess = mission.status === "Success";
          return (
            <div
              key={mission.id}
              className={`bg-surface-container-highest p-4 border-l-2 relative group cursor-pointer hover:bg-surface-bright transition-colors ${
                isSuccess ? "border-secondary" : "border-error"
              } ${mission.dim ? "opacity-70" : ""}`}
            >
              <div className="absolute top-2 right-2 text-on-surface-variant font-mono text-[10px]">
                {mission.time}
              </div>
              <h4
                className={`font-headline font-medium text-sm mb-1 transition-colors text-on-surface ${
                  isSuccess
                    ? "group-hover:text-primary"
                    : "group-hover:text-error"
                }`}
              >
                {mission.title}
              </h4>
              <p className="text-on-surface-variant text-xs mb-3">
                {mission.description}
              </p>
              <div className="flex gap-2">
                <span
                  className={`bg-surface p-1 text-[10px] font-mono uppercase border border-outline-variant/20 ${
                    isSuccess ? "text-secondary" : "text-error"
                  }`}
                >
                  {mission.status}
                </span>
                <span
                  className={`bg-surface p-1 text-[10px] font-mono uppercase border border-outline-variant/20 ${
                    isSuccess ? "text-tertiary-fixed" : "text-on-surface-variant"
                  }`}
                >
                  +{mission.xp} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-3 border border-outline-variant/50 text-on-surface-variant font-mono text-xs uppercase hover:bg-surface-container-highest hover:text-on-surface transition-colors">
        Access Full Archive
      </button>
    </div>
  );
}
