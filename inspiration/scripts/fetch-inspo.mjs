#!/usr/bin/env node
/**
 * Make sure a webdesigninspo checkout exists, cloning or updating the CI
 * cache when it does not.
 *
 *   npm run fetch            # clone into .cache/webdesigninspo if nothing is found
 *   npm run fetch -- --pull  # also fast-forward an existing cache
 *
 * Honours INSPO_DIR (used as-is, never touched), INSPO_REPO (clone URL) and
 * INSPO_REF (branch, default main). A sibling checkout at ../webdesigninspo
 * is used as-is too: this script only ever writes inside .cache/.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { CACHE_DIR, INSPO_REF, INSPO_REPO, findInspoDir } from './lib/inspo-dir.mjs';

const git = (args, cwd) => execFileSync('git', args, { cwd, stdio: 'inherit' });

export function ensureInspoDir({ pull = false } = {}) {
  const found = findInspoDir();
  if (found && (found !== CACHE_DIR || !pull)) return found;
  if (existsSync(CACHE_DIR)) {
    console.log(`fetch: updating ${CACHE_DIR} (${INSPO_REF})`);
    git(['fetch', '--depth', '1', 'origin', INSPO_REF], CACHE_DIR);
    git(['reset', '--hard', 'FETCH_HEAD'], CACHE_DIR);
  } else {
    console.log(`fetch: cloning ${INSPO_REPO}#${INSPO_REF} into ${CACHE_DIR}`);
    mkdirSync(dirname(CACHE_DIR), { recursive: true });
    git(['clone', '--depth', '1', '--branch', INSPO_REF, INSPO_REPO, CACHE_DIR]);
  }
  if (!existsSync(`${CACHE_DIR}/manifest.json`)) throw new Error(`fetch: ${CACHE_DIR} has no manifest.json`);
  return CACHE_DIR;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const dir = ensureInspoDir({ pull: process.argv.includes('--pull') });
  console.log(`fetch: using ${dir}`);
}
