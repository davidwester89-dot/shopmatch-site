// Wk47: /platformen/jouwweb/ upgrade (push 25-11). Alleen jouwweb.nl-prijzen; title/meta ongewijzigd; geen nieuwe knop.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { JW_UPD } from '../src/l7-jouwweb-tarieven-2311.mjs';
import { revisieDatum } from './nuchter-datums-helper.mjs';
const JW_D = revisieDatum('/platformen/jouwweb/', '2026-11-25'); // 01-12: JouwWeb-actie weg (zelfde push als webshop-maken-met-ai)

test('JouwWeb: H2 tarieven + bijkomende kosten, tabel, interne links, datum 25-11, geen partnerknop', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  const h = readFileSync('dist/platformen/jouwweb/index.html', 'utf8');
  const t = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.equal(JW_UPD, '2026-11-25');
  assert.match(h, /<h2>Pakketten, prijzen en tarieven<\/h2>/);
  assert.match(h, /<h2>Bijkomende kosten<\/h2>/);
  assert.doesNotMatch(h, /<h2>Pakketten en prijzen<\/h2>/);
  assert.match(t, /Lite Niet vermeld op jouwweb\.nl € 5,50 – Pro € 12 € 10 € 24 Business Niet vermeld op jouwweb\.nl € 20 –/);
  assert.match(t, /daarna € 20 per jaar/);
  assert.match(t, /extra mailbox kost € 15 per jaar/);
  assert.match(t, /€ 120 \+ € 20 voor de domeinnaam = € 140 per jaar/);
  assert.match(h, /<title>JouwWeb kosten 2026: prijzen per pakket \| ShopMatch<\/title>/);
  for (const l of ['/vergelijken/wix-vs-jouwweb/', '/gratis-website-maken/', '/website-maken-zzp/', '/blog/shopify-wix-jouwweb-kleine-webshop/', '/shop-match/']) assert.ok(h.includes(`href="${l}"`), l);
  assert.ok(h.includes('href="https://www.jouwweb.nl/tarieven"'));
  assert.doesNotMatch(h, /data-vendor="jouwweb"|rel="[^"]*sponsored[^"]*"[^>]*jouwweb/);
  assert.match(h, new RegExp(`"dateModified": ?"${JW_D}"`));
  assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${JW_D}">`, 'i'));
});
