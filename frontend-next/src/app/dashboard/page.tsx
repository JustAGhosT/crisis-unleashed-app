"use client";

import GameStatus from "@/components/game/GameStatus";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentGames from "@/components/dashboard/RecentGames";
import UserProfile from "@/components/dashboard/UserProfile";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import FactionsThemeShell from "../factions/FactionsThemeShell";

export default function DashboardPage() {
  return (
    <FactionsThemeShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, Commander. Here&apos;s your latest status.
            </p>
          </div>
          <GameStatus compact={true} className="self-end" />
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentGames />
          </div>
          <div className="space-y-6">
            <UserProfile />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </FactionsThemeShell>
  );
}
