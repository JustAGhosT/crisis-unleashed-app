"use client";

import clsx from "clsx";
import React from "react";
import type { Card } from "@/types/game";

export interface OpponentHandProps {
  cards: Card[];
  onSelectCard?: (card: Card) => void; // used for player's hand variant
  disabled?: boolean;
  isOpponent?: boolean; // if true, render card backs
  className?: string;
}

export const OpponentHand: React.FC<OpponentHandProps> = ({
  cards,
  onSelectCard,
  disabled = false,
  isOpponent = true,
  className = "",
}) => {
  return (
    <div className={clsx("flex w-full items-center justify-center", className)}>
      <div className="flex gap-2 p-2 rounded-xl bg-gray-950/40 border border-gray-700/40">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={disabled || isOpponent}
            onClick={!isOpponent && onSelectCard ? () => onSelectCard(c) : undefined}
            className={clsx(
              "relative h-28 w-20 shrink-0 rounded-md border text-left",
              // Only elevate on hover for player's hand
              !isOpponent && !disabled ? "transition-transform duration-150 hover:-translate-y-1" : "",
              (disabled || isOpponent) ? "cursor-not-allowed opacity-90" : "cursor-pointer",
              isOpponent
                ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600"
                : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
            )}
            aria-label={isOpponent ? "Hidden opponent card" : `Card ${c.name}`}
          >
            {isOpponent ? (
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-xs text-gray-300">Opponent</span>
              </div>
            ) : (
              <div className="flex h-full flex-col p-2 text-gray-200">
                <div className="text-xs font-semibold truncate" title={c.name}>{c.name}</div>
                <div className="mt-auto flex items-center justify-between text-[10px] opacity-80">
                  <span>⚔️{c.attack ?? 0}</span>
                  <span>❤️{c.health ?? 1}</span>
                  <span className="text-yellow-300">{c.cost ?? 0}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OpponentHand;
