import { mkdir, writeFile } from 'node:fs/promises';

const output = {
  name: 'github-actions-vercel-pipeline',
  version: '1.0.0',
  buildTime: new Date().toISOString(),
  nodeVersion: process.version
};

await mkdir('public', { recursive: true });

await writeFile(
  'public/build-info.json',
  `${JSON.stringify(output, null, 2)}\n`
);

console.log('Build concluído: public/build-info.json');