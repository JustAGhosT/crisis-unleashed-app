import { describe, it, expect } from 'vitest';
import { Faction } from '@/types/game.types';
import { factionThemes, getFactionTheme, defaultTheme } from '../factionThemes';

describe('factionThemes - Basic Tests', () => {
  const allFactions: Faction[] = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial', 'synthetic'];

  describe('factionThemes object', () => {
    it('should contain synthetic faction', () => {
      expect(factionThemes.synthetic).toBeDefined();
      expect(factionThemes.synthetic.id).toBe('synthetic');
      expect(factionThemes.synthetic.name).toBe('Synthetic Directive');
    });

    it('should contain all required factions', () => {
      allFactions.forEach(faction => {
        expect(factionThemes[faction]).toBeDefined();
        expect(typeof factionThemes[faction]).toBe('object');
      });
    });

    it('should have valid primary colors for all factions', () => {
      allFactions.forEach(faction => {
        const theme = factionThemes[faction];
        expect(theme.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have correct synthetic faction colors', () => {
      const syntheticTheme = factionThemes.synthetic;
      
      expect(syntheticTheme.colors.primary).toBe('#C0C0C0');
      expect(syntheticTheme.colors.secondary).toBe('#A8A8A8');
    });

    it('should have complete theme structure for synthetic', () => {
      const theme = factionThemes.synthetic;
      
      // Check required properties
      expect(theme.id).toBe('synthetic');
      expect(theme.name).toBe('Synthetic Directive');
      
      // Check colors object
      expect(theme.colors).toBeDefined();
      expect(theme.colors.primary).toBe('#C0C0C0');
      expect(theme.colors.background).toBe('#0A0A0A');
      
      // Check theme configurations
      expect(theme.gradient).toContain('linear-gradient');
      expect(theme.glow).toContain('rgba');
      
      // Check nested theme objects
      expect(theme.cardTheme).toBeDefined();
      expect(theme.buttonTheme).toBeDefined();
    });
  });

  describe('getFactionTheme', () => {
    it('should return synthetic theme correctly', () => {
      const theme = getFactionTheme('synthetic');
      expect(theme.name).toBe('Synthetic Directive');
      expect(theme.id).toBe('synthetic');
    });

    it('should return correct theme for each faction', () => {
      allFactions.forEach(faction => {
        const theme = getFactionTheme(faction);
        expect(theme).toBe(factionThemes[faction]);
        expect(theme.id).toBe(faction);
      });
    });

    it('should return default theme for invalid faction', () => {
      const theme = getFactionTheme('invalid' as never);
      expect(theme).toBe(defaultTheme);
    });
  });

  describe('defaultTheme', () => {
    it('should be set to solaris theme', () => {
      expect(defaultTheme).toBe(factionThemes.solaris);
    });
  });
});