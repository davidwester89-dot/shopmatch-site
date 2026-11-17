// E-CTA-1 B (17-11): tekstlinks in de lopende tekst (copy Blogschrijver, src/b-tekstlink.mjs), pastAls in keuzebox A,
// en de L7-unwrap (scripts/l7.config.mjs stripCta): alleen de B-linkmarkup telt niet; tekst eromheen telt wel.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { ECTA } from '../src/e-cta-1.config.mjs';
import { resolve, MAX_A } from '../src/e-cta.mjs';
import { CFG } from '../scripts/l7.config.mjs';
import { bodyFingerprint } from '../scripts/l7check.mjs';
import { bLinks, zonderB, B_LABEL, REL_B } from './e-cta-b-helper.mjs';
import { secties, plekFouten } from './e-cta-b-plek.mjs';

// SEO-besluit B in-tekst (17-11, /workspace/site-checks/2026-11-17/e-cta-1/seo-besluit-b-intekst.md): alleen kaartmerken, exacte
// partnerlink + rel sponsored + label (partnerlink), niet in FAQ/schema, max. 1 per merk per sectie, alleen als link in een bestaande
// zin (geen nieuwe tekst: bewaakt door L7 met de B-unwrap), interne links wijken nooit (o.a. SEO-01 /platformen/shopify/ → /platformen/wix/).
// Aanvulling 17-11 (seo-review-5380612.md, besluit punten 8-10): geen B in koppen, B op de eerste vermelding in p/li per H2-sectie,
// alleen bestaande woorden linken, bronregels byte-gelijk.
const PRE_B = '94bd15d'; // golf-1-tip vóór B (vendor-fix): referentie voor interne links, koppen, bronregels en tekst
let basisDir = null;
/** dist van PRE_B (eenmalig gebouwd in een tijdelijke map), of null als de commit niet in deze clone zit. */
const basis = () => {
  if (basisDir !== null) return basisDir || null;
  const tmp = mkdtempSync(join(tmpdir(), 'sm-pre-b-'));
  try { execSync(`git archive ${PRE_B} | tar -x -C ${tmp}`, { stdio: 'ignore' }); } catch { rmSync(tmp, { recursive: true, force: true }); basisDir = ''; return null; }
  execSync('node build.mjs', { cwd: tmp, stdio: 'ignore', env: { ...process.env, BASE: '', PREVIEW: '' } });
  basisDir = tmp; return tmp;
};
after(() => { if (basisDir) rmSync(basisDir, { recursive: true, force: true }); });
const oudePagina = (p) => { try { return readFileSync(join(basis(), 'dist', p, 'index.html'), 'utf8'); } catch { return null; } };

const SITE = {
  build: () => execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, BASE: '', PREVIEW: '' } }),
  root: 'dist',
  consent: 'src/assets/js/consent.js',
  // B-subID volgens de partnerkaart: <site>-<slug>-mid (alleen waar de kaart de parameter bevestigt).
  voorbeeld: '/blog/webshop-maken-met-ideal/',
};
let gebouwd = false;
const pagina = (p) => { if (!gebouwd) { SITE.build(); gebouwd = true; } return readFileSync(join(SITE.root, p, 'index.html'), 'utf8'); };
const alle = (d, pre = '/') => readdirSync(d).flatMap((f) => { const q = join(d, f); return statSync(q).isDirectory() ? alle(q, `${pre}${f}/`) : f === 'index.html' ? [pre] : []; });
const slug = (p) => p.replace(/\/$/, '').split('/').pop() || 'home';
const betaald = (p) => (ECTA.pages[p]?.partners || []).filter((id) => ECTA.partners[id]?.reflink);
const verwachtHref = (id, p) => {
  const c = ECTA.partners[id]; if (!c.subid) return [c.reflink];
  const u = new URL(c.reflink); u.searchParams.set(c.subid.param, c.subid.waarde.replace('{site}', ECTA.site).replace('{slug}', slug(p)).replace('{pos}', 'mid'));
  return [u.toString(), u.toString().replace(/&/g, '&amp;')];
};

test('E-CTA-1 B: elke tekstlink alleen naar een betaalde partner van de kaart voor die pagina, met label, rel, data-vendor en data-pos="mid"', () => {
  pagina('/');
  let n = 0;
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8');
    const bs = bLinks(h); if (!bs.length) continue;
    const ids = betaald(p);
    assert.ok(ids.length >= 2, `${p}: B-link op een pagina zonder (≥ 2) betaalde partners op de kaart`);
    for (const b of bs) {
      n++;
      assert.equal(b.rel, REL_B, `${p}: rel`);
      assert.ok(b.tekst.endsWith(B_LABEL), `${p}: label (partnerlink)`);
      assert.equal(b.pos, 'mid', `${p}: data-pos`);
      assert.ok(b.vendor, `${p}: data-vendor (vendor_click)`);
      const kand = ids.filter((id) => (ECTA.partners[id].vendor || id) === b.vendor);
      assert.ok(kand.length, `${p}: ${b.vendor} staat niet als betaalde partner op de kaart van deze pagina`);
      assert.ok(kand.some((id) => verwachtHref(id, p).includes(b.href)), `${p}: href ${b.href} ≠ reflink(+subID mid) van ${b.vendor}`);
      assert.equal(b.tekst, `${ECTA.partners[kand[0]].naam}${B_LABEL}`, `${p}: linktekst = merknaam + label`);
    }
    // max. 1 tekstlink per merk per H2-sectie (briefing B)
    const secties = h.split(/<h2\b/);
    for (const s of secties) { const v = bLinks(s).map((b) => b.vendor); assert.equal(new Set(v).size, v.length, `${p}: merk dubbel in één H2-sectie`); }
  }
  assert.ok(n > 0, 'geen enkele B-link gevonden');
});

const faqDeel = (h) => { const i = h.search(/<h2\b[^>]*(?:id="faq"|>\s*Veelgestelde vragen)/); if (i < 0) return ''; const j = h.slice(i + 3).search(/<h2\b/); return j < 0 ? h.slice(i) : h.slice(i, i + 3 + j); };
const schema = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

test('E-CTA-1 B: niet in de FAQ en niet in het schema (SEO-besluit 2)', () => {
  pagina('/');
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8');
    assert.equal(bLinks(faqDeel(h)).length, 0, `${p}: B-link in de FAQ`);
    const ld = schema(h);
    assert.doesNotMatch(ld, /\(partnerlink\)|data-pos=|data-ecta/, `${p}: B in het schema`);
    for (const b of bLinks(h)) assert.ok(!ld.includes(b.href) && !ld.includes(b.href.replace(/&amp;/g, '&')), `${p}: B-reflink in het schema`);
  }
});

const STRIP_AC = /<aside class="ecta[^"]*"[^>]*data-ecta="[AC]"[^>]*>[\s\S]*?<\/aside>/g;
const interneLinks = (h) => { const m = new Map(); for (const x of (h.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(STRIP_AC, '').matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) m.set(x[1], (m.get(x[1]) || 0) + 1); return m; };
test('E-CTA-1 B: een interne link wijkt nooit voor een partnerlink (SEO-besluit 5; t.o.v. de stand vóór B)', (t) => {
  pagina('/');
  if (!basis()) { t.skip(`${PRE_B} niet in deze clone`); return; }
  let n = 0;
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8'); if (!bLinks(h).length) continue;
    const oud = oudePagina(p); if (!oud) continue;
    const a = interneLinks(oud), b = interneLinks(h); n++;
    for (const [href, k] of a) assert.ok((b.get(href) || 0) >= k, `${p}: interne link ${href} ${k}× → ${b.get(href) || 0}×`);
  }
  assert.ok(n > 0);
  // SEO-01 (audit 20-10): ALT_ZIN op /platformen/shopify/ linkt intern naar /platformen/wix/.
  assert.match(pagina('/platformen/shopify/'), /Wil je klein en goedkoper starten\? Kijk dan ook naar <a href="\/platformen\/hostinger\/">Hostinger<\/a>, of naar <a href="\/platformen\/wix\/">Wix<\/a>/);
});

const H2 = /(?=<h2\b)/;
test('E-CTA-1 B: geen sponsored link in h1-h6 (SEO-besluit 8)', () => {
  pagina('/');
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8');
    for (const m of h.matchAll(/<(h[1-6])\b[^>]*>((?:(?!<\/\1>)[\s\S])*)<\/\1>/g)) assert.doesNotMatch(m[2], /<a\b[^>]*\srel="[^"]*\bsponsored\b/, `${p}: sponsored link in <${m[1]}>`);
  }
});

test('E-CTA-1 B: per H2-sectie max. 1 per merk, op de eerste vermelding in de lopende tekst (p/li) (SEO-besluit 3, 9)', () => {
  pagina('/');
  const fout = [];
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8').replace(STRIP_AC, ''); if (!bLinks(h).length) continue;
    for (const s of secties(h, H2)) for (const f of plekFouten(s)) fout.push(`${p} [${(s.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/) || [, 'intro'])[1].replace(/<[^>]+>/g, '')}] ${f}`);
  }
  assert.deepEqual(fout, []);
});

test('E-CTA-1 B: alleen bestaande woorden gelinkt; koppen en bronregels byte-gelijk aan de stand vóór B (SEO-besluit 4, 8, 10)', (t) => {
  pagina('/');
  if (!basis()) { t.skip(`${PRE_B} niet in deze clone`); return; }
  const koppen = (h) => [...h.matchAll(/<h[1-6]\b[\s\S]*?<\/h[1-6]>/g)].map((m) => m[0]);
  const bron = (h) => [...h.matchAll(/<(p|div|ul)\b[^>]*\sclass="[^"]*\b(?:src|sources|bron)\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g)].map((m) => m[0]);
  let n = 0;
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8'); if (!bLinks(h).length) continue;
    const oud = oudePagina(p); assert.ok(oud, `${p}: B op een pagina die vóór B niet bestond`); n++;
    // linktekst zonder label = het woord dat er al stond: na de unwrap is de body gelijk aan de stand vóór B
    assert.equal(bodyFingerprint(h, CFG), bodyFingerprint(oud, CFG), `${p}: tekst gewijzigd t.o.v. ${PRE_B} (niet alleen een bestaand woord gelinkt)`);
    assert.equal(bodyFingerprint(zonderB(h), CFG), bodyFingerprint(oud, CFG), `${p}: zonderB ≠ stand vóór B`);
    assert.deepEqual(koppen(h), koppen(oud), `${p}: koppen niet byte-gelijk aan ${PRE_B}`);
    assert.deepEqual(bron(h), bron(oud), `${p}: bronregels niet byte-gelijk aan ${PRE_B}`);
  }
  assert.ok(n > 0);
});

test('E-CTA-1 B plek: negatieve tests (kop, latere vermelding, dubbel, productnaam, tabel, in een andere link)', () => {
  const b = (v = 'shopify', t = 'Shopify') => `<a href="https://x.example/r" rel="sponsored nofollow noopener" target="_blank" data-ecta="B" data-vendor="${v}" data-cta="outbound" data-pos="mid">${t} (partnerlink)</a>`;
  const ok = (s) => assert.deepEqual(plekFouten(s), [], s);
  const rood = (s, re) => assert.ok(plekFouten(s).some((f) => re.test(f)), `${s} → ${plekFouten(s)}`);
  ok(`<h2>Shopify</h2><p>Kies ${b()} als je wilt groeien. Shopify heeft apps.</p>`);
  rood(`<h2>Kies ${b()}</h2><p>Shopify heeft apps.</p>`, /in <h2>|lopende tekst/);
  rood(`<h2>X</h2><p>Shopify heeft apps. Kies ${b()}.</p>`, /eerdere vermelding/);
  rood(`<h2>X</h2><ul><li>Shopify is groot.</li></ul><p>Kies ${b()}.</p>`, /eerdere vermelding/);
  rood(`<h2>X</h2><p>Kies ${b()}. En ${b()}.</p>`, /2 B-links/);
  rood(`<h2>X</h2><p>Via Shopify Payments betaal je. Kies ${b()}.</p>`, /eerdere vermelding/);
  rood(`<h2>X</h2><p>Via ${b()} Payments.</p>`, /productnaam/);
  rood(`<h2>X</h2><table><tr><td>${b()}</td></tr></table><p>Shopify.</p>`, /lopende tekst/);
  rood(`<h2>X</h2><p><a href="/x/">Over Shopify</a> en ${b()}.</p>`, /eerdere vermelding/);
  rood(`<h2>X</h2><p>Kies ${b('shopify', 'Wix')}.</p>`, /geen vermelding/);
  // koppen, tabellen, bronregels en knoplabels tellen niet als vermelding
  ok(`<h2>Shopify</h2><table><tr><td>Shopify</td></tr></table><p class="src">Bron: Shopify</p><p class="go"><a href="#">Shopify</a></p><p>Kies ${b()}.</p>`);
});

test('E-CTA-1 B: alinea met alleen tekstlinks (bAndere) volgt de neutrale kaartvolgorde, nooit een onbetaald merk', () => {
  for (const p of alle(SITE.root)) {
    const h = readFileSync(join(SITE.root, p, 'index.html'), 'utf8');
    for (const m of h.matchAll(/<p>((?:<a\b[^>]*data-ecta="B"[^>]*>[^<]*<\/a>\.[^<]*)+)<\/p>/g)) {
      const v = bLinks(m[1]).map((b) => b.vendor);
      const kaart = [...new Set(betaald(p).map((id) => ECTA.partners[id].vendor || id))].filter((x) => v.includes(x));
      assert.deepEqual(v, kaart, `${p}: volgorde`);
    }
  }
});

test('E-CTA-1 B: vendor_click telt de tekstlinks (consent.js luistert op a[data-vendor], ongewijzigd)', () => {
  assert.match(readFileSync(SITE.consent, 'utf8'), /a\[data-vendor\]/);
});

test('E-CTA-1 pastAls: keuzebox A toont per betaalde partner precies de pastAls-regel uit de config; C niet', () => {
  let n = 0;
  for (const p of Object.keys(ECTA.pages)) {
    const r = resolve(ECTA, p); if (r.fallback) continue;
    const h = pagina(p);
    const a = h.match(/<aside class="ecta[^"]*"[^>]*data-ecta="A"[^>]*>[\s\S]*?<\/aside>/)[0];
    const c = h.match(/<aside class="ecta[^"]*"[^>]*data-ecta="C"[^>]*>[\s\S]*?<\/aside>/)[0];
    const regels = [...a.matchAll(/<span class="ecta-pastals">([^<]*)<\/span>/g)].map((m) => m[1]);
    assert.deepEqual(regels, r.partners.slice(0, MAX_A).map((x) => ECTA.partners[x.id].pastAls).filter(Boolean), `${p}: pastAls A`);
    assert.doesNotMatch(c, /ecta-pastals/, `${p}: geen pastAls in C`);
    for (const t of regels) assert.doesNotMatch(t, /€|\d|gratis|korting|actie/i, `${p}: pastAls zonder prijs/claim`);
    n += regels.length;
  }
  assert.ok(n > 0);
});

test('L7 stripCta B-unwrap: alleen de linkmarkup en het label vallen weg; tekst eromheen blijft tellen (negatieve test)', () => {
  const pag = (body) => `<html><body><main><article><h1>T</h1>${body}</article></main></body></html>`;
  const b = '<a href="https://x.example/r" rel="sponsored nofollow noopener" target="_blank" data-ecta="B" data-vendor="x" data-cta="outbound" data-pos="mid">Merk (partnerlink)</a>';
  const fp = (body) => bodyFingerprint(pag(body), CFG);
  // 1. kale merknaam -> B-link: geen bodywijziging
  assert.equal(fp(`<p>Kies Merk als je wilt groeien.</p>`), fp(`<p>Kies ${b} als je wilt groeien.</p>`));
  // 2. echte copywijziging naast de link: wél bodywijziging
  assert.notEqual(fp(`<p>Kies Merk als je wilt groeien.</p>`), fp(`<p>Kies ${b} als je snel wilt groeien.</p>`));
  // 3. nieuwe zin met alleen een B-link: wél bodywijziging (de merknaam blijft staan)
  assert.notEqual(fp(`<p>Tekst.</p>`), fp(`<p>Tekst. ${b}.</p>`));
  // 4. andere partnerlink (zonder data-ecta="B" of zonder data-pos="mid") wordt niet ge-unwrapt
  assert.notEqual(fp(`<p>Kies Merk.</p>`), fp(`<p>Kies ${b.replace(' data-ecta="B"', '')}.</p>`));
  assert.notEqual(fp(`<p>Kies Merk.</p>`), fp(`<p>Kies ${b.replace('data-pos="mid"', 'data-pos="top"')}.</p>`));
  // 5. B-link met geneste tags of andere linktekst blijft tellen
  assert.notEqual(fp(`<p>Kies Merk.</p>`), fp(`<p>Kies ${b.replace('Merk (partnerlink)', '<strong>Merk</strong> (partnerlink)')}.</p>`));
  // 6. echte pagina: B-links terug naar merknaam = zelfde vingerafdruk; één woord buiten de links anders = rood
  const h = pagina(SITE.voorbeeld);
  assert.ok(bLinks(h).length, 'voorbeeldpagina heeft B-links');
  assert.equal(bodyFingerprint(h, CFG), bodyFingerprint(zonderB(h), CFG));
  const mut = h.replace(/(<h2 id="[^"]*">[^<]*<\/h2>\s*<p>)(\S+)/, '$1Gewijzigd $2');
  assert.notEqual(mut, h);
  assert.notEqual(bodyFingerprint(mut, CFG), bodyFingerprint(h, CFG));
  // 7. A/C-blokken: nog steeds spoorloos weg
  assert.equal(fp('<p>x</p>'), fp('<p>x</p><aside class="ecta ecta-a" data-ecta="A"><p>Shopify</p></aside>'));
});
