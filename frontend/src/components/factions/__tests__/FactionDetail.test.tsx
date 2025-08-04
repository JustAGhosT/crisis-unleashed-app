import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FactionDetail } from '../FactionDetail';
import { Faction } from '@/types/game.types';

// Mock the factionThemes
vi.mock('@/theme/factionThemes', () => ({
  factionThemes: {
    synthetic: {
      colors: {
        primary: '#C0C0C0'
      },
      name: 'Synthetic Directive'
    },
    solaris: {
      colors: {
        primary: '#FFD700'
      },
      name: 'Solaris Nexus'
    }
  }
}));

// Mock the utils
vi.mock('@/utils/factionUtils', () => ({
  getFactionLongDescription: vi.fn((faction: Faction) => {
    const descriptions: Record<Faction, string> = {
      synthetic: 'The Synthetic Directive achieves optimization through perfect mechanical precision.',
      solaris: 'The Solaris Nexus serves as caretakers of the Divine Algorithm.',
      umbral: 'Umbral description',
      neuralis: 'Neuralis description', 
      aeonic: 'Aeonic description',
      infernal: 'Infernal description',
      primordial: 'Primordial description'
    };
    return descriptions[faction];
  }),
  getFactionTechnology: vi.fn((faction: Faction) => {
    return faction === 'synthetic' ? 'Perfect Optimization Systems' : 'Some Technology';
  }),
  getFactionPhilosophy: vi.fn((faction: Faction) => {
    return faction === 'synthetic' ? 'Perfection Through Elimination of Inefficiency' : 'Some Philosophy';
  }),
  getFactionStrength: vi.fn((faction: Faction) => {
    return faction === 'synthetic' ? 'Resource Optimization and Prediction' : 'Some Strength';
  })
}));

describe('FactionDetail', () => {
  const mockOnClose = vi.fn();
  const mockOnExplore = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    
    // Mock document.documentElement.style.setProperty and removeProperty
    Object.defineProperty(document.documentElement, 'style', {
      value: {
        setProperty: vi.fn(),
        removeProperty: vi.fn()
      },
      writable: true
    });
  });

  describe('Component Rendering', () => {
    it('should render faction detail modal', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      expect(screen.getByText('Synthetic Directive')).toBeInTheDocument();
      expect(screen.getByText(/The Synthetic Directive achieves optimization/)).toBeInTheDocument();
    });

    it('should render all faction attributes', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      expect(screen.getByText('Core Technology:')).toBeInTheDocument();
      expect(screen.getByText('Perfect Optimization Systems')).toBeInTheDocument();
      
      expect(screen.getByText('Philosophy:')).toBeInTheDocument();
      expect(screen.getByText('Perfection Through Elimination of Inefficiency')).toBeInTheDocument();
      
      expect(screen.getByText('Key Strength:')).toBeInTheDocument();
      expect(screen.getByText('Resource Optimization and Prediction')).toBeInTheDocument();
    });

    it('should render faction emblem image', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      const emblemImage = screen.getByAltText('Synthetic Directive');
      expect(emblemImage).toBeInTheDocument();
      expect(emblemImage).toHaveAttribute('src', '/assets/factions/synthetic/emblem.svg');
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      const closeButton = screen.getByLabelText('Close detail view');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onExplore with faction when explore button is clicked', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      const exploreButton = screen.getByText('Explore Full Faction');
      fireEvent.click(exploreButton);

      expect(mockOnExplore).toHaveBeenCalledTimes(1);
      expect(mockOnExplore).toHaveBeenCalledWith('synthetic');
    });
  });

  describe('Multiple Factions', () => {
    it('should render correctly for different factions', () => {
      const { rerender } = render(
        <FactionDetail 
          faction="solaris" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      expect(screen.getByText('Solaris Nexus')).toBeInTheDocument();

      rerender(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      expect(screen.getByText('Synthetic Directive')).toBeInTheDocument();
    });
  });

  describe('CSS Custom Properties', () => {
    it('should set CSS custom properties on mount', () => {
      render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--faction-primary', 
        '#C0C0C0'
      );
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--faction-bg-image', 
        "url('/assets/factions/synthetic/background.jpg')"
      );
    });

    it('should cleanup CSS custom properties on unmount', () => {
      const { unmount } = render(
        <FactionDetail 
          faction="synthetic" 
          onClose={mockOnClose} 
          onExplore={mockOnExplore} 
        />
      );

      unmount();

      expect(document.documentElement.style.removeProperty).toHaveBeenCalledWith('--faction-primary');
      expect(document.documentElement.style.removeProperty).toHaveBeenCalledWith('--faction-bg-image');
    });
  });
});