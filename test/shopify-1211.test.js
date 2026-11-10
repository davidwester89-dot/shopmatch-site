// Shopify-verdieping 12-11-2026 (SEO wk46): Plus, rekenvoorbeeld eerste jaar, tarieven per transactie, POS-link; L7-datum 12-11.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { SD_UPD, SD_PADEN } from '../src/l7-shopify-1211.mjs';
import { HB_UPD } from '../src/l7-hostinger-blog-1611.mjs';
const read = (f) => readFileSync(f, 'utf8');
const tekst = (p) => read(`dist${p}index.html`).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ');

test('Shopify-verdieping 12-11: Plus, rekensom, POS-link, title ongewijzigd', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  // Rekensommen kloppen.
  assert.equal(12 * 28, 336); assert.equal(12 * 21, 252); assert.equal(Math.round(240 * 29) / 100, 69.6);
  assert.equal(336 + 69.6, 405.6); assert.equal(252 + 69.6, 321.6); assert.equal(240 * 1.2, 288); assert.equal(0.02 * 12000, 240);
  assert.equal(12 * 2100, 25200); assert.equal(2100 - 384, 1716);
  const t = tekst('/platformen/shopify/');
  assert.match(t, /Wat kost Shopify Plus\?/);
  assert.match(t, /Rekenvoorbeeld: wat kost Shopify het eerste jaar\?/);
  assert.match(t, /Kosten per transactie en Shopify Payments/);
  assert.match(t, /Totaal eerste jaar € 405,60 € 321,60/);
  const h = read('dist/platformen/shopify/index.html');
  assert.match(h, /<title>Wat kost Shopify per maand\? Abonnementen en kosten 2026<\/title>/);
  assert.ok(h.includes('href="https://kassamatch.nl/aanbieders/shopify-pos/"'));
  for (const l of ['/vergelijken/shopify-vs-woocommerce/', '/vergelijken/shopify-vs-lightspeed/', '/webshop-beginnen-kosten/', '/blog/webshop-maken-met-ideal/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/shop-match/', '/vergelijken/']) assert.ok(h.includes(`href="${l}"`), l);
  // Geen nieuwe partnerlink in de verdieping: alleen de bestaande Shopify-knoppen (platform_top, platform_bottom).
  const v = h.slice(h.indexOf('Wat kost Shopify naast het abonnement?'), h.indexOf('class="out"'));
  assert.doesNotMatch(v, /rel="sponsored/);
});

test('L7: /platformen/shopify/ 16-11 door ALT_ZIN-bodywijziging; hub 16-11 door eigen body; datePublished 17-10', () => {
  const sm = read('dist/sitemap.xml');
  assert.ok(!SD_PADEN.has('/platformen/'));
  assert.deepEqual([...SD_PADEN], ['/platformen/shopify/']);
  // /platformen/shopify/ krijgt 16-11 (hbDatum na sdDatum) door de zichtbare ALT_ZIN-wijziging.
  for (const p of SD_PADEN) {
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${HB_UPD}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${HB_UPD}">`, 'i'), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"${HB_UPD}"`));
    assert.match(read(`dist${p}index.html`), /"datePublished": ?"2026-10-17"/);
  }
  // Hub /platformen/ heeft op 16-11 een eigen bodywijziging (Hostinger-prijstekst), niet alleen door dit Shopify-kind.
  assert.ok(sm.includes('<loc>https://shopmatch.nl/platformen/</loc><lastmod>2026-11-16</lastmod>'));
  assert.match(read('dist/platformen/index.html'), /bijgewerkt (?:op )?<time datetime="2026-11-16">/i);
  assert.doesNotMatch(read('dist/platformen/index.html'), /"dateModified": ?"2026-11-12"/);
});

// SEO-B1 45b6c11: de gelinkte blog spreekt de Shopify-pagina niet meer tegen (iDEAL € 0,29); L7 12-11 op die blog en hub /blog/.
test('SEO-B1 12-11: iDEAL € 0,29 in blog shopify-wix-jouwweb, blog en /blog/ op SD_UPD', () => {
  const b = tekst('/blog/shopify-wix-jouwweb-kleine-webshop/');
  assert.ok(b.includes('rekent Shopify volgens de prijspagina € 0,29 per betaling bij Basic, Grow en Advanced'));
  assert.ok(!b.includes('een vast bedrag noemt Shopify niet'));
  const sm = read('dist/sitemap.xml');
  const blogP = '/blog/shopify-wix-jouwweb-kleine-webshop/';
  assert.ok(sm.includes(`<loc>https://shopmatch.nl${blogP}</loc><lastmod>${SD_UPD}</lastmod>`), blogP);
  assert.match(read(`dist${blogP}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${SD_UPD}">`, 'i'));
  assert.match(read(`dist${blogP}index.html`), new RegExp(`"dateModified": ?"${SD_UPD}"`));
  // /blog/ body wijzigt door de nieuwere Hostinger-post (16-11); lastmod = max(updated) >= SD_UPD.
  const blogLm = sm.match(/<loc>https:\/\/shopmatch\.nl\/blog\/<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1];
  assert.ok(blogLm && blogLm >= SD_UPD, `/blog/ lastmod ${blogLm}`);
  assert.match(read('dist/blog/index.html'), new RegExp(`bijgewerkt (op )?<time datetime="${blogLm}">`, 'i'));
});
