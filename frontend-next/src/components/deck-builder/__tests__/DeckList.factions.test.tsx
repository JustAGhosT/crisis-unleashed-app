import { render } from "@testing-library/react";
import { DeckList } from "../DeckList";

const make = (id: string, type: string, faction: string) => ({ id, name: id, type, faction, cost: 1 });

describe("DeckList faction limit", () => {
  it("blocks adding a third non-neutral faction", () => {
    const a = make("a", "unit", "solaris");
    const b = make("b", "unit", "umbral");
    const c = make("c", "unit", "aeonic");
    // Deck already has card from solaris and umbral
    const deckCards = [
      { cardId: "a", quantity: 1 },
      { cardId: "b", quantity: 1 },
    ];
    const cards = [a, b, c];
    const onAddCard = jest.fn();

    render(
      <DeckList
        deckCards={deckCards as any}
        cards={cards as any}
        onAddCard={onAddCard}
        onRemoveCard={() => {}}
        onSaveDeck={() => {}}
        onClearDeck={() => {}}
        maxCards={60}
      />,
    );

    expect(onAddCard).not.toHaveBeenCalled();
  });
});


