import { Component, type ReactNode } from 'react';
import QueryErrorFallback from './QueryErrorFallback';

type ErrorBoundaryProps = {
  children: ReactNode;
  title?: string;
  fallback?: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  error: unknown | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error !== null) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <QueryErrorFallback
          title={this.props.title ?? '오류가 발생했어요'}
          error={this.state.error}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
