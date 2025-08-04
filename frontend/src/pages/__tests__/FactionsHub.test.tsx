import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FactionsHub } from '../FactionsHub';

// Mock the navigation hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the faction utils
vi.mock('@/utils/factionUtils', () => ({
  getFactionsList: vi.fn(() => [
    'solaris', 'primordial', 'synthetic', 'infernal',
    'aeonic', 'neuralis', 'umbral'
  ])
}));

// Define prop types for mock components
interface FactionHexagonProps {
  factions: string[];
  onNavigate?: (faction: string) => void;
  onFocus: (faction: string) => void;
  hoveredFaction?: string | null;
  focusedFaction?: string | null;
}

interface DescriptionSectionProps {
  title: string;
  children: React.ReactNode;
  choiceText?: string;
}

interface TimelineSectionProps {
  title: string;
  description?: string;
  buttonText?: string;
  onTimelineClick: () => void;
}

interface FooterProps {
  children: React.ReactNode;
  copyright?: string;
}

interface FactionDetailProps {
  faction: string;
  onClose: () => void;
  onExplore: (faction: string) => void;
}

// Mock the faction components
vi.mock('@/components/factions', () => ({
  Header: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
  FactionHexagon: ({ factions, onFocus }: FactionHexagonProps) => (
    <div data-testid="faction-hexagon">
      {factions.map((faction: string) => (
        <button
          key={faction}
          data-testid={`faction-${faction}`}
          onClick={() => onFocus(faction)}
        >
          {faction}
        </button>
      ))}
    </div>
  ),
  DescriptionSection: ({ title, children }: DescriptionSectionProps) => (
    <div data-testid="description-section">
      <h2>{title}</h2>
      {children}
    </div>
  ),
  TimelineSection: ({ title, onTimelineClick }: TimelineSectionProps) => (
    <div data-testid="timeline-section">
      <h2>{title}</h2>
      <button onClick={onTimelineClick}>View Timeline</button>
    </div>
  ),
  Footer: ({ children, copyright }: FooterProps) => (
    <div data-testid="footer">
      {children}
      {copyright && <p>{copyright}</p>}
    </div>
  ),
  FactionDetail: ({ faction, onClose, onExplore }: FactionDetailProps) => (
    <div data-testid="faction-detail">
      <p>Detail for: {faction}</p>
      <button onClick={onClose}>Close</button>
      <button onClick={() => onExplore(faction)}>Explore Full Faction</button>
    </div>
  )
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FactionsHub', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      renderWithRouter(<FactionsHub />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('The Factions of Crisis Unleashed')).toBeInTheDocument();

      expect(screen.getByTestId('faction-hexagon')).toBeInTheDocument();
      expect(screen.getByTestId('description-section')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-section')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render all 7 factions including synthetic', () => {
      renderWithRouter(<FactionsHub />);

      expect(screen.getByTestId('faction-solaris')).toBeInTheDocument();
      expect(screen.getByTestId('faction-synthetic')).toBeInTheDocument();
      expect(screen.getByTestId('faction-primordial')).toBeInTheDocument();
      expect(screen.getByTestId('faction-infernal')).toBeInTheDocument();
      expect(screen.getByTestId('faction-aeonic')).toBeInTheDocument();
      expect(screen.getByTestId('faction-neuralis')).toBeInTheDocument();
      expect(screen.getByTestId('faction-umbral')).toBeInTheDocument();
    });

    it('should render description section with correct content', () => {
      renderWithRouter(<FactionsHub />);

      expect(screen.getByText('The Universal Program')).toBeInTheDocument();
      expect(screen.getByText(/Each faction represents a unique component/)).toBeInTheDocument();
      expect(screen.getByText(/Choose your allegiance wisely/)).toBeInTheDocument();
    });

    it('should render timeline section', () => {
      renderWithRouter(<FactionsHub />);

      expect(screen.getByText('Universal Timeline')).toBeInTheDocument();
      expect(screen.getByText('View Timeline')).toBeInTheDocument();
    });

    it('should render footer with copyright', () => {
      renderWithRouter(<FactionsHub />);

      expect(screen.getByText('Crisis Unleashed - Factions Portal')).toBeInTheDocument();
      expect(screen.getByText('© 2025 Crisis Unleashed. All rights reserved.')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should show faction detail when faction is clicked', () => {
      renderWithRouter(<FactionsHub />);

      const syntheticButton = screen.getByTestId('faction-synthetic');
      fireEvent.click(syntheticButton);

      expect(screen.getByTestId('faction-detail')).toBeInTheDocument();
      expect(screen.getByText('Detail for: synthetic')).toBeInTheDocument();
    });

    it('should close faction detail when close button is clicked', () => {
      renderWithRouter(<FactionsHub />);

      // Open faction detail
      const syntheticButton = screen.getByTestId('faction-synthetic');
      fireEvent.click(syntheticButton);

      expect(screen.getByTestId('faction-detail')).toBeInTheDocument();

      // Close faction detail
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('faction-detail')).not.toBeInTheDocument();
    });

    it('should navigate to timeline when timeline button is clicked', () => {
      renderWithRouter(<FactionsHub />);

      const timelineButton = screen.getByText('View Timeline');
      fireEvent.click(timelineButton);

      expect(mockNavigate).toHaveBeenCalledWith('/timeline');
    });

    it('should navigate to faction page when explore button is clicked', () => {
      renderWithRouter(<FactionsHub />);

      // Open faction detail
      const syntheticButton = screen.getByTestId('faction-synthetic');
      fireEvent.click(syntheticButton);

      // Click explore button
      const exploreButton = screen.getByText('Explore Full Faction');
      fireEvent.click(exploreButton);

      expect(mockNavigate).toHaveBeenCalledWith('/synthetic');
    });

    it('should toggle faction focus correctly', () => {
      renderWithRouter(<FactionsHub />);

      const syntheticButton = screen.getByTestId('faction-synthetic');

      // First click should show detail
      fireEvent.click(syntheticButton);
      expect(screen.getByTestId('faction-detail')).toBeInTheDocument();

      // Second click should hide detail
      fireEvent.click(syntheticButton);
      expect(screen.queryByTestId('faction-detail')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Logic', () => {
    it('should navigate to correct faction path for each faction', () => {
      renderWithRouter(<FactionsHub />);

      const factions = ['solaris', 'synthetic', 'primordial', 'infernal', 'aeonic', 'neuralis', 'umbral'];

      factions.forEach(faction => {
        // Open faction detail
        const factionButton = screen.getByTestId(`faction-${faction}`);
        fireEvent.click(factionButton);

        // Click explore button
        const exploreButton = screen.getByText('Explore Full Faction');
        fireEvent.click(exploreButton);

        expect(mockNavigate).toHaveBeenCalledWith(`/${faction}`);
        mockNavigate.mockClear();

        // Close detail for next iteration
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
      });
    });
  });

  describe('Faction List Integration', () => {
    it('should use faction list from utils', () => {
      renderWithRouter(<FactionsHub />);

      // Verify that getFactionsList is used by checking all factions are rendered
      const expectedFactions = ['solaris', 'primordial', 'synthetic', 'infernal', 'aeonic', 'neuralis', 'umbral'];

      expectedFactions.forEach(faction => {
        expect(screen.getByTestId(`faction-${faction}`)).toBeInTheDocument();
      });
    });
  });
});