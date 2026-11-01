// Scores weg (29-10-2026): geen score-badge, scorebalkjes, "Score"-kolom of "x/10" meer bij de platforms, op geen enkele pagina.
// De volgorde (ranglijst) blijft gelijk; alleen de weergave van de score is weg.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');
const files = (d, ext) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p, ext) : p.endsWith(ext) ? [p] : []; });
const zichtbaar = (h) => h.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');

test('geen scores in de gebouwde pagina\'s en scripts', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const fout = [];
  for (const f of files('dist', '.html')) {
    const h = read(f);
    if (/class="(sc|bars|pc-score)"|aggregateRating|ratingValue|reviewRating/.test(h)) fout.push(`${f}: score-markup of rating-schema`);
    if (/\bscore\b|checklistscore|\d\/10\b/i.test(zichtbaar(h))) fout.push(`${f}: score in zichtbare tekst`);
  }
  for (const f of readdirSync('dist/js').filter((x) => x.endsWith('.js')).map((x) => join('dist/js', x))) if (/checklistscore|fmtScore/i.test(read(f))) fout.push(`${f}: score in script`);
  assert.deepEqual(fout, []);
  assert.doesNotMatch(read('src/assets/css/style.css').replace(/\/\*[\s\S]*?\*\//g, ''), /\.bars\b|\.pc-score\b|\.sc\{/);
});

test('pagina\'s die een score toonden: lastmod en dateModified 2026-10-29', () => {
  const sm = read('dist/sitemap.xml');
  // De twee blogs zijn op 30-10 opnieuw bijgewerkt (logo's in de tabellen); die datum test test/logo-l7.test.js.
  // '/' en '/platformen/' zijn op 1-11 opnieuw bijgewerkt (JouwWeb-actie weg, hubdatum); die datum test test/acties-weg-0111.test.js.
  // '/vergelijken/' is op 1-11 opnieuw bijgewerkt (checklist Mijndomein); die datum test test/acties-weg-0111.test.js.
  // '/platformen/shopify/' en '/platformen/woocommerce/' zijn op 2-11 opnieuw bijgewerkt (maandprijzen in kaart en alternatieven); die datum test test/maandprijs-0211.test.js.
  // '/over/' en (opnieuw) de platformpagina's zijn op 3-11 bijgewerkt (externe feedback); die datum test test/externe-feedback-0311.test.js.
  for (const p of ['/vergelijken/wix-vs-jouwweb/'])
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p}</loc><lastmod>2026-10-29</lastmod>`), p);
  for (const f of ['vergelijken/wix-vs-jouwweb']) {
    const h = read(`dist/${f}/index.html`);
    assert.match(h, /"dateModified":"2026-10-29"/, f);
    assert.match(h, /Laatst bijgewerkt <time datetime="2026-10-29">/, f);
  }
});
