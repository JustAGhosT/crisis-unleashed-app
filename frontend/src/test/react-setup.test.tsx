import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple component for testing
const TestComponent = ({ message }: { message: string }) => {
  return <div data-testid="test-message">{message}</div>;
};

describe('React Testing Setup', () => {
  it('should render React components', () => {
    render(<TestComponent message="Hello Test" />);
    
    const element = screen.getByTestId('test-message');
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Hello Test');
  });

  it('should find elements by text', () => {
    render(<TestComponent message="Find Me" />);
    
    const element = screen.getByText('Find Me');
    expect(element).toBeTruthy();
  });
});