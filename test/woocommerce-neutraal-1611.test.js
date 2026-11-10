// WooCommerce-neutralisatie (PM 10-11-2026): geen CTA/sponsored voor de platformkeuze.
// Automattic Affiliate dekt niet de gratis plug-in. Vervanging: gewone bronlink.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { knop, uitgaand, PARTNERLINKS } from '../src/lib/partnerlinks.js';
import { VERKOOP_VANAF, PLATFORMS } from '../src/lib/platforms.js';
import { WN_PADEN, WN_UPD } from '../src/l7-woocommerce-neutraal-1611.mjs';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') || p.endsWith('.js') ? [p] : []; });

const BRON = '<a href="https://woocommerce.com/nl/" rel="noopener">Bron: WooCommerce</a>';

test('knop() en uitgaand() voor WooCommerce zijn een gewone bronlink, geen CTA', () => {
  assert.equal(knop('woocommerce', 'x'), BRON);
  assert.equal(knop('woocommerce', 'x', 'btn ghost sm'), BRON);
  const o = uitgaand('woocommerce');
  assert.equal(o.href, 'https://woocommerce.com/nl/');
  assert.equal(o.rel, 'noopener');
  assert.equal(o.partner, false);
  assert.ok(!('woocommerce' in PARTNERLINKS));
});

test('prijzen en ranking-basis WooCommerce ongewijzigd', () => {
  assert.equal(VERKOOP_VANAF.woocommerce, 0);
  assert.equal(PLATFORMS.woocommerce.vanaf, 0);
  assert.equal(VERKOOP_VANAF.jouwweb, 10);
  assert.equal(VERKOOP_VANAF.lightspeed, 78);
  assert.equal(VERKOOP_VANAF.mijndomein, 15);
  assert.equal(VERKOOP_VANAF.hostinger, 16.99);
});

test('gebouwde site: WooCommerce nergens CTA of sponsored; wél exacte bronlink; andere merken ongewijzigd als CTA', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: '2026-11-16', PUSH_DATE: '2026-11-16' } });
  const fout = [];
  let bron = 0;
  for (const f of files('dist')) {
    const h = read(f);
    if (/data-vendor="woocommerce"/.test(h)) fout.push(`${f}: data-vendor=woocommerce`);
    if (/data-cta="outbound"[^>]*woocommerce|data-vendor="woocommerce"[^>]*data-cta="outbound"/.test(h)) fout.push(`${f}: outbound-CTA WooCommerce`);
    if (/data-partner-slot="woocommerce"/.test(h)) fout.push(`${f}: data-partner-slot=woocommerce`);
    if (/Naar( de site van)? WooCommerce/.test(h)) fout.push(`${f}: CTA-tekst "Naar WooCommerce"`);
    // sponsored op een WooCommerce-URL (partnerbehandeling)
    for (const m of h.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      if (/woocommerce\.com/i.test(tag) && /\bsponsored\b/i.test(tag)) fout.push(`${f}: sponsored op ${tag}`);
      if (/woocommerce\.com/i.test(tag) && /\bclass="[^"]*\bbtn\b/i.test(tag)) fout.push(`${f}: btn-class op ${tag}`);
      if (/[?&](ref|utm_|clickid)=/i.test(tag) && /woocommerce\.com/i.test(tag)) fout.push(`${f}: tracking op ${tag}`);
    }
    bron += h.split(BRON).length - 1;
  }
  assert.deepEqual(fout, []);
  assert.ok(bron >= 5, `verwacht bronlink op platformpagina, vs-pagina, beste-gids, blog en hub; gevonden ${bron}`);

  // Andere merken blijven een CTA-knop (Naar …, data-cta=outbound) — niet per ongeluk mee geneutraliseerd.
  for (const id of ['jouwweb', 'lightspeed', 'mijndomein', 'shopify', 'hostinger', 'wix']) {
    const re = new RegExp(`data-vendor="${id}"[^>]*data-cta="outbound"[^>]*>Naar `);
    const hit = files('dist').some((f) => f.endsWith('.html') && re.test(read(f)));
    assert.ok(hit, `${id} moet nog een CTA-knop "Naar …" hebben`);
  }

  const sm = read('dist/sitemap.xml');
  for (const p of WN_PADEN) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${WN_UPD}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${WN_UPD}">`, 'i'), p);
  }
  assert.match(read('dist/js/lib/partnerlinks.js'), /Bron: WooCommerce/);

  // datePublished van de bestaande B2B-post blijft 17-10.
  assert.match(read('dist/blog/b2b-webshop-beginnen/index.html'), /"datePublished": ?"2026-10-17"/);
  assert.match(read('dist/blog/b2b-webshop-beginnen/index.html'), /"dateModified": ?"2026-11-16"/);
  // /gidsen/ blijft 5-11 (geen Woo-wijziging). /platformen/shopify/ blijft 16-11 (ALT_ZIN in Hostinger-v3; deze hash tilt hem niet).
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/gidsen\/<\/loc><lastmod>2026-11-05<\/lastmod>/);
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/platformen\/shopify\/<\/loc><lastmod>2026-11-16<\/lastmod>/);
});
