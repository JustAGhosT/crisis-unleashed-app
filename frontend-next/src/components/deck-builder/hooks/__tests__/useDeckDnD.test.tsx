import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useDeckDnD } from "../useDeckDnD";
import { CARD_ID_MIME, CARD_JSON_MIME } from "@/types/deck";
import { Card as GameCardData } from "@/types/card";

function Wrapper({
  cards,
  onAdd,
  onInvalid,
  onAnnounce,
}: {
  cards: GameCardData[];
  onAdd: (c: GameCardData) => void;
  onInvalid: () => void;
  onAnnounce?: (name: string) => void;
}) {
  const cardMap = React.useMemo(
    () => new Map(cards.map((c) => [c.id, c])),
    [cards],
  );
  const dnd = useDeckDnD({
    resolveById: (id) => cardMap.get(id),
    onAddCard: onAdd,
    onInvalidDrop: onInvalid,
    onAnnounceAdd: onAnnounce,
  });
  return (
    <div
      data-testid="dropzone"
      onDrop={dnd.handleDrop}
      onDragOver={dnd.handleDragOver}
      onDragEnter={dnd.handleDragEnter}
      onDragLeave={dnd.handleDragLeave}
    />
  );
}

describe("useDeckDnD", () => {
  const cards: GameCardData[] = [
    {
      id: "c1",
      name: "Alpha",
      cost: 1,
      type: "Unit",
      faction: "solaris",
      rarity: "common",
    },
  ];

  it("adds by id payload", () => {
    const onAdd = jest.fn();
    const onInvalid = jest.fn();
    const onAnnounce = jest.fn();
    const { getByTestId } = render(
      <Wrapper
        cards={cards}
        onAdd={onAdd}
        onInvalid={onInvalid}
        onAnnounce={onAnnounce}
      />,
    );
    const dz = getByTestId("dropzone");
    const store: Record<string, string> = { [CARD_ID_MIME]: "c1" };
    const event = {
      preventDefault: () => {},
      dataTransfer: {
        getData: (k: string) => store[k] || "",
        dropEffect: "copy",
      },
    } as any;
    fireEvent.drop(dz, event);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0].id).toBe("c1");
    expect(onInvalid).not.toHaveBeenCalled();
    expect(onAnnounce).toHaveBeenCalledWith("Alpha");
  });

  it("adds by JSON payload", () => {
    const onAdd = jest.fn();
    const onInvalid = jest.fn();
    const { getByTestId } = render(
      <Wrapper cards={cards} onAdd={onAdd} onInvalid={onInvalid} />,
    );
    const dz = getByTestId("dropzone");
    const store: Record<string, string> = {
      [CARD_JSON_MIME]: JSON.stringify({ id: "c1" }),
    };
    fireEvent.drop(dz, {
      preventDefault: () => {},
      dataTransfer: {
        getData: (k: string) => store[k] || "",
        dropEffect: "copy",
      },
    } as any);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it("invalid drop triggers onInvalid", () => {
    const onAdd = jest.fn();
    const onInvalid = jest.fn();
    const { getByTestId } = render(
      <Wrapper cards={cards} onAdd={onAdd} onInvalid={onInvalid} />,
    );
    const dz = getByTestId("dropzone");
    const store: Record<string, string> = { "text/plain": "noop" };
    fireEvent.drop(dz, {
      preventDefault: () => {},
      dataTransfer: {
        getData: (k: string) => store[k] || "",
        dropEffect: "copy",
      },
    } as any);
    expect(onAdd).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalledTimes(1);
  });
});
