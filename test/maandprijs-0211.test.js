// Match en kaarten op de maandprijs bij maandbetaling (MM-besluit 01-11-2026 11:05, zelfde regel als TM 30-10), pushdatum 2-11-2026.
// Bronnen gerenderd 1-11-2026 (NL-IP, headless Chrome, toggles geklikt): shopify.com/nl/prijzen "Maandelijks betalen € 28 EUR/mnd";
// lightspeedhq.nl/ecommerce/prijzen/ tab Maandelijks 78/138/298 (Jaarlijks 68/120/259); mijndomein.nl/producten/webshop Maandelijks 15/29,50/43,50 (excl. btw).
// Wix (alleen jaarabonnementen), JouwWeb ("gelden bij jaarlijkse betaling") en Hostinger ("Alle plannen worden vooraf betaald"): getoonde prijs blijft.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EF_PADEN } from '../src/l7-externe-feedback-0311.mjs';
import { WN_PADEN } from '../src/l7-woocommerce-neutraal-1611.mjs'; // op 3-11 opnieuw bijgewerkt: test/externe-feedback-0311.test.js
import { readFileSync } from 'node:fs';
import { verkoopPrijs, score } from '../src/lib/match.js';
import { VERKOOP_VANAF, PLATFORMS } from '../src/lib/platforms.js';

const read = (p) => readFileSync(p, 'utf8');
const DATUM = '2026-11-02';

test('verkoopPrijs = maandprijs bij maandbetaling waar de aanbieder die toont', () => {
  assert.deepEqual([verkoopPrijs('mijndomein', 0), verkoopPrijs('mijndomein', 100), verkoopPrijs('mijndomein', 5000)], [15, 29.5, 43.5]);
  assert.deepEqual([verkoopPrijs('lightspeed', 0), verkoopPrijs('lightspeed', 1000), verkoopPrijs('lightspeed', 10000)], [78, 138, 298]);
  assert.equal(verkoopPrijs('shopify', 0), 28);
  // Alleen een prijs bij jaarbetaling of vooruitbetaling getoond: blijft staan.
  assert.deepEqual([verkoopPrijs('wix', 0), verkoopPrijs('jouwweb', 0), verkoopPrijs('jouwweb', 100), verkoopPrijs('hostinger', 0), verkoopPrijs('woocommerce', 0)], [25, 10, 20, 16.99, 0]);
  assert.equal(PLATFORMS.shopify.vanaf, VERKOOP_VANAF.shopify);
  assert.equal(PLATFORMS.lightspeed.vanaf, VERKOOP_VANAF.lightspeed);
  assert.doesNotMatch(read('src/lib/match.js'), /€ 522/);
});

test('uitslag toont de nieuwe maandprijs (Mijndomein Plus € 29,50)', () => {
  const r = score({ doel: 'shop', producten: '100', budget: 'mid', techniek: 'geen', nl: 'ja' });
  assert.equal(r.find((x) => x.id === 'mijndomein').prijs, 29.5);
});

test('L7 2-11: pagina\'s met gewijzigde kaartprijzen op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  // /shop-match/ is op 5-11 opnieuw bijgewerkt (voorbeelden en vragen); die datum test test/shop-match-0311.test.js.
  const PAGINAS = ['/', '/platformen/', '/vergelijken/', '/vergelijken/shopify-vs-lightspeed/', '/vergelijken/shopify-vs-woocommerce/', ...Object.keys(PLATFORMS).map((id) => `/platformen/${PLATFORMS[id].slug}/`)];
  for (const p of PAGINAS.filter((x) => !EF_PADEN.has(x) && !WN_PADEN.has(x))) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
  for (const p of ['/vergelijken/shopify-vs-lightspeed/', '/platformen/shopify/', '/platformen/lightspeed/'].filter((x) => !EF_PADEN.has(x) && !WN_PADEN.has(x))) assert.match(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"${DATUM}"`), p);
  assert.match(read('dist/platformen/lightspeed/index.html'), /Prijzen gecontroleerd op <time datetime="2026-10-17">17 oktober 2026<\/time>, Lightspeed op <time datetime="2026-11-01">1 november 2026<\/time>/);
});
