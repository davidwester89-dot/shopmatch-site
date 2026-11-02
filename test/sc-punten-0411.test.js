// SC-punten 01-11 (review 5ad582a/ab996ba, punten 1-3) + filterregel /vergelijken/, pushdatum 2026-11-04.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { SP_UPD, SP_PADEN } from '../src/l7-sc-punten-0411.mjs';
const read = (f) => readFileSync(f, 'utf8');
const tekst = (p) => read(`dist${p}index.html`).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('SC-punten 01-11: kolomkop, stempels, Lightspeed-titel, filterregel', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  assert.match(tekst('/blog/shopify-wix-jouwweb-kleine-webshop/'), /Actie tot en met 30 november 2026 \(eerste 12 maanden 50%, onze rekensom\)/);
  assert.match(tekst('/platformen/jouwweb/'), /Prijzen gecontroleerd op 17 oktober 2026 ?, Lightspeed op 1 november 2026 ?, JouwWeb op 1 november 2026/);
  assert.match(tekst('/platformen/shopify/'), /Prijzen gecontroleerd op 17 oktober 2026[^.]*?, Shopify op 1 november 2026/);
  const t = read('dist/platformen/lightspeed/index.html').match(/<title>(.*?)<\/title>/)[1];
  assert.equal(t, 'Lightspeed kosten 2026: vanaf € 78 p/m (€ 68 jaarbetaling)'); assert.ok(t.length <= 60);
  assert.match(tekst('/vergelijken/'), /Noemt een aanbieder geen maximum aantal producten, dan filteren we zonder grens\./);
  // Klopt met de code: vergelijk.js behandelt data-max="nv" (niet vermeld) als Infinity.
  assert.match(read('src/assets/js/vergelijk.js'), /d\.max === 'inf' \|\| d\.max === 'nv' \? Infinity/);
});

test('L7 4-11: lastmod, zichtbare bijgewerkt-regel en dateModified', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of [...SP_PADEN, '/blog/', '/blog/shopify-wix-jouwweb-kleine-webshop/']) {
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${SP_UPD}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${SP_UPD}">`, 'i'), p);
    if (p !== '/blog/') assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${SP_UPD})`), p); // /blog/ heeft geen eigen dateModified (alleen die van de posts in de lijst)
  }
});

test('Regel D: /platformen/lightspeed/ alleen head-wijziging (titel), datum blijft 2026-11-03', () => {
  assert.ok(!SP_PADEN.has('/platformen/lightspeed/'));
  assert.ok(read('dist/sitemap.xml').includes('<loc>https://shopmatch.nl/platformen/lightspeed/</loc><lastmod>2026-11-03</lastmod>'));
  assert.match(read('dist/platformen/lightspeed/index.html'), /"dateModified": ?"2026-11-03"/);
});
