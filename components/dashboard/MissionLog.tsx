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

import { challenges } from "@/lib/piston";

export default function MissionLog({ completed }: { completed?: string[] }) {
  const completedMissions = challenges.filter(m => completed?.includes(m.id)).map(m => ({
    id: m.id,
    time: "COMPLETED",
    title: m.title,
    description: m.description,
    status: "Success" as const,
    xp: 250 // Base XP per mission
  }));

  return (
    <div className="bg-surface-container-low h-full ghost-border p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/30">
        <h3 className="text-on-surface font-headline font-bold uppercase tracking-wide text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
          Mission Log
        </h3>
      </div>

      {/* Entries */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {completedMissions.length === 0 ? (
           <p className="text-on-surface-variant font-mono text-xs text-center mt-10">No mission logs detected in recent cycles.</p>
        ) : (
          completedMissions.map((mission) => (
            <div key={mission.id} className="bg-surface-container-highest p-4 border-l-2 border-secondary relative group cursor-pointer hover:bg-surface-bright transition-colors">
              <h4 className="font-headline font-medium text-sm mb-1 transition-colors text-on-surface group-hover:text-primary">
                {mission.title}
              </h4>
              <p className="text-on-surface-variant text-[10px] mb-3">
                {mission.description}
              </p>
              <div className="flex gap-2">
                <span className="bg-surface p-1 text-[10px] font-mono uppercase border border-outline-variant/20 text-secondary">
                  SUCCESS
                </span>
                <span className="bg-surface p-1 text-[10px] font-mono uppercase border border-outline-variant/20 text-tertiary-fixed">
                  +250 XP
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
