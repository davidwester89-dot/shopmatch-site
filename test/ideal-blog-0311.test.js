// Blog 'Webshop maken met iDEAL' (pushdatum 3-11-2026). Bedragen letterlijk van de bronpagina's, gerenderd 2-11-2026 vanaf een NL-IP:
// shopify.com/nl/prijzen ("iDEAL-tarieven 0% + € 0,29 EUR" Basic/Grow/Advanced, "0% + € 0,15 EUR" Plus; "Transactiekosten externe partij 2% 1% 0,6% 0,2%"),
// support.wix.com iDEAL-artikel ("2,5% + € 0,30"), mollie.com/nl/pricing ("iDEAL | Wero € 0,32"), stripe.com/nl/pricing ("€ 0,29 per betaling via iDEAL"),
// woocommerce.com WooPayments fees, Netherlands ("iDEAL | Wero €0.29"), ideal.nl/naar-wero ("Uiterlijk eind 2027 ...").
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { IDEAL_UPD, IDEAL_PADEN } from '../src/l7-ideal-blog-0311.mjs';

execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, BUILD_DATE: process.env.BUILD_DATE && process.env.BUILD_DATE > IDEAL_UPD ? process.env.BUILD_DATE : IDEAL_UPD } });
const read = (p) => readFileSync(p, 'utf8');
const P = 'dist/blog/webshop-maken-met-ideal/index.html';
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('iDEAL-blog: title, meta, H1 en byline volgens briefing', () => {
  const h = read(P);
  assert.match(h, /<title>Webshop maken met iDEAL: platforms en kosten per betaling<\/title>/);
  assert.match(h, /<meta name="description" content="Welke webshopplatforms hebben iDEAL ingebouwd en wat kost een betaling\? Shopify, Wix, JouwWeb, WooCommerce en meer naast elkaar, plus wat Wero verandert\.">/);
  assert.match(h, /Door Redactie ShopMatch · <time datetime="2026-11-03">/);
  assert.match(h, /"author": ?\{"@type": ?"Organization", ?"name": ?"Redactie ShopMatch"/);
  assert.equal((h.match(/property="og:image"/g) || []).length, 1);
});

test('iDEAL-blog: bedragen exact zoals de bronnen', () => {
  const t = tekst(read(P));
  for (const s of ['€ 0,29 bij Basic, Grow en Advanced; € 0,15 bij Plus', '2,5% + € 0,30', 'Mollie € 0,32', 'WooPayments € 0,29 in Nederland', '2% op Basic, 1% op Grow, 0,6% op Advanced en 0,2% op Plus', '€ 1,55 (2,5% van € 50 = € 1,25, plus € 0,30)', 'Uiterlijk eind 2027']) assert.ok(t.includes(s), s);
  assert.doesNotMatch(t, /\$|USD|dollar/);
});

test('iDEAL-blog: interne links uit de briefing en geen partnerlinks in de lopende tekst', () => {
  const h = read(P);
  for (const l of ['/shop-match/', '/vergelijken/', '/platformen/shopify/', '/platformen/wix/', '/platformen/jouwweb/', '/platformen/woocommerce/', '/platformen/lightspeed/', '/platformen/mijndomein/', '/platformen/hostinger/', '/webshop-beginnen-kosten/', '/gratis-website-maken/']) assert.ok(h.includes(`href="${l}"`), l);
  const art = h.slice(h.indexOf('<article'), h.indexOf('</article>'));
  assert.doesNotMatch(art, /sponsored/);
  assert.doesNotMatch(art, /reddit/i);
});

test('L7 3-11 (iDEAL-blog): lastmod, dateModified en zichtbare bijgewerkt-regel op de pushdatum (of later, als een latere commit de pagina weer bijwerkt)', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of IDEAL_PADEN) {
    const h = read(`dist${p}index.html`);
    const lm = sm.match(new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>(\\d{4}-\\d{2}-\\d{2})</lastmod>`))?.[1];
    const zicht = h.match(/bijgewerkt (?:op )?<time datetime="(\d{4}-\d{2}-\d{2})">/i)?.[1];
    const dm = h.match(/"dateModified": ?"(\d{4}-\d{2}-\d{2})"/)?.[1];
    assert.ok(lm && lm >= IDEAL_UPD, `${p} lastmod ${lm}`);
    assert.equal(zicht, lm, `${p} zichtbaar ${zicht} = lastmod ${lm}`);
    if (p !== '/blog/') assert.equal(dm, lm, `${p} dateModified ${dm} = lastmod ${lm}`);
  }
  // 5-11: bronlinks Wero/Shopify/Wix hersteld (bodywijziging) → post op de pushdatum 2026-11-05 (test/ideal-bronlinks-0511.test.js).
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/blog\/webshop-maken-met-ideal\/<\/loc><lastmod>2026-11-05<\/lastmod>/);
});
