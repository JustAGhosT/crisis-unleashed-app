"use client";

import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Deck, Card as CardType } from "@/types/deck";
import DeckCard from "./DeckCard";
import { AlertTriangle } from "lucide-react";

interface DeckEditorPanelProps {
  deck: Deck;
  onRemoveCard: (card: CardType) => void;
  onClearDeck: () => void;
  onSaveDeck: () => void;
  onExportDeck: () => void;
  isValid: boolean;
  validationErrors: string[];
}

export default function DeckEditorPanel({
  deck,
  onRemoveCard,
  onClearDeck,
  onSaveDeck,
  onExportDeck,
  isValid,
  validationErrors,
}: DeckEditorPanelProps) {
  // Group cards by type for better organization
  const cardsByType = deck.cards.reduce(
    (acc, card) => {
      const type = card.type || "Unknown";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(card);
      return acc;
    },
    {} as Record<string, CardType[]>,
  );

  // Sort card types in a specific order
  const sortedCardTypes = Object.keys(cardsByType).sort((a, b) => {
    const typeOrder = ["Unit", "Tactic", "Support", "Resource", "Unknown"];
    return typeOrder.indexOf(a) - typeOrder.indexOf(b);
  });

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="dark:text-white">
              {deck.name || "Untitled Deck"}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {deck.faction ? `${deck.faction} • ` : ""}
              {deck.cards.length} / {deck.maxCards || 60} cards
            </CardDescription>
          </div>
          <Badge
            variant={isValid ? "secondary" : "destructive"}
            className={
              isValid
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : ""
            }
          >
            {isValid ? "Valid" : "Invalid"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Validation errors */}
        {!isValid && validationErrors.length > 0 && (
          <Alert className="mx-6 mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {deck.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Empty Deck
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Your deck is empty. Browse and add cards from the right panel.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px] px-6">
            <div className="space-y-4 pb-4">
              {sortedCardTypes.map((type) => (
                <div key={type}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    {type}
                    <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {cardsByType[type].length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {cardsByType[type].map((card) => (
                      <DeckCard
                        key={`${card.id}-${card.instanceId}`}
                        card={card}
                        onRemove={() => onRemoveCard(card)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t p-6 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearDeck}
          disabled={deck.cards.length === 0}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Clear Deck
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportDeck}
          disabled={deck.cards.length === 0}
          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Export
        </Button>
        <Button
          size="sm"
          onClick={onSaveDeck}
          disabled={!isValid || deck.cards.length === 0}
          className="ml-auto"
        >
          Save Deck
        </Button>
      </CardFooter>
    </>
  );
}
