import {
  cn,
  debounce,
  formatFactionName,
  formatRarity,
  getFactionColorClass,
  getFactionGradientClass,
  getRarityColorClass
} from '@/lib/utils';

// Mock the implementation of clsx and twMerge for the cn function test
jest.mock('clsx', () => ({
  default: (...inputs: unknown[]) => {
    const flattened = inputs.flatMap((i: unknown) => {
      if (typeof i === 'object' && i !== null) {
        return Object.entries(i as Record<string, unknown>)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k);
      }
      return i as unknown;
    });
    return flattened.filter(Boolean).join(' ');
  },
}));

jest.mock('tailwind-merge', () => ({
  twMerge: (className: string) => className
}));

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('combines class names', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false });
      // Assert actual merged output to catch regressions
      expect(result).toBe('class1 class2 class3');
    });
  });

  describe('formatFactionName', () => {
    it('formats snake_case faction names to Title Case', () => {
      expect(formatFactionName('solaris')).toBe('Solaris');
      expect(formatFactionName('umbral_covenant')).toBe('Umbral Covenant');
      expect(formatFactionName('infernal_legion')).toBe('Infernal Legion');
    });

    it('handles empty strings', () => {
      expect(formatFactionName('')).toBe('');
    });
  });

  describe('getFactionColorClass', () => {
    it('returns the correct color class for known factions', () => {
      expect(getFactionColorClass('solaris')).toBe('text-faction-solaris-primary');
      expect(getFactionColorClass('umbral')).toBe('text-faction-umbral-primary');
      expect(getFactionColorClass('synthetic')).toBe('text-faction-synthetic-primary');
    });

    it('returns a default color for unknown factions', () => {
      expect(getFactionColorClass('unknown_faction')).toBe('text-gray-400');
    });
  });

  describe('getFactionGradientClass', () => {
    it('returns the correct gradient class for known factions', () => {
      expect(getFactionGradientClass('solaris')).toBe('faction-gradient-solaris');
      expect(getFactionGradientClass('umbral')).toBe('faction-gradient-umbral');
      expect(getFactionGradientClass('neuralis')).toBe('faction-gradient-neuralis');
    });

    it('returns a default gradient for unknown factions', () => {
      expect(getFactionGradientClass('unknown_faction')).toBe('bg-gray-500');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays function execution until after wait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(499);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('only executes the last call within the wait period', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('first call');
      debouncedFn('second call');
      debouncedFn('third call');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third call');
    });
  });

  describe('formatRarity', () => {
    it('capitalizes the first letter of rarity', () => {
      expect(formatRarity('common')).toBe('Common');
      expect(formatRarity('rare')).toBe('Rare');
      expect(formatRarity('legendary')).toBe('Legendary');
    });

    it('handles empty strings', () => {
      expect(formatRarity('')).toBe('');
    });
  });

  describe('getRarityColorClass', () => {
    it('returns the correct color class for known rarities', () => {
      expect(getRarityColorClass('common')).toBe('text-gray-400');
      expect(getRarityColorClass('uncommon')).toBe('text-green-400');
      expect(getRarityColorClass('legendary')).toBe('text-yellow-400');
    });

    it('returns a default color for unknown rarities', () => {
      expect(getRarityColorClass('unknown_rarity')).toBe('text-gray-400');
    });
  });
});