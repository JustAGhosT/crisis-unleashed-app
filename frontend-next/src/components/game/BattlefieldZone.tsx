import clsx from "clsx";
import styles from "./battlefield.module.css";
import React from "react";
import { BattlefieldZone as BattlefieldZoneType } from "@/types/game";

export interface BattlefieldZoneProps {
  zone: BattlefieldZoneType;
  isActiveZone: boolean;
  isNeighbor: boolean;
  isLegalMove: boolean;
  isSelected: boolean;
  isAdjacentEnemy: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  children: React.ReactNode;
}

export const BattlefieldZoneComponent: React.FC<BattlefieldZoneProps> = ({
  zone,
  isActiveZone,
  isNeighbor,
  isLegalMove,
  isSelected,
  isAdjacentEnemy,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}) => {
  const isPlayableZone = isActiveZone && (zone.isPlayerZone || (zone.isNeutralZone && !zone.unit));
  
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center transition-all duration-200",
        styles.hex,
        "border-2 border-opacity-30",
        {
          "bg-blue-900/20 border-blue-500/60": zone.isPlayerZone,
          "bg-red-900/20 border-red-500/60": zone.isEnemyZone,
          "bg-gray-800/30 border-gray-600/80": zone.isNeutralZone,
          "ring-2 ring-offset-2 ring-offset-gray-900 ring-primary": isActiveZone,
          "outline outline-1 outline-yellow-400/60": isNeighbor && process.env.NODE_ENV === "development",
          "cursor-pointer hover:bg-opacity-40": isPlayableZone || isLegalMove || isSelected,
          "ring-2 ring-emerald-400/70": isLegalMove,
          "ring-2 ring-cyan-400/70": isSelected,
          "outline outline-2 outline-red-500/70": isAdjacentEnemy,
        }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      data-pos={zone.position}
      data-player-zone={zone.isPlayerZone ? "true" : "false"}
      data-enemy-zone={zone.isEnemyZone ? "true" : "false"}
      data-frontline={zone.isFrontline ? "true" : "false"}
      data-backline={zone.isBackline ? "true" : "false"}
      data-legal-move={isLegalMove ? "true" : "false"}
      data-lane={zone.lane || "C"} // Add lane data attribute
    >
      <div className="absolute inset-0 rounded-lg opacity-20 transition-opacity" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      {children}
    </div>
  );
};

export default BattlefieldZoneComponent;