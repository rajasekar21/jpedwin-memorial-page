'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

/** Catches render-time errors in the component tree and shows a fallback UI. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }
    return this.props.children;
  }
}

function DefaultFallback() {
  return (
    <div
      role="alert"
      className="flex min-h-dvh items-center justify-center bg-paper px-5 text-center text-ink dark:bg-twilight dark:text-paper"
    >
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-clay dark:text-gold">
          Something went wrong
        </p>
        <h1 className="font-serif text-3xl">This page could not be displayed.</h1>
        <p className="mt-4 text-ink/65 dark:text-paper/65">
          Please refresh the page or return home.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
        >
          Return home
        </a>
      </div>
    </div>
  );
}
