import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in the component tree and displays a fallback UI.
 * Helps prevent the entire app from crashing due to a single component error.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.resetError)
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
                <h2 className="text-lg font-semibold text-destructive">
                  Something went wrong
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mb-6 text-xs">
                  <summary className="cursor-pointer font-mono text-muted-foreground hover:text-foreground">
                    Error details (dev only)
                  </summary>
                  <pre className="mt-2 overflow-auto bg-muted p-2 rounded text-destructive max-h-40">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button
                onClick={this.resetError}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
