"use client";

import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive"
          >
            <p className="font-semibold">Something went wrong.</p>
            <p className="text-xs opacity-80">Please try again.</p>
            {process.env.NODE_ENV !== "production" && (
              <p className="mt-2 text-[10px] font-mono opacity-80">{this.state.error?.message}</p>
            )}
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
