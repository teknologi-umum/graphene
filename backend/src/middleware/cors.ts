import type { Middleware } from "polka";

/**
 * cors is a middleware that adds CORS headers to the response.
 */
export const cors: Middleware = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    ["POST"].join(", ").toUpperCase()
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type,accept");
  res.setHeader("Access-Control-Allow-Credentials", "false");

  if (req.method.toUpperCase() === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Content-Length", 0);
    res.end();
    return;
  }

  next();
};
