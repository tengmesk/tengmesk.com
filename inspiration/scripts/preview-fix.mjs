#!/usr/bin/env node
/**
 * Final step of `npm run build:preview`, after ../scripts/relativize.mjs:
 * the preview host rejects any top-level name that starts with "_", so
 * hashed assets are already emitted to assets/ (astro.config, PREVIEW=1)
 * and this removes the Cloudflare-only `_headers` file. It then fails if
 * anything underscored is left at the top level.
 *
 *   node scripts/preview-fix.mjs dist-preview
 */
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist-preview');
for (const name of ['_headers']) {
  const p = join(root, name);
  if (existsSync(p)) {
    rmSync(p);
    console.log(`preview-fix: removed ${name}`);
  }
}
const left = readdirSync(root).filter((n) => n.startsWith('_'));
if (left.length) {
  console.error(`preview-fix: top-level names starting with "_" remain: ${left.join(', ')}`);
  process.exit(1);
}
console.log(`preview-fix: ${root} has no underscored top-level entries`);
