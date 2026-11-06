// Siteconfig voor scripts/l4-promocheck.mjs (L4: actie/korting met prijs en einddatum).
// ShopMatch heeft geen aanbieders.js: het actie-veld staat op het platform in src/lib/platforms.js.
// BEKEND_L4: { pad, reden, tot?: 'JJJJ-MM-DD', alleen?: RegExp op de hele melding }.
// Met 'tot' vervalt de uitzondering ná die kalenderdag (Europe/Amsterdam; L4_VANDAAG alleen voor tests).
// Geen stille content-delete: een open hercheck blijft hier staan tot de dag, daarna is de melding weer rood.
import { execSync } from 'node:child_process';
import { join } from 'node:path';

export const CFG = {
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  // Data-modules met een veld `actie` (regel C). Ontbreekt een bestand, dan slaat de check het over.
  actieModules: ['src/lib/platforms.js'],
};

// Hostinger Black Friday: handmatige hercheck 13-11-2026 (deze site). De kopie staat nu niet in de boom;
// duikt ze op de platformpagina op, dan blokkeert ze de suite niet tot en met die dag. Andere paden of
// andere actiewoorden blijven rood. Na 13-11 vervalt deze regel vanzelf.
export const BEKEND_L4 = [
  {
    pad: '/platformen/hostinger/',
    reden: 'Hostinger Black Friday: handmatige hercheck 13-11-2026. Geen automatische contentfix.',
    tot: '2026-11-13',
    alleen: /black friday/i,
  },
];
