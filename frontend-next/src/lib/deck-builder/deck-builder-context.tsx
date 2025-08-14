const genId = () =>
  globalThis.crypto && "randomUUID" in globalThis.crypto
    ? (globalThis.crypto as Crypto).randomUUID()
    : Math.random().toString(36).slice(2);
("use client");

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Deck, Card } from "@/types/deck";

// Sample cards for demonstration
import { sampleCards } from "./sample-cards";

interface DeckBuilderContextType {
  deck: Deck;
  cards: Card[];
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (card: Card) => void;
  clearDeck: () => void;
  saveDeck: (name: string, description: string) => void;
  loadDeck: (deckId: string) => Promise<boolean>;
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
      maxCards: 60,
      minCards: 40,
    },
  );

  // Store all available cards
  const [cards] = useState<Card[]>(sampleCards);

  // Validation state
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate the deck
  const validateDeck = React.useCallback(() => {
    const errors: string[] = [];

    // Check card count
    if (deck.cards.length < (deck.minCards || 40)) {
      errors.push(`Deck must contain at least ${deck.minCards || 40} cards`);
    }

    if (deck.cards.length > (deck.maxCards || 60)) {
      errors.push(`Deck cannot contain more than ${deck.maxCards || 60} cards`);
    }

    // Check faction consistency
    const cardFactions = deck.cards
      .filter((card) => card.faction && card.faction !== "Neutral")
      .map((card) => card.faction);

    const uniqueFactions = new Set(cardFactions);
    if (uniqueFactions.size > 1) {
      errors.push("Deck cannot contain cards from multiple factions");
    }

    // Check card limits (max 3 copies of any card, except unique cards)
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
    // Clone the card and add a unique instanceId
    const cardWithId: Card = {
      ...card,
      instanceId: genId(),
    };

    setDeck((prevDeck) => ({
      ...prevDeck,
      cards: [...prevDeck.cards, cardWithId],
    }));
  };

  // Remove a card from the deck
  const removeCardFromDeck = (card: Card) => {
    setDeck((prevDeck) => ({
      ...prevDeck,
      cards: prevDeck.cards.filter(
        (c) =>
          // Remove the specific instance of the card
          c.instanceId !== card.instanceId,
      ),
    }));
  };

  // Clear the deck
  const clearDeck = () => {
    setDeck((prevDeck) => ({
      ...prevDeck,
      cards: [],
    }));
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
    cards,
    addCardToDeck,
    removeCardFromDeck,
    clearDeck,
    saveDeck,
    loadDeck,
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
