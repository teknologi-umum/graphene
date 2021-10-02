import polka from 'polka';
import sirv from 'sirv';
import helmet from 'helmet';
import { cors } from './middleware/cors';
import { json } from './middleware/json';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { coreHandler } from './handler/core';
import logtail from './utils/logtail';
import type { Middleware } from 'polka';

const server = polka({ onError: errorHandler })
  .use(
    helmet() as Middleware,
    cors,
    sirv('./src/dist', { dev: process.env.NODE_ENV !== 'production', etag: true, maxAge: 60 * 60 * 24 }),
  )
  .get('/')
  .post('/api', rateLimiter, json, coreHandler);

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Running on http://localhost:${process.env.PORT || 3000}`);
    logtail.info('Launching');
  });
}

// Graceful shutdown
process.on('SIGINT', () =>
  server.server.close((err) => {
    /* eslint-disable-next-line */
    console.log('\nSIGINT: ' + err);
  }),
);
process.on('SIGTERM', () =>
  server.server.close((err) => {
    /* eslint-disable-next-line */
    console.log('\nSIGTERM: ' + err);
  }),
);

export default server;
