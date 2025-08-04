import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FactionDataDisplay from '../FactionDataDisplay';
import withSafeRendering from '../withSafeRendering';

// Mock the theme and faction utilities
vi.mock('@/theme/factionThemes', () => ({
  factionThemes: {
    synthetic: {
      name: 'Synthetic Directive',
      colors: {
        primary: '#C0C0C0',
        secondary: '#A8A8A8'
      }
    },
    solaris: {
      name: 'Solaris Nexus',
      colors: {
        primary: '#FFD700',
        secondary: '#FF8C00'
      }
    }
  }
}));

// Mock the SafeDisplay component
vi.mock('../SafeDisplay', () => ({
  SafeDisplay: ({ value }: { value: unknown }) => <span>{String(value)}</span>,
  DebugDisplay: ({ value, label }: { value: unknown, label?: string, expanded?: boolean }) => (
    <div>
      <div>{label}</div>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}));

vi.mock('@/utils/factionUtils', () => ({
  getFactionLongDescription: (faction: string) => 
    faction === 'synthetic' 
      ? 'The Synthetic Directive achieves optimization through perfect mechanical precision.'
      : 'The Solaris Nexus serves as caretakers of the Divine Algorithm.',
  
  getFactionTechnology: (faction: string) => 
    faction === 'synthetic' 
      ? 'Perfect Optimization Systems' 
      : 'Divine Algorithm Implementation',
  
  getFactionPhilosophy: (faction: string) => 
    faction === 'synthetic' 
      ? 'Perfection Through Elimination of Inefficiency' 
      : 'Perfect Order Through Divine Pattern'
}));

describe('FactionDataDisplay Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = '';
  });
  
  describe('Regular Component', () => {
    it('renders faction data correctly', () => {
      render(<FactionDataDisplay faction="synthetic" />);
      
      expect(screen.getByText('Synthetic Directive')).toBeInTheDocument();
      expect(screen.getByText(/The Synthetic Directive achieves optimization/)).toBeInTheDocument();
      expect(screen.getByText('Perfect Optimization Systems')).toBeInTheDocument();
      expect(screen.getByText('Perfection Through Elimination of Inefficiency')).toBeInTheDocument();
      expect(screen.getByText('#C0C0C0')).toBeInTheDocument();
    });
    
    it('shows debug view when showDebug is true', () => {
      render(<FactionDataDisplay faction="synthetic" showDebug={true} />);
      
      // In debug mode, we show the raw data
      expect(screen.getByText('Faction Data')).toBeInTheDocument();
      expect(screen.getByText(/"name": "Synthetic Directive"/)).toBeInTheDocument();
      expect(screen.getByText(/"primary": "#C0C0C0"/)).toBeInTheDocument();
    });
    
    it('handles different factions', () => {
      render(<FactionDataDisplay faction="solaris" />);
      
      expect(screen.getByText('Solaris Nexus')).toBeInTheDocument();
      expect(screen.getByText(/The Solaris Nexus serves as caretakers/)).toBeInTheDocument();
      expect(screen.getByText('Divine Algorithm Implementation')).toBeInTheDocument();
      expect(screen.getByText('#FFD700')).toBeInTheDocument();
    });
  });
  
  describe('Safe Component with HOC', () => {
    it('renders faction data without [object Object] issues', () => {
      // This test simulates when an object would otherwise be rendered as [object Object]
      // by intentionally breaking the theme structure
      // This type satisfies Record<string, unknown>
      interface MockComponentProps extends Record<string, unknown> {
        faction: string;
      }

      const MockedComponent: React.FC<MockComponentProps> = ({ faction }) => {
        // Force an object to be rendered directly in JSX (bad practice)
        const problematicObject = { 
          problem: "This would normally show as [object Object]" 
        };
        
        return (
          <div>
            <h2>{faction}</h2>
            <div data-testid="problematic">
              {/* Convert to string to fix TS error, but this will show [object Object] */}
              {String(problematicObject)}
            </div>
          </div>
        );
      };
      
      // Create a safe version that will handle the object properly
      const SafeMockedComponent = withSafeRendering<MockComponentProps>(MockedComponent);
      
      render(<SafeMockedComponent faction="synthetic" />);
      
      // Without the HOC, this would be [object Object]
      // With the HOC, it should be a JSON string
      const content = screen.getByTestId('problematic').textContent;
      expect(content).not.toBe('[object Object]');
      expect(content).toContain('problem');
      expect(content).toContain('This would normally show');
    });
  });
});