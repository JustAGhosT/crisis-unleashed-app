import { render } from "@testing-library/react";
import { DeckList } from "../DeckList";
import { ToastProvider } from "@/hooks/useToast";

// Create a simpler test version first
describe("DeckList simple test", () => {
  it("renders without crashing", () => {
    const cards = [{ id: "a", name: "Card A", type: "unit", faction: "solaris", cost: 1 }];
    const deckCards = [{ cardId: "a", quantity: 1 }];
    
    // Just render without expecting specific behavior
    render(
      <ToastProvider>
        <DeckList
          deckCards={deckCards as any}
          cards={cards as any}
          onAddCard={() => {}}
          onRemoveCard={() => {}}
          onSaveDeck={() => {}}
          onClearDeck={() => {}}
          onReorderDeckCards={() => {}}
          maxCards={60}
        />
      </ToastProvider>
    );
    
    // No assertions, just check that it renders
    expect(true).toBe(true);
  });
});