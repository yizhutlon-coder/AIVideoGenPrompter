// Read-only loopback server for the guided-first draft.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const preview = dirname(fileURLToPath(import.meta.url));
const root = dirname(preview);
const port = 8766;
const pages = new Map([
  ['/', join(preview, 'PromptStudio.html')],
  ['/PromptStudio.html', join(preview, 'PromptStudio.html')],
  ['/tools/WalkThrough.html', join(preview, 'tools', 'WalkThrough.html')],
  ...['H3Builder.html','H3Studio.html','ClipPicker.html','ClipStitcher.html','MetaInspector.html','video-prompt-translator.html']
    .map(name => ['/tools/' + name, join(root, 'tools', name)])
]);
const csp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
  "img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; " +
  "frame-src 'self'; frame-ancestors 'self'; connect-src http://localhost:11434 " +
  "http://127.0.0.1:11434 http://127.0.0.1:8188; " +
  "object-src 'none'; base-uri 'none'; form-action 'none'";

createServer((request, response) => {
  if (request.headers.host !== `127.0.0.1:${port}`) {
    response.writeHead(400).end(); return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
  }
  let route;
  try { route = new URL(request.url, `http://127.0.0.1:${port}`).pathname; }
  catch { response.writeHead(400).end(); return; }
  const file = pages.get(route);
  if (route !== '/__health' && (!file || !existsSync(file))) {
    response.writeHead(404).end(); return;
  }
  const body = route === '/__health' ? Buffer.from(preview, 'utf8') : readFileSync(file);
  response.writeHead(200, {
    'Content-Type': route === '/__health' ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8',
    'Content-Length': body.length,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': csp
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Guided-first preview ready at http://127.0.0.1:${port}/PromptStudio.html\n`);
});
