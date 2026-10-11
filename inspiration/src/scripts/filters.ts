/**
 * Progressive enhancement for Gallery.astro: reads ?cat=&tag= on load,
 * writes them back on change (replaceState, so Back is not polluted),
 * keeps the live count and shows the empty message. The actual hiding is
 * done by the CSS `:has()` rules too; `hidden` is set here as well so the
 * count and the message agree with what is on screen.
 */
const has = (list: string | undefined, v: string) => (list ?? '').split(' ').includes(v);

for (const g of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
  const inputs = [...g.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
  const items = [...g.querySelectorAll<HTMLElement>('.item')];
  const count = g.querySelector<HTMLElement>('[data-count]');
  const empty = g.querySelector<HTMLElement>('[data-empty]');
  const resets = g.querySelectorAll<HTMLAnchorElement>('[data-reset]');
  const names = ['cat', 'tag'] as const;
  const total = count?.textContent ?? '';

  const current = () => Object.fromEntries(names.map((n) => [n, inputs.find((i) => i.name === n && i.checked)?.value ?? ''])) as Record<(typeof names)[number], string>;

  const fromUrl = () => {
    const p = new URLSearchParams(location.search);
    for (const n of names) {
      const v = p.get(n) ?? '';
      const target = inputs.find((i) => i.name === n && i.value === v) ?? inputs.find((i) => i.name === n && i.value === '');
      if (target) target.checked = true;
    }
  };

  const apply = (writeUrl: boolean) => {
    const sel = current();
    let shown = 0;
    for (const it of items) {
      const ok = (!sel.cat || has(it.dataset.cat, sel.cat)) && (!sel.tag || has(it.dataset.tags, sel.tag));
      it.hidden = !ok;
      if (ok) shown++;
    }
    const filtered = Boolean(sel.cat || sel.tag);
    if (count) count.textContent = filtered ? `${shown} of ${total}` : total;
    if (empty) empty.hidden = shown > 0;
    for (const r of resets) if (r.closest('[data-status]')) r.hidden = !filtered;
    if (writeUrl) {
      const p = new URLSearchParams(location.search);
      for (const n of names) sel[n] ? p.set(n, sel[n]) : p.delete(n);
      const q = p.toString();
      history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}${location.hash}`);
    }
  };

  for (const i of inputs) i.addEventListener('change', () => apply(true));
  for (const r of resets) {
    r.addEventListener('click', (e) => {
      e.preventDefault();
      for (const i of inputs) if (i.value === '') i.checked = true;
      apply(true);
      inputs.find((i) => i.name === 'cat')?.focus();
    });
  }
  addEventListener('popstate', () => {
    fromUrl();
    apply(false);
  });
  fromUrl();
  apply(false);
}
