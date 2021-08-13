import http from 'http';
import { screenshot } from './utils/screenshot.js';
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
    switch (req?.method?.toUpperCase()) {
      case 'OPTIONS': {
        return res.writeHead(204, { 'Content-Length': 0, ...corsDefault }).end();
      }
      case 'GET': {
        return res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' }).end('<h1>coming soon!</h1>', 'utf-8');
      }
      default: {
        if (!data) {
          return res
            .writeHead(400, {
              'Content-Type': 'application/json',
              ...corsDefault,
            })
            .end(JSON.stringify({ msg: 'empty body is not allowed!!' }));
        }

        const { code, lang, username } = JSON.parse(data);
        const err = [];

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
            logger.captureException(err, (scope) => {
              scope.setContext('detail', { lang, username, code, payload: data });
              scope.setTags({ lang, username });
              return scope;
            });

            return res
              .writeHead(500, {
                'Content-Type': 'application/json',
                ...corsDefault,
              })
              .end(JSON.stringify({ msg: 'Something went wrong on our side.' }));
          }
        })();
      }
    }
  });
});

if (process.env?.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000);
}

export default server;
