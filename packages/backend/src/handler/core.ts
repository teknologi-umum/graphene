import type { Middleware } from "polka";
import { ZodError } from "zod";
import * as Sentry from "@sentry/node";
import { generateImage } from "~/logic/generate-image";
import { convertOpenTelemetryHeaders, getUserIP, sentryTraceFromHeader } from "~/utils";
import { optionSchema, OptionSchema } from "~/schema/options";

export const coreHandler: Middleware = async (req, res) => {
  /* c8 ignore start */
  const abortController = new AbortController();
  return Sentry.withIsolationScope(() =>
    Sentry.continueTrace(
      {
        sentryTrace: sentryTraceFromHeader(req.headers),
        baggage: req.headers["baggage"]
      },
      () => {
        const userIPAddress = getUserIP(req.headers);
        if (userIPAddress != null) {
          Sentry.getIsolationScope().setUser({ ip_address: userIPAddress });
        }
        Sentry.getIsolationScope().setExtra("Headers", req.headers);

        return Sentry.startSpan(
          {
            name: `${req.method.toUpperCase()} ${req.path}`,
            op: "http.server",
            attributes: {
              source: "url",
              "http.request.method": req.method,
              "http.method": req.method,
              "http.url": req.url,
              "http.user_agent": req.headers["User-Agent"] || "unknown",
              "http.host": req.headers["Host"],
              "http.client_ip": userIPAddress,
              ...convertOpenTelemetryHeaders(req.headers, "request")
            }
          },
          async (sentrySpan) => {
            req.once("close", () => {
              if (req.destroyed) {
                abortController.abort("Request closed");
              }
              sentrySpan?.setStatus(Sentry.getSpanStatusFromHttpCode(res.statusCode));
            });
            /* c8 ignore end */

            if (req.body === "" || !Object.keys(req.body).length) {
              res
                .writeHead(400, { "Content-Type": "application/json" })
                .end(JSON.stringify({ message: "Body can't be empty!" }));
              return;
            }

            try {
              const options = (await optionSchema.parseAsync(req.body)) as OptionSchema;
              const { image, format, length } = await generateImage(options);

              res
                .writeHead(200, {
                  "Content-Type": `image/${format === "svg" ? "svg+xml" : format}`,
                  "Content-Length": length
                })
                .end(image);
            } catch (err) {
              if (err instanceof ZodError) {
                res
                  .writeHead(400, { "Content-Type": "application/json" })
                  .end(
                    JSON.stringify({ message: "Validation error", issues: err.issues.map((issue) => issue.message) })
                  );
              } else if (err instanceof Error) {
                res
                  .writeHead(500, { "Content-Type": "application/json" })
                  .end(JSON.stringify({ message: err.message }));
              } else {
                res
                  .writeHead(500, { "Content-Type": "application/json" })
                  .end(JSON.stringify({ message: "Unknown error" }));
              }
            }
          }
        );
      }
    )
  );
};
