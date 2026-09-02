/* Servidor local para conferir o site antes de publicar. Sem dependências.
   Uso: node src/preview.mjs  →  http://localhost:4321 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.env.PORT) || 4321;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // normalize + prefixo impedem sair da raiz com ../
  let alvo = normalize(join(RAIZ, caminho));
  if (!alvo.startsWith(RAIZ)) { res.writeHead(403).end('Proibido'); return; }

  try {
    if ((await stat(alvo)).isDirectory()) alvo = join(alvo, 'index.html');
  } catch { /* trata abaixo */ }

  try {
    const corpo = await readFile(alvo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(alvo)] || 'application/octet-stream' });
    res.end(corpo);
  } catch {
    try {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(join(RAIZ, '404.html')));
    } catch { res.writeHead(404).end('404'); }
  }
}).listen(PORTA, () => console.log(`Site em http://localhost:${PORTA}`));
