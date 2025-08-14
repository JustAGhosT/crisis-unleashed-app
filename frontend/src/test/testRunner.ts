// Test runner utilities and helpers

import type { ReactElement } from 'react';

export const renderWithProviders = (ui: ReactElement) => {
  // Add your providers here (Router, Theme, etc.)
  return ui;
};

export const createMockNavigate = () => {
  const mockNavigate = jest.fn();
  return mockNavigate;
};