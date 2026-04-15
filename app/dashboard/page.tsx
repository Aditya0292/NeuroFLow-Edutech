import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import SkillRadar from "@/components/dashboard/SkillRadar";
import LevelProgress from "@/components/dashboard/LevelProgress";
import MissionLog from "@/components/dashboard/MissionLog";

export default function DashboardPage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col gap-8 min-h-screen">
        <TopBar />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Center Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <SkillRadar />
            <LevelProgress />
          </div>
          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MissionLog />
          </div>
        </div>
      </main>
    </div>
  );
}
