// Wk48 nieuwe post /blog/webshop-maken-met-ai/ (push di 01-12-2026). Alleen vendor-/overheidsbronnen, bestaande knoppen,
// E-CTA-1: alleen keuzehulp (na de partnerkaart van 17-11), L7 01-12 op post, / en /blog/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { ECTA } from '../src/e-cta-1.config.mjs';
const D = '2026-12-01';
execSync('node build.mjs', { env: { ...process.env, BUILD_DATE: process.env.BUILD_DATE || D, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' });
const md = readFileSync('content/blog/2026-12-01-webshop-maken-met-ai.md', 'utf8');
const h = readFileSync('dist/blog/webshop-maken-met-ai/index.html', 'utf8');
const body = md.split('---').slice(2).join('---');
test('ai-webshop: title ≤60, meta 120–155, woorden 700–1200', () => {
  const t = md.match(/^seo_title: (.+)$/m)[1];
  const m = md.match(/^description: (.+)$/m)[1];
  assert.ok(t.length <= 60, String(t.length));
  assert.ok(m.length >= 120 && m.length <= 155, String(m.length));
  const w = body.replace(/\{\{[^}]+\}\}/g, '').replace(/\]\([^)]+\)/g, ']').split(/\s+/).filter((x) => /\w/.test(x)).length;
  assert.ok(w >= 700 && w <= 1200, String(w));
});
test('ai-webshop: H2-opbouw, bedragen uit platformdata, geen actieprijzen', () => {
  for (const k of ['Wat een AI-webshopbouwer wel en niet doet', 'Shopify, Wix en Hostinger', 'Kosten per maand', 'Wat je zelf nog regelt', 'Zo kies je']) assert.ok(h.includes(`${k}</h2>`), k);
  for (const k of ['€ 28', '€ 21', '€ 25', '€ 16,99', '€ 0,29']) assert.ok(body.includes(k), k);
  assert.doesNotMatch(body, /black friday|€ ?1\b|3 dagen gratis|\bvolgens\b|\baldus\b|reddit/i);
});
test('ai-webshop: alleen bestaande knoppen, keuzehulp in E-CTA-config', () => {
  assert.deepEqual([...md.matchAll(/\{\{knop:([a-z]+)\}\}/g)].map((m) => m[1]), ['shopify', 'wix', 'hostinger']);
  assert.ok(JSON.stringify(ECTA).includes('/blog/webshop-maken-met-ai/'));
});
test('ai-webshop: interne links', () => {
  for (const l of ['/platformen/shopify/', '/platformen/wix/', '/platformen/hostinger/', '/webshop-beginnen-kosten/', '/blog/hostinger-website-webshop-kosten/', '/blog/dropshipping-webshop-maken/', '/gratis-website-maken/', '/shop-match/', '/vergelijken/']) assert.ok(h.includes(`href="${l}`), l);
});
test('ai-webshop: L7 01-12 op post, / en /blog/; byline Redactie', () => {
  assert.match(h, /"datePublished": ?"2026-12-01"/);
  assert.match(h, /"dateModified": ?"2026-12-01"/);
  assert.match(h, /Redactie ShopMatch/);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of ['/blog/webshop-maken-met-ai/', '/blog/', '/']) assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${D}</lastmod>`), p);
  assert.match(h, /og\/blog-webshop-maken-met-ai\.png/);
});
test('ai-webshop: /, /blog/ en /shop-match/ hebben JSON-LD dateModified = lastmod = zichtbare stempel = 01-12 (les 19-11)', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const [p, f, type] of [['/', 'dist/index.html', 'WebPage'], ['/blog/', 'dist/blog/index.html', 'Blog'], ['/shop-match/', 'dist/shop-match/index.html', 'WebApplication']]) {
    const s = readFileSync(f, 'utf8');
    const ld = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const x = ld.find((o) => o['@type'] === type);
    assert.ok(x, `${p}: ${type}-schema ontbreekt`);
    const lm = sm.match(new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/\//g, '\\/')}</loc><lastmod>([^<]+)</lastmod>`))[1];
    const vis = s.match(/bijgewerkt[^<]*<time datetime="([^"]+)"/)[1];
    assert.equal(x.dateModified, lm, `${p}: dateModified ≠ lastmod`);
    assert.equal(vis, lm, `${p}: zichtbare stempel ≠ lastmod`);
    assert.equal(lm, D, `${p}: lastmod`);
  }
});
test('JouwWeb-actie t/m 30-11 weg (L4, pushdag 01-12): drie pagina\'s + clientdata met datum 01-12', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of ['/platformen/jouwweb/', '/webshop-beginnen-kosten/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/shop-match/']) {
    const s = readFileSync(`dist${p}index.html`, 'utf8');
    assert.doesNotMatch(s, /30 november 2026|12 maanden 50%|JouwWeb-actie/, p);
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${D}</lastmod>`), p);
    assert.match(s, new RegExp(`"dateModified": ?"${D}"`), p);
  }
  assert.doesNotMatch(readFileSync('dist/js/lib/platforms.js', 'utf8'), /30 november 2026|12 maanden 50%/);
});
