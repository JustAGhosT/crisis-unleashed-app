"use client";

import { useRouter } from "next/navigation";
import GameStatus from "@/components/game/GameStatus";
import type { Route } from "next";
import { FactionGrid } from "@/components/factions/FactionGrid";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Crisis Unleashed</h1>

      <div className="w-full max-w-2xl mb-8">
        <GameStatus className="w-full" />
      </div>

      <div className="w-full max-w-4xl mb-8">
        <FactionGrid />
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <div className="rounded border border-slate-700 p-4 bg-slate-900/50">
          <h2 className="text-lg font-semibold">Strategic Combat</h2>
          <p className="text-sm text-gray-400">
            Initiative, positioning, and abilities define every turn.
          </p>
        </div>
        <div className="rounded border border-slate-700 p-4 bg-slate-900/50">
          <h2 className="text-lg font-semibold">Digital Ownership</h2>
          <p className="text-sm text-gray-400">
            Own, trade, and showcase your collection on-chain.
          </p>
        </div>
        <div className="rounded border border-slate-700 p-4 bg-slate-900/50">
          <h2 className="text-lg font-semibold">Rich Lore</h2>
          <p className="text-sm text-gray-400">
            Seven factions with unique metaphysical mechanics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => router.push("/game" as Route)}
        >
          Start Playing
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/deck-builder" as Route)}
        >
          Build Deck
        </button>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          onClick={() => router.push("/factions" as Route)}
        >
          View Factions
        </button>
      </div>
    </div>
  );
}
