// Squarespace uit de vergelijking (afgewezen, 26-10-2026): doorverwijzing, tellingen, selectietekst en de match.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { IDS } from '../src/lib/platforms.js';
import { VRAGEN, score } from '../src/lib/match.js';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const STUB = 'dist/platformen/squarespace/index.html';

test('Squarespace weg: 7 platforms, doorverwijzing naar /platformen/, niet in sitemap', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  assert.equal(IDS.length, 7); assert.ok(!IDS.includes('squarespace'));
  const r = readFileSync(STUB, 'utf8');
  assert.match(r, /<meta http-equiv="refresh" content="0; url=\/platformen\/">/);
  assert.match(r, /<link rel="canonical" href="https:\/\/shopmatch.nl\/platformen\/">/);
  assert.match(r, /<meta name="robots" content="noindex">/);
  assert.match(r, /location\.replace\("\/platformen\/"\)/); assert.match(r, /<a href="\/platformen\/">/);
  assert.ok(!/squarespace/i.test(readFileSync('dist/sitemap.xml', 'utf8')));
  for (const f of walk('dist').filter((x) => x !== STUB && /\.(html|xml|js|txt)$/.test(x))) assert.ok(!/squarespace/i.test(readFileSync(f, 'utf8')), `${f} noemt Squarespace`);
  const home = readFileSync('dist/index.html', 'utf8');
  assert.match(home, /Zeven platforms naast elkaar/); assert.match(home, /Vergelijk alle 7 platforms/); assert.match(home, /Deze 7 platforms vergelijken we/);
  for (const f of walk('dist').filter((x) => x.endsWith('.html'))) assert.ok(!/\b(8|acht) (webshop)?platforms\b|Acht (platforms|manieren)/i.test(readFileSync(f, 'utf8')), `${f}: oude telling`);
  assert.match(readFileSync('dist/over/index.html', 'utf8'), /We vergelijken ook aanbieders waar we niet aan verdienen\./);
  assert.doesNotMatch(readFileSync('dist/over/index.html', 'utf8'), /verdwijnt alleen/);
});

test('match: elk antwoordprofiel geeft een volledige top 3', () => {
  const combis = VRAGEN.reduce((acc, v) => acc.flatMap((a) => v.opties.map(([val]) => ({ ...a, [v.id]: val }))), [{}]);
  assert.equal(combis.length, 4 * 5 * 3 * 3 * 2);
  for (const a of combis) {
    const top = score(a).slice(0, 3);
    assert.equal(top.length, 3, JSON.stringify(a));
    for (const t of top) { assert.ok(IDS.includes(t.id)); assert.ok(Number.isFinite(t.score) && Number.isFinite(t.prijs), JSON.stringify(a)); }
    assert.equal(new Set(top.map((t) => t.id)).size, 3);
  }
});
