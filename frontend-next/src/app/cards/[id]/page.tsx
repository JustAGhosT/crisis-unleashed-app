"use client";

import { CardDetail } from '@/components/cards/CardDetail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCardDetail } from '@/hooks/useCardDetail';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.id as string;

  // Mock user ID - in a real app, this would come from authentication context
  const userId = 'current-user';

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

  // Handle "Add to Deck" button click
  const handleAddToDeck = () => {
    // In a real app, this might open a deck selector or use a default deck
    addToDeck('default-deck');
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

      {loading ? (
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
        <CardDetail
          card={card}
          onAddToDeck={handleAddToDeck}
          onToggleFavorite={toggleFavorite}
          ownedQuantity={ownedQuantity}
          isFavorite={isFavorite}
        />
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The card you&apos;re looking for does not exist or has been removed.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}