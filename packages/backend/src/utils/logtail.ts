import { Logtail } from "@logtail/node";
import type { Context, ILogtailLog } from "@logtail/types";
import { IS_TEST, LOGTAIL_TOKEN } from "~/constants";

/**
 * Logger class wraps Logtail logger. It will use Logtail when the token is provided and Console otherwise
 */
export class Logger {
  private readonly _loggerInstance: Logtail | Console;

  /**
   * @param token Logtail token. Should not be empty on production.
   */
  constructor(token: string | undefined) {
    const isTokenEmpty = token === null || token === undefined || token === "";
    this._loggerInstance = isTokenEmpty ? console : new Logtail(token);
  }

  warn(message: string, context: Context = {}): Promise<ILogtailLog & Context> | void {
    if (IS_TEST) return;
    return this._loggerInstance.warn(message, context);
  }
  info(message: string, context: Context = {}): Promise<ILogtailLog & Context> | void {
    if (IS_TEST) return;
    return this._loggerInstance.info(message, context);
  }
  error(message: string, context: Context = {}): Promise<ILogtailLog & Context> | void {
    if (IS_TEST) return;
    return this._loggerInstance.error(message, context);
  }
}

export const logger = new Logger(LOGTAIL_TOKEN);
