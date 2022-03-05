import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import polka from "polka";
import type { Middleware } from "polka";
import sirv from "sirv";
import helmet from "helmet";
import {
  cors,
  bodyParser,
  errorHandler,
  notFoundHandler,
  rateLimiter
} from "@/middleware/index.js";
import { logger } from "@/utils/index.js";
import { coreHandler } from "@/handler/core.js";

const server = polka({ onError: errorHandler, onNoMatch: notFoundHandler })
  .use(
    helmet() as Middleware,
    sirv(resolve(dirname(fileURLToPath(import.meta.url)), "./views"), {
      dev: process.env.NODE_ENV !== "production",
      etag: true,
      maxAge: 60 * 60 * 24
    })
  )
  .get("/")
  .options("/api", cors)
  .post("/api", cors, rateLimiter, bodyParser, coreHandler);

/* c8 ignore start */
if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Running on http://localhost:${process.env.PORT || 3000}`);
    logger.info("Launching", {});
  });
}
/* c8 ignore stop */

/* c8 ignore start */
// Graceful shutdown
process.on("SIGINT", () =>
  server.server.close((err) => {
    /* eslint-disable-next-line */
    console.log("\nSIGINT: " + err);
  })
);
process.on("SIGTERM", () =>
  server.server.close((err) => {
    /* eslint-disable-next-line */
    console.log("\nSIGTERM: " + err);
  })
);
/* c8 ignore stop */

export default server;
