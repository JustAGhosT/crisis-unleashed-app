"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

// Types for our game data
type GameResult = "win" | "loss" | "draw";

interface RecentGame {
  id: string;
  date: string;
  opponent: {
    name: string;
    avatar: string;
    faction: string;
  };
  playerFaction: string;
  result: GameResult;
  score: {
    player: number;
    opponent: number;
  };
  duration: string;
}

// Mock data fetcher - replace with actual API call
const fetchRecentGames = async (): Promise<RecentGame[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      id: "game-123456",
      date: "2025-08-09T14:30:00Z",
      opponent: {
        name: "NightStalker",
        avatar: "https://via.placeholder.com/40",
        faction: "Cyber Collective"
      },
      playerFaction: "Wasteland Nomads",
      result: "win",
      score: {
        player: 25,
        opponent: 18
      },
      duration: "24:15"
    },
    {
      id: "game-123455",
      date: "2025-08-08T19:15:00Z",
      opponent: {
        name: "TechMage",
        avatar: "https://via.placeholder.com/40",
        faction: "Corporate Overlords"
      },
      playerFaction: "Wasteland Nomads",
      result: "loss",
      score: {
        player: 12,
        opponent: 25
      },
      duration: "18:42"
    },
    {
      id: "game-123454",
      date: "2025-08-08T16:20:00Z",
      opponent: {
        name: "ShadowHunter",
        avatar: "https://via.placeholder.com/40",
        faction: "Resistance Fighters"
      },
      playerFaction: "Cyber Collective",
      result: "win",
      score: {
        player: 25,
        opponent: 10
      },
      duration: "15:30"
    },
    {
      id: "game-123453",
      date: "2025-08-07T21:10:00Z",
      opponent: {
        name: "DataWraith",
        avatar: "https://via.placeholder.com/40",
        faction: "Cyber Collective"
      },
      playerFaction: "Wasteland Nomads",
      result: "draw",
      score: {
        player: 20,
        opponent: 20
      },
      duration: "30:00"
    },
    {
      id: "game-123452",
      date: "2025-08-07T18:45:00Z",
      opponent: {
        name: "BioCrusader",
        avatar: "https://via.placeholder.com/40",
        faction: "Wasteland Nomads"
      },
      playerFaction: "Corporate Overlords",
      result: "win",
      score: {
        player: 25,
        opponent: 22
      },
      duration: "27:18"
    }
  ];
};

export default function RecentGames() {
  const { data: games, isLoading } = useQuery({
    queryKey: ["recent-games"],
    queryFn: fetchRecentGames,
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Games</h2>
        <Link 
          href="/games/history" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opponent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games?.map((game) => (
              <tr key={game.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(game.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        className="rounded-full"
                        src={game.opponent.avatar}
                        alt={game.opponent.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{game.opponent.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{game.playerFaction}</div>
                  <div className="text-sm text-gray-500">vs. {game.opponent.faction}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    game.result === 'win' 
                      ? 'bg-green-100 text-green-800' 
                      : game.result === 'loss' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {game.result.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {game.score.player} - {game.score.opponent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {game.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}