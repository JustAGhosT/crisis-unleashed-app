"use client";

import React, { useMemo, useState } from "react";
import Battlefield from "@/components/game/Battlefield";
import TurnManager, { type Phase } from "@/components/game/TurnManager";
import PlayerHUD from "@/components/game/PlayerHUD";
import OpponentHand from "@/components/game/OpponentHand";
import type { BattlefieldUnit, Card } from "@/types/game";

export default function BattlefieldDemoPage() {
  const [phase, setPhase] = useState<Phase>("deploy");
  const [energy, setEnergy] = useState(3);
  const [momentum, setMomentum] = useState(2);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const playerHand = useMemo<Card[]>(
    () => [
      { id: "c1", name: "Striker", cost: 1, attack: 2, health: 1, type: "normal" },
      { id: "c2", name: "Guardian", cost: 2, attack: 1, health: 3, type: "tank" },
      { id: "c3", name: "Archer", cost: 2, attack: 2, health: 2, type: "ranged" },
    ],
    []
  );
  const opponentHand = useMemo<Card[]>(
    () => [
      { id: "o1", name: "Hidden A", cost: 1 },
      { id: "o2", name: "Hidden B", cost: 2 },
      { id: "o3", name: "Hidden C", cost: 3 },
    ],
    []
  );

  const initialUnits = useMemo<Record<string, BattlefieldUnit>>(
    () => ({
      "0-2": { id: "e1", name: "Shade", player: "enemy", attack: 1, health: 2, type: "assassin" },
      "2-1": { id: "p1", name: "Vanguard", player: "player1", attack: 2, health: 2, type: "tank" },
    }),
    []
  );

  const onCardPlayed = (position: string) => {
    if (!selectedCard) return;
    if (energy < (selectedCard.cost ?? 0)) return;
    // naive demo state updates
    setEnergy((e) => e - (selectedCard.cost ?? 0));
    setSelectedCard(null);
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.info("Played card", selectedCard, "to", position);
    }
  };

  const onNextPhase = () => {
    setPhase((p) => (p === "deploy" ? "action" : p === "action" ? "end" : "deploy"));
    setMomentum((m) => Math.min(10, m + 1));
  };

  const onEndTurn = () => {
    setPhase("deploy");
    setEnergy((e) => Math.min(10, e + 1));
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-bold">Battlefield Demo</h1>

      {/* Opponent HUD */}
      <PlayerHUD player="enemy" health={80} momentum={6} energy={3} maxEnergy={10} position="top" isActive={phase !== "deploy"} />

      {/* Opponent hand (hidden) */}
      <OpponentHand cards={opponentHand} isOpponent />

      {/* Battlefield */}
      <Battlefield
        selectedCard={selectedCard}
        onCardPlayed={onCardPlayed}
        onUnitSelected={(u) => {
          if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
            console.info("Selected unit", u);
          }
        }}
        onZoneHover={() => {}}
        initialUnits={initialUnits}
        rows={3}
        cols={5}
      />

      {/* Player hand */}
      <OpponentHand
        cards={playerHand}
        isOpponent={false}
        onSelectCard={(c) => setSelectedCard(c)}
      />

      {/* Turn manager */}
      <TurnManager
        currentPhase={phase}
        energy={energy}
        momentum={momentum}
        onNextPhase={onNextPhase}
        onEndTurn={onEndTurn}
      />

      {/* Player HUD */}
      <PlayerHUD player="player1" health={92} momentum={momentum} energy={energy} maxEnergy={10} position="bottom" isActive={phase === "deploy"} />
    </div>
  );
}
