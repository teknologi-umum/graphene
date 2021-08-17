import polka from 'polka';
import cors from 'cors';
import sirv from 'sirv';
import logger from './utils/logger.js';
import { screenshot } from './utils/screenshot.js';
import { json } from 'milliparsec';
import { squooshify } from './utils/squoosh.js';

/**
 * @param {import('polka').Request} req
 * @param {import('http').ServerResponse} res
 */
const handler = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const { code, lang, username, format = 'oxipng', upscale = 1 } = req.body;
  let err = [];

  if (!code) err.push('`code` is required!');
  if (!username) err.push('`username` is required!');
  if (typeof upscale !== 'number') err.push('`upscale` should be a number!');
  if (!format || !['oxipng', 'mozjpeg'].includes(format)) {
    err.push('Bad `format`! Valid options are `oxipng` and `mozjpg`');
  }

  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  try {
    const base64 = await screenshot(code, lang, username);
    const image = await squooshify(base64, upscale, format);
    res
      .writeHead(200, {
        'Content-Type': `image/${format === 'oxipng' ? 'png' : 'jpeg'}`,
        'Content-Length': image.length,
      })
      .end(image);
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.log(err);
    logger.captureException(err, (scope) => {
      scope.setContext('detail', { lang, username, code, payload: req.body });
      scope.setTags({ lang, username });
    });

    res
      .writeHead(500, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ msg: 'Something went wrong on our side.' }));
  }
};

const server = polka().use(cors(), json(), sirv('./static')).get('/').post('/api/shot', handler);

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000);
}

export default server;
