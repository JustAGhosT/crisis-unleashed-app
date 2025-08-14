"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Faction } from "@/types/faction";
import { Button } from "@/components/ui/button";

export type FactionDetailProps = {
  faction: Faction;
  onClose: () => void;
  onExplore?: (faction: Faction) => void;
  className?: string;
};

/**
 * Light FactionDetail panel using Tailwind and faction colors.
 * Avoids global CSS variables; uses a CSS var locally for dynamic background image only.
 */
export function FactionDetail({ faction, onClose, onExplore, className }: FactionDetailProps) {
  // Use Option A: CSS variables + helper classes instead of inline styles
  const themeClass = `faction-theme-${faction.id}`;
  const bgClass = `faction-bg-${faction.id}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 sm:p-6",
        "border-border/50 bg-background/70 backdrop-blur",
        themeClass,
        bgClass,
        "faction-detail-bg",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{faction.name}</h2>
          <p className="text-sm text-muted-foreground">{faction.tagline}</p>
        </div>
        <button
          type="button"
          aria-label="Close detail view"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-background/70 text-foreground hover:bg-background/90"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="grid gap-4 sm:grid-cols-2">
        <p className="text-sm leading-relaxed text-foreground/90">{faction.description}</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="min-w-fit text-sm font-semibold text-muted-foreground">Core Technology:</span>
            <span className="text-sm text-foreground/90">{faction.technology}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="min-w-fit text-sm font-semibold text-muted-foreground">Philosophy:</span>
            <span className="text-sm text-foreground/90">{faction.philosophy}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="min-w-fit text-sm font-semibold text-muted-foreground">Key Strength:</span>
            <span className="text-sm text-foreground/90">{faction.strength}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {onExplore && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            className="border-current text-foreground hover:bg-foreground/10"
            onClick={() => onExplore(faction)}
          >
            Explore Full Faction
          </Button>
        </div>
      )}

      {/* Subtle accent border using faction colors via CSS vars */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 faction-accent-bar" />
    </div>
  );
}

export default FactionDetail;
