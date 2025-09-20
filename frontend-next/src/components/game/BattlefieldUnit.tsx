import { BattlefieldUnit } from "@/types/game";
import clsx from "clsx";
import React from "react";

export interface BattlefieldUnitComponentProps {
  unit: BattlefieldUnit;
  isPlayerUnit: boolean;
  onUnitClick: (e: React.MouseEvent) => void;
}

export const BattlefieldUnitComponent: React.FC<BattlefieldUnitComponentProps> = ({
  unit,
  isPlayerUnit,
  onUnitClick
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-md px-2 py-1 text-sm shadow-md cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-offset-1",
        isPlayerUnit ? "bg-blue-900/60 border border-blue-500/30 focus:ring-blue-400" : "bg-red-900/60 border border-red-500/30 focus:ring-red-400"
      )}
      aria-label={`Unit ${unit.name}`}
      onClick={onUnitClick}
    >
      <div className="font-semibold">{unit.name}</div>
      <div className="flex gap-2 text-xs opacity-90">
        {unit.shields !== undefined && <span>🛡️{unit.shields}</span>}
        {unit.guards !== undefined && <span>🔰{unit.guards}</span>}
        {unit.initiative !== undefined && <span>⚡{unit.initiative}</span>}
      </div>

      {unit.statusEffects && unit.statusEffects.length > 0 && (
        <div className="mt-1 flex gap-1 text-[8px]">
          {unit.statusEffects.map((effect, i) => (
            <span
              key={i}
              className="rounded bg-purple-900/50 px-1 py-0.5"
              title={`${effect.type} (${effect.stacks || 1}): ${effect.duration} turns`}
            >
              {effect.type[0]}{effect.stacks && effect.stacks > 1 ? effect.stacks : ''}
            </span>
          ))}
        </div>
      )}

      {unit.abilities?.length ? (
        <div className="mt-1 flex gap-1 text-[10px]">
          {unit.abilities.map((a, i) => (
            <span key={i} className="rounded bg-black/30 px-1 py-0.5">
              {typeof a === 'string' ? a[0] : a}
            </span>
          ))}
        </div>
      ) : null}

      {unit.ethereal && (
        <div className="mt-1 text-[10px] italic text-cyan-300/70">
          Ethereal
        </div>
      )}
    </button>
  );
};

export default BattlefieldUnitComponent;