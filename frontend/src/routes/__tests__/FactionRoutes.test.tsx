import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FactionRoutes from '../FactionRoutes';

// Mock all the page components
vi.mock('@/pages/FactionsHub', () => ({
  FactionsHub: () => <div data-testid="factions-hub">Factions Hub</div>
}));

vi.mock('@/pages/factions/SolarisPage', () => ({
  default: () => <div data-testid="solaris-page">Solaris Page</div>
}));

vi.mock('@/pages/factions/UmbralPage', () => ({
  default: () => <div data-testid="umbral-page">Umbral Page</div>
}));

vi.mock('@/pages/factions/NeuralisPage', () => ({
  default: () => <div data-testid="neuralis-page">Neuralis Page</div>
}));

vi.mock('@/pages/factions/AeonicPage', () => ({
  default: () => <div data-testid="aeonic-page">Aeonic Page</div>
}));

vi.mock('@/pages/factions/InfernalPage', () => ({
  default: () => <div data-testid="infernal-page">Infernal Page</div>
}));

vi.mock('@/pages/factions/PrimordialPage', () => ({
  default: () => <div data-testid="primordial-page">Primordial Page</div>
}));

vi.mock('@/pages/factions/SyntheticPage', () => ({
  default: () => <div data-testid="synthetic-page">Synthetic Page</div>
}));

vi.mock('@/pages/TimelinePage', () => ({
  default: () => <div data-testid="timeline-page">Timeline Page</div>
}));

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <FactionRoutes />
    </MemoryRouter>
  );
};

describe('FactionRoutes', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Route Navigation', () => {
    it('should render FactionsHub for root path', () => {
      renderWithRouter('/');
      expect(screen.getByTestId('factions-hub')).toBeInTheDocument();
    });

    it('should render SolarisPage for /solaris path', () => {
      renderWithRouter('/solaris');
      expect(screen.getByTestId('solaris-page')).toBeInTheDocument();
    });

    it('should render UmbralPage for /umbral path', () => {
      renderWithRouter('/umbral');
      expect(screen.getByTestId('umbral-page')).toBeInTheDocument();
    });

    it('should render NeuralisPage for /neuralis path', () => {
      renderWithRouter('/neuralis');
      expect(screen.getByTestId('neuralis-page')).toBeInTheDocument();
    });

    it('should render AeonicPage for /aeonic path', () => {
      renderWithRouter('/aeonic');
      expect(screen.getByTestId('aeonic-page')).toBeInTheDocument();
    });

    it('should render InfernalPage for /infernal path', () => {
      renderWithRouter('/infernal');
      expect(screen.getByTestId('infernal-page')).toBeInTheDocument();
    });

    it('should render PrimordialPage for /primordial path', () => {
      renderWithRouter('/primordial');
      expect(screen.getByTestId('primordial-page')).toBeInTheDocument();
    });

    it('should render SyntheticPage for /synthetic path', () => {
      renderWithRouter('/synthetic');
      expect(screen.getByTestId('synthetic-page')).toBeInTheDocument();
    });

    it('should render TimelinePage for /timeline path', () => {
      renderWithRouter('/timeline');
      expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    });
  });

  describe('Route Redirects', () => {
    it('should redirect unknown routes to FactionsHub', () => {
      renderWithRouter('/unknown-route');
      expect(screen.getByTestId('factions-hub')).toBeInTheDocument();
    });

    it('should redirect nested unknown routes to FactionsHub', () => {
      renderWithRouter('/some/unknown/nested/route');
      expect(screen.getByTestId('factions-hub')).toBeInTheDocument();
    });
  });

  describe('All Faction Routes', () => {
    const factionRoutes = [
      { path: '/solaris', testId: 'solaris-page' },
      { path: '/umbral', testId: 'umbral-page' },
      { path: '/neuralis', testId: 'neuralis-page' },
      { path: '/aeonic', testId: 'aeonic-page' },
      { path: '/infernal', testId: 'infernal-page' },
      { path: '/primordial', testId: 'primordial-page' },
      { path: '/synthetic', testId: 'synthetic-page' }
    ];

    it('should have routes for all 7 factions', () => {
      expect(factionRoutes).toHaveLength(7);
      
      factionRoutes.forEach(({ path, testId }) => {
        renderWithRouter(path);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        cleanup();
      });
    });

    it('should include synthetic faction route', () => {
      const syntheticRoute = factionRoutes.find(route => route.path === '/synthetic');
      expect(syntheticRoute).toBeDefined();
      expect(syntheticRoute?.testId).toBe('synthetic-page');
    });
  });

  describe('Route Structure', () => {
    it('should have consistent route naming convention', () => {
      const factionNames = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial', 'synthetic'];
      
      factionNames.forEach(faction => {
        renderWithRouter(`/${faction}`);
        expect(screen.getByTestId(`${faction}-page`)).toBeInTheDocument();
        cleanup();
      });
    });

    it('should handle case sensitivity correctly', () => {
      // Routes should be case-sensitive lowercase
      renderWithRouter('/SYNTHETIC');
      expect(screen.getByTestId('factions-hub')).toBeInTheDocument(); // Should redirect
    });
  });
});