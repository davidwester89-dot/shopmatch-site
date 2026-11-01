// Acties weg (1-11-2026, L4): de JouwWeb-actie liep t/m 31-10-2026 (jouwweb.nl/prijzen, gerenderd 31-10-2026) en staat nergens meer.
// Mijndomein: de actie 'eerste 6 maanden gratis' heeft geen einddatum (mijndomein.nl/actievoorwaarden) en staat nergens meer; jaarprijzen = 12 × de maandprijs bij jaarbetaling.
// L7: elke pagina met een zichtbare bodywijziging, en de hubs erboven, heeft lastmod, dateModified (als de template die heeft) en de zichtbare bijgewerkt-regel op 1-11-2026.
import test from 'node:test';
import { EF_PADEN } from '../src/l7-externe-feedback-0311.mjs'; // pagina's die op 3-11 opnieuw zijn bijgewerkt: test/externe-feedback-0311.test.js
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const DATUM = '2026-11-01';
// /shop-match/, /platformen/, /platformen/mijndomein/, /gidsen/, /webshop-beginnen-kosten/ en /gratis-website-maken/ zijn op 2-11 opnieuw bijgewerkt (Mijndomein-vervolg); die datum test test/md-vervolg-0211.test.js.
// '/', '/platformen/jouwweb/' en '/vergelijken/' zijn op 2-11 opnieuw bijgewerkt (maandprijzen); die datum test test/maandprijs-0211.test.js.
// '/blog/' en '/blog/shopify-wix-jouwweb-kleine-webshop/' zijn op 2-11 opnieuw bijgewerkt (JouwWeb-actie t/m 30-11 terug); die datum test test/jouwweb-lightspeed-0211.test.js.
const PAGINAS = [];
const MET_DATEMODIFIED = [];

test('JouwWeb-actie t/m 31-10-2026: nergens meer in de gebouwde site', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const fout = [];
  for (const f of files('dist')) {
    // Uitzondering (2-11): de controledatum van de Mijndomein-prijzen in de stempel ('Mijndomein op 31 oktober 2026') is geen actie.
    const h = read(f).replace(/Mijndomein op (<time datetime="2026-10-31">)?31 oktober 2026(<\/time>)?/g, '');
    if (/31 oktober 2026|31-10-2026|eerste 12 maanden de helft/i.test(h)) fout.push(f);
  }
  assert.deepEqual(fout, []);
});

test('L7 1-11: lastmod, dateModified en zichtbare bijgewerkt-regel op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of PAGINAS.filter((x) => !EF_PADEN.has(x))) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
  for (const p of MET_DATEMODIFIED.filter((x) => !EF_PADEN.has(x))) assert.match(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"${DATUM}"`), p);
});

test('Mijndomein: geen actie zonder einddatum, jaarprijzen = 12 × de maandprijs bij jaarbetaling', async () => {
  const { PLATFORMS, FEATURES } = await import('../src/lib/platforms.js');
  const md = PLATFORMS.mijndomein;
  assert.equal(md.actie, undefined);
  assert.deepEqual(md.plannen.map((p) => p[1]), ['€ 15 per maand · € 162 per jaar', '€ 29,50 per maand · € 324 per jaar', '€ 43,50 per maand · € 480 per jaar']);
  for (const [jaar, maand] of [[162, 13.5], [324, 27], [480, 40]]) assert.equal(Math.round(maand * 12 * 100) / 100, jaar);
  assert.equal(FEATURES.mijndomein.proberen.v, 'nee');
  for (const f of files('dist')) assert.doesNotMatch(read(f), /6 maanden( nu)? gratis|6 gratis maanden|€ 126|€ 522/, f);
});
