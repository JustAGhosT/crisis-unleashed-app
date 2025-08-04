import { describe, it, expect } from 'vitest';
import { Faction } from '@/types/game.types';
import {
  getFactionsList,
  getFactionLongDescription,
  getFactionTechnology,
  getFactionPhilosophy,
  getFactionStrength
} from '../factionUtils';

describe('factionUtils - Basic Tests', () => {
  describe('getFactionsList', () => {
    it('should return exactly 7 factions', () => {
      const factions = getFactionsList();
      expect(factions.length).toBe(7);
    });

    it('should include synthetic faction', () => {
      const factions = getFactionsList();
      expect(factions.includes('synthetic')).toBe(true);
    });

    it('should include all expected factions', () => {
      const factions = getFactionsList();
      const expectedFactions: Faction[] = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial', 'synthetic'];
      
      expectedFactions.forEach(faction => {
        expect(factions.includes(faction)).toBe(true);
      });
    });

    it('should have solaris as first faction', () => {
      const factions = getFactionsList();
      expect(factions[0]).toBe('solaris');
    });
  });

  describe('getFactionLongDescription', () => {
    it('should return description for synthetic faction', () => {
      const description = getFactionLongDescription('synthetic');
      expect(description).toContain('Synthetic Directive');
      expect(description).toContain('optimization');
      expect(description.length).toBeGreaterThan(0);
    });

    it('should return descriptions for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const description = getFactionLongDescription(faction);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getFactionTechnology', () => {
    it('should return correct technology for synthetic', () => {
      const technology = getFactionTechnology('synthetic');
      expect(technology).toBe('Perfect Optimization Systems');
    });

    it('should return technology for all factions', () => {
      const factions = getFactionsList();
      
      factions.forEach(faction => {
        const technology = getFactionTechnology(faction);
        expect(technology).toBeTruthy();
        expect(typeof technology).toBe('string');
      });
    });
  });

  describe('getFactionPhilosophy', () => {
    it('should return correct philosophy for synthetic', () => {
      const philosophy = getFactionPhilosophy('synthetic');
      expect(philosophy).toBe('Perfection Through Elimination of Inefficiency');
    });
  });

  describe('getFactionStrength', () => {
    it('should return correct strength for synthetic', () => {
      const strength = getFactionStrength('synthetic');
      expect(strength).toBe('Resource Optimization and Prediction');
    });
  });
});