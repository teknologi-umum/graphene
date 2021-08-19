/**
 * Practical JSON parser middleware
 * @type {import('polka').Middleware}
 */
export const json =
  () =>
  /**
   * @param {import('polka').Request} req
   * @param {import('http').ServerResponse} res
   * @param {import('polka').Next} next
   */
  async (req, res, next) => {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      req.body = JSON.parse(body);
      next();
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: 'Invalid JSON body' }));
    }
  };
