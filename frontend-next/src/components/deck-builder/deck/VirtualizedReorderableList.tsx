import React from "react";
import { DeckCard } from "@/types/card";
import { useDeckReorder } from "@/components/deck-builder/hooks/useDeckReorder";
import styles from "./virtualized-list.module.css";

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
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const spacerRef = React.useRef<HTMLDivElement | null>(null);
  const offsetRef = React.useRef<HTMLDivElement | null>(null);
  const total = items.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    total,
    Math.ceil((scrollTop + height) / rowHeight) + overscan,
  );
  const slice = items.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  // Set CSS variables via refs to avoid inline style props (Option A)
  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.style.setProperty("--vh", `${height}px`);
    }
  }, [height]);

  React.useEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.setProperty("--spacer-h", `${total * rowHeight}px`);
    }
  }, [total, rowHeight]);

  React.useEffect(() => {
    if (offsetRef.current) {
      offsetRef.current.style.setProperty("--offsetY", `${offsetY}px`);
    }
  }, [offsetY]);

  return (
    <div
      ref={viewportRef}
      className={`${styles.vlistViewport} relative w-full overflow-auto`}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      {/* Spacer to preserve scroll height */}
      <div ref={spacerRef} className={styles.vlistSpacer} />
      <div ref={offsetRef} className={`${styles.vlistOffset} absolute left-0 right-0 top-0`}>
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
