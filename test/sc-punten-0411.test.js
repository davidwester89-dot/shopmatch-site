// SC-punten 01-11 (review 5ad582a/ab996ba, punten 1-3) + filterregel /vergelijken/, pushdatum 2026-11-04.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { SP_UPD, SP_PADEN } from '../src/l7-sc-punten-0411.mjs';
import { SD_PADEN } from '../src/l7-shopify-1211.mjs'; // op 12-11 opnieuw bijgewerkt (Shopify-verdieping): test/shopify-1211.test.js
import { HB_PADEN } from '../src/l7-hostinger-blog-1611.mjs';
import { WN_PADEN } from '../src/l7-woocommerce-neutraal-1611.mjs'; // /platformen/ en /vergelijken/ 16-11: test/hostinger-blog-1611.test.js
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
  // Hub /blog/ = nieuwste kind (regel D): 4-11 of later (5-11 schuift de iDEAL-post naar 2026-11-05).
  const blog = sm.match(/<loc>https:\/\/shopmatch\.nl\/blog\/<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1];
  assert.ok(blog && blog >= SP_UPD, `/blog/ lastmod ${blog}`);
  assert.match(read('dist/blog/index.html'), new RegExp(`bijgewerkt (op )?<time datetime="${blog}">`, 'i'), '/blog/');
  for (const p of [...SP_PADEN].filter((x) => !SD_PADEN.has(x) && !HB_PADEN.has(x) && !WN_PADEN.has(x))) { // HB: /platformen/ en /vergelijken/ 16-11, eigen Hostinger-bodywijziging
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${SP_UPD}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${SP_UPD}">`, 'i'), p);
    if (p !== '/blog/') assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${SP_UPD})`), p); // /blog/ heeft geen eigen dateModified (alleen die van de posts in de lijst)
  }
  // 6-11: title/meta + hub-CTA → post updated 2026-11-06 (of later); exact SP_UPD niet meer vast
  {
    const p = '/blog/shopify-wix-jouwweb-kleine-webshop/';
    const lm = sm.match(new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>(\\d{4}-\\d{2}-\\d{2})</lastmod>`))?.[1];
    const h = read(`dist${p}index.html`);
    const zicht = h.match(/bijgewerkt (?:op )?<time datetime="(\d{4}-\d{2}-\d{2})">/i)?.[1];
    const dm = h.match(/"dateModified": ?"(\d{4}-\d{2}-\d{2})"/)?.[1];
    assert.ok(lm && lm >= SP_UPD, `${p} lastmod ${lm}`);
    assert.equal(zicht, lm, `${p} zichtbaar`);
    assert.equal(dm, lm, `${p} dateModified`);
  }
});

test('Regel D: /platformen/lightspeed/ alleen head-wijziging (titel), datum blijft 2026-11-03', () => {
  assert.ok(!SP_PADEN.has('/platformen/lightspeed/'));
  assert.ok(read('dist/sitemap.xml').includes('<loc>https://shopmatch.nl/platformen/lightspeed/</loc><lastmod>2026-11-03</lastmod>'));
  assert.match(read('dist/platformen/lightspeed/index.html'), /"dateModified": ?"2026-11-03"/);
});
