# Testing Guide for Next.js Frontend

This document provides guidelines for writing and running tests for the Next.js frontend application.

## Testing Setup

We use the following tools for testing:

- **Jest**: Test runner
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **jest-environment-jsdom**: For DOM testing environment

## Running Tests

You can run tests using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Scripts in frontend-next/package.json

The following test-related scripts are available in `frontend-next/package.json`:

- `test`: Runs Jest once (`jest`).
- `test:watch`: Runs Jest in watch mode (`jest --watch`).
- `test:coverage`: Runs Jest with coverage (`jest --coverage`).

Ensure you run these from the `frontend-next/` directory or use a package manager workspace command from the repo root that targets this package.

### Jest configuration (example)

Below is a minimal `jest.config.ts` aligned with Next.js and this project’s folder layout. Place it at the repo root if you run Jest from there, or adjust paths accordingly.

```ts
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./frontend-next" });

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/frontend-next/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/frontend-next/src/$1",
    "\\.(css|less|scss|sass)$":
      "<rootDir>/frontend-next/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/frontend-next/__mocks__/fileMock.js",
  },
};

export default createJestConfig(customJestConfig);
```

## Test Directory Structure

Tests are organized in the `src/__tests__` directory with the following structure:

- `components/`: Tests for UI components
- `hooks/`: Tests for custom React hooks
- `lib/`: Tests for utility functions
- `pages/`: Tests for page components

## Writing Tests

### Component Tests

When testing components, focus on user interactions and component behavior rather than implementation details:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Hook Tests

Use `renderHook` to test custom hooks:

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter Hook", () => {
  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Utility Function Tests

Test utility functions directly:

```tsx
import { formatCurrency } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats numbers as currency", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(10.5)).toBe("$10.50");
  });
});
```

### Page Component Tests

For page components, you'll often need to mock dependencies like routers and data fetching:

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/home";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@tanstack/react-query");

describe("HomePage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useQuery as jest.Mock).mockReturnValue({
      data: { items: [] },
      isLoading: false,
    });
  });

  it("renders correctly", () => {
    render(<HomePage />);
    expect(screen.getByText("Welcome to the Home Page")).toBeInTheDocument();
  });
});
```

## Mocking

### API Requests

Use Jest's mocking capabilities to mock API requests:

```tsx
jest.mock("@/services/api", () => ({
  fetchData: jest.fn().mockResolvedValue({ data: "mocked data" }),
}));
```

### Component Dependencies

Mock child components to focus on testing the component under test:

```tsx
jest.mock("@/components/ComplexComponent", () => ({
  ComplexComponent: () => (
    <div data-testid="mocked-component">Mocked Component</div>
  ),
}));
```

### Hooks and Context

When testing components that use context, wrap them in the appropriate providers:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

// Create a shared QueryClient instance for tests
export const queryClient = new QueryClient();

// Fully-typed wrapper for render and renderHook utilities
export const wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ThemeProvider>
);

// Usage
const { result } = renderHook(() => useTheme(), { wrapper });
```

#### Jest setup cleanup

In `frontend-next/jest.setup.ts`, clear the QueryClient between tests to avoid cache bleed:

```ts
import { queryClient } from "./test-utils"; // wherever you export it from for tests

afterEach(() => {
  queryClient.clear();
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and interacts with.
2. **Keep tests simple**: Each test should verify one specific behavior.
3. **Use meaningful assertions**: Write assertions that make failures easy to understand.
4. **Mock dependencies**: Isolate the code being tested by mocking external dependencies.
5. **Use test IDs sparingly**: Prefer querying by role, text, or aria attributes when possible.
6. **Write accessible components**: Testing with RTL encourages accessible component design.
7. **Test edge cases**: Include tests for loading states, error states, and edge cases.

## Common Testing Patterns

### Testing Loading States

```tsx
(useQuery as jest.Mock).mockReturnValue({
  data: null,
  isLoading: true,
});

render(<MyComponent />);
expect(screen.getByText("Loading...")).toBeInTheDocument();
```

### Testing Error States

```tsx
(useQuery as jest.Mock).mockReturnValue({
  data: null,
  isLoading: false,
  error: new Error("Failed to fetch"),
});

render(<MyComponent />);
expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
```

### Testing User Interactions

```tsx
const handleSubmit = jest.fn();
render(<Form onSubmit={handleSubmit} />);

await userEvent.type(screen.getByLabelText("Username"), "testuser");
await userEvent.type(screen.getByLabelText("Password"), "password");
await userEvent.click(screen.getByRole("button", { name: /submit/i }));

expect(handleSubmit).toHaveBeenCalledWith({
  username: "testuser",
  password: "password",
});
```
