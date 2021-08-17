import polka from 'polka';
import cors from 'cors';
import sirv from 'sirv';
import helmet from 'helmet';
import logger from './utils/logger.js';
import { screenshot } from './utils/screenshot.js';
import { json } from './middleware/json.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { processImage } from './utils/sharp.js';

/**
 * @param {import('polka').Request} req
 * @param {import('http').ServerResponse} res
 */
const handler = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const { code, lang, username, format = 'png', upscale = 1 } = req.body;
  const err = [];

  if (!code) err.push('`code` is required!');
  if (!username) err.push('`username` is required!');
  if (typeof upscale !== 'number') err.push('`upscale` must be a number!');
  if (upscale < 1) err.push("`upscale` can't be lower than 1!");
  if (!format || !['png', 'jpeg', 'webp'].includes(format)) {
    err.push('Bad `format`! Valid options are `png`, `jpeg`, and `webp`');
  }

  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  try {
    const base64 = await screenshot(code, lang, username);
    const image = await processImage(base64, upscale, format);
    res
      .writeHead(200, {
        'Content-Type': `image/${format}`,
        'Content-Length': image.length,
      })
      .end(image);
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.log(err);
    logger.captureException(err, (scope) => {
      scope.setContext('request_header', {
        'Content-Type': req.headers['content-type'],
        Origin: req.headers['origin'],
        Accept: req.headers['accept'],
        'User-Agent': req.headers['user-agent'],
      });
      scope.setContext('request_body', { ...req.body });
      scope.setTags({ lang, username });
    });

    res
      .writeHead(500, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ msg: 'Something went wrong on our side.' }));
  }
};

const server = polka({ onError: errorHandler })
  .use(
    helmet(),
    cors(),
    sirv('./src/static', { dev: process.env.NODE_ENV !== 'production', etag: true, maxAge: 60 * 60 * 24 }),
  )
  .get('/')
  .post('/api', rateLimiter(), json(), handler);

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000);
}

export default server;
