import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getFactionColorClass, getFactionGradientClass } from "@/lib/utils";
import { FactionCardProps, FactionId } from "@/types/faction";
import React from "react";

/**
 * FactionCard component following SOLID principles
 *
 * Single Responsibility: Displays a single faction's information
 * Open/Closed: Extensible through props without modification
 * Liskov Substitution: Can be used anywhere a React component is expected
 * Interface Segregation: Props interface only includes what's needed
 * Dependency Inversion: Depends on abstractions (types) not concrete implementations
 */
export const FactionCard: React.FC<FactionCardProps> = ({
  faction,
  size = "md",
  interactive = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick(faction);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      interactive &&
      onClick &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      onClick(faction);
    }
  };

  // Spectral base styles per faction identity
  const spectralById: Record<FactionId, string> = {
    solaris: "bg-slate-800/30 border-slate-600 ring-1 ring-amber-400/10 hover:ring-amber-400/20",
    umbral: "bg-slate-950/60 border-violet-900/60 ring-1 ring-violet-400/10 hover:ring-violet-400/20",
    aeonic: "bg-slate-900/40 border-indigo-900/60 ring-1 ring-indigo-400/10 hover:ring-indigo-400/20",
    primordial: "bg-slate-900/40 border-emerald-900/60 ring-1 ring-emerald-400/10 hover:ring-emerald-400/20",
    infernal: "bg-slate-900/40 border-red-900/60 ring-1 ring-red-400/10 hover:ring-red-400/20",
    neuralis: "bg-slate-900/40 border-pink-900/60 ring-1 ring-pink-400/10 hover:ring-pink-400/20",
    synthetic: "bg-slate-900/50 border-cyan-900/60 ring-1 ring-cyan-400/10 hover:ring-cyan-400/20",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 border-2 backdrop-blur-sm",
        sizeClasses[size],
        interactive && "card-hover cursor-pointer hover:border-current",
        getFactionColorClass(faction.id),
        spectralById[faction.id],
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `Select ${faction.name} faction` : undefined}
    >
      {/* Faction header with gradient background */}
      <CardHeader
        className={cn(
          "relative overflow-hidden",
          getFactionGradientClass(faction.id),
        )}
      >
        <div className="relative z-10">
          <CardTitle className="text-white text-shadow-sm">
            {faction.name}
          </CardTitle>
          <CardDescription className="text-white/90 font-medium">
            {faction.tagline}
          </CardDescription>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {faction.description}
          </p>
        </div>

        {/* Key attributes */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">
              Philosophy:
            </span>
            <span className="text-sm text-gray-300">{faction.philosophy}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">
              Strength:
            </span>
            <span className="text-sm text-gray-300">{faction.strength}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">
              Technology:
            </span>
            <span className="text-sm text-gray-300">{faction.technology}</span>
          </div>
        </div>

        {/* Action button */}
        {interactive && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-current hover:bg-current/10",
                getFactionColorClass(faction.id),
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Select {faction.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

FactionCard.displayName = "FactionCard";
