import { renderHook, act } from "@testing-library/react";
import { useDeckReorder } from "../useDeckReorder";
import { DeckCard } from "@/types/card";

describe("useDeckReorder", () => {
  const items: DeckCard[] = [
    { cardId: "a", quantity: 1 },
    { cardId: "b", quantity: 2 },
    { cardId: "c", quantity: 3 },
  ];

  it("moves item between positions", () => {
    const onReorder = jest.fn();
    const { result } = renderHook(() => useDeckReorder({ items, onReorder }));
    act(() => {
      result.current.move("a", "c");
    });
    expect(onReorder).toHaveBeenCalledTimes(1);
    const next: DeckCard[] = onReorder.mock.calls[0][0];
    expect(next.map((i) => i.cardId)).toEqual(["b", "c", "a"]);
  });

  it("moves item up/down via keyboard direction", () => {
    const onReorder = jest.fn();
    const { result, rerender } = renderHook(
      (props: any) => useDeckReorder(props),
      {
        initialProps: { items, onReorder },
      },
    );

    act(() => {
      result.current.moveByDirection("b", "up");
    });
    expect(onReorder).toHaveBeenCalledTimes(1);
    let next: DeckCard[] = onReorder.mock.calls[0][0];
    expect(next.map((i) => i.cardId)).toEqual(["b", "a", "c"]);

    // Rerender with new order to simulate state update
    onReorder.mockClear();
    rerender({ items: next, onReorder });

    act(() => {
      result.current.moveByDirection("b", "down");
    });
    expect(onReorder).toHaveBeenCalledTimes(1);
    next = onReorder.mock.calls[0][0];
    expect(next.map((i) => i.cardId)).toEqual(["a", "b", "c"]);
  });
});
