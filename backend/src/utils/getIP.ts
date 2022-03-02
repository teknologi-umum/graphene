import { proxyaddr, compile } from '@tinyhttp/proxy-addr';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';

/**
 * getIP is a function that gets the client's IP
 * @param req - The incoming request
 * @returns {string} Client's IP
 */
export const getIP = (req: IncomingMessage): string => {
  const trust = trustRemoteAddress(req.socket);
  return proxyaddr(req, trust).replace(/^.*:/, '');
};

type TrustFunction = (addr: string) => boolean;

/**
 * @param socket - The net.Socket object associated with the request
 * @returns {boolean}
 */
function trustRemoteAddress(socket: Socket): TrustFunction {
  const addresses = socket.remoteAddress;

  if (addresses !== undefined) {
    return compile(addresses.split(',').map((x) => x.trim()));
  }

  return compile([]);
}
