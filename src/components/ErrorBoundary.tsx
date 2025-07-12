'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { connectionManager } from '@/config/firebase';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      isOffline: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Check if it's a Firebase connection error
    if (this.isFirebaseConnectionError(error)) {
      connectionManager.handleConnectionError(error);
      this.setState({ isOffline: true });
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  componentDidMount() {
    // Listen for network status changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleOnline = () => {
    this.setState({ isOffline: false });
    if (this.state.hasError && this.isFirebaseConnectionError(this.state.error)) {
      this.handleRetry();
    }
  };

  handleOffline = () => {
    this.setState({ isOffline: true });
  };

  isFirebaseConnectionError = (error: Error | null): boolean => {
    if (!error) return false;
    
    const errorMessage = error.message.toLowerCase();
    const errorCode = (error as any).code;
    
    return (
      errorCode === 'unavailable' ||
      errorCode === 'deadline-exceeded' ||
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('firestore') ||
      errorMessage.includes('webchannel')
    );
  };

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    try {
      // Try to reconnect Firebase
      if (this.isFirebaseConnectionError(this.state.error)) {
        const success = await connectionManager.retryConnection();
        if (success) {
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            isRetrying: false,
            isOffline: false
          });
          return;
        }
      }
      
      // For other errors, just reset the error boundary
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      });
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      this.setState({ isRetrying: false });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isConnectionError = this.isFirebaseConnectionError(this.state.error);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                {isConnectionError ? (
                  this.state.isOffline ? <WifiOff className="h-6 w-6 text-red-600" /> : <Wifi className="h-6 w-6 text-red-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <CardTitle className="text-xl font-semibold">
                {isConnectionError ? 'Connection Issue' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {isConnectionError
                  ? this.state.isOffline
                    ? 'You appear to be offline. Please check your internet connection.'
                    : 'Unable to connect to our servers. This might be a temporary issue.'
                  : 'An unexpected error occurred. We apologize for the inconvenience.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.isOffline && (
                <Alert>
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    Working in offline mode. Some features may be limited.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="w-full"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="w-full"
                >
                  Reload Page
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs bg-muted p-2 rounded border overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;