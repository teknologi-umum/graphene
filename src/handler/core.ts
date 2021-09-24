import type { Middleware } from 'polka';
import { validate } from '../logic/validate';
import { generateImage } from '../logic/generateImage';

export const coreHandler: Middleware = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const err = validate(req.body);
  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  const { image, format, length } = await generateImage(req.body);
  res.writeHead(200, { 'Content-Type': `image/${format}`, 'Content-Length': length }).end(image);
};
