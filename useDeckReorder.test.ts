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
    
    // Directly call the handler with the result of the callback
    act(() => {
      // Call the function and capture its result
      const nextItems = [...items];
      const fromIdx = items.findIndex(i => i.cardId === "a");
      const toIdx = items.findIndex(i => i.cardId === "c");
      const [moved] = nextItems.splice(fromIdx, 1);
      nextItems.splice(toIdx, 0, moved);
      
      // Use the result to call onReorder directly
      result.current.move("a", "c");
      onReorder.mock.calls[0][0].forEach((item, idx) => {
        expect(item.cardId).toBe(nextItems[idx].cardId);
      });
    });
    
    expect(onReorder).toHaveBeenCalledTimes(1);
    const next: DeckCard[] = onReorder.mock.calls[0][0];
    expect(next.map((i) => i.cardId)).toEqual(["b", "c", "a"]);
  });

  // Rest of tests remain unchanged
  it("moves item up/down via keyboard direction", () => {
    // Existing test case remains unchanged
  });
});