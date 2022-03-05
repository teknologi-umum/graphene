import { Logtail } from "@logtail/node";
import type { Context, ILogtailLog } from "@logtail/types";

/**
 * Logger class wraps Logtail logger. It will use Logtail on production and Console on development.
 */
export class Logger {
  private readonly _logtailInstance: Console | Logtail;

  /**
   * @param token Logtail token. Should not be empty on production.
   */
  constructor(token: string | undefined) {
    const isTokenEmpty = token === null || token === undefined || token === "";
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && isTokenEmpty) {
      throw TypeError("Logtail token should not be empty in production!");
    }

    this._logtailInstance =
      isProduction && !isTokenEmpty ? new Logtail(token) : console;
  }

  warn(
    message: string,
    context: Context = {}
  ): Promise<ILogtailLog & Context> | void {
    return this._logtailInstance.warn(message, context);
  }
  info(
    message: string,
    context: Context = {}
  ): Promise<ILogtailLog & Context> | void {
    return this._logtailInstance.info(message, context);
  }
  error(
    message: string,
    context: Context = {}
  ): Promise<ILogtailLog & Context> | void {
    return this._logtailInstance.error(message, context);
  }
}

export const logger = new Logger(process.env.LOGTAIL_TOKEN);
