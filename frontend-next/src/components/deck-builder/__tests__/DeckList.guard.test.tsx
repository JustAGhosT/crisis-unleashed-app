import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeckList } from "../DeckList";

const makeCard = (id: string, overrides: Partial<any> = {}) => ({
  id,
  name: id,
  type: "unit",
  faction: "solaris",
  cost: 1,
  ...overrides,
});

describe("DeckList guardAdd", () => {
  it("blocks adding beyond max copies (3 for non-hero)", async () => {
    const user = userEvent.setup();
    const card = makeCard("c1");
    const deckCards = [{ cardId: "c1", quantity: 3 }];
    const cards = [card];
    const onAddCard = jest.fn();
    const onRemoveCard = jest.fn();

    render(
      <DeckList
        deckCards={deckCards as any}
        cards={cards as any}
        onAddCard={onAddCard}
        onRemoveCard={onRemoveCard}
        onSaveDeck={() => {}}
        onClearDeck={() => {}}
        maxCards={60}
      />,
    );

    // Try to add c1 again via keyboard add on a rendered row (simulate accessible add via button)
    const addButtons = await screen.findAllByRole("button", { name: /add/i });
    if (addButtons[0]) {
      await user.click(addButtons[0]);
    }

    expect(onAddCard).not.toHaveBeenCalled();
  });
});


