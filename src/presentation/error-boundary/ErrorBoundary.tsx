"use client";

import { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import styles from "./ErrorBoundary.module.css";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// ADR-007: fallback amigável + captura de exceções não tratadas do reducer,
// reportadas ao Sentry quando NEXT_PUBLIC_SENTRY_DSN estiver configurado.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallback} role="alert">
          <p>Ocorreu um erro, reinicie o jogo.</p>
          <button
            type="button"
            className={styles.reload}
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
