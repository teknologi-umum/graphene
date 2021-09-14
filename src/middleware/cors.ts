import type { Middleware } from 'polka';

/**
 * Yes, I make my own CORS middleware.
 */
export const cors: Middleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'].join(', ').toUpperCase(),
  );
  res.setHeader('Access-Control-Allow-Headers', 'content-type,accept');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Content-Length', 0);
    res.end();
    return;
  }
  next();
};
