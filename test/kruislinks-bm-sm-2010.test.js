// Kruislinks BM-SM (20-10-2026): contextuele links tussen BoekhoudMatch en ShopMatch.
// Elke link staat in de lopende tekst, is een gewone link (geen nofollow/sponsored; noopener mag) en per pagina staan er max. 3 kruislinks in <main>.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const OWN = 'shopmatch.nl';
const LAYOUT = 'src/layout.mjs';
// Alle netwerksites tellen mee (…match.nl/.com), behalve de eigen site.
const isNet = (href) => /^https:\/\/(?:www\.)?[a-z]+match\.(?:nl|com)\//.test(href) && !href.startsWith(`https://${OWN}/`) && !href.startsWith(`https://www.${OWN}/`);
const KRUISLINKS = {
  "/platformen/shopify/": [
    [
      "zo doe je je btw-aangifte als zzp'er",
      "https://boekhoudmatch.nl/blog/btw-aangifte-doen-zzp/"
    ]
  ],
  "/blog/b2b-webshop-beginnen/": [
    [
      "wat er bij verlegde btw op je factuur moet",
      "https://boekhoudmatch.nl/btw-berekenen/"
    ]
  ],
  "/blog/shopify-wix-jouwweb-kleine-webshop/": [
    [
      "de boekhoudprogramma-match",
      "https://boekhoudmatch.nl/boekhoudprogramma-kiezen/"
    ]
  ]
};
// Pagina's die al vóór deze ronde meer dan 3 kruislinks hadden; deze ronde voegt daar niets aan toe.
const LEGACY = {};

const mainOf = (path) => {
  const h = readFileSync(`dist${path}index.html`, 'utf8');
  const m = h.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  assert.ok(m, `geen <main> op ${path}`);
  return m[1];
};
const crossLinks = (html) => [...html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)]
  .map(([, attrs, text]) => ({ attrs, text: text.replace(/<[^>]+>/g, '').trim(), href: (attrs.match(/href="([^"]+)"/) || [])[1] || '' }))
  .filter((a) => isNet(a.href));

test('kruislinks: aanwezig in de lopende tekst, juiste anker en doel, zonder nofollow/sponsored', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', LEADS_PREVIEW: '' }, stdio: 'ignore' });
  for (const [src, items] of Object.entries(KRUISLINKS)) {
    const links = crossLinks(mainOf(src));
    for (const [anker, doel] of items) {
      const hit = links.find((a) => a.href === doel && a.text === anker);
      assert.ok(hit, `${src}: link '${anker}' -> ${doel} ontbreekt`);
      assert.doesNotMatch(hit.attrs, /\b(nofollow|sponsored)\b/, `${src}: '${anker}' heeft nofollow/sponsored`);
    }
  }
});

test('kruislinks: max. 3 per pagina, ankers uniek', () => {
  const pages = walk('dist').filter((f) => f.endsWith('/index.html')).map((f) => f.slice(4, -10));
  for (const p of pages) {
    if (!/<main[^>]*>/.test(readFileSync(`dist${p}index.html`, 'utf8'))) continue; // doorverwijspagina zonder inhoud
    const n = crossLinks(mainOf(p)).length;
    if (p in LEGACY) assert.ok(n <= LEGACY[p], `${p}: ${n} kruislinks, was ${LEGACY[p]}`);
    else assert.ok(n <= 3, `${p}: ${n} kruislinks (max 3)`);
  }
  const ankers = Object.values(KRUISLINKS).flat().map(([a]) => a.toLowerCase());
  assert.equal(new Set(ankers).size, ankers.length, 'dubbel anker');
});

test('kruislinks: niet in footer of als sitewide blok', () => {
  const layout = readFileSync(LAYOUT, 'utf8');
  for (const [, doel] of Object.values(KRUISLINKS).flat()) assert.ok(!layout.includes(doel), `${doel} staat in de layout`);
});

