import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getIP } from '../utils/getIP.js';

const rlm = new RateLimiterMemory({
  points: 10,
  duration: 60,
  blockDuration: 30,
});

/**
 * Rate limiter, duh!
 */
export const rateLimiter =
  () =>
  /**
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @param {(err?: any) => void} next
   */
  async (req, res, next) => {
    try {
      await rlm.consume(getIP(req), 1);
      next();
    } catch {
      res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: 'Too Many Requests' }));
    }
  };
