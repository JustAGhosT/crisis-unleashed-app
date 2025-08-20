"use client";

import React, { useEffect, useMemo, useState } from "react";
import Battlefield from "@/components/game/Battlefield";
import TurnManager, { type Phase } from "@/components/game/TurnManager";
import PlayerHUD from "@/components/game/PlayerHUD";
import OpponentHand from "@/components/game/OpponentHand";
import type { BattlefieldUnit, Card } from "@/types/game";

export default function BattlefieldDemoPage() {
  const [phase, setPhase] = useState<Phase>("deploy");
  const [energy, setEnergy] = useState(3);
  const [momentum, setMomentum] = useState(2);
  const [actionsLeft, setActionsLeft] = useState<number>(2);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      // Enemy melee unit
      "0-2": { id: "e1", name: "Shade", player: "enemy", attack: 1, health: 2, type: "assassin", moveSpeed: 2, meleeOnly: true },
      // Player frontline tank with ZOC
      "2-1": { id: "p1", name: "Vanguard", player: "player1", attack: 2, health: 3, type: "tank", moveSpeed: 2, meleeOnly: true, zoc: true },
      // Player ranged archer backline (example)
      "4-3": { id: "p2", name: "Archer", player: "player1", attack: 2, health: 2, type: "ranged", moveSpeed: 2, rangeMin: 2, rangeMax: 3 },
    }),
    []
  );

  // Controlled units state for Battlefield
  const [units, setUnits] = useState<Record<string, BattlefieldUnit>>(initialUnits);
  // Keep in sync if initialUnits changes (e.g., reset scenario)
  useEffect(() => {
    setUnits(initialUnits);
  }, [initialUnits]);

  const onCardPlayed = (position: string) => {
    if (!selectedCard) {
      const msg = "Select a card before playing.";
      setErrorMessage(msg);
      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.warn("Card play failed:", msg);
      }
      return;
    }
    const cost = selectedCard.cost ?? 0;
    if (energy < cost) {
      const msg = `Not enough energy (${energy}/${cost}) to play ${selectedCard.name}.`;
      setErrorMessage(msg);
      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.warn("Card play failed:", msg);
      }
      return;
    }
    // naive demo state updates
    setEnergy((e) => e - cost);
    setSelectedCard(null);
    setErrorMessage(null);
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
    setActionsLeft(2);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-bold">Battlefield Demo</h1>

      {/* Opponent HUD */}
      <PlayerHUD player="enemy" health={80} momentum={6} energy={3} maxEnergy={10} position="top" isActive={phase !== "deploy"} />

      {/* Opponent hand (hidden) */}
      <OpponentHand cards={opponentHand} isOpponent />

      {/* Battlefield */}
      {errorMessage && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 text-red-800 p-2">
          {errorMessage}
        </div>
      )}

      <Battlefield
        selectedCard={selectedCard}
        onCardPlayed={onCardPlayed}
        units={units}
        onMove={(from, to) => {
          setUnits((prev) => {
            const moving = prev[from];
            if (!moving || prev[to]) return prev;
            const next = { ...prev };
            delete next[from];
            next[to] = moving;
            return next;
          });
        }}
        onAttack={(from, to) => {
          setUnits((prev) => {
            const attacker = prev[from];
            const target = prev[to];
            if (!attacker || !target) return prev;
            const remaining = (target.health ?? 0) - (attacker.attack ?? 0);
            const next = { ...prev };
            if (remaining <= 0) {
              delete next[to];
            } else {
              next[to] = { ...target, health: remaining };
            }
            return next;
          });
        }}
        onUnitSelected={(u) => {
          if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
            console.info("Selected unit", u);
          }
        }}
        onZoneHover={() => {}}
        rows={6}
        cols={5}
        actionsLeft={actionsLeft}
        onActionUsed={() => setActionsLeft((a) => Math.max(0, a - 1))}
        currentPhase={phase}
      />

      {/* Player hand */}
      <OpponentHand
        cards={playerHand}
        isOpponent={false}
        onSelectCard={(c) => {
          setSelectedCard(c);
          setErrorMessage(null);
        }}
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
