import http from 'http';
import { screenshot } from './utils/shot.js';
import logger from './utils/logger.js';

const corsDefault = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'HEAD, POST, PUT, PATCH',
  'Access-Control-Allow-Headers': ['content-type', 'accept'],
};

const server = http.createServer((req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    if (req?.method?.toUpperCase() === 'OPTIONS') {
      return res.writeHead(204, { 'Content-Length': 0, ...corsDefault }).end();
    }

    if (!data) {
      return res
        .writeHead(400, {
          'Content-Type': 'application/json',
          ...corsDefault,
        })
        .end(JSON.stringify({ msg: 'empty body is not allowed!!' }));
    }

    const { code, lang, username } = JSON.parse(data);
    let err = [];

    if (!code) err.push('`code`');
    if (!lang) err.push('`lang`');
    if (!username) err.push('`username`');

    if (err.length > 0) {
      return res
        .writeHead(400, {
          'Content-Type': 'application/json',
          ...corsDefault,
        })
        .end(JSON.stringify({ msg: err.join(' + ') + ' body parameter is required!' }));
    }

    (async () => {
      try {
        const base64 = await screenshot(code, lang, username);
        const image = Buffer.from(base64, 'base64');
        return res
          .writeHead(200, {
            'Content-Length': image.length,
            'Content-Type': 'image/png',
            ...corsDefault,
          })
          .end(image);
      } catch (err) {
        logger.captureException(err);

        return res
          .writeHead(500, {
            'Content-Type': 'application/json',
            ...corsDefault,
          })
          .end(JSON.stringify({ msg: 'Something went wrong on our side.' }));
      }
    })();
  });
});

if (process.env?.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000);
}

export default server;
