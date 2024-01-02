import type { Middleware } from "polka";
import { ZodError } from "zod";
import * as Sentry from "@sentry/node";
import { generateImage } from "~/logic/generate-image";
import { logger, sentryTraceFromHeader } from "~/utils";
import { optionSchema, OptionSchema } from "~/schema/options";

export const coreHandler: Middleware = async (req, res) => {
  /* c8 ignore start */
  const abortController = new AbortController();
  const sentrySpan = Sentry.continueTrace(
    { sentryTrace: sentryTraceFromHeader(req.headers), baggage: req.headers["baggage"] },
    (ctx) =>
      Sentry.startTransaction(
        {
          name: `${req.method.toUpperCase()} ${req.path}`,
          op: "http.server",
          origin: "manual.http.node.tracingHandler",
          ...ctx,
          metadata: {
            ...ctx.metadata,
            request: req,
            source: "url"
          }
        },
        { request: Sentry.extractRequestData(req) }
      )
  );

  req.once("close", () => {
    if (req.destroyed) {
      abortController.abort("Request closed");
    }
    sentrySpan.setHttpStatus(res.statusCode);
    sentrySpan.finish();
  });

  Sentry.getCurrentHub().getScope().setSpan(sentrySpan);

  await logger.info("Incoming POST request", {
    body: req.body ?? "",
    headers: {
      accept: req.headers.accept ?? "",
      "content-type": req.headers["content-type"] ?? "",
      origin: req.headers.origin ?? "",
      referer: req.headers.referer ?? "",
      "user-agent": req.headers["user-agent"] ?? ""
    },
    port: req.socket.remotePort ?? 0,
    ipv: req.socket.remoteFamily ?? ""
  });
  /* c8 ignore end */

  if (req.body === "" || !Object.keys(req.body).length) {
    res.writeHead(400, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "Body can't be empty!" }));
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
        .end(JSON.stringify({ message: "Validation error", issues: err.issues.map((issue) => issue.message) }));
    } else if (err instanceof Error) {
      res.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ message: err.message }));
    } else {
      res.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "Unknown error" }));
    }
  }
};
