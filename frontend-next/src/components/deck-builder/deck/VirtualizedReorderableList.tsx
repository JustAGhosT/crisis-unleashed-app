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

  // Memoized style objects to avoid inline-style lint warnings while retaining CSS variable approach (Option A)
  const viewportStyle = React.useMemo(
    () => ({ "--vh": `${height}px` } as React.CSSProperties),
    [height],
  );
  const spacerStyle = React.useMemo(
    () => ({ "--spacer-h": `${total * rowHeight}px` } as React.CSSProperties),
    [total, rowHeight],
  );
  const translateStyle = React.useMemo(
    () => ({ "--offsetY": `${offsetY}px` } as React.CSSProperties),
    [offsetY],
  );

  return (
    <div
      className="relative w-full overflow-auto [height:var(--vh)]"
      /* eslint-disable-next-line */
      style={viewportStyle}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      {/* Spacer to preserve scroll height */}
      <div
        className="[height:var(--spacer-h)]"
        /* eslint-disable-next-line */
        style={spacerStyle}
      />
      <div
        className="absolute left-0 right-0 [transform:translateY(var(--offsetY))]"
        /* eslint-disable-next-line */
        style={translateStyle}
      >
        <div className="space-y-2" role="list" aria-label="Virtualized deck list">
          {slice.map((item) => (
            <div key={getRowId(item)} role="listitem">
              {renderItem(item, {
                draggable: enabled,
                onDragStart: reorder.getDragStart(item.cardId),
                onDragOver: reorder.getDragOver(item.cardId),
                onDrop: reorder.getDrop(item.cardId),
                onKeyDown: reorder.onKeyDown(item.cardId),
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
;

VirtualizedReorderableList.displayName = "VirtualizedReorderableList";
