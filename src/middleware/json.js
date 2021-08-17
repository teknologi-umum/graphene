/**
 * Practical JSON parser middleware
 */
export const json =
  () =>
  /**
   * @param {import('polka').Request} req
   * @param {import('http').ServerResponse} res
   * @param {(err?: any) => void} next
   */
  async (req, res, next) => {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      req.body = JSON.parse(body);
      next();
    } catch (error) {
      next(error);
    }
  };
