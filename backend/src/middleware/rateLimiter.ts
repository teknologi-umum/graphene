import type { Middleware } from 'polka';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getIP } from '../utils/getIP';

const rlm = new RateLimiterMemory({
  points: process.env.NODE_ENV === 'test' ? 100 : 10,
  duration: 60,
  blockDuration: 30,
});

/**
 * Rate limiter, duh!
 * @type {import('polka').Middleware}
 */
export const rateLimiter: Middleware = async (req, res, next) => {
  try {
    await rlm.consume(getIP(req), 1);
    next();
  } catch {
    res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: 'Too Many Requests' }));
  }
};
