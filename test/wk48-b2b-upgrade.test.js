// Wk48-upgrade /blog/b2b-webshop-beginnen/ (push 27-11-2026, SEO: 'b2b webshop starten', 'beste b2b webshop').
// Tabel B2B-functies alleen uit vendorpagina's, H2 '5 stappen', FAQ zonder 'beste'-claim, briefinglinks, geen nieuwe knop, L7 27-11.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' });
const h = readFileSync('dist/blog/b2b-webshop-beginnen/index.html', 'utf8');
const md = readFileSync('content/blog/2026-10-17-b2b-webshop-beginnen.md', 'utf8');
test('b2b: title en meta ongewijzigd', () => {
  assert.match(md, /^seo_title: B2B-webshop maken of starten: welk platform\? \(2026\)$/m);
  assert.match(md, /^description: B2B-webshop maken\? JouwWeb vanaf € 10, Shopify vanaf € 28, Lightspeed vanaf € 298 per maand/m);
});
test('b2b: functietabel met vijf kolommen en vier platforms', () => {
  assert.ok(h.includes('B2B-functies naast elkaar'));
  for (const k of ['Prijzen per klant of klantgroep', 'Betalen op rekening', 'Minimale bestelling', 'Btw verleggen', 'Offerte']) assert.ok(h.includes(`<th>${k}</th>`) || h.includes(`>${k}</th>`), k);
  for (const p of ['JouwWeb', 'Shopify', 'Lightspeed eCom', 'WooCommerce + B2B for WooCommerce']) assert.ok(h.includes(`${p}</td>`), p);
});
test('b2b: H2 5 stappen en FAQ zonder beste-claim', () => {
  assert.ok(h.includes('B2B-webshop bouwen in 5 stappen</h2>'));
  assert.ok(h.includes('Welke B2B-webshopsoftware past bij een kleine zaak?'));
  assert.ok(!/\bbeste B2B/i.test(h.replace(/<title>[\s\S]*?<\/title>/, '')), 'geen beste-claim');
});
test('b2b: interne links uit de briefing', () => {
  for (const l of ['/vergelijken/shopify-vs-lightspeed/', '/vergelijken/shopify-vs-woocommerce/', '/platformen/shopify/', '/platformen/lightspeed/', '/beste-webshop-platform/', '/shop-match/']) assert.ok(h.includes(`href="${l}`), l);
});
test('b2b: geen nieuwe knoppen in de post-bron', () => {
  assert.deepEqual([...md.matchAll(/\{\{knop:([a-z]+)\}\}/g)].map((m) => m[1]), ['jouwweb', 'shopify', 'lightspeed', 'woocommerce']);
});
test('b2b: L7 2026-11-27 (dateModified, zichtbaar, lastmod); /blog/ tilt niet', () => {
  assert.match(h, /"dateModified": ?"2026-11-27"/);
  assert.match(h, /bijgewerkt (op )?<time datetime="2026-11-27">/i);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  assert.ok(sm.includes('<loc>https://shopmatch.nl/blog/b2b-webshop-beginnen/</loc><lastmod>2026-11-27</lastmod>'));
  assert.ok(!sm.includes('<loc>https://shopmatch.nl/blog/</loc><lastmod>2026-11-27</lastmod>'));
});
