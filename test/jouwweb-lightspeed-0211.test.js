// Contentcommit 2-11-2026 (MM 01-11 11:25, alleen SC-OK):
// 1) JouwWeb-actie terug met einddatum 30-11-2026 (L4), letterlijk van jouwweb.nl/prijzen (→ /tarieven, gerenderd 1-11-2026 NL-IP:
//    "* ACTIE t/m 30 nov 2026 — Eerste 12 maanden 50%, daarna het standaardtarief."), altijd ná de standaardprijs (L1), op de pagina's waar f0275ad haar weghaalde.
// 2) Lightspeed: maandprijs bij maandbetaling eerst (78/138/298), jaarbetaling (68/120/259) als zodanig benoemd; rekensom 12 × 78 = 936, 12 × 68 = 816.
// 3) Shopify (commit D, shopify.com/nl/prijzen gerenderd 1-11-2026: "Maandelijks betalen € 28 / € 78 / € 384 EUR/mnd", "Jaarlijks betalen € 21 / € 59 / € 289 EUR/mnd"):
//    maandbetaling eerst, jaarbetaling benoemd, ook in title/meta; rekensom 12 × 28 = 336, 12 × 21 = 252.
import test from 'node:test';
import { SP_PADEN } from '../src/l7-sc-punten-0411.mjs';
import assert from 'node:assert/strict';
import { EF_PADEN } from '../src/l7-externe-feedback-0311.mjs'; // op 3-11 opnieuw bijgewerkt: test/externe-feedback-0311.test.js
import { IDEAL_PADEN } from '../src/l7-ideal-blog-0311.mjs'; // op 3-11 opnieuw bijgewerkt (iDEAL-blog): test/ideal-blog-0311.test.js
import { LINKS_PADEN } from '../src/l7-interne-links-0511.mjs'; // op 5-11 opnieuw bijgewerkt: test/interne-links-0511.test.js
import { HB_PADEN } from '../src/l7-hostinger-blog-1611.mjs';
import { WN_PADEN } from '../src/l7-woocommerce-neutraal-1611.mjs';
import { F1_PADEN } from '../src/l7-f1-neutraal-1611.mjs'; // op 16-11 Hostinger-prijstekst: test/hostinger-blog-1611.test.js
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const tekst = (p) => read(`dist${p}index.html`).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const DATUM = '2026-11-02';
// Pagina's die op 4-11 opnieuw wijzigen (SC-punten 01-11) dragen de latere datum; zie test/sc-punten-0411.test.js.
const LATER_0411 = new Set([...SP_PADEN, '/blog/', '/blog/shopify-wix-jouwweb-kleine-webshop/']);
const JW = /Eerste 12 maanden 50%, daarna het standaardtarief\./;

test('JouwWeb-actie t/m 30-11-2026 op de drie pagina\'s, met einddatum en ná de standaardprijs', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const jw = tekst('/platformen/jouwweb/');
  assert.match(jw, /Actie tot en met 30 november 2026, volgens JouwWeb: "Eerste 12 maanden 50%, daarna het standaardtarief\."/);
  assert.ok(jw.indexOf('€ 10') < jw.indexOf('Actie tot en met 30 november 2026'));
  const k = tekst('/webshop-beginnen-kosten/');
  assert.match(k, /JouwWeb-actie tot en met 30 november 2026/); assert.match(k, JW);
  const b = tekst('/blog/shopify-wix-jouwweb-kleine-webshop/');
  assert.match(b, /Tot en met 30 november 2026 heeft JouwWeb een actie/); assert.match(b, JW);
  assert.match(b, /Prijs per maand Producten Actie tot en met 30 november 2026 \(eerste 12 maanden 50%, onze rekensom\)/);
  // Nergens een actie zonder einddatum: elke vermelding van de JouwWeb-actie staat naast '30 november 2026'.
  for (const f of files('dist')) { const t = read(f); if (/12 maanden 50%/.test(t)) assert.match(t, /30 november 2026/, f); }
});

// Alle zichtbare tekst + title/meta/og/alt + JSON-LD, per pagina, als één string (SC 01-11: ook title, meta, JSON-LD, tabellen en teasers).
const volledig = (f) => {
  const h = read(f);
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' | ');
  const body = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  const attrs = [...body.matchAll(/(?:content|alt|title)="([^"]*)"/g)].map((m) => m[1]).join(' | ');
  const title = (h.match(/<title>(.*?)<\/title>/) || [, ''])[1];
  return [title, attrs, ld, body.replace(/<[^>]+>/g, ' ')].join(' | ').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
};
// Een jaarprijs mag alleen met 'jaarbetaling' vlakbij (zelfde zin/cel), of in de Shopify-tabel met kolomkop 'Per maand bij jaarbetaling'.
const kaleJaarprijzen = (re, extra = () => false) => {
  const fout = [];
  for (const f of files('dist')) {
    const t = volledig(f);
    for (const m of t.matchAll(re)) {
      const ctx = t.slice(Math.max(0, m.index - 70), m.index + 45);
      const tabel = /Per maand bij maandbetaling Per maand bij jaarbetaling Verschil per jaar/.test(t.slice(Math.max(0, m.index - 260), m.index));
      if (!/jaarbetaling/.test(ctx) && !tabel && !extra(ctx)) fout.push(`${f}: ${ctx}`);
    }
  }
  return fout;
};

test('Lightspeed: geen jaarprijs (€ 68/120/259/816) zonder "jaarbetaling", ook niet in title/meta/JSON-LD', () => {
  assert.equal(12 * 78, 936); assert.equal(12 * 68, 816);
  // € 120 is ook JouwWeb Pro per jaar (12 × € 10).
  assert.deepEqual(kaleJaarprijzen(/€ (68|120|259|816)\b/g, (c) => /JouwWeb Pro (\(tot 10 producten\) )?(kost )?€ 120/.test(c)), []);
  const lt = volledig('dist/platformen/lightspeed/index.html');
  assert.match(lt, /Lightspeed kosten 2026: vanaf € 78 p\/m \(€ 68 jaarbetaling\)/);
  assert.match(lt, /Wat kost Lightspeed eCom\? Essential € 78, Advanced € 138, Professional € 298 per maand; bij jaarbetaling € 68, € 120 en € 259\. Plus alternatieven\./);
});

test('Shopify: geen jaarprijs (€ 21/59/289/252) zonder "jaarbetaling", ook niet in title/meta/JSON-LD; maandbetaling eerst', () => {
  assert.equal(12 * 28, 336); assert.equal(12 * 21, 252);
  assert.deepEqual(kaleJaarprijzen(/€ (21|59|289|252)\b/g), []);
  assert.match(tekst('/platformen/shopify/'), /Basic € 28 per maand € 21 per maand bij jaarbetaling Webshop/);
  assert.match(tekst('/platformen/shopify/'), /Grow € 78 per maand € 59 per maand bij jaarbetaling/);
  assert.match(tekst('/platformen/shopify/'), /Advanced € 384 per maand € 289 per maand bij jaarbetaling/);
  assert.match(tekst('/beste-webshop-platform/'), /Shopify € 28 \(€ 21 bij jaarbetaling\)/);
});

test('SC F2: kostennoot, stempel en rekensommen', () => {
  const k = tekst('/webshop-beginnen-kosten/');
  assert.match(k, /Shopify, Wix en Lightspeed: 12 × de maandprijs bij jaarbetaling \(onze rekensom\)\. Bij maandbetaling: Shopify 12 × € 28 = € 336, Lightspeed 12 × € 78 = € 936 \(onze rekensom/);
  assert.match(read('dist/webshop-beginnen-kosten/index.html'), /Prijzen gecontroleerd op <time datetime="2026-10-17">17 oktober 2026<\/time>, Lightspeed op <time datetime="2026-11-01">1 november 2026<\/time>, Mijndomein op/);
});

test('L7 2-11: pagina\'s met deze bodywijzigingen op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of ['/', '/platformen/jouwweb/', '/platformen/lightspeed/', '/vergelijken/', '/vergelijken/shopify-vs-lightspeed/', '/beste-webshop-platform/', '/webshop-beginnen-kosten/', '/blog/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/blog/b2b-webshop-beginnen/', '/blog/herroepingsknop-webshop/'].filter((x) => !EF_PADEN.has(x) && !IDEAL_PADEN.has(x) && !LATER_0411.has(x) && !LINKS_PADEN.has(x) && !HB_PADEN.has(x) && !WN_PADEN.has(x) && !F1_PADEN.has(x))) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
});

test('L7 2-11 (Shopify): pagina\'s met de Shopify-wijziging op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of ['/platformen/shopify/', '/vergelijken/shopify-vs-woocommerce/', '/beste-webshop-platform/', '/webshop-beginnen-kosten/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/blog/b2b-webshop-beginnen/'].filter((x) => !EF_PADEN.has(x) && !IDEAL_PADEN.has(x) && !LATER_0411.has(x) && !LINKS_PADEN.has(x) && !HB_PADEN.has(x) && !WN_PADEN.has(x) && !F1_PADEN.has(x))) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"${DATUM}"`), p);
  }
});
