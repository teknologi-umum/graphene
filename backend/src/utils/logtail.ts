import { Logtail } from "@logtail/node";
import type { Context, ILogtailLog } from "@logtail/types";

const logtailInstance = new Logtail(String(process.env.LOGTAIL_TOKEN) || "");

type WrapperHandler = (
  message: string,
  context: Context
) => Promise<ILogtailLog & Context> | undefined;
interface LogtailWrapper {
  warn: WrapperHandler;
  info: WrapperHandler;
  error: WrapperHandler;
}

export const logtail: LogtailWrapper = {
  warn(message, context = {}) {
    if (process.env.NODE_ENV !== "production") return;
    return logtailInstance.warn(message, context);
  },
  info(message, context = {}) {
    if (process.env.NODE_ENV !== "production") return;
    return logtailInstance.info(message, context);
  },
  error(message, context = {}) {
    if (process.env.NODE_ENV !== "production") return;
    return logtailInstance.error(message, context);
  }
};
