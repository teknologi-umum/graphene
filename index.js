import http from 'http';
import { screenshot } from './utils/shot.js';

http
  .createServer((req, res) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const { code, lang, username } = JSON.parse(data);
      let err = '';

      if (!code) err += '`code` body parameter is required!';
      if (!lang) err += '`lang` body parameter is required!';
      if (!username) err += '`username` body parameter is required!';

      if (err) {
        return res
          .writeHead(400, {
            'Content-Type': 'application/json',
          })
          .end(JSON.stringify({ msg: err }));
      }

      (async () => {
        const base64 = await screenshot(code, lang, username);
        const image = Buffer.from(base64, 'base64');
        res
          .writeHead(200, {
            'Content-Length': image.length,
            'Content-Type': 'image/png',
          })
          .end(image);
      })();
    });
  })
  .listen(process.env.PORT || 3000);
