"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card as CardType } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
// Tooltips component not available in this project; using simple title attributes instead

interface CardItemProps {
  card: CardType;
  onAdd?: () => void;
  onRemove?: () => void;
  onClick?: (card: CardType) => void;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  copiesInDeck?: number;
  maxCopies?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Enable native drag from grid to deck list */
  draggable?: boolean;
}

export function CardItem({
  card,
  onAdd,
  onRemove,
  onClick,
  showAddButton = false,
  showRemoveButton = false,
  copiesInDeck = 0,
  maxCopies = 3,
  className,
  size = "md",
  draggable = false,
}: CardItemProps) {
  const canAdd = Boolean(onAdd) && copiesInDeck < maxCopies;
  const sizeClasses = {
    sm: "w-32 h-48",
    md: "w-40 h-60",
    lg: "w-48 h-72",
  }[size];
  const [isHovered, setIsHovered] = useState(false);

  // Get color class based on card rarity
  const getRarityColorClass = (rarity: string = "common") => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "epic":
        return "border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "rare":
        return "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "uncommon":
        return "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20";
      case "common":
      default:
        return "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800";
    }
  };

  // Get faction color class
  const getFactionColorClass = (faction: string = "neutral") => {
    const base = "text-xs font-medium px-2 py-0.5 rounded-full";
    switch (faction.toLowerCase()) {
      case "solaris-nexus":
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
      case "umbral-eclipse":
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300`;
      case "aeonic-dominion":
        return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
      case "primordial-genesis":
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "infernal-core":
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      case "neuralis-conclave":
        return `${base} bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300`;
      case "synthetic-directive":
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  // Get the reason why a card can't be added
  const getAddDisabledReason = () => {
    if (copiesInDeck >= maxCopies) {
      return `Maximum copies (${maxCopies}) already in deck`;
    }
    return "Deck is full";
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAdd && canAdd) onAdd();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return;
    // Provide both a stable id payload and a JSON fallback
    e.dataTransfer.setData("text/card-id", card.id);
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Space or Enter triggers add for accessibility
    if ((e.key === " " || e.key === "Enter") && onAdd && canAdd) {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        getRarityColorClass(card.rarity),
        isHovered && "shadow-md",
        className,
      )}
      onClick={() => onClick?.(card)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={draggable}
      onDragStart={handleDragStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Card ${card.name}${canAdd ? ", press Space to add" : ""}`}
    >
      {/* Card image */}
      <div
        className={cn(
          "relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-t-lg",
          sizeClasses,
        )}
      >
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
            <svg
              className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {card.name}
            </span>
          </div>
        )}

        {/* Card stats overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          {/* Faction badge */}
          {card.faction && (
            <span className={getFactionColorClass(String(card.faction))}>
              {card.faction}
            </span>
          )}

          {/* Cost/Attack badges */}
          <div className="flex space-x-1">
            {card.cost !== undefined && (
              <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 text-xs font-bold">
                {card.cost}
              </span>
            )}
            {card.attack !== undefined && (
              <span className="inline-flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold">
                {card.attack}
              </span>
            )}
          </div>
        </div>

        {/* Rarity badge */}
        {card.rarity && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-black/60 text-white">
              {card.rarity}
            </span>
          </div>
        )}

        {/* Copies badge */}
        {copiesInDeck > 0 && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-black/60 text-white">
              x{copiesInDeck}
            </span>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {card.name}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {card.type}
          {card.unitType && ` · ${card.unitType}`}
          {card.actionType && ` · ${card.actionType}`}
          {card.structureType && ` · ${card.structureType}`}
        </p>

        {/* Card description - truncated */}
        {card.description && (
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
            {card.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 pt-0 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {copiesInDeck} / {maxCopies}
        </span>
        <div className="flex items-center gap-2">
          {showRemoveButton && onRemove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveClick}
              title="Remove from deck"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {showAddButton && onAdd && (
            <Button
              size="sm"
              onClick={handleAddClick}
              disabled={!canAdd}
              title={canAdd ? "Add to deck" : getAddDisabledReason()}
            >
              <Plus className="h-4 w-4" />
              <span className="ml-1">Add</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
