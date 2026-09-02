import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CarePulse Application ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          aria-live="assertive" 
          className="min-h-[50vh] flex items-center justify-center p-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              CarePulse encountered an unexpected rendering error. Your local data and emergency contacts remain safely preserved.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-semibold text-sm transition shadow-md shadow-cyan-600/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Reload application"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
