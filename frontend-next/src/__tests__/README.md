# Tests Directory

This directory contains all test files for the Next.js frontend application.

## Structure

- `components/` - Tests for UI components
- `hooks/` - Tests for custom React hooks
- `lib/` - Tests for utility functions and libraries
- `pages/` - Tests for page components

## Running Tests

You can run tests using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Testing Patterns

We use the following testing libraries:

- Jest - As the test runner
- React Testing Library - For testing React components
- jest-dom - For custom DOM matchers

## Best Practices

1. Test components in isolation
2. Focus on user behavior rather than implementation details
3. Use screen queries that resemble how users interact with the application
4. Keep tests simple and focused on a single behavior
5. Use descriptive test names
