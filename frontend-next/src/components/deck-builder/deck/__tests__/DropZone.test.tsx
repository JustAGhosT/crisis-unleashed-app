import React from "react";
import { render } from "@testing-library/react";
import { DropZone } from "../DropZone";

describe("DropZone", () => {
  it("renders header and children", () => {
    const { container, getByText } = render(
      <DropZone
        title="Current Deck"
        totalCount={5}
        isDragOver={false}
        isInvalidDrop={false}
        onDrop={jest.fn()}
        onDragOver={jest.fn()}
        onDragEnter={jest.fn()}
        onDragLeave={jest.fn()}
      >
        <div>content</div>
      </DropZone>,
    );
    expect(getByText("Current Deck")).toBeInTheDocument();
    expect(getByText("5 cards")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
