import type { Middleware } from "polka";
import yaml from "yaml";
import toml from "toml";
import gura from "gura";

/**
 * bodyParser is a middleware that parses the request body into various format.
 */
export const bodyParser: Middleware = async (req, res, next) => {
  try {
    let body = "";

    for await (const chunk of req) {
      body += chunk;
    }

    switch (req.headers["content-type"]) {
      case "application/x-www-form-urlencoded": {
        const url = new URLSearchParams(body);
        req.body = Object.fromEntries(url.entries());
        break;
      }
      case "application/toml":
      case "text/x-toml":
        req.body = toml.parse(body);
        break;
      case "application/x-yaml":
      case "text/yaml":
        req.body = yaml.parse(body);
        break;
      case "application/gura":
      case "text/gura":
        req.body = gura.parse(body);
        break;
      case "application/json":
      default:
        req.body = JSON.parse(body);
    }
    next();
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" }).end(
      JSON.stringify({
        msg: "Invalid body content with the Content-Type header specification"
      })
    );
  }
};
