import { Metadata } from 'next';
import { DeckBuilder } from '@/components/deck-builder/DeckBuilder';

export const metadata: Metadata = {
  title: 'Deck Builder - Crisis Unleashed',
  description: 'Create and customize your deck for Crisis Unleashed battles',
};

export default function DeckBuilderPage() {
  // In a real app, this would come from authentication context
  const userId = 'user-1'; // Mock user ID for development

  return (
    <main>
      <DeckBuilder userId={userId} />
    </main>
  );
}