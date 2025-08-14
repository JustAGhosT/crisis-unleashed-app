import React from "react";
import { DeckCard } from "@/types/card";
import { useDeckReorder } from "@/components/deck-builder/hooks/useDeckReorder";

interface VirtualizedReorderableListProps {
  items: DeckCard[];
  enabled?: boolean;
  onReorder?: (next: DeckCard[]) => void;
  plainArrowKeys?: boolean;
  rowHeight?: number; // px
  height?: number; // px
  overscan?: number; // rows
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

export const VirtualizedReorderableList: React.FC<
  VirtualizedReorderableListProps
> = ({
  items,
  enabled = false,
  onReorder,
  plainArrowKeys = false,
  rowHeight = 56,
  height = 420,
  overscan = 6,
  renderItem,
  getRowId = (i) => i.cardId,
}) => {
  const reorder = useDeckReorder({ items, onReorder, plainArrowKeys });
  const [scrollTop, setScrollTop] = React.useState(0);
  const total = items.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    total,
    Math.ceil((scrollTop + height) / rowHeight) + overscan,
  );
  const slice = items.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  return (
    <div
      className="relative w-full overflow-auto"
      style={{ height }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      role="list"
      aria-label="Virtualized deck list"
    >
      <div style={{ height: total * rowHeight }} />
      <div
        className="absolute left-0 right-0"
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        <div className="space-y-2">
          {slice.map((item) => (
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
      </div>
    </div>
  );
};

VirtualizedReorderableList.displayName = "VirtualizedReorderableList";
