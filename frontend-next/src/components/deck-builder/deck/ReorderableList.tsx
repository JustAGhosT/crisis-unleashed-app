import React from "react";
import { DeckCard } from "@/types/card";
import { useDeckReorder } from "@/components/deck-builder/hooks/useDeckReorder";

interface ReorderableListProps {
  items: DeckCard[];
  enabled?: boolean;
  onReorder?: (next: DeckCard[]) => void;
  plainArrowKeys?: boolean;
  renderItem: (
    item: DeckCard,
    ctx: {
      draggable: boolean;
      onDragStart: (e: React.DragEvent) => void;
      onDragOver: (e: React.DragEvent) => void;
      onDrop: (e: React.DragEvent) => void;
      onKeyDown: (e: React.KeyboardEvent) => void;
    },
  ) => React.ReactNode;
  getRowId?: (item: DeckCard) => string;
}

export const ReorderableList: React.FC<ReorderableListProps> = ({
  items,
  enabled = false,
  onReorder,
  plainArrowKeys = false,
  renderItem,
  getRowId = (i) => i.cardId,
}) => {
  const reorder = useDeckReorder({ items, onReorder, plainArrowKeys });
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <React.Fragment key={getRowId(item)}>
          {renderItem(item, {
            draggable: enabled,
            onDragStart: reorder.getDragStart(item.cardId),
            onDragOver: reorder.getDragOver(item.cardId),
            onDrop: reorder.getDrop(item.cardId),
            onKeyDown: reorder.onKeyDown(item.cardId),
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

ReorderableList.displayName = "ReorderableList";
