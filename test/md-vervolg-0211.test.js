// Mijndomein-vervolg (SC-review f0275ad/8a079da, 31-10, punten 1-3), pushdatum 2-11-2026:
// 1) btw-basis bij onze rekensom in de noot van /webshop-beginnen-kosten/; 2) bron 'Mijndomein actievoorwaarden' weg (onderbouwt niets meer);
// 3) controledatum per aanbieder: Mijndomein-prijzen gecontroleerd op 31-10-2026 (mijndomein.nl/producten/webshop), de rest blijft 17-10-2026.
// L7: elke pagina met een zichtbare bodywijziging, plus /shop-match/ (js/lib/platforms.js) en de hubs, heeft lastmod, dateModified (als de template die heeft) en de zichtbare bijgewerkt-regel op 2-11-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EF_PADEN } from '../src/l7-externe-feedback-0311.mjs'; // op 3-11 opnieuw bijgewerkt: test/externe-feedback-0311.test.js
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : /\.(html|js|xml)$/.test(p) ? [p] : []; });
const DATUM = '2026-11-02';
const PAGINAS = ['/shop-match/', '/platformen/', '/platformen/mijndomein/', '/gidsen/', '/beste-webshop-platform/', '/webshop-beginnen-kosten/', '/gratis-website-maken/', '/website-maken-zzp/'];
const MET_DATEMODIFIED = ['/platformen/mijndomein/', '/beste-webshop-platform/', '/webshop-beginnen-kosten/', '/gratis-website-maken/', '/website-maken-zzp/'];

test('bron Mijndomein actievoorwaarden nergens meer', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  for (const f of files('dist')) assert.doesNotMatch(read(f), /actievoorwaarden/i, f);
});

test('noot kostenpagina: btw-basis bij onze rekensom', () => {
  assert.match(read('dist/webshop-beginnen-kosten/index.html'), /Mijndomein: 12 × € 13,50, de maandprijs bij jaarbetaling \(onze rekensom, excl\. btw\)\./);
});

test('controledatum per aanbieder op de pagina\'s met de Mijndomein-prijzen van 31-10', () => {
  for (const p of ['/platformen/mijndomein/', '/webshop-beginnen-kosten/']) {
    assert.match(read(`dist${p}index.html`), /Prijzen gecontroleerd op <time datetime="2026-10-17">17 oktober 2026<\/time>(, Lightspeed op <time datetime="2026-11-01">1 november 2026<\/time>)?, Mijndomein op <time datetime="2026-10-31">31 oktober 2026<\/time>/, p);
  }
});

test('L7 2-11: lastmod, dateModified en zichtbare bijgewerkt-regel op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of PAGINAS.filter((x) => !EF_PADEN.has(x))) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${DATUM}</lastmod>`), p);
    assert.match(read(`dist${p}index.html`), new RegExp(`bijgewerkt (op )?<time datetime="${DATUM}">`, 'i'), p);
  }
  for (const p of MET_DATEMODIFIED.filter((x) => !EF_PADEN.has(x))) assert.match(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"${DATUM}"`), p);
});
