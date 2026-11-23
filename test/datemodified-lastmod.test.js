// Elke lastmod-lift vereist dateModified (les 19-11, SEO-les 23-11, elke lastmod-lift).
// Zonder PUSH_DATE/BUILD_DATE (pages.yml: job-env heeft die variabelen niet; de stap
// schrijft PUSH_DATE naar GITHUB_ENV, maar `env.PUSH_DATE: ${{ env.PUSH_DATE }}` is dan
// leeg en overschrijft de runner-env): gebruik vandaag in Europe/Amsterdam.
// Geen lastmod-lift op die dag is groen; een lift zonder dateModified blijft rood.
// Geen lastmod verzinnen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const amsterdamToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
const PUSH = process.env.PUSH_DATE || process.env.BUILD_DATE || amsterdamToday();

const dateModifieds = (html) => {
  const out = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.dateModified === 'string') out.push(o.dateModified.slice(0, 10));
    for (const v of Object.values(o)) walk(v);
  };
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    walk(JSON.parse(m[1]));
  }
  return out;
};

test('elke pagina met lastmod = PUSH_DATE heeft dateModified = PUSH_DATE', () => {
  assert.match(PUSH, /^\d{4}-\d{2}-\d{2}$/, 'PUSH_DATE/BUILD_DATE of Amsterdam-vandaag ongeldig');
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' });
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  const pages = [...sm.matchAll(/<loc>https:\/\/shopmatch\.nl([^<]*)<\/loc><lastmod>([^<]*)<\/lastmod>/g)];
  const lifted = pages.filter(([, , last]) => last === PUSH);
  // Geen lastmod-lift op deze dag (L3, of CI op een dag zonder lift) is groen;
  // wel een lift zonder dateModified is rood.
  const missing = [];
  for (const [, path, last] of lifted) {
    const file = path === '/' ? 'dist/index.html' : `dist${path}index.html`;
    const dms = dateModifieds(readFileSync(file, 'utf8'));
    if (!dms.includes(last)) missing.push(`${path}: lastmod ${last}, dateModified ${dms.join('/') || 'ontbreekt'}`);
  }
  assert.equal(missing.length, 0, missing.join('\n'));
});
