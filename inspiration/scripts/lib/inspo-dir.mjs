/**
 * Where the content repository (tengmesk/webdesigninspo) lives on disk.
 *
 * Order: `INSPO_DIR` from the environment, then the sibling checkout
 * `../webdesigninspo` next to this repository, then the CI cache
 * `inspiration/.cache/webdesigninspo` that `npm run fetch` (or `npm run
 * sync`) clones when neither exists. The directory must contain
 * manifest.json; nothing in it is ever written to.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The inspiration/ project directory. Scripts derive it from this file's
 * location; code bundled by Vite passes it in explicitly (see astro.config),
 * because a bundled chunk's import.meta.url points into dist/.
 */
export const INSPIRATION_DIR = resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const cacheDir = (base = INSPIRATION_DIR) => resolve(base, '.cache/webdesigninspo');
export const siblingDir = (base = INSPIRATION_DIR) => resolve(base, '../../webdesigninspo');
export const CACHE_DIR = cacheDir();
export const SIBLING_DIR = siblingDir();
export const INSPO_REPO = process.env.INSPO_REPO || 'https://github.com/tengmesk/webdesigninspo';
export const INSPO_REF = process.env.INSPO_REF || 'main';

const isCheckout = (dir) => existsSync(resolve(dir, 'manifest.json'));

/** Candidate directories in priority order, with the reason each is a candidate. */
export function candidates(base = INSPIRATION_DIR) {
  const list = [];
  if (process.env.INSPO_DIR) list.push({ dir: resolve(process.env.INSPO_DIR), why: 'INSPO_DIR' });
  list.push({ dir: siblingDir(base), why: 'sibling checkout ../webdesigninspo' });
  list.push({ dir: cacheDir(base), why: 'CI cache (npm run fetch)' });
  return list;
}

/** First candidate that holds a manifest.json, or null. */
export function findInspoDir(base = INSPIRATION_DIR) {
  if (process.env.INSPO_DIR) {
    const dir = resolve(process.env.INSPO_DIR);
    if (!isCheckout(dir)) {
      throw new Error(`INSPO_DIR=${process.env.INSPO_DIR} does not contain manifest.json`);
    }
    return dir;
  }
  for (const c of candidates(base)) if (isCheckout(c.dir)) return c.dir;
  return null;
}

/** Resolve or fail with the three places that were tried. */
export function resolveInspoDir(base = INSPIRATION_DIR) {
  const dir = findInspoDir(base);
  if (dir) return dir;
  const tried = candidates(base)
    .map((c) => `  - ${c.dir}  (${c.why})`)
    .join('\n');
  throw new Error(
    `webdesigninspo checkout not found. Tried:\n${tried}\n` +
      `Set INSPO_DIR, clone the repo next to this one, or run \`npm run fetch\` inside inspiration/.`,
  );
}
