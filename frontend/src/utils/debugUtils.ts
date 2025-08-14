/**
 * Debug utilities for troubleshooting object serialization issues
 */

import { safeToString } from './stringUtils';

// Create a more specific type for objects that can be debugged
type DebuggableValue = unknown;

export const debugObject = (obj: DebuggableValue, label?: string): void => {
  const prefix = label ? `[${label}]` : '[DEBUG]';

  try {
    console.group(prefix);
    console.log('Type:', typeof obj);

    // Only access constructor if obj is an object and not null
    if (obj !== null && typeof obj === 'object') {
      console.log('Constructor:', (obj as object).constructor?.name);
    }

    if (obj === null) {
      console.log('Value: null');
    } else if (obj === undefined) {
      console.log('Value: undefined');
    } else if (typeof obj === 'object') {
      console.log('Keys:', Object.keys(obj as object));
      console.log('JSON:', JSON.stringify(obj, null, 2));
    } else {
      console.log('Value:', obj);
    }
  } catch (error) {
    console.error('Error debugging object:', error instanceof Error ? error.message : String(error));
    console.log('Raw object:', obj);
  } finally {
    console.groupEnd();
  }
};

export const safeStringify = (obj: DebuggableValue): string => {
  return safeToString(obj, '[Error stringifying object]');
};

export const logWithDetails = (message: string, ...objects: DebuggableValue[]): void => {
  console.log(message);
  objects.forEach((obj, index) => {
    debugObject(obj, `Object ${index + 1}`);
  });
};