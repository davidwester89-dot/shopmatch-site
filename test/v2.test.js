// v2: vergelijkingsdesign. Score = telling met vaste methode, data met bron, geen nep-beoordelingen, huisstijl match-sites.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { IDS, FEATURES, VERKOOP_VANAF, BEST_FOR } from '../src/lib/platforms.js';
import { IDS_PUNTEN, MAX, score, ranglijst, situaties, punt } from '../src/lib/checklist.js';
import { verkoopPrijs } from '../src/lib/match.js';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const read = (p) => readFileSync(p, 'utf8');

test('checklist: 10 punten per platform, alleen ja/deels/nee/niet vermeld, met bron', () => {
  assert.equal(MAX, 10);
  for (const id of IDS) {
    assert.deepEqual(Object.keys(FEATURES[id]).sort(), [...IDS_PUNTEN].sort(), id);
    for (const k of IDS_PUNTEN) {
      const f = FEATURES[id][k];
      assert.ok([null, 'ja', 'deels', 'nee'].includes(f.v), `${id}.${k}`);
      // Elke ja of deels heeft een bron; nee alleen zonder bron bij 'Nederlandse aanbieder' (feit over de aanbieder zelf).
      if (f.v === 'ja' || f.v === 'deels' || (f.v === 'nee' && k !== 'nl')) assert.match(f.s || '', /^https:\/\//, `${id}.${k} zonder bron`);
      if (f.v === null) assert.ok(!f.t, `${id}.${k}: niet vermeld hoort geen toelichting te hebben`);
    }
    assert.ok(BEST_FOR[id]);
  }
});

test('score is de som van de punten (ja 1, deels 0,5, rest 0)', () => {
  for (const id of IDS) {
    const s = score(id);
    const som = IDS_PUNTEN.reduce((t, k) => t + punt(FEATURES[id][k].v), 0);
    assert.equal(s.totaal, som);
    assert.equal(s.groepen.reduce((t, g) => t + g.max, 0), 10);
    assert.ok(s.totaal >= 0 && s.totaal <= 10);
  }
  const r = ranglijst();
  for (let i = 1; i < r.length; i++) {
    const [a, b] = [score(r[i - 1]).totaal, score(r[i]).totaal];
    assert.ok(a > b || (a === b && VERKOOP_VANAF[r[i - 1]] <= VERKOOP_VANAF[r[i]]));
  }
});

test('situaties volgen uit vaste regels', () => {
  const t = Object.fromEntries(situaties().map((s) => [s.id, s.top]));
  assert.deepEqual(t, { start: 'jouwweb', budget: 'hostinger', winkel: 'lightspeed', groei: 'shopify', controle: 'woocommerce' });
});

test('prijzen in de vergelijking = prijzen in de match', () => {
  for (const id of IDS) assert.equal(verkoopPrijs(id, 0), VERKOOP_VANAF[id]);
});

test('checklist en match lezen geen partnerlinks', () => {
  for (const f of ['../src/lib/checklist.js', '../src/lib/match.js']) assert.ok(!read(new URL(f, import.meta.url)).includes('partnerlinks'));
});

test('build: huisstijl, componenten en regels op elke pagina', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const html = walk('dist').filter((f) => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(f));
  for (const f of ['inter-400.woff2', 'inter-600.woff2', 'inter-800.woff2']) assert.ok(existsSync(join('dist/fonts', f)));
  const css = read('src/assets/css/style.css');
  assert.match(css, /--brand:#4b3fc4/); assert.match(css, /font-family:Inter/);
  assert.ok(!/#b44d22|#0e6b63/i.test(css), 'geen BM-terracotta of VM-teal als ShopMatch-kleur');
  const nep = [/★/, /aggregateRating/, /reviewCount/, /ratingValue/, /sterren/i, /klantbeoordeling/i, /AI-gegenereerd/i, /gemaakt met AI/i];
  for (const f of html) {
    const s = read(f);
    for (const r of nep) assert.ok(!r.test(s), `${f} bevat ${r}`);
    assert.match(s, /<details class="menu">/); assert.match(s, /<footer class="site">/);
    assert.ok(!/<div class="net">[\s\S]*shopmatch\.nl[\s\S]*<\/div>/.test(s.slice(s.indexOf('<div class="net">'), s.indexOf('<p class="fine">'))), `${f}: netwerkfooter linkt naar zichzelf`);
    if (/<article/.test(s) && /class="src">Door/.test(s)) assert.match(s, /Door Redactie ShopMatch/);
    // Elke sponsored link toont direct erna het zichtbare label 'partnerlink'; geen label zonder sponsored link.
    const sponsored = [...s.matchAll(/<a [^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g)];
    for (const m of sponsored) {
      assert.match(m[0], /rel="sponsored nofollow noopener"/, `${f}: rel`);
      assert.match(s.slice(m.index), /^<a [^>]*>[^<]*<\/a><span class="partner">partnerlink<\/span>/, `${f}: sponsored zonder label partnerlink`);
    }
    assert.equal((s.match(/class="partner"/g) || []).length, sponsored.length, `${f}: label zonder sponsored link`);
  }
  const v = read('dist/vergelijken/index.html');
  assert.match(v, /id="filters"/); assert.match(v, /id="f-sort"/);
  const rows = [...v.matchAll(/<tr data-id="(\w+)" data-prijs="([\d.]+)" data-max="(\w+)" data-score="([\d.]+)"/g)];
  assert.equal(rows.length, IDS.length);
  for (const [, id, prijs, , sc] of rows) { assert.equal(Number(sc), score(id).totaal); assert.equal(Number(prijs), VERKOOP_VANAF[id]); }
  assert.deepEqual(rows.map((r) => r[1]), ranglijst());
  const h = read('dist/index.html');
  for (const k of ['class="hero-q"', 'class="trustbar"', 'class="sitlist"', 'method-band']) assert.ok(h.includes(k), k);
  const m = read('dist/shop-match/index.html');
  assert.match(m, /id="result"/); assert.match(m, /id="q-prog"/); assert.match(m, /Zo werkt de match/);
  for (const id of IDS) assert.match(read(`dist/platformen/${id === 'lightspeed' ? 'lightspeed' : id}/index.html`), /Checklist: wat zit erin\?/);
  assert.ok(!html.some((f) => /Hostinger Website Bouwer Business|Het Business-pakket met e-commerce/.test(read(f))), 'oude Hostinger-pakketnaam');
});

test('preview: elke pagina noindex', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '/shopmatch-site', GO_LIVE: '' } });
  for (const f of walk('dist').filter((x) => x.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(x))) {
    const s = read(f);
    assert.match(s, /<meta name="robots" content="noindex">/, f);
    assert.match(s, /url\(\/shopmatch-site\/fonts\/inter-400\.woff2\)/, `${f}: fontpad zonder BASE`);
  }
});

test('blog: index, posts in sitemap en feed, byline, bronnen, geen namen', async () => {
  const { execSync } = await import('node:child_process');
  const { readFileSync, readdirSync } = await import('node:fs');
  execSync('node build.mjs', { env: { ...process.env, BASE: '', GO_LIVE: '1', PREVIEW: '' } });
  const posts = readdirSync('content/blog').filter((f) => f.endsWith('.md')).map((f) => f.replace(/^\d{4}-\d{2}-\d{2}-|\.md$/g, ''));
  assert.ok(posts.length >= 2);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  const idx = readFileSync('dist/blog/index.html', 'utf8');
  assert.match(sm, /https:\/\/shopmatch\.nl\/blog\/<\/loc>/);
  assert.match(readFileSync('dist/blog/feed.xml', 'utf8'), /<rss/);
  for (const slug of posts) {
    const s = readFileSync(`dist/blog/${slug}/index.html`, 'utf8');
    assert.ok(sm.includes(`https://shopmatch.nl/blog/${slug}/</loc>`), `${slug} niet in sitemap`);
    assert.ok(idx.includes(`/blog/${slug}/`), `${slug} niet op blogindex`);
    assert.match(s, /Door Redactie ShopMatch/);
    assert.match(s, /<h2>Bronnen<\/h2>/);
    assert.ok(!/\{\{|Dave|Wester|Reddit|batterijmatch/i.test(s), `${slug}: verboden tekst of token`);
    assert.ok(/href="\/platformen\//.test(s), `${slug}: geen interne link naar platformpagina`);
  }
});
