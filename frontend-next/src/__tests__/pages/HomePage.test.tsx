import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock the required modules
jest.mock("@tanstack/react-query");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: () => null,
  })),
}));
jest.mock("@/lib/theme/theme-context", () => ({
  FactionThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock("@/lib/theme/use-faction-key", () => ({
  useFactionKey: () => "default",
}));
jest.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="sparkles" />,
}));
jest.mock("@/components/factions/FactionGrid", () => ({
  FactionGrid: () => (
    <div data-testid="faction-grid">Faction Grid Component</div>
  ),
}));

describe("HomePage Component", () => {
  const getHome = () => require("@/app/page").default as React.ComponentType;
  // Setup default mocks
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: { message: "Crisis Unleashed - Ready to deploy!" },
      isLoading: false,
    });

    // Mock useRouter
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the home page with game status", async () => {
    const HomePage = getHome();
    render(<HomePage />);

    // Check heading
    expect(screen.getByText("Crisis Unleashed")).toBeInTheDocument();

    // Check game status
    expect(
      screen.getByText("Crisis Unleashed - Ready to deploy!"),
    ).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText("Start Playing")).toBeInTheDocument();
    expect(screen.getByText("Build Deck")).toBeInTheDocument();
    expect(screen.getByText("View Factions")).toBeInTheDocument();

    // Check faction grid is rendered
    expect(screen.getByTestId("faction-grid")).toBeInTheDocument();

    // Check feature cards
    expect(screen.getByText("Strategic Combat")).toBeInTheDocument();
    expect(screen.getByText("Digital Ownership")).toBeInTheDocument();
    expect(screen.getByText("Rich Lore")).toBeInTheDocument();
  });

  it("shows loading state when game status is loading", () => {
    // Override the mock to simulate loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const HomePage = getHome();
    render(<HomePage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("has a Build Deck link pointing to /deck-builder", () => {
    const HomePage = getHome();
    render(<HomePage />);
    const link = screen.getByRole("link", { name: "Build Deck" });
    expect(link).toHaveAttribute("href", "/deck-builder");
  });

  it("shows fallback status when query fails", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Network error"),
      isError: true,
    });

    const HomePage = getHome();
    render(<HomePage />);

    expect(screen.getByText("System Online")).toBeInTheDocument();
  });
});
