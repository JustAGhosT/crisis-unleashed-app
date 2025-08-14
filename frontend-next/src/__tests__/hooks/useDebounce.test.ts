import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial value", 500));
    expect(result.current).toBe("initial value");
  });

  it("should debounce the value change after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } },
    );

    // Initial value should be returned immediately
    expect(result.current).toBe("initial value");

    // Update the value
    rerender({ value: "updated value", delay: 500 });

    // Value should not change yet
    expect(result.current).toBe("initial value");

    // Fast-forward time past the delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // After the delay, the value should be updated
    expect(result.current).toBe("updated value");
  });

  it("should use the default delay of 300ms when no delay is provided", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial value" },
    });

    // Initial value should be returned immediately
    expect(result.current).toBe("initial value");

    // Update the value
    rerender({ value: "updated value" });

    // Value should not change yet
    expect(result.current).toBe("initial value");

    // Fast-forward time, but not enough to trigger update
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Value should still be the initial value
    expect(result.current).toBe("initial value");

    // Fast-forward the remaining time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // After the default delay (300ms), the value should be updated
    expect(result.current).toBe("updated value");
  });

  it("should handle multiple updates correctly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } },
    );

    // Update multiple times in quick succession
    rerender({ value: "update 1", delay: 500 });
    rerender({ value: "update 2", delay: 500 });
    rerender({ value: "update 3", delay: 500 });

    // Value should still be the initial one
    expect(result.current).toBe("initial value");

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Only the latest update should be reflected
    expect(result.current).toBe("update 3");
  });
});
