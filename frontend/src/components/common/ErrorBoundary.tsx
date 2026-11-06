import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#031811] text-emerald-50 p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-black text-emerald-400 text-lg mb-4 shadow-sm shadow-emerald-500/20">
            CV
          </div>
          <h2 className="text-base font-bold text-white mb-2">
            Classic Crocs Visualizer
          </h2>
          <p className="text-xs text-emerald-400/80 max-w-sm mb-4 leading-relaxed">
            {this.state.error?.message ?? 'An unexpected error occurred in the customizer.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
          >
            Reload Customizer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
