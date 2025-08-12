import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { SafeDisplay } from '../components/common/SafeDisplay';
import withSafeRendering from '../components/common/withSafeRendering';
import { safeToString } from '../utils/stringUtils';

describe('Object Rendering Utilities', () => {
  describe('safeToString', () => {
    it('handles primitive values correctly', () => {
      expect(safeToString('hello')).toBe('hello');
      expect(safeToString(42)).toBe('42');
      expect(safeToString(true)).toBe('true');
      expect(safeToString(null)).toBe('null');
      expect(safeToString(undefined)).toBe('undefined');
    });

    it('handles objects without [object Object]', () => {
      const testObj = { name: 'Test', id: 123 };
      expect(safeToString(testObj)).toBe('{"name":"Test","id":123}');
    });

    it('handles objects with custom toString', () => {
      const custom = {
        toString: () => 'Custom String'
      };
      expect(safeToString(custom)).toBe('Custom String');
    });

    it('handles circular references gracefully', () => {
      // Create an object with a circular reference
      interface CircularObject {
        self?: CircularObject;
        [key: string]: unknown;
      }

      const circular: CircularObject = {};
      circular.self = circular;

      // Should not throw and return fallback
      expect(() => safeToString(circular)).not.toThrow();
    });
  });

  describe('SafeDisplay Component', () => {
    it('renders primitive values correctly', () => {
      render(<SafeDisplay value="Test String" />);
      expect(screen.getByText('Test String')).toBeInTheDocument();

      render(<SafeDisplay value={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders objects as JSON strings', () => {
      const testObj = { name: 'Test Object' };
      render(<SafeDisplay value={testObj} />);

      // Should show JSON instead of [object Object]
      expect(screen.getByText('{"name":"Test Object"}')).toBeInTheDocument();
    });

    it('uses fallback for problematic objects', () => {
      const problematic = {
        toString: () => { throw new Error('Error in toString'); }
      };

      render(<SafeDisplay value={problematic} fallback="Fallback Text" />);
      expect(screen.getByText('Fallback Text')).toBeInTheDocument();
    });
  });

  describe('withSafeRendering HOC', () => {// Test component that might have object rendering issues
    const TestComponent: React.FC<{message: unknown; label?: string}> = ({message, label}) => (
      <div>
        {label && <span>{label}: </span>}
        <span data-testid="message">{String(message)}</span>
      </div>
    );

    it('protects components from object rendering issues', () => {
      const SafeTestComponent = withSafeRendering(TestComponent, ['message']);
      const testObject = { foo: 'bar', num: 42 };

      render(<SafeTestComponent message={testObject} />);

      const messageEl = screen.getByTestId('message');
      expect(messageEl.textContent).toBe('{"foo":"bar","num":42}');
      expect(messageEl.textContent).not.toBe('[object Object]');
    });

    it('passes through primitive values unchanged', () => {
      const SafeTestComponent = withSafeRendering(TestComponent);

      render(<SafeTestComponent message="Hello World" label="Greeting" />);

      expect(screen.getByTestId('message').textContent).toBe('Hello World');
      expect(screen.getByText('Greeting: ')).toBeInTheDocument();
    });

    it('can protect specific props only', () => {
      // Create a component that only protects the 'message' prop
      const PartialSafeComponent = withSafeRendering(TestComponent, ['message']);

      const testObject = { id: 123 };

      // Only 'message' should be protected, 'label' would still have issues if it were an object
      render(<PartialSafeComponent message={testObject} label="Label" />);

      expect(screen.getByTestId('message').textContent).toBe('{"id":123}');
    });
  });
});