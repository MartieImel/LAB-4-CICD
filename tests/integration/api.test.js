import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

test('API local responde corretamente', async t => {
  const port = 3100 + Math.floor(Math.random() * 1000);

  const server = spawn(
    process.execPath,
    ['scripts/server.js'],
    {
      env: { ...process.env, PORT: String(port) },
      stdio: 'ignore'
    }
  );

  const base = `http://127.0.0.1:${port}`;

  t.after(() => {
    server.kill();
  });

  let ready = false;

  for (let i = 0; i < 50; i++) {
    if (server.exitCode !== null) {
      throw new Error('Servidor encerrou antes de iniciar');
    }

    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // O servidor ainda pode estar inicializando.
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  assert.equal(ready, true, 'Servidor não iniciou a tempo');

  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const greeting = await fetch(`${base}/api/hello?name=Ana`);
  assert.equal(greeting.status, 200);
  assert.deepEqual(await greeting.json(), {
    message: 'Olá, Ana!'
  });

  const fallback = await fetch(`${base}/api/hello`);
  assert.deepEqual(await fallback.json(), {
    message: 'Olá, mundo!'
  });

  const notFound = await fetch(`${base}/rota-inexistente`);
  assert.equal(notFound.status, 404);
});