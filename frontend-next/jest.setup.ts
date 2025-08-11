// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.ts`

import '@testing-library/jest-dom';
import { ImageProps } from 'next/image';

// Create a mockable router function that tests can override
const useRouterMock = jest.fn().mockReturnValue({
  push: jest.fn().mockResolvedValue(true),
  replace: jest.fn().mockResolvedValue(true),
  prefetch: jest.fn().mockResolvedValue(true),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
});

// Mock next/router with both useRouter and default export
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: useRouterMock,
  default: {
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    prefetch: jest.fn().mockResolvedValue(true),
    back: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    // Add other Router singleton methods that might be used
    ready: jest.fn().mockResolvedValue(true),
    beforePopState: jest.fn(),
  },
}));

// Create stable instances to avoid identity changes between calls
const stableSearchParams = new URLSearchParams();

// Create mockable navigation hooks
const useNavigationRouterMock = jest.fn().mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  // Remove prefetch as it's not part of AppRouterInstance
  // https://nextjs.org/docs/app/api-reference/functions/use-router
  pathname: '/',
});

const usePathnameMock = jest.fn().mockReturnValue('/');
const useSearchParamsMock = jest.fn().mockReturnValue(stableSearchParams);

// Mock redirect and notFound functions
const redirectMock = jest.fn();
const notFoundMock = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: useNavigationRouterMock,
  usePathname: usePathnameMock,
  useSearchParams: useSearchParamsMock,
  redirect: redirectMock,
  notFound: notFoundMock,
}));

// Define a type for the Next.js Image props
type NextImageProps = Omit<ImageProps, 'src'> & {
  src: string | object;
  alt?: string;
};

// Mock next/image without using JSX directly
jest.mock('next/image', () => ({
  __esModule: true,
  default: function NextImage(props: NextImageProps) {
    // Instead of returning JSX directly, return a mock object
    // that Jest can serialize without requiring JSX transformation
    return {
      type: 'img',
      props: {
        ...props,
        'data-testid': 'next-image',
        alt: props.alt || '',
      },
      $$typeof: Symbol.for('react.element'),
    };
  },
}));

// Export the mock functions so tests can override them
export {
  notFoundMock, redirectMock, useNavigationRouterMock,
  usePathnameMock, useRouterMock, useSearchParamsMock
};

// Reset all jest mocks between tests to avoid cross-test leakage
beforeEach(() => {
  jest.clearAllMocks();

  // Reset mock implementations to defaults
  useRouterMock.mockClear();
  useNavigationRouterMock.mockClear();
  usePathnameMock.mockClear();
  useSearchParamsMock.mockClear();
  redirectMock.mockClear();
  notFoundMock.mockClear();

  // Clear search params between tests
  stableSearchParams.forEach((_, key) => {
    stableSearchParams.delete(key);
  });
});