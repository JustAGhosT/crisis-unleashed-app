import { renderHook, act } from "@testing-library/react";
import { useDeckAnnouncer } from "../useDeckAnnouncer";

describe("useDeckAnnouncer", () => {
  it("announces add, remove, and clears message", () => {
    const { result } = renderHook(() => useDeckAnnouncer());

    act(() => {
      result.current.announceAdd("Alpha");
    });
    expect(result.current.message).toBe("Alpha added to deck");

    act(() => {
      result.current.announceRemove("Beta");
    });
    expect(result.current.message).toBe("Beta removed from deck");

    act(() => {
      result.current.clear();
    });
    expect(result.current.message).toBe("");
  });
});
