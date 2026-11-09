// Hub-link 13-11-2026: precies één contextuele tekstlink in de homepage-<main> naar /platformen/.
// L7: alleen / krijgt 2026-11-13 (bodywijziging). /platformen/ blijft 2026-11-04: de body wijzigt niet
// (op 25bdd4b stond 2026-11-12, een hub-bump zonder bodywijziging). Een pagina zonder bodywijziging
// krijgt geen nieuwere lastmod dan op die basis.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { materialize, bodyFingerprint, readSitemap, walk, fileToPath, dateFields } from '../scripts/l7check.mjs';
import { CFG } from '../scripts/l7.config.mjs';
import { HL_UPD, HL_PADEN } from '../src/l7-hublink-1311.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASIS = '25bdd4bad0f99a2db53a162425ef2e11fce84728';
const HUB = '2026-11-04';
const ANKER = 'alle webshopplatformen vergelijken';
const env = { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: process.env.BUILD_DATE || HL_UPD, PUSH_DATE: process.env.PUSH_DATE || HL_UPD };
const ign = /^(404\.html|google[0-9a-f]+\.html)$/;
const noindex = (html) => /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
const redirect = (html) => /<meta\b[^>]*http-equiv=["']refresh["']/i.test(html);
const veld = (html, re) => (html.match(re) || [, ''])[1];
const main = (html) => (html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i) || [, ''])[1];

test('homepage main: precies één contextuele link naar /platformen/', () => {
  execSync('node build.mjs', { cwd: ROOT, env, stdio: 'ignore' });
  const html = readFileSync(join(ROOT, 'dist/index.html'), 'utf8');
  const m = main(html);
  const links = [...m.matchAll(/<a\b[^>]*\bhref="\/platformen\/"[^>]*>[\s\S]*?<\/a>/gi)];
  assert.equal(links.length, 1, links.map((x) => x[0]).join(' | '));
  assert.equal(links[0][0].replace(/<[^>]+>/g, ''), ANKER);
  assert.ok(m.includes('Beantwoord 5 vragen en zie je top 3, of <a href="/platformen/">alle webshopplatformen vergelijken</a>.'));
  assert.equal(veld(html, /<title>(.*?)<\/title>/), 'Webshop maken? Kies het juiste platform | ShopMatch');
  assert.equal(veld(html, /<meta name="description" content="([^"]*)"/), 'Vergelijk Shopify, Wix, JouwWeb, Lightspeed, Hostinger, Mijndomein en WooCommerce op prijs, iDEAL, kassa en B2B. Doe de match en zie je top 3.');
  assert.equal(veld(html, /<h1[^>]*>(.*?)<\/h1>/), 'Webshop kiezen? Vergelijk eerst.');
  assert.deepEqual([...HL_PADEN], ['/']);
});

test('lastmod-hygiëne: home krijgt de pushdatum, /platformen/ blijft 2026-11-04, geen nieuwere lastmod zonder body', () => {
  execSync('node build.mjs', { cwd: ROOT, env, stdio: 'ignore' });
  const tmp = mkdtempSync(join(tmpdir(), 'hl-base-'));
  try {
    const dir = join(tmp, 'base');
    materialize(ROOT, BASIS, dir);
    const bOut = CFG.build(dir, env);
    const tOut = join(ROOT, 'dist');
    const bSm = readSitemap(bOut);
    const tSm = readSitemap(tOut);
    assert.equal(bSm.get('/platformen/'), '2026-11-12', '25bdd4b bumpte de hub zonder bodywijziging');
    assert.equal(tSm.get('/'), HL_UPD, '(a) home');
    assert.equal(tSm.get('/platformen/'), HUB, '(b) hub');
    const htmlOf = (out) => new Map(walk(out).filter((f) => f.endsWith('.html') && !ign.test(f)).map((f) => [f, readFileSync(join(out, f), 'utf8')]));
    const bPages = htmlOf(bOut);
    const tPages = htmlOf(tOut);
    assert.deepEqual([...tPages.keys()].sort(), [...bPages.keys()].sort());
    const bodyChanged = [];
    for (const [f, html] of tPages) {
      const old = bPages.get(f);
      const path = fileToPath(f);
      if (veld(html, /<title>(.*?)<\/title>/)) assert.equal(veld(html, /<title>(.*?)<\/title>/), veld(old, /<title>(.*?)<\/title>/), `${path} title`);
      if (veld(html, /<meta name="description" content="([^"]*)"/)) assert.equal(veld(html, /<meta name="description" content="([^"]*)"/), veld(old, /<meta name="description" content="([^"]*)"/), `${path} meta`);
      if (veld(html, /<h1[^>]*>(.*?)<\/h1>/)) assert.equal(veld(html, /<h1[^>]*>(.*?)<\/h1>/), veld(old, /<h1[^>]*>(.*?)<\/h1>/), `${path} h1`);
      if (noindex(html) || redirect(html)) continue;
      const same = bodyFingerprint(old) === bodyFingerprint(html);
      const lm = tSm.get(path);
      const baseLm = bSm.get(path);
      const nu = dateFields(html);
      const toen = dateFields(old);
      if (!same) { bodyChanged.push(path); continue; }
      // (c) zonder bodywijziging nooit een nieuwere lastmod
      assert.ok(!lm || !baseLm || lm <= baseLm, `${path} nieuwere lastmod ${lm} zonder bodywijziging (basis ${baseLm})`);
      if (path === '/platformen/') {
        assert.equal(lm, HUB);
        assert.equal(nu.visible, HUB);
        assert.deepEqual(nu.ld, toen.ld);
      } else {
        assert.equal(lm, baseLm, path);
        assert.equal(nu.visible, toen.visible, `${path} zichtbaar`);
        assert.deepEqual(nu.ld, toen.ld, `${path} dateModified`);
        assert.deepEqual(nu.og, toen.og, `${path} article:modified_time`);
      }
    }
    assert.deepEqual(bodyChanged, ['/'], 'alleen de home-body wijzigt');
    const home = readFileSync(join(tOut, 'index.html'), 'utf8');
    assert.equal(dateFields(home).visible, HL_UPD);
    assert.match(home, new RegExp(`bijgewerkt op <time datetime="${HL_UPD}">13 november 2026</time>`));
    const hub = readFileSync(join(tOut, 'platformen/index.html'), 'utf8');
    assert.match(hub, new RegExp(`Laatst bijgewerkt <time datetime="${HUB}">4 november 2026</time>`));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
