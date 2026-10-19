import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { score } from '../src/lib/match.js';
import { uitgaand, knop, PARTNERLINKS, WIX_ECOM, WIX_WSB, WIX_URLS } from '../src/lib/partnerlinks.js';
import { PLATFORMS, IDS } from '../src/lib/platforms.js';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

test('match: logische uitkomsten', () => {
  assert.equal(score({ doel: 'winkel', producten: '1000', budget: 'hoog', techniek: 'wat', nl: 'ja' })[0].id, 'lightspeed');
  assert.equal(score({ doel: 'shop', producten: 'meer', budget: 'laag', techniek: 'veel', nl: 'nee' })[0].id, 'woocommerce');
  assert.equal(score({ doel: 'site', producten: '0', budget: 'laag', techniek: 'geen', nl: 'ja' })[0].id, 'jouwweb');
  // Geen techniek: WooCommerce nooit in de top 3.
  for (const doel of ['site', 'diensten', 'shop', 'winkel']) for (const budget of ['laag', 'mid', 'hoog'])
    assert.ok(!score({ doel, producten: '100', budget, techniek: 'geen', nl: 'nee' }).slice(0, 3).some((r) => r.id === 'woocommerce'));
});

test('partnerlinks: alleen goedgekeurde links, gevuld = sponsored nofollow + zichtbaar label', () => {
  for (const [id, href] of Object.entries(PARTNERLINKS)) { assert.ok(PLATFORMS[id], `partnerlink voor onbekend platform ${id}`); assert.match(href, /^https:\/\//, id); }
  for (const id of IDS) {
    const o = uitgaand(id);
    if (PARTNERLINKS[id]) { assert.equal(o.partner, true); assert.equal(o.href, PARTNERLINKS[id]); assert.equal(o.rel, 'sponsored nofollow noopener'); }
    else { assert.equal(o.partner, false); assert.equal(o.href, PLATFORMS[id].url); assert.equal(o.rel, 'noopener'); }
    const k = knop(id, 't');
    assert.equal(/rel="sponsored nofollow noopener"/.test(k), !!PARTNERLINKS[id], id);
    assert.equal(/<\/a><span class="partner">partnerlink<\/span>$/.test(k), !!PARTNERLINKS[id], id);
  }
  // Zonder partnerlinks: officiële site, geen sponsored, geen label.
  for (const id of IDS) { const o = uitgaand(id, {}); assert.equal(o.partner, false); assert.equal(o.href, PLATFORMS[id].url); assert.ok(!knop(id, 't', 'btn', {}).includes('partner"')); }
  const k = knop('shopify', 't', 'btn', { shopify: 'https://example.com/aff' });
  assert.match(k, /rel="sponsored nofollow noopener"/);
  assert.match(k, /partnerlink<\/span>/);
  // Wix: default ecom, trafcat wsb voor websitebouwer-CTA's.
  assert.equal(uitgaand('wix').href, WIX_ECOM);
  assert.equal(uitgaand('wix', { trafcat: 'wsb' }).href, WIX_WSB);
  assert.equal(uitgaand('wix', { trafcat: 'ecom' }).href, WIX_ECOM);
  assert.ok(knop('wix', 't', 'btn', { trafcat: 'wsb' }).includes(WIX_WSB));
});

test('partnerlinks hebben geen invloed op de match', () => {
  const src = readFileSync(new URL('../src/lib/match.js', import.meta.url), 'utf8');
  assert.ok(!src.includes('partnerlinks'));
});

test('build (productie): pagina’s, sitemap, robots, IndexNow, regels', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const html = walk('dist').filter((f) => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(f)); // Google-verificatiebestand is geen pagina
  assert.ok(html.length >= 22);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  assert.equal((sm.match(/<loc>/g) || []).length, html.length - 1);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/shopmatch.nl\/sitemap.xml/);
  assert.equal(readFileSync('dist/CNAME', 'utf8').trim(), 'shopmatch.nl');
  const key = readdirSync('dist').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.ok(key && readFileSync(join('dist', key), 'utf8') === key.replace('.txt', ''));
  const verboden = [/Dave/i, /Wester/i, /batterijmatch/i, /goodfellas/i, /reddit/i, /geraadpleegd op/i, /check altijd/i, /controleer altijd/i, /kan veranderen/i, /dit is geen advies/i];
  for (const f of html) {
    const s = readFileSync(f, 'utf8');
    for (const r of verboden) assert.ok(!r.test(s), `${f} bevat ${r}`);
    if (!f.endsWith('404.html')) { assert.match(s, /<link rel="canonical" href="https:\/\/shopmatch.nl\//); assert.ok(!s.includes('noindex'), f); }
    const title = s.match(/<title>(.*?)<\/title>/)[1]; assert.ok(title.length <= 60, `${f}: titel te lang (${title.length})`);
    assert.match(s, /Ook van ons/);
    assert.match(s, /boekhoudmatch.nl/); assert.match(s, /verduurzaammatch.nl/); assert.match(s, /warmtepompenmatch.nl/);
    for (const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
    // Interne links bestaan.
    for (const m of s.matchAll(/href="(\/[^"#?]*)/g)) {
      const p = m[1]; const t = p.endsWith('/') ? join('dist', p, 'index.html') : join('dist', p);
      assert.ok(existsSync(t), `${f}: kapotte link ${p}`);
    }
    // Uitgaande links naar aanbieders: goedgekeurde partnerlink = sponsored nofollow noopener, anders officiële site met noopener.
    for (const m of s.matchAll(/<a [^>]*data-partner-slot="([^"]+)"[^>]*>/g)) {
      const id = m[1]; const href = m[0].match(/href="([^"]+)"/)[1];
      if (PARTNERLINKS[id]) {
        if (id === 'wix') assert.ok(WIX_URLS.includes(href), `${f}: wix href ${href}`);
        else assert.equal(href, PARTNERLINKS[id], `${f}: ${id}`);
        assert.match(m[0], /rel="sponsored nofollow noopener"/, `${f}: ${id}`);
      } else { assert.equal(href, PLATFORMS[id].url, `${f}: ${id}`); assert.match(m[0], /rel="noopener"/, `${f}: ${id}`); }
    }
  }
});

test('build (preview): noindex, Disallow, BASE-paden, geen CNAME', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '/shopmatch-site', GO_LIVE: '' } });
  const s = readFileSync('dist/index.html', 'utf8');
  assert.match(s, /<meta name="robots" content="noindex">/);
  assert.match(s, /href="\/shopmatch-site\/shop-match\/"/);
  assert.match(s, /<link rel="canonical" href="https:\/\/shopmatch.nl\/">/);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Disallow: \//);
  assert.ok(!existsSync('dist/CNAME'));
});
