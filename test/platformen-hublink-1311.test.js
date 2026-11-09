// Hub-link 13-11-2026: precies één contextuele tekstlink in de homepage-<main> naar /platformen/.
// L7 t.o.v. parent A (f0d9eb9): alleen / krijgt 2026-11-13. /platformen/ blijft 2026-11-04.
// Elke sitemap-lastmod is >= de parent-build. Een hub die zonder bodywijziging terug of vooruit gaat, faalt.
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
const BASIS = process.env.L7_BASE || 'f0d9eb9ffe50c145e7c2116df47aa59e04f04e89';
const ANKER = 'alle webshopplatformen vergelijken';
const env = { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: process.env.BUILD_DATE || HL_UPD, PUSH_DATE: process.env.PUSH_DATE || HL_UPD };
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

test('lastmod >= parent-build: home 2026-11-13, hub /platformen/ blijft 2026-11-04', () => {
  execSync('node build.mjs', { cwd: ROOT, env, stdio: 'ignore' });
  const tmp = mkdtempSync(join(tmpdir(), 'hl-base-'));
  try {
    const dir = join(tmp, 'base');
    materialize(ROOT, BASIS, dir);
    const bOut = CFG.build(dir, env);
    const tOut = join(ROOT, 'dist');
    const bSm = readSitemap(bOut);
    const tSm = readSitemap(tOut);
    assert.equal(bSm.get('/platformen/'), '2026-11-04');
    assert.equal(tSm.get('/platformen/'), '2026-11-04');
    assert.equal(tSm.get('/'), HL_UPD);
    const htmlOf = (out) => new Map(walk(out).filter((f) => f.endsWith('.html') && !ign.test(f)).map((f) => [f, readFileSync(join(out, f), 'utf8')]));
    const bPages = htmlOf(bOut);
    const tPages = htmlOf(tOut);
    const bodyGewijzigd = new Set();
    for (const [f, html] of tPages) {
      const old = bPages.get(f);
      if (!old) continue;
      const path = fileToPath(f);
      if (veld(html, /<title>(.*?)<\/title>/)) assert.equal(veld(html, /<title>(.*?)<\/title>/), veld(old, /<title>(.*?)<\/title>/), `${path} title`);
      if (veld(html, /<meta name="description" content="([^"]*)"/)) assert.equal(veld(html, /<meta name="description" content="([^"]*)"/), veld(old, /<meta name="description" content="([^"]*)"/), `${path} meta`);
      if (veld(html, /<h1[^>]*>(.*?)<\/h1>/)) assert.equal(veld(html, /<h1[^>]*>(.*?)<\/h1>/), veld(old, /<h1[^>]*>(.*?)<\/h1>/), `${path} h1`);
      if (noindex(html) || redirect(html)) continue;
      if (bodyFingerprint(old) !== bodyFingerprint(html)) bodyGewijzigd.add(path);
    }
    assert.deepEqual([...bodyGewijzigd], ['/']);
    for (const [path, lm] of tSm) {
      const oud = bSm.get(path);
      if (oud) assert.ok(lm >= oud, `${path}: lastmod ${lm} < parent ${oud}`);
    }
    assert.deepEqual(lastmodFouten(bSm, tSm, bodyGewijzigd), []);
    const home = readFileSync(join(tOut, 'index.html'), 'utf8');
    assert.equal(dateFields(home).visible, HL_UPD);
    const hub = readFileSync(join(tOut, 'platformen/index.html'), 'utf8');
    assert.match(hub, /Laatst bijgewerkt <time datetime="2026-11-04">4 november 2026<\/time>/);
    assert.doesNotMatch(hub, /"dateModified": ?"2026-11-12"/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
