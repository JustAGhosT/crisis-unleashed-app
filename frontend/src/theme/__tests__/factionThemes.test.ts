import { describe, it, expect } from 'vitest';
import { Faction } from '@/types/game.types';
import { factionThemes, getFactionTheme, defaultTheme, FactionTheme } from '../factionThemes';

describe('factionThemes', () => {
  const allFactions: Faction[] = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial', 'synthetic'];

  describe('factionThemes object', () => {
    it('should contain all required factions', () => {
      allFactions.forEach(faction => {
        expect(factionThemes[faction]).toBeDefined();
        expect(factionThemes[faction]).toBeTypeOf('object');
      });
    });

    it('should include synthetic faction theme', () => {
      expect(factionThemes.synthetic).toBeDefined();
      expect(factionThemes.synthetic.id).toBe('synthetic');
      expect(factionThemes.synthetic.name).toBe('Synthetic Directive');
    });

    it('should have complete theme structure for all factions', () => {
      allFactions.forEach(faction => {
        const theme = factionThemes[faction];
        
        // Check required properties
        expect(theme.id).toBe(faction);
        expect(theme.name).toBeTypeOf('string');
        
        // Check colors object
        expect(theme.colors).toBeDefined();
        expect(theme.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.colors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.colors.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
        
        // Check theme configurations
        expect(theme.gradient).toContain('linear-gradient');
        expect(theme.glow).toContain('rgba');
        
        // Check nested theme objects
        expect(theme.cardTheme).toBeDefined();
        expect(theme.buttonTheme).toBeDefined();
      });
    });

    it('should have unique primary colors for each faction', () => {
      const primaryColors = allFactions.map(faction => factionThemes[faction].colors.primary);
      const uniqueColors = [...new Set(primaryColors)];
      
      expect(uniqueColors).toHaveLength(allFactions.length);
    });

    it('should have correct synthetic faction colors', () => {
      const syntheticTheme = factionThemes.synthetic;
      
      expect(syntheticTheme.colors.primary).toBe('#C0C0C0');
      expect(syntheticTheme.colors.secondary).toBe('#A8A8A8');
      expect(syntheticTheme.gradient).toContain('#0A0A0A');
      expect(syntheticTheme.gradient).toContain('#1A1A1A');
    });
  });

  describe('getFactionTheme', () => {
    it('should return correct theme for each faction', () => {
      allFactions.forEach(faction => {
        const theme = getFactionTheme(faction);
        expect(theme).toBe(factionThemes[faction]);
        expect(theme.id).toBe(faction);
      });
    });

    it('should return default theme for invalid faction', () => {
      const theme = getFactionTheme('invalid' as Faction);
      expect(theme).toBe(defaultTheme);
    });

    it('should return synthetic theme correctly', () => {
      const theme = getFactionTheme('synthetic');
      expect(theme.name).toBe('Synthetic Directive');
      expect(theme.id).toBe('synthetic');
    });
  });

  describe('defaultTheme', () => {
    it('should be set to solaris theme', () => {
      expect(defaultTheme).toBe(factionThemes.solaris);
    });
  });

  describe('theme consistency', () => {
    it('should have consistent button theme structure', () => {
      allFactions.forEach(faction => {
        const theme = factionThemes[faction];
        
        expect(theme.buttonTheme.primary).toBeDefined();
        expect(theme.buttonTheme.hover).toBeDefined();
        expect(theme.buttonTheme.text).toBeDefined();
        
        // Should contain rgba or # color
        expect(theme.buttonTheme.primary).toMatch(/^(#[0-9A-Fa-f]{6}|rgba?\()/);
        expect(theme.buttonTheme.hover).toMatch(/^(#[0-9A-Fa-f]{6}|rgba?\()/);
        expect(theme.buttonTheme.text).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have consistent card theme structure', () => {
      allFactions.forEach(faction => {
        const theme = factionThemes[faction];
        
        expect(theme.cardTheme.background).toBeDefined();
        expect(theme.cardTheme.border).toBeDefined();
        expect(theme.cardTheme.highlight).toBeDefined();
        expect(theme.cardTheme.text).toBeDefined();
        
        // All should contain rgba or #
        Object.values(theme.cardTheme).forEach(value => {
          expect(value).toMatch(/^(#[0-9A-Fa-f]{6}|rgba?\(|.*solid.*)/);
        });
      });
    });
  });
});