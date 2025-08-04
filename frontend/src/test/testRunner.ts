// Test runner utilities and helpers

export const renderWithProviders = (ui: React.ReactElement, options?: any) => {
  // Add your providers here (Router, Theme, etc.)
  return ui;
};

export const createMockNavigate = () => {
  const mockNavigate = jest.fn();
  return mockNavigate;
};