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

export const getUserIP = (headers: Record<string, string | string[] | undefined>): string | undefined => {
  let ipAddress: string | undefined;
  const possibleHeaders = [
    "Forwarded",
    "Forwarded-For",
    "Client-IP",
    "X-Forwarded",
    "X-Forwarded-For",
    "X-Client-IP",
    "X-Real-IP",
    "True-Client-IP"
  ];
  for (const possibleHeader of possibleHeaders) {
    const value = headers[possibleHeader];
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        ipAddress = value[0];
        continue;
      }

      ipAddress = value;
    }
  }

  return ipAddress;
};

export const convertOpenTelemetryHeaders = (
  headers: Record<string, string | string[] | undefined>,
  precedence: "request" | "response"
): Record<string, string[]> => {
  const openTelemetryHeadersCollection: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      openTelemetryHeadersCollection[`http.${precedence}.header.${key.toLowerCase()}`] = value;
      continue;
    }

    openTelemetryHeadersCollection[`http.${precedence}.header.${key.toLowerCase()}`] = [value];
  }

  return openTelemetryHeadersCollection;
};
