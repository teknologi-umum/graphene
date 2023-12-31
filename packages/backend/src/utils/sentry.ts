export function sentryTraceFromHeader(headers: Record<string, string | string[] | undefined>): string | undefined {
  if (!headers["sentry-trace"]) {
    return undefined;
  }

  const sentryTrace = headers["sentry-trace"];

  if (typeof sentryTrace === "string") {
    return sentryTrace;
  }

  if (Array.isArray(headers["sentry-trace"])) {
    return sentryTrace?.at(0) ?? undefined;
  }

  return undefined;
}
