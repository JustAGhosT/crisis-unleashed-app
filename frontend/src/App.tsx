import React, { FC, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeSelector } from '@/theme/ThemeProvider';
import '@/theme/global.css';
import GameInterface from '@/components/game/GameInterface';

// Add error boundary for better error handling
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-900 bg-opacity-50 p-4">
          <div className="text-center p-8 bg-black bg-opacity-70 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              We're sorry, but an unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for suspense fallback
const LoadingFallback: FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-primary">Loading game assets...</p>
    </div>
  </div>
);

const App: FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider initialFaction="solaris">
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen flex flex-col">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<GameInterface />} />
              </Routes>
            </BrowserRouter>
            {/* Enable theme selector in development */}
            {process.env.NODE_ENV === 'development' && <ThemeSelector />}
          </div>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
