// Interne-links-experiment (SEO-lijst 5-11, MM-OK): 1 contextuele link SM.
// Target (geen title/H1-wijziging): /vergelijken/wix-vs-jouwweb/.
// L7 pushdatum: 2026-11-05 (gas vóór di-batch 10-11). Hub /gidsen/ bleef 2026-11-05.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { LINKS_UPD, LINKS_PADEN } from '../src/l7-interne-links-0511.mjs';

const main = (p) => { const t = readFileSync(`dist${p}index.html`, 'utf8'); return (t.match(/<main[\s\S]*?<\/main>/) || [''])[0]; };

test('interne-links-exp SM: contextlink met exact anker', () => {
  if (!existsSync('dist/sitemap.xml')) execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' });
  assert.ok(main('/webshop-beginnen-kosten/').includes('<a href="/vergelijken/wix-vs-jouwweb/">Wix en JouwWeb naast elkaar</a>'));
});

test('interne-links-exp SM L7: /webshop-beginnen-kosten/ op 2026-11-05', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of LINKS_PADEN) {
    assert.match(sm, new RegExp(`<loc>https://shopmatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${LINKS_UPD}</lastmod>`), p);
    assert.match(readFileSync(`dist${p}index.html`, 'utf8'), new RegExp(`bijgewerkt (op )?<time datetime="${LINKS_UPD}">`, 'i'), p);
    assert.match(readFileSync(`dist${p}index.html`, 'utf8'), new RegExp(`"dateModified": ?"${LINKS_UPD}"`), p);
  }
});

test('interne-links-exp SM: geen title/H1-wijziging op target', () => {
  const h = readFileSync('dist/vergelijken/wix-vs-jouwweb/index.html', 'utf8');
  assert.match(h, /<title>Wix vs JouwWeb 2026: prijzen en verschillen/);
  assert.match(h, /<h1>Wix of JouwWeb: welke websitebouwer kies je\?<\/h1>/);
});
