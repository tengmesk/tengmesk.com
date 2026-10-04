import type { ImageMetadata } from 'astro';
import { media, type Photo } from './media';

/**
 * Photo files are imported from assets/ (the originals stay the source) and
 * matched to media.yaml entries by their `file` path, so the YAML remains the
 * only place a photo is declared.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../../assets/photos/**/*.{webp,jpg,jpeg,png}', {
  eager: true,
});

const byFile = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  byFile.set(path.replace(/^\.\.\/\.\.\//, ''), mod.default);
}

export interface PhotoAsset {
  meta: Photo;
  src: ImageMetadata;
}

export function photoAsset(id: string): PhotoAsset {
  const meta = media.photos.find((p) => p.id === id);
  if (!meta) throw new Error(`media.yaml: unknown photo "${id}"`);
  const src = byFile.get(meta.file);
  if (!src) throw new Error(`photo "${id}": file not found at ${meta.file}`);
  return { meta, src };
}
