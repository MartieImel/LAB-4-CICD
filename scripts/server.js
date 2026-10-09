import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { buildGreeting } from '../src/greeting.js';

const port = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);

  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (url.pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (url.pathname === '/api/hello') {
    const name = url.searchParams.get('name') ?? 'mundo';

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify({ message: buildGreeting(name) }));
    return;
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      const html = await readFile('public/index.html');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.end(html);
    } catch {
      res.writeHead(500);
      res.end('Erro ao carregar a página');
    }
    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Servidor em http://127.0.0.1:${port}`);
});