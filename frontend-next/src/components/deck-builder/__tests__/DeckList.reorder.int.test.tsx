import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeckList } from "../DeckList";
import { DeckCard, Card as GameCardData } from "@/types/card";
import { ToastProvider } from "@/hooks/useToast";

describe("DeckList + ReorderableList integration", () => {
  const base = {
    description: "",
    abilities: [] as string[],
    energyCost: 0,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };
  const cards: GameCardData[] = [
    {
      id: "a",
      name: "Alpha",
      cost: 1,
      type: "unit",
      faction: "solaris",
      rarity: "common",
      ...base,
    },
    {
      id: "b",
      name: "Beta",
      cost: 2,
      type: "unit",
      faction: "solaris",
      rarity: "common",
      ...base,
    },
    {
      id: "c",
      name: "Gamma",
      cost: 3,
      type: "unit",
      faction: "solaris",
      rarity: "common",
      ...base,
    },
  ];
  const deckCards: DeckCard[] = [
    { cardId: "a", quantity: 1 },
    { cardId: "b", quantity: 1 },
    { cardId: "c", quantity: 1 },
  ];

  // TODO: Flaky in JSDOM due to draggable + keyboard event dispatch. Keyboard path is covered in unit tests.
  it.skip("keyboard ArrowDown triggers onReorder when reorder enabled (plain Arrow)", async () => {
    const onReorder = jest.fn();
    const user = userEvent.setup();
    const { getAllByTestId } = render(
      <ToastProvider>
        <DeckList
          deckCards={deckCards}
          cards={cards}
          onRemoveCard={jest.fn()}
          onAddCard={jest.fn()}
          onSaveDeck={jest.fn()}
          onClearDeck={jest.fn()}
          onReorderDeckCards={onReorder}
          viewMode="list"
        />
      </ToastProvider>,
    );

    const items = getAllByTestId("deck-row");
    // Focus first row and arrow down
    items[0].focus();
    expect(items[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    // Fallback dispatch in case keyboard does not bubble correctly in this environment
    fireEvent.keyDown(items[0], {
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40,
      which: 40,
      bubbles: true,
    });

    await waitFor(() => expect(onReorder).toHaveBeenCalledTimes(1));
    const next = onReorder.mock.calls[0][0] as DeckCard[];
    expect(next.map((x) => x.cardId)).toEqual(["b", "a", "c"]);
  });
});
