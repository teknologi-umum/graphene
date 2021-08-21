import { proxyaddr, compile } from '@tinyhttp/proxy-addr';

/**
 * Get client's IP
 * @param {import('http').IncomingMessage} req
 * @returns {String} Client's IP
 */
export const getIP = (req) => {
  return proxyaddr(req, trustRemoteAddress(req.socket)).replace(/^.*:/, '');
};

/**
 * `req.connection` is deprecated on node 16.
 * Using req.socket instead.
 * @param {import('net').Socket} socket
 * @returns {never|boolean}
 */
const trustRemoteAddress = (socket) => {
  const val = socket.remoteAddress;

  if (typeof val === 'function') return val;
  if (typeof val === 'boolean' && val === true) return () => true;
  if (typeof val === 'number') return (_, i) => (val ? i < val : undefined);
  if (typeof val === 'string') return compile(val.split(',').map((x) => x.trim()));

  return compile(val || []);
};
