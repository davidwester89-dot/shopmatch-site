import { revisieDatum } from './nuchter-datums-helper.mjs';
// Hub-link 13-11-2026: precies één contextuele tekstlink in de homepage-<main> naar /platformen/.
// L7-hygiëne: lastmod >= parent-build, en alleen omhoog bij bodywijziging.
// Op deze keten (Hostinger-v3 boven B): parent is B (1bf0c3d) of, bij een losse FF-stap, de directe voorganger.
// Lastmod-asserts hangen aan de echte L7_BASE-build, niet aan een hardgecodeerde 04-11. /platformen/shopify/ gaat naar 16-11 door ALT_ZIN.
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
import { HB_UPD } from '../src/l7-hostinger-blog-1611.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASIS = process.env.L7_BASE || '1bf0c3d7ab8a9b23103832a57a295167a6f600b9';
const ANKER = 'alle webshopplatformen vergelijken';
const env = { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: process.env.BUILD_DATE || HB_UPD, PUSH_DATE: process.env.PUSH_DATE || HB_UPD };
const ign = /^(404\.html|google[0-9a-f]+\.html)$/;
const noindex = (html) => /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
const redirect = (html) => /<meta\b[^>]*http-equiv=["']refresh["']/i.test(html);
const veld = (html, re) => (html.match(re) || [, ''])[1];
const main = (html) => (html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i) || [, ''])[1];

/** Lastmod mag alleen omhoog bij een bodywijziging, en nooit achteruit t.o.v. de parent-build. */
export function lastmodFouten(basis, nu, bodyGewijzigd) {
  const fout = [];
  for (const path of new Set([...basis.keys(), ...nu.keys()])) {
    const oud = basis.get(path);
    const lm = nu.get(path);
    if (!oud || !lm) continue;
    if (lm < oud) fout.push(`${path}: lastmod achteruit ${oud} → ${lm}`);
    else if (lm !== oud && !bodyGewijzigd.has(path)) fout.push(`${path}: lastmod ${oud} → ${lm} zonder bodywijziging`);
  }
  return fout;
}

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

test('mutatie: hub-lastmod terug of vooruit zonder bodywijziging faalt', () => {
  const basis = new Map([['/platformen/', '2026-11-04'], ['/', '2026-11-03']]);
  const terug = lastmodFouten(basis, new Map([['/platformen/', '2026-11-01']]), new Set());
  assert.ok(terug.some((f) => f.startsWith('/platformen/: lastmod achteruit 2026-11-04 → 2026-11-01')), terug.join('; '));
  const vooruit = lastmodFouten(basis, new Map([['/platformen/', '2026-11-12']]), new Set());
  assert.ok(vooruit.some((f) => f === '/platformen/: lastmod 2026-11-04 → 2026-11-12 zonder bodywijziging'), vooruit.join('; '));
  // De 39fbf25-situatie t.o.v. 25bdd4b: hub 12-11 → 04-11 is achteruit en faalt.
  const rollback = lastmodFouten(new Map([['/platformen/', '2026-11-12']]), new Map([['/platformen/', '2026-11-04']]), new Set());
  assert.ok(rollback.some((f) => f.startsWith('/platformen/: lastmod achteruit')), rollback.join('; '));
  assert.deepEqual(lastmodFouten(new Map([['/', '2026-11-03']]), new Map([['/', '2026-11-13']]), new Set(['/'])), []);
});

test('lastmod >= parent-build (L7_BASE): nooit achteruit, 16-11 alleen bij bodywijziging', () => {
  execSync('node build.mjs', { cwd: ROOT, env, stdio: 'ignore' });
  const tmp = mkdtempSync(join(tmpdir(), 'hl-base-'));
  try {
    const dir = join(tmp, 'base');
    materialize(ROOT, BASIS, dir);
    const bOut = CFG.build(dir, env);
    const tOut = join(ROOT, 'dist');
    const bSm = readSitemap(bOut);
    const tSm = readSitemap(tOut);
    // Basis-lastmods komen uit de echte L7_BASE-build, niet uit een hardgecodeerde 04-11.
    // Zo blijft deze test groen bij een losse FF-stap (L7_BASE = directe parent, die al 16-11 kan zijn).
    assert.ok(bSm.has('/platformen/'), 'basis heeft /platformen/');
    assert.ok(tSm.get('/platformen/') >= bSm.get('/platformen/'), `/platformen/ ${tSm.get('/platformen/')} < basis ${bSm.get('/platformen/')}`);
    assert.equal(tSm.get('/platformen/'), HB_UPD);
    assert.equal(tSm.get('/'), HB_UPD);
    assert.ok(tSm.get('/') >= HL_UPD);
    assert.equal(tSm.get('/blog/'), HB_UPD);
    assert.equal(tSm.get('/platformen/shopify/'), revisieDatum('/platformen/shopify/', HB_UPD));
    const htmlOf = (out) => new Map(walk(out).filter((f) => f.endsWith('.html') && !ign.test(f)).map((f) => [f, readFileSync(join(out, f), 'utf8')]));
    const bPages = htmlOf(bOut);
    const tPages = htmlOf(tOut);
    const bodyGewijzigd = new Set();
    for (const [f, html] of tPages) {
      const old = bPages.get(f);
      if (!old) continue;
      const path = fileToPath(f);
      if (path !== '/platformen/hostinger/') {
        if (veld(html, /<title>(.*?)<\/title>/)) assert.equal(veld(html, /<title>(.*?)<\/title>/), veld(old, /<title>(.*?)<\/title>/), `${path} title`);
        if (veld(html, /<meta name="description" content="([^"]*)"/)) assert.equal(veld(html, /<meta name="description" content="([^"]*)"/), veld(old, /<meta name="description" content="([^"]*)"/), `${path} meta`);
        if (veld(html, /<h1[^>]*>(.*?)<\/h1>/)) assert.equal(veld(html, /<h1[^>]*>(.*?)<\/h1>/), veld(old, /<h1[^>]*>(.*?)<\/h1>/), `${path} h1`);
      }
      if (noindex(html) || redirect(html)) continue;
      if (bodyFingerprint(old, CFG) !== bodyFingerprint(html, CFG)) bodyGewijzigd.add(path);
    }
    for (const path of bodyGewijzigd) assert.equal(tSm.get(path), revisieDatum(path, HB_UPD), `${path} bodywijziging zonder 16-11`);
    for (const [path, lm] of tSm) {
      const oud = bSm.get(path);
      if (oud) assert.ok(lm >= oud, `${path}: lastmod ${lm} < parent ${oud}`);
    }
    assert.deepEqual(lastmodFouten(bSm, tSm, bodyGewijzigd), []);
    const home = readFileSync(join(tOut, 'index.html'), 'utf8');
    assert.equal(dateFields(home).visible, HB_UPD);
    const hub = readFileSync(join(tOut, 'platformen/index.html'), 'utf8');
    assert.match(hub, /Laatst bijgewerkt <time datetime="2026-11-16">16 november 2026<\/time>/);
    assert.doesNotMatch(hub, /"dateModified": ?"2026-11-12"/);
    const shop = readFileSync(join(tOut, 'platformen/shopify/index.html'), 'utf8');
    assert.match(shop, /Laatst bijgewerkt <time datetime="2026-11-18">18 november 2026<\/time>/);
    assert.match(shop, /"dateModified": ?"2026-11-18"/);
    assert.match(shop, /"datePublished": ?"2026-10-17"/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
