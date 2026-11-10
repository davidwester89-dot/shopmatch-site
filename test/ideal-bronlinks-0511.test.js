// iDEAL-blog bronlinks (pushdatum 2026-11-05, sitecheck 3-11): brontitels met ' | ' (bv. 'iDEAL | Wero') gaven tekst als href
// ('Wero?', 'Wero', 'Wero toevoegen via Wix Payments'). parsePost splitst nu op de LAATSTE ' | '.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { parsePost } from '../src/markdown.mjs';

const UPD = '2026-11-05';
execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, BUILD_DATE: process.env.BUILD_DATE && process.env.BUILD_DATE > UPD ? process.env.BUILD_DATE : UPD } });
const read = (p) => readFileSync(p, 'utf8');

test('parsePost: brontitel met " | " houdt de hele titel, URL = laatste deel', () => {
  const src = '---\ntitle: t\ndescription: d\ndate: 2026-01-01\nupdated: 2026-01-01\nsources:\n- iDEAL: Wat is iDEAL | Wero? | https://ideal.nl/wat-is-ideal\n- A | https://a.nl/\n---\nx\n';
  const p = parsePost('2026-01-01-x.md', src);
  assert.deepEqual(p.sources, [{ title: 'iDEAL: Wat is iDEAL | Wero?', url: 'https://ideal.nl/wat-is-ideal' }, { title: 'A', url: 'https://a.nl/' }]);
});

test('alle blogposts: elke bron-URL is absoluut https', () => {
  for (const f of readdirSync('content/blog').filter((x) => x.endsWith('.md'))) {
    for (const s of parsePost(f, read(`content/blog/${f}`)).sources) assert.match(s.url || '', /^https:\/\/[^\s|]+$/, `${f}: ${s.title} → ${s.url}`);
  }
});

test('iDEAL-blog: bronnenlijst en JSON-LD citation alleen absolute https-URL\'s, met de drie herstelde links', () => {
  const h = read('dist/blog/webshop-maken-met-ideal/index.html');
  const lijst = [...h.match(/<ul class="sources">([\s\S]*?)<\/ul>/)[1].matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  const cit = JSON.parse(h.match(/"citation": ?(\[[^\]]*\])/)[1]);
  assert.equal(lijst.length, 19);
  assert.deepEqual(cit, lijst);
  for (const u of lijst) assert.match(u, /^https:\/\/[^\s|]+$/, u);
  for (const u of ['https://ideal.nl/wat-is-ideal', 'https://help.shopify.com/nl/manual/payments/shopify-payments/local-payment-methods/ideal', 'https://support.wix.com/nl/article/ideal-als-betaalmethode-koppelen-via-wix-payments']) assert.ok(lijst.includes(u), u);
  for (const t of ['iDEAL: Wat is iDEAL | Wero?', 'Shopify Help: iDEAL | Wero', 'Wix Help: iDEAL | Wero toevoegen via Wix Payments']) assert.ok(h.includes(`rel="noopener">${t}</a>`), t);
});

test('L7 5-11 (iDEAL-bronlinks): post op 2026-11-05; hub /blog/ op die datum of later (regel D)', () => {
  const sm = read('dist/sitemap.xml');
  const h = read('dist/blog/webshop-maken-met-ideal/index.html');
  assert.ok(sm.includes('<loc>https://shopmatch.nl/blog/webshop-maken-met-ideal/</loc><lastmod>2026-11-18</lastmod>'));
  const blogLm = sm.match(/<loc>https:\/\/shopmatch\.nl\/blog\/<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1];
  assert.ok(blogLm && blogLm >= UPD, `/blog/ lastmod ${blogLm}`);
  assert.match(h, /"dateModified": ?"2026-11-18"/);
  assert.match(h, /bijgewerkt (?:op )?<time datetime="2026-11-18">/i);
  assert.match(read('dist/blog/index.html'), new RegExp(`bijgewerkt (?:op )?<time datetime="${blogLm}">`, 'i'));
});
