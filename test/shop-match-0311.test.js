// /shop-match/ indexering (SEO 02-11-2026): GSC gaf 'Gecrawld - momenteel niet geïndexeerd' (2-11, wisselend). De pagina was zonder JavaScript
// vooral een formulier. Nu: statische voorbeelden uit dezelfde matchlogica, vragen over de match en een title met 'webshopplatform kiezen'.
// L7: /shop-match/ heeft een bodywijziging, hub /gidsen/ schuift mee; lastmod en zichtbare bijgewerkt-regel op de pushdatum 5-11-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { score } from '../src/lib/match.js';
import { MAX_PRODUCTEN } from '../src/lib/platforms.js';

const read = (p) => readFileSync(p, 'utf8');
const DATUM = '2026-11-05';

test('shop-match: title, 1 h1, voorbeelden en vragen in de HTML zonder JavaScript', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const h = read('dist/shop-match/index.html');
  const title = h.match(/<title>([^<]*)<\/title>/)[1];
  assert.equal(title, 'Webshopplatform kiezen: keuzehulp in 5 vragen | ShopMatch');
  assert.ok(title.length <= 60, `title ${title.length}`);
  assert.equal((h.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((h.match(/property="og:image"/g) || []).length, 1);
  assert.match(h, /<link rel="canonical" href="https:\/\/shopmatch\.nl\/shop-match\/">/);
  assert.doesNotMatch(h, /name="robots"/);
  assert.match(h, /<h2>Voorbeelden: zo valt de match uit<\/h2>/);
  assert.match(h, /<h2>Veelgestelde vragen<\/h2>/);
  const main = h.match(/<main[\s\S]*<\/main>/)[0].replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  assert.ok(main.split(/\s+/).filter(Boolean).length >= 600, 'genoeg tekst zonder JavaScript');
});

test('shop-match: voorbeelden volgen de matchlogica (top 1 per situatie)', () => {
  const h = read('dist/shop-match/index.html');
  const top = (a) => score(a)[0].id;
  assert.equal(top({ doel: 'shop', producten: '10', budget: 'laag', techniek: 'geen', nl: 'nee' }), 'jouwweb');
  assert.equal(top({ doel: 'winkel', producten: 'meer', budget: 'hoog', techniek: 'wat', nl: 'ja' }), 'lightspeed');
  assert.match(h, /<h3>Starter met een kleine webshop<\/h3><p class="sub">Antwoorden: [^<]*<\/p><ol><li><a href="\/platformen\/jouwweb\/">JouwWeb<\/a>/);
});

test('L7 5-11: /shop-match/ en hub /gidsen/ met lastmod en zichtbare bijgewerkt-regel op de pushdatum', () => {
  for (const p of ['/shop-match/', '/gidsen/']) {
    assert.match(read('dist/sitemap.xml'), new RegExp(`<loc>https://shopmatch\\.nl${p}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
});

test('shop-match: FAQ \'er valt geen platform af\' bij meer dan 1.000 producten klopt met de data (match rekent met 5.000)', () => {
  for (const [id, max] of Object.entries(MAX_PRODUCTEN)) assert.ok((max ?? Infinity) >= 5000, id);
  const h = read('dist/shop-match/index.html');
  const items = [...h.match(/id="voorbeelden"[\s\S]*?<\/section>/)[0].matchAll(/<li>[\s\S]*?<\/li>/g)].map((m) => m[0]);
  assert.equal(items.length, 12);
  for (const li of items) assert.doesNotMatch(li, /€/, 'geen prijs zonder betaalbasis in een voorbeeldregel');
});
