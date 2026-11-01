// L7 30-10: pagina's waar logo's in de tabellen bijkwamen hebben dateModified, sitemap-lastmod en de zichtbare bijwerkdatum 30-10-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// /blog/shopify-wix-jouwweb-kleine-webshop/ is op 1-11 opnieuw bijgewerkt (JouwWeb-actie weg); die datum test test/acties-weg-0111.test.js.
// /gratis-website-maken/ is op 1-11 opnieuw bijgewerkt (Mijndomein-actie weg); die datum test test/acties-weg-0111.test.js.
// /beste-webshop-platform/ en /website-maken-zzp/ zijn op 2-11 opnieuw bijgewerkt (bron 'Mijndomein actievoorwaarden' weg); die datum test test/md-vervolg-0211.test.js.
const PAGINAS = ['/blog/b2b-webshop-beginnen/'];
const ZICHTBAAR = /Laatst bijgewerkt <time datetime="2026-10-30">/;

test('L7 30-10: pagina\'s met logo\'s in de tabellen', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of PAGINAS) {
    const h = readFileSync(`dist${p}index.html`, 'utf8');
    assert.match(h, /"dateModified": ?"2026-10-30"/, p);
    assert.match(h, ZICHTBAAR, p);
    assert.match(sm, new RegExp(`${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>2026-10-30</lastmod>`), p);
  }
});
