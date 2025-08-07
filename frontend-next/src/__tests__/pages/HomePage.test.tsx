import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

// Mock the required modules
jest.mock('@tanstack/react-query');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/factions/FactionGrid', () => ({
  FactionGrid: () => <div data-testid="faction-grid">Faction Grid Component</div>,
}));

describe('HomePage Component', () => {
  // Setup default mocks
  beforeEach(() => {
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

  it('renders the home page with game status', async () => {
    render(<HomePage />);
    
    // Check heading
    expect(screen.getByText('Crisis Unleashed')).toBeInTheDocument();
    
    // Check game status
    expect(screen.getByText('Crisis Unleashed - Ready to deploy!')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Start Playing')).toBeInTheDocument();
    expect(screen.getByText('Build Deck')).toBeInTheDocument();
    expect(screen.getByText('View Factions')).toBeInTheDocument();
    
    // Check faction grid is rendered
    expect(screen.getByTestId('faction-grid')).toBeInTheDocument();
    
    // Check feature cards
    expect(screen.getByText('Strategic Combat')).toBeInTheDocument();
    expect(screen.getByText('Digital Ownership')).toBeInTheDocument();
    expect(screen.getByText('Rich Lore')).toBeInTheDocument();
  });

  it('shows loading state when game status is loading', () => {
    // Override the mock to simulate loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });
    
    render(<HomePage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('navigates to deck builder when Build Deck button is clicked', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    render(<HomePage />);
    
    const buildDeckButton = screen.getByText('Build Deck');
    await userEvent.click(buildDeckButton);
    
    expect(mockPush).toHaveBeenCalledWith('/deck-builder');
  });

  it('shows fallback status when query fails', () => {
    // Mock query with error handler being triggered
    (useQuery as jest.Mock).mockImplementation(({ onError }) => {
      // Trigger the onError callback
      onError();
      return {
        data: { message: "System Online" },
        isLoading: false,
      };
    });
    
    render(<HomePage />);
    
    expect(screen.getByText('System Online')).toBeInTheDocument();
  });
});