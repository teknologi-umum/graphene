import type { Middleware } from "polka";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { IS_TEST } from "~/constants";
import { getIP } from "../utils/get-ip";

const rateLimiterMemory = new RateLimiterMemory({
  points: IS_TEST ? 100 : 10,
  duration: 60,
  blockDuration: 30
});

/**
 * Rate limiter, duh!
 */
export const rateLimiter: Middleware = async (req, res, next) => {
  try {
    await rateLimiterMemory.consume(getIP(req), 1);
    next();
  } catch {
    res.writeHead(429, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "Too Many Requests" }));
  }
};
