import console from "node:console";
import type { ErrorHandler } from "polka";
import * as Sentry from "@sentry/node";
import { IS_PRODUCTION } from "~/constants";
import { logger } from "~/utils/index.js";

/**
 * errorHandler is the default error handler for every request.
 */
export const errorHandler: ErrorHandler = (err, req, res) => {
  if (!IS_PRODUCTION) {
    console.error(err);
  }

  Sentry.captureException(err, (scope) => {
    scope.setContext("request_header", {
      "Content-Type": req.headers["content-type"],
      Origin: req.headers["origin"],
      Accept: req.headers["accept"],
      "User-Agent": req.headers["user-agent"]
    });
    scope.setContext("request_body", { body: req.body });
    scope.setContext("request_meta", {
      url: req.url,
      method: req.method,
      http: req.httpVersion
    });
    return scope;
  });

  const message = JSON.stringify({
    message: "Something went wrong on our side."
  });
  res
    .writeHead(500, {
      "Content-Type": "application/json",
      "Content-Length": message.length
    })
    .end(message);

  logger.error("Error was thrown", {
    error: err.toString(),
    headers: {
      "Content-Type": req.headers["content-type"] || "",
      Origin: req.headers["origin"] || "",
      Accept: req.headers["accept"] || "",
      "User-Agent": req.headers["user-agent"] || ""
    },
    body: req.body
  });
};
