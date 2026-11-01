// Contentcommit 2-11-2026 (MM 01-11 11:25, alleen SC-OK):
// 1) JouwWeb-actie terug met einddatum 30-11-2026 (L4), letterlijk van jouwweb.nl/prijzen (→ /tarieven, gerenderd 1-11-2026 NL-IP:
//    "* ACTIE t/m 30 nov 2026 — Eerste 12 maanden 50%, daarna het standaardtarief."), altijd ná de standaardprijs (L1), op de pagina's waar f0275ad haar weghaalde.
// 2) Lightspeed: maandprijs bij maandbetaling eerst (78/138/298), jaarbetaling (68/120/259) als zodanig benoemd; rekensom 12 × 78 = 936, 12 × 68 = 816.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const tekst = (p) => read(`dist${p}index.html`).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const DATUM = '2026-11-02';
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
  assert.match(b, /Prijs per maand Producten Actie tot en met 30 november 2026 \(eerste 12 maanden\)/);
  // Nergens een actie zonder einddatum: elke vermelding van de JouwWeb-actie staat naast '30 november 2026'.
  for (const f of files('dist')) { const t = read(f); if (/12 maanden 50%/.test(t)) assert.match(t, /30 november 2026/, f); }
});

test('Lightspeed: geen kale jaarprijs meer, maandbetaling eerst, rekensom klopt', () => {
  assert.equal(12 * 78, 936); assert.equal(12 * 68, 816);
  for (const f of files('dist')) {
    const t = read(f).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    for (const m of t.matchAll(/€ (68|120|259|816)\b/g)) {
      const ctx = t.slice(Math.max(0, m.index - 70), m.index + 45);
      // Toegestaan: Lightspeed-jaarprijs met 'jaarbetaling' erbij, of JouwWeb Pro € 120 per jaar (12 × € 10).
      assert.match(ctx, /jaarbetaling|JouwWeb Pro (\(tot 10 producten\) )?(kost )?€ 120/, `${f}: ${ctx}`);
    }
  }
  assert.match(tekst('/webshop-beginnen-kosten/'), /Lightspeed: 12 × € 78, de maandprijs bij maandbetaling; bij jaarbetaling 12 × € 68 = € 816 \(onze rekensom/);
  assert.match(read('dist/platformen/lightspeed/index.html'), /<title>Lightspeed eCom kosten 2026: abonnement vanaf € 78 p\/m<\/title>/);
});

test('L7 2-11: pagina\'s met deze bodywijzigingen op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of ['/', '/platformen/jouwweb/', '/platformen/lightspeed/', '/vergelijken/', '/vergelijken/shopify-vs-lightspeed/', '/beste-webshop-platform/', '/webshop-beginnen-kosten/', '/blog/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/blog/b2b-webshop-beginnen/', '/blog/herroepingsknop-webshop/']) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
});
