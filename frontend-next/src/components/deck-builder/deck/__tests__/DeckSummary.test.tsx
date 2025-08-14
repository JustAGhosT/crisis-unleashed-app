import React from "react";
import { render } from "@testing-library/react";
import { DeckSummary } from "../DeckSummary";

describe("DeckSummary", () => {
  it("renders counts and average", () => {
    const { container, getByText } = render(
      <DeckSummary uniqueCount={10} totalCount={30} averageCost={"2.7"} />,
    );
    expect(getByText("Unique Cards")).toBeInTheDocument();
    expect(getByText("Total Cards")).toBeInTheDocument();
    expect(getByText("Avg Cost")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
