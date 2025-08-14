"use client";

import { CardDetail } from "@/components/cards/CardDetail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardDetail } from "@/hooks/useCardDetail";
import { useUserDecks } from "@/hooks/useDecks";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CardDetailPage() {
  const params = useParams<{ id?: string }>();
  // Guard against malformed routes where params.id may be missing or not a string
  const cardId = typeof params.id === "string" ? params.id : "";

  // TODO: derive userId from authentication context/provider. Avoid hard-coded test IDs in production.
  const userId: string | undefined = undefined;

  // Load user's decks only when authenticated
  const isAuthenticated = Boolean(userId);
  const { data: userDecks } = useUserDecks(userId ?? "", isAuthenticated);
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  useEffect(() => {
    if (
      isAuthenticated &&
      userDecks &&
      userDecks.length > 0 &&
      !selectedDeckId
    ) {
      setSelectedDeckId(userDecks[0].id);
    }
  }, [isAuthenticated, userDecks, selectedDeckId]);

  const {
    card,
    loading,
    error,
    isFavorite,
    ownedQuantity,
    toggleFavorite,
    addToDeck,
  } = useCardDetail({
    cardId,
    userId,
  });

  // Handle "Add to Deck" button click using an explicit deck selection
  const handleAddToDeck = () => {
    if (selectedDeckId) {
      addToDeck(selectedDeckId);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cards" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cards
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Card Details</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!cardId ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The card you&apos;re looking for does not exist or has an invalid
            URL.
          </AlertDescription>
        </Alert>
      ) : loading ? (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6 animate-pulse">
            <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-700 rounded-lg"></div>
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ) : card ? (
        <>
          {userId && userDecks && userDecks.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <label htmlFor="deck-select" className="text-sm font-medium">
                Select deck
              </label>
              <select
                id="deck-select"
                className="border rounded px-2 py-1 bg-background"
                value={selectedDeckId}
                onChange={(e) => setSelectedDeckId(e.target.value)}
              >
                {userDecks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <CardDetail
            card={card}
            onAddToDeck={handleAddToDeck}
            onToggleFavorite={toggleFavorite}
            ownedQuantity={ownedQuantity}
            isFavorite={isFavorite}
          />
        </>
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The card you&apos;re looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
