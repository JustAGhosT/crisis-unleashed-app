"use client";

import { Card, Deck } from "@/types/deck";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Sample cards for demonstration
import { sampleCards } from "./sample-cards";

const genId = () =>
  globalThis.crypto && "randomUUID" in globalThis.crypto
    ? (globalThis.crypto as Crypto).randomUUID()
    : Math.random().toString(36).slice(2);

interface DeckBuilderContextType {
  deck: Deck;
  past: Deck[];
  future: Deck[];
  cards: Card[];
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (card: Card) => void;
  removeOneByCardId: (cardId: string) => void;
  clearDeck: () => void;
  saveDeck: (name: string, description: string) => void;
  loadDeck: (deckId: string) => Promise<boolean>;
  undo: () => void;
  redo: () => void;
  isValid: boolean;
  validationErrors: string[];
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(
  undefined,
);

interface DeckBuilderProviderProps {
  children: ReactNode;
  initialDeck?: Deck;
}

export function DeckBuilderProvider({
  children,
  initialDeck,
}: DeckBuilderProviderProps) {
  // Initialize deck state
  const [deck, setDeck] = useState<Deck>(
    initialDeck || {
      name: "Untitled Deck",
      description: "",
      cards: [],
      maxCards: 50,
      minCards: 30,
    },
  );
  const [past, setPast] = useState<Deck[]>([]);
  const [future, setFuture] = useState<Deck[]>([]);

  // Store all available cards
  const [cards] = useState<Card[]>(sampleCards);

  // Validation state
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate the deck
  const validateDeck = React.useCallback(() => {
    const errors: string[] = [];

    // Check card count (30-50)
    const min = deck.minCards || 30;
    const max = deck.maxCards || 50;
    if (deck.cards.length < min) {
      errors.push(`Deck must contain at least ${min} cards`);
    }
    if (deck.cards.length > max) {
      errors.push(`Deck cannot contain more than ${max} cards`);
    }

    // Faction constraint: allow up to 2 non-neutral factions
    const nonNeutralFactions = deck.cards
      .map((c) => c.faction)
      .filter((f): f is string => Boolean(f) && String(f).toLowerCase() !== "neutral");
    const uniqueNonNeutral = new Set(nonNeutralFactions);
    if (uniqueNonNeutral.size > 2) {
      errors.push("Deck can include at most 2 non-neutral factions");
    }

    // Check card limits (max 3 copies of any card; unique cards max 1)
    const cardCounts: Record<string, number> = {};
    deck.cards.forEach((card) => {
      cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
    });

    Object.entries(cardCounts).forEach(([cardId, count]) => {
      const card = deck.cards.find((c) => c.id === cardId);
      if (card?.isUnique && count > 1) {
        errors.push(
          `Cannot have more than 1 copy of unique card: ${card.name}`,
        );
      } else if (count > 3) {
        const card = deck.cards.find((c) => c.id === cardId);
        errors.push(`Cannot have more than 3 copies of: ${card?.name}`);
      }
    });

    setValidationErrors(errors);
    setIsValid(errors.length === 0);
  }, [deck]);

  // Validate deck whenever it changes
  useEffect(() => {
    validateDeck();
  }, [validateDeck]);

  // Add a card to the deck
  const addCardToDeck = (card: Card) => {
    const cardWithId: Card = { ...card, instanceId: genId() };
    setPast((p) => [...p, deck]);
    setFuture([]);
    setDeck((prevDeck) => ({ ...prevDeck, cards: [...prevDeck.cards, cardWithId] }));
  };

  // Remove a card from the deck
  const removeCardFromDeck = (card: Card) => {
    setPast((p) => [...p, deck]);
    setFuture([]);
    setDeck((prevDeck) => ({
      ...prevDeck,
      cards: prevDeck.cards.filter((c) => c.instanceId !== card.instanceId),
    }));
  };

  const removeOneByCardId = (cardId: string) => {
    setPast((p) => [...p, deck]);
    setFuture([]);
    setDeck((prevDeck) => {
      const idx = prevDeck.cards.findIndex((c) => c.id === cardId);
      if (idx === -1) return prevDeck;
      const nextCards = prevDeck.cards.slice();
      nextCards.splice(idx, 1);
      return { ...prevDeck, cards: nextCards };
    });
  };

  // Clear the deck
  const clearDeck = () => {
    setPast((p) => [...p, deck]);
    setFuture([]);
    setDeck((prevDeck) => ({ ...prevDeck, cards: [] }));
  };

  // Save the deck
  const saveDeck = (name: string, description: string) => {
    setDeck((prevDeck) => ({
      ...prevDeck,
      id: prevDeck.id || genId(),
      name,
      description,
      updatedAt: new Date().toISOString(),
      createdAt: prevDeck.createdAt || new Date().toISOString(),
    }));

    // In a real app, you would save to a database or API here
    localStorage.setItem(
      "savedDeck",
      JSON.stringify({
        ...deck,
        name,
        description,
        updatedAt: new Date().toISOString(),
        createdAt: deck.createdAt || new Date().toISOString(),
      }),
    );
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, p.length - 1));
    setFuture((f) => [deck, ...f]);
    setDeck(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const [next, ...rest] = future;
    setPast((p) => [...p, deck]);
    setFuture(rest);
    setDeck(next);
  };

  // Load a deck
  const loadDeck = async (_deckId: string): Promise<boolean> => {
    // In a real app, you would load from a database or API here
    try {
      // reference to avoid unused param lint
      void _deckId;
      const savedDeck = localStorage.getItem("savedDeck");
      if (savedDeck) {
        setDeck(JSON.parse(savedDeck));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading deck:", error);
      return false;
    }
  };

  const value = {
    deck,
    past,
    future,
    cards,
    addCardToDeck,
    removeCardFromDeck,
    removeOneByCardId,
    clearDeck,
    saveDeck,
    loadDeck,
    undo,
    redo,
    isValid,
    validationErrors,
  };

  return (
    <DeckBuilderContext.Provider value={value}>
      {children}
    </DeckBuilderContext.Provider>
  );
}

export function useDeckBuilder() {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw new Error("useDeckBuilder must be used within a DeckBuilderProvider");
  }
  return context;
}
