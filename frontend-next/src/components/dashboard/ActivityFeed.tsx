"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Trophy, Users, CreditCard, Sparkles } from "lucide-react";

// Types for activity data
type ActivityType = "game" | "reward" | "friend" | "purchase" | "achievement";

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  details?: {
    [key: string]: unknown;
  };
}

// Mock data fetcher - replace with actual API call
const fetchRecentActivity = async (): Promise<Activity[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "activity-001",
      type: "achievement",
      description: "Earned 'Master Tactician' achievement",
      timestamp: "2025-08-09T20:15:00Z",
      details: {
        achievement: "Master Tactician",
        points: 50,
      },
    },
    {
      id: "activity-002",
      type: "game",
      description: "Won a ranked match against NightStalker",
      timestamp: "2025-08-09T14:35:00Z",
      details: {
        gameId: "game-123456",
        opponent: "NightStalker",
        result: "win",
      },
    },
    {
      id: "activity-003",
      type: "reward",
      description: "Claimed daily login bonus",
      timestamp: "2025-08-09T09:10:00Z",
      details: {
        reward: "Energy Pack",
        amount: 100,
      },
    },
    {
      id: "activity-004",
      type: "friend",
      description: "TechMage accepted your friend request",
      timestamp: "2025-08-08T22:45:00Z",
    },
    {
      id: "activity-005",
      type: "purchase",
      description: "Purchased 'Apocalypse Survivor' card pack",
      timestamp: "2025-08-08T18:30:00Z",
      details: {
        item: "Apocalypse Survivor Pack",
        cost: 500,
      },
    },
  ];
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: fetchRecentActivity,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "game":
        return <Trophy className="h-6 w-6 text-purple-500" />;
      case "reward":
        return <Sparkles className="h-6 w-6 text-yellow-500" />;
      case "friend":
        return <Users className="h-6 w-6 text-blue-500" />;
      case "purchase":
        return <CreditCard className="h-6 w-6 text-green-500" />;
      case "achievement":
        return <Trophy className="h-6 w-6 text-red-500" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities?.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-900">
                        {activity.description}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All Activity
        </button>
      </div>
    </div>
  );
}
