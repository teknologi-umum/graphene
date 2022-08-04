import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { IS_PRODUCTION, NODE_ENV, SENTRY_DSN } from "~/constants";

Sentry.init({
  // @ts-expect-error -- not sure why it's complaining about missing type definition
  dsn: SENTRY_DSN,
  enabled: IS_PRODUCTION,
  environment: NODE_ENV,
  tracesSampleRate: 1.0
});

export const sentry = Sentry;
