import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { rarityBadgeClass } from "@/lib/ui-maps";
import { Card as GameCardData } from "@/types/card";

interface DeckRowProps {
  card: GameCardData;
  quantity: number;
  selected?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  onAdd: (card: GameCardData) => void;
  onRemove: (card: GameCardData) => void;
  onClick?: (card: GameCardData) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const DeckRowInner: React.FC<DeckRowProps> = ({
  card,
  quantity,
  selected = false,
  disabled = false,
  onAdd,
  onRemove,
  onClick,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onKeyDown,
}) => {
  // Enable the native draggable attribute only during pointer interaction
  const [dragAttrEnabled, setDragAttrEnabled] = React.useState(false);
  const enableDragAttr = React.useCallback(() => {
    if (draggable) setDragAttrEnabled(true);
  }, [draggable]);
  const disableDragAttr = React.useCallback(() => {
    if (dragAttrEnabled) setDragAttrEnabled(false);
  }, [dragAttrEnabled]);

  const rootClasses = cn(
    "flex items-center justify-between bg-slate-800/50 border border-slate-600 rounded-lg p-3 hover:bg-slate-800",
    selected && "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900",
  );

  return (
    <div
      data-testid="deck-row"
      className={rootClasses}
      draggable={draggable ? true : false}
      onClick={() => onClick?.(card)}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDownCapture={onKeyDown}
      onPointerDown={enableDragAttr}
      onPointerUp={disableDragAttr}
      onPointerCancel={disableDragAttr}
      onMouseDown={enableDragAttr}
      onMouseUp={disableDragAttr}
      onBlur={disableDragAttr}
      tabIndex={0}
      role="listitem"
    >
      {/* Drag handle slot via unicode when draggable */}
      {draggable && (
        <div
          className="cursor-grab mr-2 select-none"
          title="Drag to reorder"
          aria-hidden
        >
          ≡
        </div>
      )}
      {/* Quantity */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card);
          }}
          disabled={disabled}
          className="h-6 w-6 p-0"
          aria-label={`Remove one ${card.name}`}
        >
          -
        </Button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(card);
          }}
          disabled={disabled || quantity >= 3}
          className="h-6 w-6 p-0"
          aria-label={`Add one ${card.name}`}
        >
          +
        </Button>
      </div>

      {/* Card details */}
      <div className="flex-1 px-3">
        <div className="font-semibold text-white">{card.name}</div>
        <div className="text-xs text-gray-400">
          Cost: {card.cost ?? 0}
          {card.rarity && (
            <Badge className={cn("ml-2", rarityBadgeClass(card.rarity))}>
              {card.rarity}
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {card.type} • {card.faction}
          {card.attack !== undefined && card.health !== undefined && (
            <span>
              {" "}
              • {card.attack}/{card.health}
            </span>
          )}
        </div>
      </div>

      {/* Remove Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(card);
        }}
        disabled={disabled}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        aria-label={`Remove ${card.name} from deck`}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const DeckRow = React.memo(DeckRowInner);
DeckRow.displayName = "DeckRow";
