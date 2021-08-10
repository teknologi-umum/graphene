import { screenshot } from '../utils/screenshot.js';
import logger from '../utils/logger.js';

export default function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, POST, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', ['content-type', 'accept']);

  const { code, lang, username } = req.body;

  let err = [];

  if (!code) err.push('`code`');
  if (!lang) err.push('`lang`');
  if (!username) err.push('`username`');

  if (err.length > 0) {
    return res.status(400).json({ msg: err.join(' + ') + ' body parameter is required!' });
  }

  (async () => {
    try {
      const base64 = await screenshot(code, lang, username);
      const image = Buffer.from(base64, 'base64');
      res.setHeader('Content-Length', image.length);
      res.setHeader('Content-Type', 'image/png');
      return res.send(image);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.log(err);
      logger.captureException(err, (scope) => {
        scope.setContext('detail', { lang, username, code });
        scope.setTags({ lang, username });
      });

      return res.status(500).json({ msg: 'Something went wrong on our side.' });
    }
  })();
}
