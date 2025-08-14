import React from "react";
import { render } from "@testing-library/react";
import { DeckRow } from "../DeckRow";
import { Card as GameCardData } from "@/types/card";

const card: GameCardData = {
  id: "c1",
  name: "Alpha",
  cost: 2,
  type: "unit",
  faction: "solaris",
  rarity: "common",
};

describe("DeckRow", () => {
  it("renders and matches snapshot", () => {
    const { container } = render(
      <DeckRow
        card={card}
        quantity={2}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        draggable
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
