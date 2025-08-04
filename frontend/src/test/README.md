# Test Suite for Crisis Unleashed Factions

This directory contains comprehensive unit and integration tests for the Factions system.

## Test Structure

### Unit Tests
- **`factionUtils.test.ts`** - Tests all faction utility functions
- **`factionThemes.test.ts`** - Tests faction theme system and consistency
- **`FactionDetail.test.tsx`** - Tests faction detail modal component
- **`FactionsHub.test.tsx`** - Tests main faction hub page
- **`FactionRoutes.test.tsx`** - Tests routing configuration

### Integration Tests
- **`FactionsFlow.integration.test.tsx`** - End-to-end faction navigation and data flow

## Key Test Areas

### 1. Faction Completeness
- ✅ All 7 factions are present including `synthetic`
- ✅ Each faction has complete theme data
- ✅ Each faction has complete utility data
- ✅ All factions have corresponding routes

### 2. Navigation Flow
- ✅ Faction hub displays all factions
- ✅ Clicking faction shows detail modal
- ✅ "Explore Full Faction" button navigates correctly
- ✅ Route navigation works for all factions
- ✅ Unknown routes redirect to hub

### 3. Component Integration
- ✅ FactionDetail modal functionality
- ✅ Theme system integration
- ✅ CSS custom properties setup/cleanup
- ✅ User interaction handling

### 4. Data Consistency
- ✅ Theme colors match faction identities
- ✅ Utility functions return consistent data
- ✅ All functions handle all factions
- ✅ Error handling for invalid input

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- factionUtils.test.ts

# Run tests with coverage
npm test -- --coverage

# Run only integration tests
npm test -- integration
```

## Issues Identified and Tested

### Fixed Issues:
1. **Missing Synthetic Faction** - Added to `factionThemes.ts`
2. **Navigation Issues** - Verified route configuration
3. **Theme System** - Ensured all factions have complete themes
4. **Component Interactions** - Tested all user flows

### Test Coverage:
- Faction list completeness ✅
- Theme system integrity ✅  
- Navigation functionality ✅
- Component rendering ✅
- User interactions ✅
- Error handling ✅
- Accessibility basics ✅

## Debugging Guidelines

If tests fail:

1. **Check console output** for specific assertion failures
2. **Verify imports** are correctly mocked
3. **Check async operations** are properly awaited
4. **Ensure setup files** are configured correctly

## Test Philosophy

These tests follow the **Testing Trophy** approach:
- **Unit Tests** (70%) - Fast, isolated, focused
- **Integration Tests** (20%) - Component interaction
- **E2E Tests** (10%) - Full user workflows

The tests prioritize:
- **User workflows** over implementation details
- **Behavior verification** over code coverage
- **Real-world scenarios** over edge cases
- **Maintainable tests** over comprehensive mocking