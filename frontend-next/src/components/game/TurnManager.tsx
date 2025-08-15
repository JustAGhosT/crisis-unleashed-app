"use client";

import clsx from "clsx";
import React from "react";

export type Phase = "deploy" | "action" | "end";

export interface TurnManagerProps {
  currentPhase: Phase;
  onNextPhase: () => void;
  onEndTurn: () => void;
  energy: number;
  momentum: number;
  disabled?: boolean;
}

export const TurnManager: React.FC<TurnManagerProps> = ({
  currentPhase,
  onNextPhase,
  onEndTurn,
  energy,
  momentum,
  disabled = false,
}) => {
  const phaseOrder: Phase[] = ["deploy", "action", "end"];
  return (
    <div className="w-full rounded-xl border border-gray-700/40 bg-gray-950/40 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-300">Energy: <span className="font-semibold text-yellow-400">{energy}</span></div>
        <div className="text-sm text-gray-300">Momentum: <span className="font-semibold text-blue-400">{momentum}</span></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {phaseOrder.map((p) => (
            <div
              key={p}
              className={clsx(
                "px-3 py-1 rounded-md text-xs uppercase tracking-wide border",
                p === currentPhase
                  ? "bg-primary/20 border-primary/50 text-primary-foreground"
                  : "bg-gray-800/40 border-gray-700/50 text-gray-300"
              )}
            >
              {p}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-gray-800 px-3 py-1 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            onClick={onNextPhase}
            disabled={disabled}
          >
            Next phase
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
            onClick={onEndTurn}
            disabled={disabled}
          >
            End turn
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnManager;
