import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { serveRequest } from './server.mjs';

const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
assert.ok(projects.length > 0, 'At least one project is required');
for (const project of projects) {
  assert.ok(project.title && project.image, 'Each project needs a title and image');
  if (project.image.startsWith('./')) await access(project.image);
}
for (const file of ['index.html', 'Asset/img/faris-portrait.svg', 'Asset/img/favicon.svg', 'Asset/dist/app.js', 'Asset/dist/app.css']) await access(file);
const source = await readFile('src/app.jsx', 'utf8');
assert.ok(source.includes('6287827659025'));
assert.ok(!source.includes('<Breakdown/>'));
async function request(path, method = 'GET') {
  let status, headers, body;
  await serveRequest({ url: path, method }, { writeHead(code, fields) { status = code; headers = fields; return this; }, end(value) { body = value; return this; } });
  return { status, headers, body };
}
assert.equal((await request('/')).status, 200);
assert.match((await request('/Asset/dist/app.css')).headers['Content-Type'], /^text\/css/);
assert.equal((await request('/missing-file')).status, 404);
assert.equal((await request('/', 'POST')).status, 405);
console.log('Checks passed: project assets, contact, build output and server responses.');
