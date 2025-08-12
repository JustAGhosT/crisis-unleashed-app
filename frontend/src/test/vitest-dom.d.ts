/// <reference types="@testing-library/jest-dom" />

import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> 
    extends jest.Matchers<void, T> {
    toBeInTheDocument(): unknown;
    toBeVisible(): unknown;
    toBeDisabled(): unknown;
    toBeEnabled(): unknown;
    toBeEmptyDOMElement(): unknown;
    toBeInvalid(): unknown;
    toBeRequired(): unknown;
    toBeValid(): unknown;
    toBeChecked(): unknown;
    toHaveAttribute(attr: string, value?: string): unknown;
    toHaveClass(...classNames: string[]): unknown;
    toHaveStyle(style: string | Record<string, string>): unknown;
    toHaveTextContent(content: string | RegExp): unknown;
    toHaveValue(value: string | number | string[]): unknown;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): unknown;
    toBePartiallyChecked(): unknown;
    toHaveErrorMessage(message?: string | RegExp): unknown;
  }
  
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): unknown;
    toBeVisible(): unknown;
    toBeDisabled(): unknown;
    toHaveAttribute(attr: string, value?: string): unknown;
    toHaveClass(...classNames: string[]): unknown;
    toHaveTextContent(content: string | RegExp): unknown;
  }
}