/**
 * Type declarations for preventing [object Object] rendering issues
 */

export type StringifiableValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type StringifiableObject = {
  [key: string]: StringifiableValue | StringifiableObject | StringifiableArray;
};

export interface StringifiableArray extends Array<StringifiableValue | StringifiableObject | StringifiableArray> { }

/**
 * Utility type that ensures a value can be safely stringified
 * Use this for props that will be displayed directly in JSX
 */
export type SafeDisplayValue = StringifiableValue | { toString(): string };

/**
 * Interface for components that need to safely display data
 */
export interface SafeDisplayProps {
  value: unknown;
  fallback?: string;
}

/**
 * Interface for components that show faction-specific content
 */
export interface FactionDisplayProps {
  faction: string;
  // Other common faction display props can go here
}
