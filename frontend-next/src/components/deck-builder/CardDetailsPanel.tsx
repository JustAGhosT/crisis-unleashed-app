"use client";

import React from "react";
import Image from "next/image";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Card as GameCard } from "@/types/card";
import { rarityBadgeClass } from "@/lib/ui-maps";
import { cn } from "@/lib/utils";

interface CardDetailsPanelProps {
  card: GameCard | null;
}

export default function CardDetailsPanel({ card }: CardDetailsPanelProps) {
  if (!card) {
    return (
      <UICard className="bg-slate-800/50 border-slate-600 h-full">
        <CardHeader>
          <CardTitle className="text-white">Card Details</CardTitle>
          <CardDescription className="text-gray-300">
            Select a card to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-gray-400 py-12">
            No card selected
          </div>
        </CardContent>
      </UICard>
    );
  }

  return (
    <UICard className="bg-slate-800/50 border-slate-600 h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-white">{card.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {card.type} • {card.faction}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", rarityBadgeClass(card.rarity))}>
              {card.rarity}
            </Badge>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {card.cost}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {card.imageUrl && (
            <div className="w-full overflow-hidden rounded-lg bg-slate-700 aspect-[4/3] relative">
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Description
            </h4>
            <p className="text-sm text-gray-200 whitespace-pre-line">
              {card.description || "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {typeof card.attack === "number" && (
              <div className="text-center">
                <div className="text-lg font-semibold text-red-400">
                  {card.attack}
                </div>
                <div className="text-xs text-gray-400">Attack</div>
              </div>
            )}
            {typeof card.health === "number" && (
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">
                  {card.health}
                </div>
                <div className="text-xs text-gray-400">Health</div>
              </div>
            )}
            {card.keywords && card.keywords.length > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-300">
                  {card.keywords.join(", ")}
                </div>
                <div className="text-xs text-gray-500">Keywords</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </UICard>
  );
}
