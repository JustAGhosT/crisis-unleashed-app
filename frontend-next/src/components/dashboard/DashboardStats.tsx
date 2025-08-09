"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

// Mock data fetcher - replace with actual API call
const fetchStats = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    wins: 27,
    losses: 12,
    winRate: 69.2,
    cardsPlayed: 342,
    energy: 1250,
    rank: "Platinum",
    rankChange: 2,
    seasonHighest: "Diamond"
  };
};

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Win Rate" 
        value={`${stats?.winRate}%`} 
        subtitle={`${stats?.wins}W - ${stats?.losses}L`}
        trend="up"
        trendValue="+2.5%"
      />
      
      <StatCard 
        title="Energy" 
        value={stats?.energy.toLocaleString() || "0"} 
        subtitle="Available to spend"
        trend="up"
        trendValue="+150"
      />
      
      <StatCard 
        title="Rank" 
        value={stats?.rank || "Unranked"} 
        subtitle={`Season highest: ${stats?.seasonHighest}`}
        trend={stats?.rankChange > 0 ? "up" : "down"}
        trendValue={stats?.rankChange > 0 ? `+${stats?.rankChange}` : `${stats?.rankChange}`}
      />
      
      <StatCard 
        title="Cards Played" 
        value={stats?.cardsPlayed.toLocaleString() || "0"} 
        subtitle="This season"
        trend="neutral"
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  trendValue?: string;
};

function StatCard({ title, value, subtitle, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {trend !== "neutral" && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {trend === "up" ? (
              <ArrowUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownIcon className="w-3 h-3 mr-1" />
            )}
            {trendValue}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}