import type { Middleware } from 'polka';
import querystring from 'querystring';
import yaml from 'yaml';
import toml from 'toml';
import gura from 'gura';

/**
 * Practical JSON parser middleware
 */
export const parser: Middleware = async (req, res, next) => {
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    switch (req.headers['content-type']) {
      case 'application/x-www-form-urlencoded':
        req.body = querystring.parse(body);
        break;
      case 'application/toml':
      case 'text/x-toml':
        req.body = toml.parse(body);
        break;
      case 'application/x-yaml':
      case 'text/yaml':
        req.body = yaml.parse(body);
        break;
      case 'application/gura':
      case 'text/gura':
        req.body = gura.parse(body);
        break;
      case 'application/json':
      default:
        req.body = JSON.parse(body);
    }
    next();
  } catch (error) {
    res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ msg: 'Invalid body content with the Content-Type header specification' }));
  }
};
