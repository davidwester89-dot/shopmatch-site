import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('on-page SEO: unieke titels, meta ≤ 155, één H1, canonical = eigen URL, og, schema', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const files = walk('dist').filter((f) => f.endsWith('.html') && !f.endsWith('404.html') && !/\/google[0-9a-f]+\.html$/.test(f));
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  const titles = new Map();
  for (const f of files) {
    const s = readFileSync(f, 'utf8');
    const url = 'https://shopmatch.nl/' + f.replace(/^dist\//, '').replace(/index\.html$/, '');
    const title = unesc(s.match(/<title>(.*?)<\/title>/)[1]);
    assert.ok(!titles.has(title), `${f}: dubbele titel met ${titles.get(title)}`); titles.set(title, f);
    const desc = unesc(s.match(/<meta name="description" content="([^"]*)"/)[1]);
    assert.ok(desc.length >= 70 && desc.length <= 155, `${f}: meta description ${desc.length} tekens`);
    assert.equal((s.match(/<h1[\s>]/g) || []).length, 1, `${f}: precies één H1`);
    assert.match(s, /<html lang="nl">/);
    assert.ok(s.includes(`<link rel="canonical" href="${url}">`), `${f}: canonical`);
    assert.ok(s.includes(`<meta property="og:url" content="${url}">`), `${f}: og:url`);
    const og = s.match(/<meta property="og:image" content="https:\/\/shopmatch.nl(\/[^"]+)"/)[1];
    assert.ok(existsSync(join('dist', og)), `${f}: og:image ${og} bestaat`);
    assert.ok(sm.includes(`<loc>${url}</loc>`), `${f}: staat in sitemap`);
    const ld = [...s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const types = ld.map((x) => x['@type'] || 'graph');
    if (url !== 'https://shopmatch.nl/') assert.ok(types.includes('BreadcrumbList'), `${f}: BreadcrumbList`);
    for (const a of ld.filter((x) => x['@type'] === 'Article')) assert.equal(a.author.name, 'Redactie ShopMatch', `${f}: auteur`);
    const faq = ld.find((x) => x['@type'] === 'FAQPage');
    if (faq) assert.ok((s.match(/<details/g) || []).length >= faq.mainEntity.length, `${f}: FAQPage zonder zichtbare FAQ`);
    if (/\/(blog|vergelijken|platformen)\/.+|beste-webshop|webshop-beginnen|website-maken|gratis-website/.test(url)) {
      const main = s.split('<main')[1].split('</main>')[0];
      assert.match(main, /href="\/(shop-match|vergelijken)\//, `${f}: link naar match of vergelijking`);
    }
  }
  const home = readFileSync('dist/index.html', 'utf8');
  assert.match(home, /"@type":"Organization"/); assert.match(home, /"@type":"WebSite"/);
});

test('Google Search Console-verificatiebestand: ongewijzigd in dist, niet in sitemap', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const f = 'google5be727237a44c762.html';
  assert.equal(readFileSync(join('dist', f), 'utf8'), 'google-site-verification: google5be727237a44c762.html');
  assert.ok(!readFileSync('dist/sitemap.xml', 'utf8').includes(f));
});
