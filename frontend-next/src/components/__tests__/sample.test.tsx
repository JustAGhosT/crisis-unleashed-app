import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Jest Configuration', () => {
  test('Jest is configured correctly', () => {
    // Render a simple component
    render(<div data-testid="test-element">Test Content</div>);
    
    // Verify it renders correctly
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Content');
  });
});