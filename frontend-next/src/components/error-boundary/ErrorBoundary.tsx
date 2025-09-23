"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastHelpers } from "@/lib/toast-utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  enableReporting?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo);
    }

    // Show error toast
    if (typeof window !== "undefined" && window.navigator.onLine) {
      import("@/hooks/useToast").then(({ toastHelpers }) => {
        toastHelpers.error(
          "An unexpected error occurred. Please try refreshing the page.",
          "Application Error"
        );
      });
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // This would typically send to a monitoring service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.info("Error report generated:", errorReport);
    // TODO: Send to monitoring service
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
      });
    }
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>

              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-foreground mb-2">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  We encountered an unexpected error. This has been logged and
                  we&apos;ll look into it.
                </p>
                {this.state.errorId && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {this.state.errorId}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {this.retryCount < this.maxRetries && (
                  <button
                    onClick={this.handleRetry}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2",
                      "bg-primary text-primary-foreground rounded-md",
                      "hover:bg-primary/90 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again ({this.maxRetries - this.retryCount} attempts left)
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={this.handleGoHome}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2",
                      "bg-secondary text-secondary-foreground rounded-md",
                      "hover:bg-secondary/80 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    )}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                  <button
                    onClick={this.handleReload}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2",
                      "bg-secondary text-secondary-foreground rounded-md",
                      "hover:bg-secondary/80 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload
                  </button>
                </div>
              </div>

              {this.props.showDetails && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <pre className="text-xs text-muted-foreground overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;