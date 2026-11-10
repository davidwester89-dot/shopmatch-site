// F2 Hostinger-prijsherstel (SC + MM 10-11-2026), push 16-11: verlengprijzen, neutrale instaptekst, matchbasis 9.99/16.99.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PLATFORMS, VERKOOP_VANAF, BEST_FOR } from '../src/lib/platforms.js';
import { INSTAP_ZIE_HOSTINGER } from '../src/parts.mjs';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const tekst = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('MM-prijsbasis: vanaf 9.99, VERKOOP_VANAF 16.99, vanafTekst en btw exclusief volgens prijspagina', () => {
  assert.equal(PLATFORMS.hostinger.vanaf, 9.99);
  assert.equal(VERKOOP_VANAF.hostinger, 16.99);
  assert.equal(PLATFORMS.hostinger.vanafTekst, '€ 9,99 per maand (Premium, verlenging na de eerste looptijd; actuele instapprijs: zie Hostinger)');
  assert.equal(INSTAP_ZIE_HOSTINGER, 'Hostinger: bekijk de actuele instapprijs en looptijd bij de aanbieder.');
  assert.match(PLATFORMS.hostinger.prijsNoot, /Hostinger toont voor verlenging na de eerste looptijd: Premium € 9,99 per maand, Onbeperkt € 16,99 per maand en Cloud Startup € 23,99 per maand, voor dezelfde looptijd/);
  assert.match(PLATFORMS.hostinger.prijsNoot, /exclusief btw \(volgens de prijspagina van Hostinger\)/);
  assert.equal(PLATFORMS.hostinger.btw, undefined);
  assert.equal(BEST_FOR.hostinger, 'Eenvoudige site of kleine shop');
  assert.deepEqual(PLATFORMS.hostinger.plus, ['30 dagen geld-teruggarantie', 'Gratis domeinnaam bij jaarpakketten', '24/7 ondersteuning']);
  assert.ok(!PLATFORMS.hostinger.plus.includes('Laagste instapprijs'));
});


test('F2: geen Hostinger-introprijzen sitebreed, wel verlengprijzen en SC-zin', () => {
  const verboden = /€ 2,99|€ 3,99|€ 7,99|€ 143,52|€ 191,52|€ 383,52|€ 1,99/;
  const hPaginas = [
    '/platformen/hostinger/',
    '/beste-webshop-platform/',
    '/gratis-website-maken/',
    '/website-maken-zzp/',
    '/webshop-beginnen-kosten/',
    '/platformen/',
    '/vergelijken/',
    '/',
    '/blog/hostinger-website-webshop-kosten/',
  ];
  for (const p of hPaginas) {
    const h = read(`dist${p}index.html`);
    const vis = tekst(h);
    assert.doesNotMatch(vis, verboden, p);
    if (p !== '/blog/hostinger-website-webshop-kosten/') {
      assert.ok(vis.includes(INSTAP_ZIE_HOSTINGER) || vis.includes('Bekijk de actuele instapprijs'), p);
    }
  }
  const plat = read('dist/platformen/hostinger/index.html');
  assert.match(plat, /<th>Plan<\/th><th>Verlenging na de eerste looptijd<\/th><th>Looptijd en actuele instapprijs: zie Hostinger<\/th>/);
  assert.match(plat, /Premium[\s\S]*€ 9,99 per maand/);
  assert.match(plat, /Onbeperkt[\s\S]*€ 16,99 per maand/);
  assert.match(plat, /Cloud Startup[\s\S]*€ 23,99 per maand/);
  const post = read('dist/blog/hostinger-website-webshop-kosten/index.html');
  assert.match(tekst(post), /Voor de actuele instapprijs, de looptijd en het bedrag dat je vooraf betaalt/);
  assert.match(tekst(post), /exclusief btw \(volgens de prijspagina van Hostinger\)/);
  const vg = tekst(read('dist/vergelijken/index.html'));
  assert.ok(vg.includes('Hostinger exclusief btw (volgens de prijspagina van Hostinger)'));
  assert.doesNotMatch(vg, /Lightspeed, Hostinger en WooCommerce vermelden het in de opgehaalde prijstekst niet/);
  assert.match(vg, /Shopify, Lightspeed en WooCommerce vermelden het in de opgehaalde prijstekst niet/);
  assert.doesNotMatch(vg, /Laagste instapprijs/);
  assert.ok(vg.includes('Eenvoudige site of kleine shop'));
  const shop = read('dist/platformen/shopify/index.html');
  assert.ok(shop.includes('Wil je klein en goedkoper starten? Kijk dan ook naar'));
  assert.ok(shop.includes('href="/platformen/hostinger/">Hostinger</a>, of naar <a href="/platformen/wix/">Wix</a> als je veel ontwerpvrijheid wilt.'));
  assert.doesNotMatch(shop, /het platform met de laagste instapprijs/);
  assert.match(shop, /"dateModified": ?"2026-11-16"/);
  assert.match(shop, /"datePublished": ?"2026-10-17"/);
  assert.match(shop, /Laatst bijgewerkt <time datetime="2026-11-16">16 november 2026<\/time>/);
  const platH = tekst(read('dist/platformen/hostinger/index.html'));
  assert.ok(platH.includes('Eenvoudige site of kleine shop'));
  assert.doesNotMatch(platH, /Laagste instapprijs/);
  const home = tekst(read('dist/index.html'));
  assert.ok(home.includes('Hosting inbegrepen. Laagste maandprijs van de hosted platforms, bij jaarbetaling.'));
  assert.doesNotMatch(home, /ook bij een lange looptijd/);
  // JouwWeb/Lightspeed/Mijndomein blijven CTA (F1 deels open). WooCommerce is in deze neutrale hash een bronlink; deze test dekt Hostinger-prijzen, niet de CTA-vorm.
});

test('quiz.js toont voor Hostinger de neutrale instapzin, geen introprijs', () => {
  const js = read('dist/js/quiz.js');
  assert.match(js, /Hostinger: bekijk de actuele instapprijs en looptijd bij de aanbieder\./);
  assert.doesNotMatch(js, /€ 2,99|€ 3,99|€ 7,99|€ 143,52|€ 191,52/);
});
