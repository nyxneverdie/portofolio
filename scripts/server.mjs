import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf', '.map': 'application/json; charset=utf-8' };

export async function serveRequest(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/Asset/')) { res.writeHead(404).end('Not found'); return; }
  const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
  try {
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const content = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path).toLowerCase()] || 'application/octet-stream', 'Content-Length': content.length, 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); }
}

export function startServer() {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535');
  const server = createServer(serveRequest);
  server.on('error', error => { console.error(`Cannot start localhost server: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Portfolio running at http://localhost:${port}/ (press Ctrl+C to stop)`));
  return server;
}
