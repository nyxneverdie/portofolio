import { cp, mkdir, rm } from 'node:fs/promises';
import './build.mjs';

// Vercel publishes only this directory, keeping source and local files private.
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('Asset', 'dist/Asset', { recursive: true });
console.log('Vercel static output prepared in dist/');
