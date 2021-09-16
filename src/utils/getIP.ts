import { proxyaddr, compile } from '@tinyhttp/proxy-addr';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';

/**
 * Get client's IP
 * @param {import('http').IncomingMessage} req
 * @returns {String} Client's IP
 */
export const getIP = (req: IncomingMessage): string => {
  return proxyaddr(req, trustRemoteAddress(req.socket)).replace(/^.*:/, '');
};

/**
 * `req.connection` is deprecated on node 16.
 * Using req.socket instead.
 * @param {import('net').Socket} socket
 * @returns {boolean}
 */
const trustRemoteAddress = (socket: Socket): ((addr: string) => boolean) => {
  const val = socket.remoteAddress;

  if (typeof val === 'string') return compile(val.split(',').map((x) => x.trim()));

  return compile(val || []);
};
