import { Logtail } from '@logtail/node';
import type { Context, ILogtailLog } from '@logtail/types';

const logtailInstance = new Logtail(String(process.env.LOGTAIL_TOKEN) || '');

const logtail = {
  warn(message: string, context: Context = {}): Promise<ILogtailLog & Context> | undefined {
    if (process.env.NODE_ENV !== 'production') return;
    return logtailInstance.warn(message, context);
  },
  info(message: string, context: Context = {}): Promise<ILogtailLog & Context> | undefined {
    if (process.env.NODE_ENV !== 'production') return;
    return logtailInstance.info(message, context);
  },
  error(message: string, context: Context = {}): Promise<ILogtailLog & Context> | undefined {
    if (process.env.NODE_ENV !== 'production') return;
    return logtailInstance.error(message, context);
  },
};

export default logtail;
