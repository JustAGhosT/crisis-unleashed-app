import { GameCard } from "@/components/cards/GameCard";
import { AriaLiveRegion } from "@/components/deck-builder/deck/AriaLiveRegion";
import { DeckRow } from "@/components/deck-builder/deck/DeckRow";
import { DeckSummary } from "@/components/deck-builder/deck/DeckSummary";
import { DropZone } from "@/components/deck-builder/deck/DropZone";
import { ReorderableList } from "@/components/deck-builder/deck/ReorderableList";
import { VirtualizedReorderableList } from "@/components/deck-builder/deck/VirtualizedReorderableList";
import { useDeckAnnouncer } from "@/components/deck-builder/hooks/useDeckAnnouncer";
import { useDeckDnD } from "@/components/deck-builder/hooks/useDeckDnD";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { DeckCard, Card as GameCardData } from "@/types/card";
import { Grid, List, Save, Trash2 } from "lucide-react";
import React from "react";

interface DeckListProps {
  deckCards: DeckCard[];
  cards: GameCardData[];
  onRemoveCard: (card: GameCardData) => void;
  onAddCard: (card: GameCardData) => void;
  onSaveDeck: () => void;
  onClearDeck: () => void;
  isLoading?: boolean;
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  onSelectCard?: (card: GameCardData) => void;
  selectedCardId?: string | null;
  className?: string;
  /** Optional handler to reorder deck cards (list view only for now) */
  onReorderDeckCards?: (newOrder: DeckCard[]) => void;
  /** Maximum cards allowed in the deck (used to block invalid drops) */
  maxCards?: number;
}

/**
 * DeckList component - Displays and manages the current deck composition
 * Supports both list and grid view modes with drag-and-drop
 */
export const DeckList: React.FC<DeckListProps> = ({
  deckCards,
  cards,
  onRemoveCard,
  onAddCard,
  onSaveDeck,
  onClearDeck,
  isLoading = false,
  viewMode = "list",
  onViewModeChange,
  onSelectCard,
  selectedCardId,
  className,
  onReorderDeckCards,
  maxCards = 60,
}) => {
  const { toast } = useToast();
  const announcer = useDeckAnnouncer();
  // Create card lookup map for efficiency
  const cardMap = React.useMemo(
    () => new Map(cards.map((card) => [card.id, card])),
    [cards],
  );

  // Calculate total cards in deck
  const totalCards = React.useMemo(
    () => deckCards.reduce((sum, dc) => sum + dc.quantity, 0),
    [deckCards],
  );

  // Sort deck cards by cost, then by name
  const sortedDeckCards = React.useMemo(() => {
    // When manual reorder is enabled, preserve incoming order
    if (onReorderDeckCards) return deckCards;
    return [...deckCards].sort((a, b) => {
      const cardA = cardMap.get(a.cardId);
      const cardB = cardMap.get(b.cardId);
      if (!cardA || !cardB) return 0;

      if (cardA.cost !== cardB.cost) {
        return cardA.cost - cardB.cost;
      }
      return cardA.name.localeCompare(cardB.name);
    });
  }, [deckCards, cardMap, onReorderDeckCards]);
  // Virtualization threshold (outside of memo so it can be referenced below)
  const useVirtual = sortedDeckCards.length > 60;
  // Build a quick lookup for counts and existing non-neutral faction
  const quantityById = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const dc of deckCards) m.set(dc.cardId, dc.quantity);
    return m;
  }, [deckCards]);

  const nonNeutralFactions = React.useMemo(() => {
    const set = new Set<string>();
    for (const dc of deckCards) {
      const card = cardMap.get(dc.cardId);
      const f = card?.faction;
      if (f && f.toLowerCase() !== "neutral") set.add(f);
    }
    return set;
  }, [deckCards, cardMap]);

  const handleInvalid = (message: string) =>
    toast({ title: "Invalid drop", description: message, variant: "destructive" });

  const guardAdd = (card: GameCardData): boolean => {
    // Max deck size
    const total = deckCards.reduce((s, dc) => s + dc.quantity, 0);
    if (total >= maxCards) {
      handleInvalid(`Deck cannot exceed ${maxCards} cards.`);
      return false;
    }
    // Max copies per card (heroes capped at 1)
    const currentQty = quantityById.get(card.id) ?? 0;
    const maxAllowed = card.type === "hero" ? 1 : 3;
    if (currentQty >= maxAllowed) {
      handleInvalid(`You can only have ${maxAllowed} copies of ${card.name}.`);
      return false;
    }
    // Faction constraint: allow up to two non-neutral factions
    const f = card.faction;
    if (f && f.toLowerCase() !== "neutral") {
      const set = new Set(nonNeutralFactions);
      if (!set.has(f)) set.add(f);
      if (set.size > 2) {
        handleInvalid("Deck can include at most 2 non-neutral factions.");
        return false;
      }
    }
    return true;
  };

  const dnd = useDeckDnD({
    resolveById: (id) => cardMap.get(id),
    onAddCard: (c) => {
      if (!guardAdd(c)) return;
      onAddCard(c);
    },
    onInvalidDrop: () =>
      handleInvalid("That item cannot be added here."),
    onAnnounceAdd: announcer.announceAdd,
  });

  return (
    <DropZone
      title="Current Deck"
      totalCount={totalCards}
      isDragOver={dnd.isDragOver}
      isInvalidDrop={dnd.isInvalidDrop}
      className={className}
      onDrop={dnd.handleDrop}
      onDragOver={dnd.handleDragOver}
      onDragEnter={dnd.handleDragEnter}
      onDragLeave={dnd.handleDragLeave}
      headerRight={
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex rounded border border-slate-600 overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => onViewModeChange("list")}
                className="rounded-none px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => onViewModeChange("grid")}
                className="rounded-none px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={onSaveDeck}
            disabled={isLoading || totalCards === 0}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onClearDeck}
            disabled={isLoading || totalCards === 0}
            className="text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      }
    >
      {totalCards === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Drag cards here to start building your deck</p>
          <p className="text-sm">
            You can also click on a card in the grid to add it
          </p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            useVirtual ? (
              <VirtualizedReorderableList
                items={sortedDeckCards}
                enabled={Boolean(onReorderDeckCards)}
                onReorder={onReorderDeckCards}
                plainArrowKeys={Boolean(onReorderDeckCards)}
                renderItem={(deckCard, ctx) => {
                  const card = cardMap.get(deckCard.cardId);
                  if (!card) return null;
                  return (
                    <DeckRow
                      key={deckCard.cardId}
                      card={card}
                      quantity={deckCard.quantity}
                      selected={selectedCardId === card.id}
                      disabled={isLoading}
                      onAdd={(c) => {
                        announcer.announceAdd(c.name);
                        onAddCard(c);
                      }}
                      onRemove={(c) => {
                        announcer.announceRemove(c.name);
                        onRemoveCard(c);
                      }}
                      onClick={(c) => onSelectCard?.(c)}
                      draggable={ctx.draggable}
                      onDragStart={ctx.onDragStart}
                      onDragOver={ctx.onDragOver}
                      onDrop={ctx.onDrop}
                      onKeyDown={ctx.onKeyDown}
                    />
                  );
                }}
              />
            ) : (
              <ReorderableList
                items={sortedDeckCards}
                enabled={Boolean(onReorderDeckCards)}
                onReorder={onReorderDeckCards}
                plainArrowKeys={Boolean(onReorderDeckCards)}
                renderItem={(deckCard, ctx) => {
                  const card = cardMap.get(deckCard.cardId);
                  if (!card) return null;
                  return (
                    <DeckRow
                      key={deckCard.cardId}
                      card={card}
                      quantity={deckCard.quantity}
                      selected={selectedCardId === card.id}
                      disabled={isLoading}
                      onAdd={(c) => {
                        announcer.announceAdd(c.name);
                        onAddCard(c);
                      }}
                      onRemove={(c) => {
                        announcer.announceRemove(c.name);
                        onRemoveCard(c);
                      }}
                      onClick={(c) => onSelectCard?.(c)}
                      draggable={ctx.draggable}
                      onDragStart={ctx.onDragStart}
                      onDragOver={ctx.onDragOver}
                      onDrop={ctx.onDrop}
                      onKeyDown={ctx.onKeyDown}
                    />
                  );
                }}
              />
            )
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedDeckCards.map((deckCard) => {
                const card = cardMap.get(deckCard.cardId);
                if (!card) return null;

                return (
                  <GameCard
                    key={deckCard.cardId}
                    card={card}
                    quantity={deckCard.quantity}
                    size="sm"
                    onAdd={onAddCard}
                    onRemove={onRemoveCard}
                    onClick={onSelectCard}
                    disabled={isLoading}
                  />
                );
              })}
            </div>
          )}

          <DeckSummary
            uniqueCount={sortedDeckCards.length}
            totalCount={totalCards}
            averageCost={
              totalCards > 0
                ? (
                    deckCards.reduce((sum, dc) => {
                      const card = cardMap.get(dc.cardId);
                      return sum + (card ? (card.cost ?? 0) * dc.quantity : 0);
                    }, 0) / totalCards
                  ).toFixed(1)
                : "0.0"
            }
          />
        </>
      )}
      <AriaLiveRegion message={announcer.message} />
    </DropZone>
  );
};

DeckList.displayName = "DeckList";
