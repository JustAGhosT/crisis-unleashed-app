import clsx from "clsx";
import React from "react";
import { BattlefieldUnit } from "@/types/game";

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
    <div
      className={clsx(
        "rounded-md px-2 py-1 text-sm shadow-md",
        isPlayerUnit ? "bg-blue-900/60 border border-blue-500/30" : "bg-red-900/60 border border-red-500/30"
      )}
      onClick={onUnitClick}
    >
      <div className="font-semibold">{unit.name}</div>
      <div className="flex gap-2 text-xs opacity-90">
        <span>⚔️{unit.attack}</span>
        <span>❤️{unit.health}</span>
        {unit.shields && <span>🛡️{unit.shields}</span>}
        {unit.guards && <span>🔰{unit.guards}</span>}
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
    </div>
  );
};

export default BattlefieldUnitComponent;