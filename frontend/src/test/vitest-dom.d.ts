/// <reference types="@testing-library/jest-dom" />

import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> 
    extends jest.Matchers<void, T> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toBeEmptyDOMElement(): T;
    toBeInvalid(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeChecked(): T;
    toHaveAttribute(attr: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveStyle(style: string | Record<string, any>): T;
    toHaveTextContent(content: string | RegExp): T;
    toHaveValue(value: string | number | string[]): T;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T;
    toBePartiallyChecked(): T;
    toHaveErrorMessage(message?: string | RegExp): T;
  }
  
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): any;
    toBeVisible(): any;
    toBeDisabled(): any;
    toHaveAttribute(attr: string, value?: string): any;
    toHaveClass(...classNames: string[]): any;
    toHaveTextContent(content: string | RegExp): any;
  }
}