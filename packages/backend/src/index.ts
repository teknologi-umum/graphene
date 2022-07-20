import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import console from "node:console";
import polka, { type Middleware } from "polka";
import sirv from "sirv";
import helmet from "helmet";
import { cors, bodyParser, errorHandler, notFoundHandler, rateLimiter } from "~/middleware/index.js";
import { logger } from "~/utils/index.js";
import { coreHandler } from "~/handler/core.js";
import { IS_PRODUCTION, IS_TEST, PORT } from "~/constants";

const MAX_AGE = 24 * 60; // 1 day
const CWD = dirname(fileURLToPath(import.meta.url));
const STATIC_PATH = resolve(CWD, "./views");

const app = polka({ onError: errorHandler, onNoMatch: notFoundHandler })
  .use(
    helmet() as Middleware,
    sirv(STATIC_PATH, {
      dev: !IS_PRODUCTION,
      etag: true,
      maxAge: MAX_AGE
    })
  )
  .options("/api", cors)
  .post("/api", cors, rateLimiter, bodyParser, coreHandler);

/* c8 ignore start */
if (!IS_TEST) {
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
    logger.info("Launching", {});
  });
}
/* c8 ignore stop */

/* c8 ignore start */
// Graceful shutdown
process.on("SIGINT", () =>
  app.server.close((err) => {
    if (err === undefined) return;
    console.log("\nSIGINT: " + err);
  })
);
process.on("SIGTERM", () =>
  app.server.close((err) => {
    if (err === undefined) return;
    console.log("\nSIGTERM: " + err);
  })
);
/* c8 ignore stop */

export default app;
