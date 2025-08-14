import React from "react";
import { DeckCard } from "@/types/card";
import { DECK_CARD_ID_MIME } from "@/types/deck";

export type ReorderDirection = "up" | "down";

interface UseDeckReorderParams {
  items: DeckCard[];
  onReorder?: (next: DeckCard[]) => void;
  plainArrowKeys?: boolean;
}

export function useDeckReorder({
  items,
  onReorder,
  plainArrowKeys = false,
}: UseDeckReorderParams) {
  const findIndexById = React.useCallback(
    (id: string) => items.findIndex((dc) => dc.cardId === id),
    [items],
  );

  const move = React.useCallback(
    (sourceId: string, targetId: string) => {
      if (!onReorder) return;
      if (sourceId === targetId) return;
      const fromIdx = findIndexById(sourceId);
      const toIdx = findIndexById(targetId);
      if (fromIdx === -1 || toIdx === -1) return;
      const next = [...items];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      onReorder(next);
    },
    [items, onReorder, findIndexById],
  );

  const moveByDirection = React.useCallback(
    (id: string, direction: ReorderDirection) => {
      if (!onReorder) return;
      const idx = findIndexById(id);
      if (idx === -1) return;
      const targetIdx =
        direction === "up"
          ? Math.max(0, idx - 1)
          : Math.min(items.length - 1, idx + 1);
      if (targetIdx === idx) return;
      const next = [...items];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);
      onReorder(next);
    },
    [items, onReorder, findIndexById],
  );

  // Drag handlers per-row
  const getDragStart = React.useCallback(
    (id: string) => (e: React.DragEvent) => {
      if (!onReorder) return;
      e.dataTransfer.setData(DECK_CARD_ID_MIME, id);
      e.dataTransfer.effectAllowed = "move";
    },
    [onReorder],
  );

  const getDragOver = React.useCallback(
    (targetId: string) => (e: React.DragEvent) => {
      if (!onReorder) return;
      void targetId; // referenced to appease linter
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    [onReorder],
  );

  const getDrop = React.useCallback(
    (targetId: string) => (e: React.DragEvent) => {
      if (!onReorder) return;
      e.stopPropagation();
      e.preventDefault();
      const sourceId = e.dataTransfer.getData(DECK_CARD_ID_MIME);
      if (!sourceId) return;
      move(sourceId, targetId);
    },
    [onReorder, move],
  );

  const onKeyDown = React.useCallback(
    (id: string) => (e: React.KeyboardEvent) => {
      if (!onReorder) return;
      const modOK = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
      if (e.key === "ArrowUp" && (plainArrowKeys || modOK)) {
        e.preventDefault();
        moveByDirection(id, "up");
      } else if (e.key === "ArrowDown" && (plainArrowKeys || modOK)) {
        e.preventDefault();
        moveByDirection(id, "down");
      }
    },
    [onReorder, moveByDirection, plainArrowKeys],
  );

  return {
    getDragStart,
    getDragOver,
    getDrop,
    onKeyDown,
    move,
    moveByDirection,
  };
}
