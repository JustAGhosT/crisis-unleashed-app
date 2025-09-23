'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
  maxRetries?: number;
}

/**
 * Enhanced Error Boundary with comprehensive error handling and reporting
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private readonly maxRetries: number;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.maxRetries = props.maxRetries ?? 3;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      errorInfo,
    });

    // Report error to monitoring service
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return ErrorBoundary.generateErrorId();
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      level: this.props.level || 'component',
      retryCount: this.state.retryCount,
    };

    // Send to error reporting service (replace with your actual service)
    if (process.env.NODE_ENV === 'production') {
      try {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport),
        }).catch((reportingError) => {
          console.error('Failed to report error:', reportingError);
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    }

    // Store error locally for debugging
    if (typeof window !== 'undefined') {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorReport);

      // Keep only last 10 errors to prevent localStorage bloat
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }

      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      // Add a small delay to avoid immediate re-errors
      this.retryTimeoutId = setTimeout(() => {
        // Force a re-render after clearing the error
        this.forceUpdate();
      }, 100);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorToClipboard = () => {
    const errorText = `
Error ID: ${this.state.errorId}
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(errorText).then(
      () => {
        console.log('Error details copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy error details:', err);
      }
    );
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const isPageLevel = this.props.level === 'page';
      const isCritical = this.props.level === 'critical';

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                {isCritical ? (
                  <Bug className="h-8 w-8 text-red-600 dark:text-red-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isCritical ? 'Critical System Error' : 'Something went wrong'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Error ID: {this.state.errorId}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isCritical
                  ? 'A critical error has occurred. Please contact support if this persists.'
                  : isPageLevel
                    ? 'This page encountered an error while loading.'
                    : 'This component encountered an unexpected error.'
                }
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                </button>
              )}

              {isPageLevel || isCritical ? (
                <div className="flex space-x-2">
                  <button
                    onClick={this.handleReload}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </button>
                </div>
              ) : (
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </button>
              )}

              <button
                onClick={this.copyErrorToClipboard}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-1"
              >
                Copy Error Details
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Retry attempts: {this.state.retryCount} / {this.maxRetries}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}