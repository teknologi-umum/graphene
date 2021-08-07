import http from 'http';
import { screenshot } from './utils/shot.js';

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
    if (req?.method?.toUpperCase() === 'OPTIONS')
      return res.writeHead(204, { 'Content-Length': 0, ...corsDefault }).end();
    const { code, lang, username } = JSON.parse(data);
    let err = '';

    if (!code) err += '`code` body parameter is required!';
    if (!lang) err += '`lang` body parameter is required!';
    if (!username) err += '`username` body parameter is required!';

    if (err) {
      return res
        .writeHead(400, {
          'Content-Type': 'application/json',
          ...corsDefault,
        })
        .end(JSON.stringify({ msg: err }));
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
        return res
          .writeHead(500, {
            'Content-Type': 'application/json',
            ...corsDefault,
          })
          .end(JSON.stringify({ msg: err }));
      }
    })();
  });
});

if (process.env?.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 3000);
}

export default server;
