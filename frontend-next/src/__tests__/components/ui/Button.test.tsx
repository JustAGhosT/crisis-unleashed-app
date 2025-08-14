import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Destructive</Button>);

    const button = screen.getByRole("button", { name: /destructive/i });
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size classes correctly", () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-9");
  });

  // The "faction" variant has been removed from Button.
  // If a themed variant is reintroduced later, add assertions here for that variant's classes/semantics.

  it("applies additional className", () => {
    render(<Button className="test-class">Custom Class</Button>);

    const button = screen.getByRole("button", { name: /custom class/i });
    expect(button).toHaveClass("test-class");
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});
