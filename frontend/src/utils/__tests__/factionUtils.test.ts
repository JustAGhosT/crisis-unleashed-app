import { describe, it, expect } from 'vitest';
import { Faction } from '@/types/game.types';
import {
  getFactionsList,
  getFactionLongDescription,
  getFactionTechnology,
  getFactionPhilosophy,
  getFactionStrength
} from '../factionUtils';

describe('factionUtils', () => {
  describe('getFactionsList', () => {
    it('should return exactly 7 factions', () => {
      const factions = getFactionsList();
      expect(factions).toHaveLength(7);
    });

    it('should include all required factions', () => {
      const factions = getFactionsList();
      const expectedFactions: Faction[] = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial', 'synthetic'];
      
      expectedFactions.forEach(faction => {
        expect(factions).toContain(faction);
      });
    });

    it('should have solaris as the center faction', () => {
      const factions = getFactionsList();
      expect(factions[0]).toBe('solaris');
    });

    it('should include synthetic faction', () => {
      const factions = getFactionsList();
      expect(factions).toContain('synthetic');
    });
  });

  describe('getFactionLongDescription', () => {
    it('should return descriptions for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const description = getFactionLongDescription(faction);
        expect(description).toBeDefined();
        expect(description).toBeTypeOf('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });

    it('should return specific description for synthetic faction', () => {
      const description = getFactionLongDescription('synthetic');
      expect(description).toContain('Synthetic Directive');
      expect(description).toContain('optimization');
      expect(description).toContain('mechanical precision');
    });
  });

  describe('getFactionTechnology', () => {
    it('should return technologies for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const technology = getFactionTechnology(faction);
        expect(technology).toBeDefined();
        expect(technology).toBeTypeOf('string');
        expect(technology.length).toBeGreaterThan(0);
      });
    });

    it('should return correct technology for synthetic', () => {
      const technology = getFactionTechnology('synthetic');
      expect(technology).toBe('Perfect Optimization Systems');
    });
  });

  describe('getFactionPhilosophy', () => {
    it('should return philosophies for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const philosophy = getFactionPhilosophy(faction);
        expect(philosophy).toBeDefined();
        expect(philosophy).toBeTypeOf('string');
        expect(philosophy.length).toBeGreaterThan(0);
      });
    });

    it('should return correct philosophy for synthetic', () => {
      const philosophy = getFactionPhilosophy('synthetic');
      expect(philosophy).toBe('Perfection Through Elimination of Inefficiency');
    });
  });

  describe('getFactionStrength', () => {
    it('should return strengths for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const strength = getFactionStrength(faction);
        expect(strength).toBeDefined();
        expect(strength).toBeTypeOf('string');
        expect(strength.length).toBeGreaterThan(0);
      });
    });

    it('should return correct strength for synthetic', () => {
      const strength = getFactionStrength('synthetic');
      expect(strength).toBe('Resource Optimization and Prediction');
    });
  });
});