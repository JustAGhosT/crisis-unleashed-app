import { describe, it, expect } from 'vitest';

// Simple test to verify Vitest setup
describe('Basic Test Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const str = 'Hello World';
    expect(str).toBe('Hello World');
    expect(str.length).toBe(11);
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});