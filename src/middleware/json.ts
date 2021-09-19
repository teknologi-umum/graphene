import type { Middleware } from 'polka';

/**
 * Practical JSON parser middleware
 */
export const json: Middleware = async (req, res, next) => {
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    req.body = JSON.parse(body);
    next();
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: 'Invalid JSON body' }));
  }
};
