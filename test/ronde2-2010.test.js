// Ronde 2 (20-10-2026): voorzichtige vergoedingszin, leesbare bronlinks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');

test('privacy: vergoeding is een mogelijkheid ("kunnen ... krijgen"), geen zekerheid', () => {
  const s = read('src/privacy-avg.mjs');
  assert.doesNotMatch(s, /dan krijgen wij daardoor een vergoeding/);
  assert.match(s, /dan kunnen wij daardoor een vergoeding krijgen/);
});

test('footer: geen "score"', () => {
  assert.doesNotMatch(read('src/layout.mjs').match(/<p class="fine">.*?<\/p>/)[0], /score/i);
});

const pages = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? pages(p) : p.endsWith('.html') ? [p] : []; });

test('bronlinks: geen kale URL (domein/pad) als linktekst, o.a. WooCommerce', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const kaal = pages('dist').flatMap((f) => [...read(f).matchAll(/<a [^>]*>([^<]*)<\/a>/g)].map((m) => m[1]).filter((t) => /(^|: )[a-z0-9.-]+\.[a-z]{2,}\/\S/.test(t)).map((t) => `${f}: ${t}`));
  assert.deepEqual(kaal, []);
  const w = read('dist/platformen/woocommerce/index.html');
  for (const t of ['WooCommerce: Betaalmethoden in WooPayments (woocommerce.com)', 'WooCommerce: WooCommerce POS (woocommerce.com)']) assert.ok(w.includes(`>${t}</a>`), t);
});
