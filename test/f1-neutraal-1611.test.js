// F1-neutralisatie (MM 10-11-2026, voorwaarde bij Hostinger-v2 e93de35): 25 onbetaalde
// CTA's van JouwWeb, Lightspeed, Mijndomein en WooCommerce → gewone bronlink, ook in de quiz-client.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { knop, uitgaand, PARTNERLINKS } from '../src/lib/partnerlinks.js';
import { VERKOOP_VANAF, PLATFORMS } from '../src/lib/platforms.js';
import { F1_PADEN, F1_UPD } from '../src/l7-f1-neutraal-1611.mjs';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') || p.endsWith('.js') ? [p] : []; });

const ONBETAALD = {
  jouwweb: { naam: 'JouwWeb', href: 'https://www.jouwweb.nl/' },
  lightspeed: { naam: 'Lightspeed eCom', href: 'https://www.lightspeedhq.nl/ecommerce/' },
  mijndomein: { naam: 'Mijndomein MijnWebshop', href: 'https://www.mijndomein.nl/producten/webshop' },
  woocommerce: { naam: 'WooCommerce', href: 'https://woocommerce.com/nl/' },
};
const BETAALD = ['shopify', 'hostinger', 'wix'];
const bronVan = (id) => `<a href="${ONBETAALD[id].href}" rel="noopener">Bron: ${ONBETAALD[id].naam}</a>`;

test('knop() en uitgaand() voor F1-merken zijn een gewone bronlink, geen CTA', () => {
  for (const id of Object.keys(ONBETAALD)) {
    const bron = bronVan(id);
    assert.equal(knop(id, 'x'), bron, id);
    assert.equal(knop(id, 'x', 'btn ghost sm'), bron, id);
    const o = uitgaand(id);
    assert.equal(o.href, ONBETAALD[id].href, id);
    assert.equal(o.rel, 'noopener', id);
    assert.equal(o.partner, false, id);
    assert.ok(!(id in PARTNERLINKS), `${id} hoort niet in PARTNERLINKS`);
  }
});

test('prijzen en ranking-basis ongewijzigd t.o.v. Hostinger-v2 / Woo-neutraal', () => {
  assert.equal(VERKOOP_VANAF.woocommerce, 0);
  assert.equal(PLATFORMS.woocommerce.vanaf, 0);
  assert.equal(VERKOOP_VANAF.jouwweb, 10);
  assert.equal(PLATFORMS.jouwweb.vanaf, 5.5); // standaardtarief; VERKOOP_VANAF is Pro tot 10 producten
  assert.equal(VERKOOP_VANAF.lightspeed, 78);
  assert.equal(VERKOOP_VANAF.mijndomein, 15);
  assert.equal(VERKOOP_VANAF.hostinger, 16.99);
  assert.equal(VERKOOP_VANAF.shopify, 28);
  assert.equal(VERKOOP_VANAF.wix, 25);
});

test('gebouwde site: F1-merken nergens CTA of sponsored; 25 exacte bronlinks; betaalde merken ongewijzigd als CTA', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: '2026-11-16', PUSH_DATE: '2026-11-16' } });
  const fout = [];
  const bronPerMerk = { jouwweb: 0, lightspeed: 0, mijndomein: 0, woocommerce: 0 };
  let bronTotaal = 0;
  for (const f of files('dist')) {
    const h = read(f);
    for (const id of Object.keys(ONBETAALD)) {
      const { naam, href } = ONBETAALD[id];
      if (new RegExp(`data-vendor="${id}"`).test(h)) fout.push(`${f}: data-vendor=${id}`);
      if (new RegExp(`data-partner-slot="${id}"`).test(h)) fout.push(`${f}: data-partner-slot=${id}`);
      if (new RegExp(`Naar( de site van)? ${naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h)) fout.push(`${f}: CTA-tekst "Naar ${naam}"`);
      for (const m of h.matchAll(/<a\b[^>]*>/g)) {
        const tag = m[0];
        const host = href.replace(/^https:\/\//, '').replace(/\/$/, '');
        if (tag.toLowerCase().includes(host.split('/')[0]) && new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(tag)) {
          if (/\bsponsored\b/i.test(tag)) fout.push(`${f}: sponsored op ${tag}`);
          if (/\bclass="[^"]*\bbtn\b/i.test(tag)) fout.push(`${f}: btn-class op ${tag}`);
          if (/[?&](ref|utm_|clickid)=/i.test(tag)) fout.push(`${f}: tracking op ${tag}`);
          if (/\btarget=/.test(tag) && tag.includes(href)) fout.push(`${f}: target op ${tag}`);
        }
      }
      const n = h.split(bronVan(id)).length - 1;
      bronPerMerk[id] += n;
      bronTotaal += n;
    }
  }
  assert.deepEqual(fout, []);
  // 25 statische HTML-vindplaatsen (SC-lijst a5d520c / F1 MM): 9 JouwWeb, 6 Lightspeed, 4 Mijndomein, 6 WooCommerce.
  assert.equal(bronTotaal, 25, `verwacht 25 bronlinks in HTML, gevonden ${bronTotaal} (${JSON.stringify(bronPerMerk)})`);
  assert.deepEqual(bronPerMerk, { jouwweb: 9, lightspeed: 6, mijndomein: 4, woocommerce: 6 });

  // Betaalde merken blijven een CTA-knop (Naar …, data-cta=outbound).
  for (const id of BETAALD) {
    const re = new RegExp(`data-vendor="${id}"[^>]*data-cta="outbound"[^>]*>Naar `);
    const hit = files('dist').some((f) => f.endsWith('.html') && re.test(read(f)));
    assert.ok(hit, `${id} moet nog een CTA-knop "Naar …" hebben`);
  }

  const sm = read('dist/sitemap.xml');
  for (const p of F1_PADEN) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${F1_UPD}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${F1_UPD}">`, 'i'), p);
  }

  // Quiz-client: knop() in de gebouwde module maakt bronlinks voor onbetaalde merken.
  const client = read('dist/js/lib/partnerlinks.js');
  assert.match(client, /Bron: \$\{naam\}/);
  assert.match(client, /geen betaalde route/i);
  const plBlok = client.slice(client.indexOf('export const PARTNERLINKS = {'), client.indexOf('};', client.indexOf('export const PARTNERLINKS = {')) + 2);
  assert.doesNotMatch(plBlok, /(?:^|\n)\s*(jouwweb|lightspeed|mijndomein|woocommerce)\s*:/m);

  // datePublished van bestaande posts blijft.
  assert.match(read('dist/blog/b2b-webshop-beginnen/index.html'), /"datePublished": ?"2026-10-17"/);
  assert.match(read('dist/blog/b2b-webshop-beginnen/index.html'), /"dateModified": ?"2026-11-16"/);
  assert.match(read('dist/blog/shopify-wix-jouwweb-kleine-webshop/index.html'), /"datePublished": ?"2026-10-17"/);
  assert.match(read('dist/blog/shopify-wix-jouwweb-kleine-webshop/index.html'), /"dateModified": ?"2026-11-16"/);

  // /gidsen/ blijft 5-11 (geen F1-wijziging). /platformen/shopify/ blijft 16-11 (ALT_ZIN in Hostinger-v3; deze hash tilt hem niet).
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/gidsen\/<\/loc><lastmod>2026-11-05<\/lastmod>/);
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/platformen\/shopify\/<\/loc><lastmod>2026-11-16<\/lastmod>/);
  // /shop-match/ HTML heeft geen onbetaalde knop (alleen de clientmodule); lastmod blijft 16-11 (Hostinger-v2).
  assert.match(sm, /<loc>https:\/\/shopmatch\.nl\/shop-match\/<\/loc><lastmod>2026-11-16<\/lastmod>/);
});
