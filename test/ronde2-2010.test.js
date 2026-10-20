// Ronde 2 (20-10-2026): voorzichtige vergoedingszin, leesbare bronlinks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

test('privacy: vergoeding is een mogelijkheid ("kunnen ... krijgen"), geen zekerheid', () => {
  const s = read('src/privacy-avg.mjs');
  assert.doesNotMatch(s, /dan krijgen wij daardoor een vergoeding/);
  assert.match(s, /dan kunnen wij daardoor een vergoeding krijgen/);
});

test('footer: geen "score"', () => {
  assert.doesNotMatch(read('src/layout.mjs').match(/<p class="fine">.*?<\/p>/)[0], /score/i);
});
