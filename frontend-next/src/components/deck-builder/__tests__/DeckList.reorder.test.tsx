import { render } from "@testing-library/react";
import React from "react";
import { DeckList } from "../DeckList";

// Mock ReorderableList to immediately invoke onReorder with reversed items
jest.mock("@/components/deck-builder/deck/ReorderableList", () => ({
  ReorderableList: (props: any) => {
    React.useEffect(() => {
      const reversed = [...props.items].reverse();
      props.onReorder?.(reversed);
    }, []);
    return null;
  },
}));

// Avoid virtualized branch by keeping items small
const mkCard = (id: string) => ({ id, name: id, type: "unit", faction: "solaris", cost: 1 });

describe("DeckList reorder", () => {
  it("calls onReorderDeckCards when list reorders", () => {
    const cards = [mkCard("a"), mkCard("b")];
    const deckCards = [
      { cardId: "a", quantity: 1 },
      { cardId: "b", quantity: 1 },
    ];
    const onReorderDeckCards = jest.fn();

    render(
      <DeckList
        deckCards={deckCards as any}
        cards={cards as any}
        onAddCard={() => {}}
        onRemoveCard={() => {}}
        onSaveDeck={() => {}}
        onClearDeck={() => {}}
        onReorderDeckCards={onReorderDeckCards}
        maxCards={60}
      />,
    );

    expect(onReorderDeckCards).toHaveBeenCalled();
    const arg = onReorderDeckCards.mock.calls[0][0];
    expect(arg[0].cardId).toBe("b");
    expect(arg[1].cardId).toBe("a");
  });
});


