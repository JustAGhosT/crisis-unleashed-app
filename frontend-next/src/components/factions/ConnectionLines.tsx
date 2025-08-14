"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ConnectionPoint = {
  x: number;
  y: number;
  color: string;
};

export type Connection = {
  from: ConnectionPoint;
  to: ConnectionPoint;
  active?: boolean;
};

export type ConnectionLinesProps = {
  connections: Connection[];
  centerNode?: ConnectionPoint;
  className?: string;
  viewBox?: string; // default "0 0 800 800"
};

export function ConnectionLines({
  connections,
  centerNode,
  className,
  viewBox = "0 0 800 800",
}: ConnectionLinesProps) {
  return (
    <svg
      className={cn("pointer-events-none h-full w-full", className)}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {connections.map((connection, i) => (
        <line
          key={i}
          x1={connection.from.x}
          y1={connection.from.y}
          x2={connection.to.x}
          y2={connection.to.y}
          stroke={connection.from.color}
          className={cn(
            "transition-colors duration-300",
            connection.active ? "opacity-80" : "opacity-30",
          )}
        />
      ))}

      {centerNode && (
        <circle
          cx={centerNode.x}
          cy={centerNode.y}
          r="8"
          fill={centerNode.color}
          className="opacity-80"
        />
      )}
    </svg>
  );
}

export default ConnectionLines;
