import { render, waitFor } from "@testing-library/react";
import React from "react";
import { DeckList } from "../DeckList";
import { ToastProvider } from "@/hooks/useToast";

// More comprehensive mocking of Next.js dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((importFunc, options) => {
    // Handle the importFunc().then(m => m.X) pattern
    const module = importFunc();
    let Component;
    
    if (module.then && typeof module.then === 'function') {
      // Extract the component name from the .then(m => m.X) pattern
      const thenString = importFunc.toString();
      const match = thenString.match(/\.then\(.*=>\s*.*\.(.*)\)/);
      const componentName = match ? match[1] : '';
      
      // Create a mock component based on the extracted name
      if (componentName === 'ReorderableList') {
        Component = (props) => {
          // When rendered, schedule a callback to reorder items
          React.useEffect(() => {
            if (props.onReorder && props.items && props.items.length > 0) {
              setTimeout(() => {
                const reversed = [...props.items].reverse();
                props.onReorder(reversed);
              }, 0);
            }
          }, [props.items, props.onReorder]);
          
          return <div data-testid="mock-reorderable-list">{props.items?.length || 0} items</div>;
        };
      } else if (componentName === 'VirtualizedReorderableList') {
        Component = (props) => {
          return <div data-testid="mock-virtualized-list">{props.items?.length || 0} items</div>;
        };
      } else if (componentName === 'GameCard') {
        Component = (props) => {
          return <div data-testid="mock-game-card">{props.card.name}</div>;
        };
      } else {
        Component = () => <div data-testid={`mock-${componentName}`}>Mock Component</div>;
      }
    } else {
      Component = () => <div>Default Mock Component</div>;
    }
    
    Component.displayName = `DynamicComponent`;
    return Component;
  })
}));

// Mock additional components used by DeckList
jest.mock("@/components/deck-builder/deck/DropZone", () => ({
  DropZone: ({ children, title, headerRight }) => (
    <div data-testid="mock-dropzone">
      <div>{title}</div>
      {headerRight}
      <div>{children}</div>
    </div>
  ),
}));

jest.mock("@/components/deck-builder/deck/DeckRow", () => ({
  DeckRow: (props) => (
    <div data-testid="mock-deck-row">{props.card.name} x{props.quantity}</div>
  ),
}));

jest.mock("@/components/deck-builder/deck/DeckSummary", () => ({
  DeckSummary: () => <div data-testid="mock-deck-summary">Deck Summary</div>,
}));

jest.mock("@/components/deck-builder/deck/AriaLiveRegion", () => ({
  AriaLiveRegion: () => <div data-testid="mock-aria-live">Aria Live</div>,
}));

jest.mock("@/components/deck-builder/hooks/useDeckAnnouncer", () => ({
  useDeckAnnouncer: () => ({
    message: "",
    announceAdd: jest.fn(),
    announceRemove: jest.fn(),
  }),
}));

jest.mock("@/components/deck-builder/hooks/useDeckDnD", () => ({
  useDeckDnD: () => ({
    isDragOver: false,
    isInvalidDrop: false,
    handleDrop: jest.fn(),
    handleDragOver: jest.fn(),
    handleDragEnter: jest.fn(),
    handleDragLeave: jest.fn(),
  }),
}));

// Avoid virtualized branch by keeping items small
const mkCard = (id: string) => ({ 
  id, 
  name: id, 
  type: "unit", 
  faction: "solaris", 
  cost: 1 
});

describe("DeckList reorder test", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("calls onReorderDeckCards when list reorders", async () => {
    const cards = [mkCard("a"), mkCard("b")];
    const deckCards = [
      { cardId: "a", quantity: 1 },
      { cardId: "b", quantity: 1 },
    ];
    const onReorderDeckCards = jest.fn();

    render(
      <ToastProvider>
        <DeckList
          deckCards={deckCards as any}
          cards={cards as any}
          onAddCard={() => {}}
          onRemoveCard={() => {}}
          onSaveDeck={() => {}}
          onClearDeck={() => {}}
          onReorderDeckCards={onReorderDeckCards}
          maxCards={60}
        />
      </ToastProvider>
    );
    
    // Advance timers to trigger the setTimeout in the mock
    jest.runAllTimers();
    
    // Wait for the callback to be called
    await waitFor(() => {
      expect(onReorderDeckCards).toHaveBeenCalled();
    });
    
    const arg = onReorderDeckCards.mock.calls[0][0];
    expect(arg[0].cardId).toBe("b");
    expect(arg[1].cardId).toBe("a");
  });
});
