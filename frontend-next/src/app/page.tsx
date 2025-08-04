"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FactionGrid } from "@/components/factions/FactionGrid";
import { useQuery } from "@tanstack/react-query";

// Temporary API function - will be moved to services
async function fetchGameStatus() {
  try {
    const response = await fetch('/api/');
    if (!response.ok) {
      throw new Error('Failed to fetch game status');
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend not available, using mock data');
    return { message: "Crisis Unleashed - Ready to deploy!" };
  }
}

export default function HomePage() {
  const { data: gameStatus, isLoading } = useQuery({
    queryKey: ['game-status'],
    queryFn: fetchGameStatus,
    retry: false,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crisis Unleashed
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A strategic digital collectible card game set in a multiverse where seven unique factions battle for supremacy
          </p>
          
          {/* Status Card */}
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md mx-auto mb-8">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white mb-2">Game Status</h2>
              {isLoading ? (
                <div className="animate-pulse text-gray-400">Loading...</div>
              ) : (
                <div className="text-green-400">{gameStatus?.message || "System Online"}</div>
              )}
            </div>
          </Card>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Playing
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              onClick={() => window.location.href = '/deck-builder'}
            >
              Build Deck
            </Button>
            <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              View Factions
            </Button>
          </div>
        </div>

        {/* Faction Preview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Choose Your Faction
          </h2>
          <FactionGrid />
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-3">Strategic Combat</h3>
            <p className="text-gray-300">
              Deploy heroes with unique abilities and master faction-specific mechanics in tactical battles.
            </p>
          </Card>
          
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-3">Digital Ownership</h3>
            <p className="text-gray-300">
              True ownership of cards and heroes through NFT integration on multiple blockchains.
            </p>
          </Card>
          
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-3">Rich Lore</h3>
            <p className="text-gray-300">
              Explore a deep multiverse with unique faction stories and evolving narrative.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}