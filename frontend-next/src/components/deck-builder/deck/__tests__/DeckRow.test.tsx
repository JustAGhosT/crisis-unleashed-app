import React from "react";
import { render } from "@testing-library/react";
import { DeckRow } from "../DeckRow";
import { Card as GameCardData } from "@/types/card";

const card: GameCardData = {
  id: "c1",
  name: "Alpha",
  description: "Test unit",
  type: "unit",
  faction: "solaris",
  rarity: "common",
  cost: 2,
  abilities: [],
  energyCost: 2,
  isActive: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
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
