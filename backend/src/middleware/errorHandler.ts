import type { ErrorHandler } from "polka";
import { logtail, sentry } from "@/utils/index.js";

/**
 * errorHandler is the default error handler for every request.
 */
export const errorHandler: ErrorHandler = (err, req, res) => {
  if (process.env.NODE_ENV !== "production") {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }

  sentry.captureException(err, (scope) => {
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

  const msg = JSON.stringify({ msg: "Something went wrong on our side." });
  res
    .writeHead(500, {
      "Content-Type": "application/json",
      "Content-Length": msg.length
    })
    .end(msg);

  logtail.error("Error was thrown", {
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
