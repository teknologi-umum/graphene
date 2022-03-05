import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

export const sentry = Sentry;
