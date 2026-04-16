"use client"
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import SkillRadar from "@/components/dashboard/SkillRadar";
import LevelProgress from "@/components/dashboard/LevelProgress";
import MissionLog from "@/components/dashboard/MissionLog";
import type { User } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/xp")
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard profile fetch failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      <Sidebar user={profile} />
      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col gap-8 min-h-screen">
        <TopBar />
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-xs text-primary uppercase tracking-widest">Hydrating_Tactical_Core...</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Center Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <SkillRadar skills={profile?.skill_vector} />
              <LevelProgress xp={profile?.xp || 0} level={profile?.level} />
            </div>
            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <MissionLog completed={profile?.completed_msns} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
