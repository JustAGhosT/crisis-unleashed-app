/**
 * Utilities for safe string conversion
 */

/**
 * Helper function to safely convert any value to a string
 * @param value - The value to convert to a string
 * @param fallback - Optional fallback value if conversion fails
 * @returns A string representation safe for display
 */
export function safeToString(value: unknown, fallback = '[object]'): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'object') {
    // Define a more specific type for objects with toString methods
    interface WithToString {
      toString: () => string;
    }

    // Check if the object has a toString method that's not the default Object.prototype.toString
    if (value !== null) {
      const valueObj = value as { toString?: unknown };
      if (
        typeof valueObj.toString === 'function' &&
        valueObj.toString !== Object.prototype.toString
      ) {
        try {
          return (value as WithToString).toString();
        } catch (e) {
          // Fall back if toString throws
        }
      }
    }

    // Try JSON.stringify as a last resort
    try {
      return JSON.stringify(value);
    } catch (e) {
      // Fall back if circular references or other issues
    }
  }

  // Default fallback
  return fallback;
}

/**
 * Checks if a value can be safely displayed directly as a string
 * @param value - The value to check
 * @returns True if the value can be directly displayed
 */
export function isDirectlyDisplayable(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}