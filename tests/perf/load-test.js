import autocannon from 'autocannon';
import { spawn } from 'node:child_process';

const port = 4100;
const server = spawn(
  process.execPath,
  ['scripts/server.js'],
  {
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  }
);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

try {
  let ready = false;

  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(
        `http://127.0.0.1:${port}/api/health`
      );

      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // Continua aguardando o servidor.
    }

    await sleep(100);
  }

  if (!ready) {
    throw new Error('Servidor não iniciou');
  }

  const result = await new Promise((resolve, reject) => {
    autocannon({
      url: `http://127.0.0.1:${port}`,
      connections: 10,
      duration: 5,
      requests: [
        { method: 'GET', path: '/api/health' },
        { method: 'GET', path: '/api/hello?name=Ana' }
      ]
    }, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

  console.log(JSON.stringify({
    requestsPerSecond: result.requests.average,
    latencyP99: result.latency.p99,
    errors: result.errors,
    timeouts: result.timeouts,
    non2xx: result.non2xx
  }, null, 2));

  if (
    result.errors > 0 ||
    result.timeouts > 0 ||
    result.non2xx > 0 ||
    result.requests.average < 500 ||
    result.latency.p99 > 100
  ) {
    throw new Error('Os critérios de performance não foram atendidos');
  }
} finally {
  server.kill();
}