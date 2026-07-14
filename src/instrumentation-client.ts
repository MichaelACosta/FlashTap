import * as Sentry from "@sentry/nextjs";

// ADR-007: observabilidade de erros client-side. Sem NEXT_PUBLIC_SENTRY_DSN
// configurado (não é obrigatório), Sentry simplesmente não inicializa e todo
// captureException chamado pelo ErrorBoundary vira um no-op silencioso.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0,
  });
}
