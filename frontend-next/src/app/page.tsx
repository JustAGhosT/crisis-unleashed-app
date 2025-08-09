"use client";

import { useRouter } from "next/navigation";
import GameStatus from "@/components/game/GameStatus";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Welcome to Crisis Unleashed</h1>
      
      <div className="w-full max-w-2xl mb-8">
        <GameStatus className="w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Begin your journey in the dystopian world of Crisis Unleashed. Choose your faction and build your deck.
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => router.push("/factions")}
          >
            Choose Faction
          </button>
        </div>
        
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
          <ul className="space-y-2">
            <li className="pb-2 border-b">
              <span className="text-sm text-gray-500">2025-08-09</span>
              <p>New faction "Cyber Collective" added to the game</p>
            </li>
            <li className="pb-2 border-b">
              <span className="text-sm text-gray-500">2025-08-05</span>
              <p>Balance updates to energy mechanics</p>
            </li>
            <li>
              <span className="text-sm text-gray-500">2025-08-01</span>
              <p>Season 3 tournament announced</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Play?</h2>
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
          onClick={() => router.push("/game")}
        >
          Launch Game
        </button>
      </div>
    </div>
  );
}