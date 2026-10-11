/**
 * NOTES.md → HTML for a detail page. Strips the frontmatter, drops the
 * leading h1 (the page already has the title) and shifts the remaining
 * headings down one level so the document outline stays valid.
 */
import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

export function renderNotes(md: string): string {
  let body = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  body = body.replace(/^\s*# .*\n/, '');
  // Shift ## → ###, ### → #### (and so on) before parsing.
  body = body.replace(/^(#{1,5}) /gm, (_m, h: string) => `${h}# `);
  const html = marked.parse(body, { async: false });
  // External links open in a new tab with rel=noopener (docs/CONSUMERS.md).
  return html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
}
