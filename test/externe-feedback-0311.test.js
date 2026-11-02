// Externe feedback nov (SM P2), push 2026-11-03:
// 1) Homepage-FAQ: partnerlinks staan live (PARTNERLINKS: Shopify, Wix, Hostinger), dus geen 'in de toekomst' meer; namen uit PARTNERLINKS.
// 2) 'Niet vermeld' overal dezelfde, ware uitleg: in de checklist levert het geen punt op, net als nee (checklist.js: punt(null) = 0).
//    De keuzehulp (match.js) gebruikt de checklist niet; geen maximum aantal producten vermeld = geen grens (MAXPROD).
// 3) L7: lastmod, zichtbare bijgewerkt-regel en (waar de template het heeft) dateModified op 2026-11-03.
import test from 'node:test';
import { SP_PADEN } from '../src/l7-sc-punten-0411.mjs';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { EF_UPD, EF_PADEN } from '../src/l7-externe-feedback-0311.mjs';
import { PARTNERLINKS } from '../src/lib/partnerlinks.js';
import { PLATFORMS } from '../src/lib/platforms.js';
import { punt } from '../src/lib/checklist.js';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const zichtbaar = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');

test('partner-FAQ en Niet vermeld: actueel en overal gelijk', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const home = read('dist/index.html');
  assert.doesNotMatch(home, /in de toekomst een vergoeding/);
  for (const id of Object.keys(PARTNERLINKS)) assert.ok(zichtbaar(home).includes(PLATFORMS[id].naam), id);
  assert.match(zichtbaar(home), /Soms\. De knoppen naar [^.]+ zijn partnerlinks/);
  assert.equal(punt(null), 0, 'checklist: niet vermeld = 0 punten (anders klopt de uitleg niet meer)');
  for (const f of files('dist')) assert.doesNotMatch(zichtbaar(read(f)), /[Nn]iet vermeld telt (als 0|niet mee)|telt het als 0/, f);
  for (const p of ['/vergelijken/', '/over/', '/platformen/mijndomein/']) assert.match(zichtbaar(read(`dist${p}index.html`)), /levert (het )?geen punt op, net als nee/, p);
});

test('L7 3-11: lastmod, zichtbare bijgewerkt-regel en dateModified', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of [...EF_PADEN].filter((x) => !SP_PADEN.has(x))) { // SP_PADEN: later (4-11) bijgewerkt
    assert.ok(sm.includes(`<loc>https://shopmatch.nl${p}</loc><lastmod>${EF_UPD}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${EF_UPD}">`, 'i'), p);
    assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${EF_UPD})`), p);
  }
});
