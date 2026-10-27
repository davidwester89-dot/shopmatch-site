// L2 (27-10): geen kale dollarbedragen. Een US$-bedrag mag alleen met een €-indicatie in dezelfde zin (ECB-koers met datum),
// en de zin 'wij rekenen dollars niet om' (of een variant) komt nergens voor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ');

test('valuta: geen "rekenen dollars niet om", elk US$-bedrag met €-indicatie en ECB-datum', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const html = walk('dist').filter((f) => f.endsWith('.html'));
  assert.ok(html.length > 10);
  let n = 0;
  for (const f of html) {
    const raw = readFileSync(f, 'utf8');
    assert.ok(!/rekenen\s+(de\s+)?dollars?\s+niet\s+om|dollars?\s+(rekenen|zetten)\s+we\s+niet\s+om/i.test(raw), `${f}: 'dollars niet om'`);
    const t = tekst(raw);
    assert.ok(!/(^|[^A-Z])\$\s?\d/.test(t.replace(/US\$/g, '')), `${f}: kaal $-bedrag zonder US$`);
    for (const m of t.matchAll(/US\$\s?\d[^()]*?\(([^)]*)\)/g)) { n++; assert.match(m[1], /€\s?\d/, `${f}: ${m[0]}`); assert.match(m[1], /ECB-koers \d{2}-\d{2}-\d{4}/, `${f}: ${m[0]}`); }
    for (const zin of t.split(/(?<=[.!?])\s+(?=[A-Z])/)) if (/US\$\s?\d/.test(zin)) assert.match(zin, /€\s?\d/, `${f}: ${zin.slice(0, 160)}`);
  }
  assert.ok(n >= 6, `te weinig US$-bedragen met omrekening gevonden (${n})`);
});

test('valuta: WooCommerce-omrekening klopt met de ECB-koers in de data (€ 1 = US$ 1,1150 op 27-10-2026)', () => {
  const koers = 1.115; const r = (x) => Math.round(x / koers);
  assert.deepEqual([25, 350, 29, 299].map(r), [22, 314, 26, 268]);
  const src = readFileSync('src/lib/platforms.js', 'utf8');
  assert.match(src, /US\$ 1,1150/); assert.match(src, /ecb\.europa\.eu/);
});
