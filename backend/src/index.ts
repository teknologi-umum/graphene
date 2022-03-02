import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import polka from 'polka';
import sirv from 'sirv';
import helmet from 'helmet';
import { cors } from './middleware/cors';
import { bodyParser } from './middleware/bodyParser';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimiter';
import { coreHandler } from './handler/core';
import logtail from './utils/logtail';
import type { Middleware } from 'polka';

const server = polka({ onError: errorHandler, onNoMatch: notFoundHandler })
  .use(
    helmet() as Middleware,
    sirv(resolve(dirname(fileURLToPath(import.meta.url)), './views'), {
      dev: process.env.NODE_ENV !== 'production',
      etag: true,
      maxAge: 60 * 60 * 24,
    }),
  )
  .get('/')
  .options('/api', cors)
  .post('/api', cors, rateLimiter, bodyParser, coreHandler);

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
