import React from "react";
import { CARD_ID_MIME, CARD_JSON_MIME } from "@/types/deck";
import { Card as GameCardData } from "@/types/card";

interface UseDeckDnDParams {
  resolveById: (id: string) => GameCardData | undefined;
  onAddCard: (card: GameCardData) => void;
  onInvalidDrop: () => void;
  onAnnounceAdd?: (name: string) => void;
}

export function useDeckDnD({
  resolveById,
  onAddCard,
  onInvalidDrop,
  onAnnounceAdd,
}: UseDeckDnDParams) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isInvalidDrop, setIsInvalidDrop] = React.useState(false);
  const invalidTimer = React.useRef<number | null>(null);

  const showInvalid = React.useCallback(() => {
    setIsInvalidDrop(true);
    if (invalidTimer.current) window.clearTimeout(invalidTimer.current);
    invalidTimer.current = window.setTimeout(
      () => setIsInvalidDrop(false),
      600,
    );
    onInvalidDrop();
  }, [onInvalidDrop]);

  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      try {
        const idPayload = e.dataTransfer.getData(CARD_ID_MIME);
        if (idPayload) {
          const byId = resolveById(idPayload);
          if (byId) {
            onAddCard(byId);
            onAnnounceAdd?.(byId.name);
            return;
          }
        }
        const json = e.dataTransfer.getData(CARD_JSON_MIME);
        if (json) {
          const parsed = JSON.parse(json);
          const byJson = parsed?.id ? resolveById(parsed.id) : undefined;
          if (byJson) {
            onAddCard(byJson);
            onAnnounceAdd?.(byJson.name);
            return;
          }
        }
        showInvalid();
      } catch {
        showInvalid();
      }
    },
    [onAddCard, onAnnounceAdd, resolveById, showInvalid],
  );

  return {
    isDragOver,
    isInvalidDrop,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
