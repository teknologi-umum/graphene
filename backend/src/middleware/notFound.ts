import type { Middleware } from 'polka';

/**
 * Default not found handler
 */
export const notFoundHandler: Middleware = (_, res) => {
  const msg = JSON.stringify({ msg: 'Not found.' });
  res.writeHead(404, { 'Content-Type': 'application/json', 'Content-Length': msg.length }).end(msg);
};
