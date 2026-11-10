import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HB_UPD, HB_PADEN } from '../src/l7-hostinger-blog-1611.mjs';

const md = readFileSync(new URL('../content/blog/2026-11-16-hostinger-website-webshop-kosten.md', import.meta.url), 'utf8');

test('hostinger-blog: SEO-pack title/meta/H1, datums 2026-11-16', () => {
  assert.match(md, /^seo_title: Hostinger website of webshop: prijzen en limieten$/m);
  assert.match(md, /^title: Hostinger: website of webshop — prijzen en limieten$/m);
  const d = md.match(/^description: (.*)$/m)[1];
  assert.ok(d.length >= 120 && d.length <= 155, String(d.length));
  assert.match(md, /^date: 2026-11-16$/m); assert.match(md, /^updated: 2026-11-16$/m);
});

test('hostinger-blog: H2-outline, links, alleen bestaande knop, geen Squarespace, geen actieprijs, verlengprijs', () => {
  for (const h of ['Welke Hostinger-plannen zijn er?', 'Website vs webshop: wat zit er wél en niet in', 'Hostinger naast Wix en Shopify', 'iDEAL en betalen in de webshop', 'Zo kies je']) assert.ok(md.includes(`## ${h}`), h);
  for (const l of ['/shop-match/', '/vergelijken/', '/platformen/hostinger/', '/platformen/wix/', '/platformen/shopify/', '/webshop-beginnen-kosten/', '/gratis-website-maken/', '/beste-webshop-platform/', '/blog/webshop-maken-met-ideal/']) assert.ok(md.includes(`(${l})`), l);
  assert.equal(md.split('{{knop:hostinger}}').length - 1, 1);
  assert.doesNotMatch(md, /squarespace|jf79\.net|reddit|\$|korting|black friday|€ 1,99|€ 2,99|€ 3,99|€ 12,99|€ 19,99/i);
  for (const p of ['€ 9,99', '€ 16,99', '€ 23,99']) assert.ok(md.includes(p), p);
  assert.ok(md.includes('Voor de actuele instapprijs, de looptijd en het bedrag dat je vooraf betaalt'));
  assert.ok(md.includes('De getoonde prijzen zijn exclusief btw (volgens de prijspagina van Hostinger).'));
});

test('hostinger-blog L7: post, hub /blog/, home en prijswijzigingspagina\'s op 2026-11-16', () => {
  const sm = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  for (const p of ['blog/hostinger-website-webshop-kosten/', 'blog/', '']) assert.ok(sm.includes(`<loc>https://shopmatch.nl/${p}</loc><lastmod>2026-11-16</lastmod>`), p);
  const h = readFileSync(new URL('../dist/blog/hostinger-website-webshop-kosten/index.html', import.meta.url), 'utf8');
  assert.match(h, /"dateModified": ?"2026-11-16"/);
  assert.match(h, /rel="sponsored nofollow noopener"[^>]*data-vendor="hostinger"/);
  assert.match(readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8'), /bijgewerkt op <time datetime="2026-11-16">/);
  for (const p of HB_PADEN) {
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${HB_UPD}</lastmod>`), p);
    assert.match(readFileSync(new URL(`../dist${p}index.html`, import.meta.url), 'utf8'), new RegExp(`bijgewerkt (op )?<time datetime="${HB_UPD}">`, 'i'), p);
  }
});
