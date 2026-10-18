// ShopMatch-checklist: de score is een telling, geen oordeel of review.
// 10 vaste punten die ondernemers in Nederland het vaakst nodig hebben. Per punt: ja = 1, deels = 0,5,
// nee of niet vermeld op de site van de aanbieder = 0. Prijs telt niet mee in de score (die staat er apart bij).
// Partnerlinks spelen hier geen rol: dit bestand leest ze niet.
import { PLATFORMS, FEATURES, VERKOOP_VANAF } from './platforms.js';

export const GROEPEN = [
  { id: 'nl', naam: 'Verkopen in Nederland', punten: ['ideal', 'geenfee', 'nl'] },
  { id: 'groei', naam: 'Groei en zakelijk', punten: ['onbeperkt', 'b2b', 'talen', 'pos'] },
  { id: 'gemak', naam: 'Gemak en contract', punten: ['hosting', 'proberen', 'maand'] },
];
export const PUNTEN = {
  ideal: { kort: 'iDEAL', lang: 'iDEAL als betaalmethode' },
  geenfee: { kort: 'Geen extra kosten per verkoop', lang: 'Geen extra platformkosten per verkoop' },
  nl: { kort: 'Nederlandse aanbieder', lang: 'Nederlandse aanbieder of vestiging' },
  onbeperkt: { kort: 'Onbeperkt producten', lang: 'Onbeperkt producten in een standaardpakket' },
  b2b: { kort: 'B2B', lang: 'B2B-functies, zoals zakelijke prijzen of catalogi' },
  talen: { kort: 'Meerdere talen', lang: 'Webshop in meerdere talen' },
  pos: { kort: 'Kassa', lang: 'Kassa voor een fysieke winkel' },
  hosting: { kort: 'Hosting inbegrepen', lang: 'Hosting, beveiliging en updates inbegrepen' },
  proberen: { kort: 'Gratis proberen', lang: 'Gratis proberen of geld terug' },
  maand: { kort: 'Per maand', lang: 'Per maand te betalen' },
};
export const IDS_PUNTEN = GROEPEN.flatMap((g) => g.punten);
export const MAX = IDS_PUNTEN.length;
const W = { ja: 1, deels: 0.5, nee: 0 };
export const punt = (v) => W[v] ?? 0;
export const WAARDE = { ja: 'Ja', deels: 'Deels', nee: 'Nee' };
export const waardeTekst = (v) => WAARDE[v] || 'Niet vermeld';

/** Score per platform: totaal (0-10) en per groep. */
export function score(id) {
  const f = FEATURES[id];
  if (!f) throw new Error('Onbekend platform ' + id);
  const groepen = GROEPEN.map((g) => ({ id: g.id, naam: g.naam, max: g.punten.length, score: g.punten.reduce((s, k) => s + punt(f[k]?.v), 0) }));
  return { id, totaal: groepen.reduce((s, g) => s + g.score, 0), max: MAX, groepen };
}
export const fmtScore = (n) => String(n).replace('.', ',');

/** Vaste volgorde voor lijsten: hoogste checklistscore, bij gelijke stand de laagste verkoopprijs. */
export function ranglijst(ids = Object.keys(PLATFORMS)) {
  return [...ids].sort((a, b) => score(b).totaal - score(a).totaal || VERKOOP_VANAF[a] - VERKOOP_VANAF[b]);
}

// Beste keuze per situatie: vaste regels op de checklist en prijs. Goedkoopste platform dat aan de regel voldoet.
export const SITUATIES = [
  { id: 'start', titel: 'Goedkoopste webshop, per maand te betalen', regel: 'Hosting inbegrepen en per maand te betalen. Laagste verkoopprijs.', past: (f) => f.hosting.v === 'ja' && f.maand.v === 'ja' },
  { id: 'budget', titel: 'Laagste prijs als je vooruit betaalt', regel: 'Hosting inbegrepen. Laagste maandprijs, ook bij een lange looptijd.', past: (f) => f.hosting.v === 'ja' },
  { id: 'winkel', titel: 'Winkel met webshop', regel: 'Kassa en webshop van één leverancier, met Nederlandse vestiging.', past: (f) => f.pos.v === 'ja' && f.nl.v === 'ja' && f.hosting.v === 'ja' },
  { id: 'groei', titel: 'B2B en verkoop over de grens', regel: 'B2B-functies, meerdere talen en onbeperkt producten, met hosting.', past: (f) => f.b2b.v === 'ja' && f.talen.v === 'ja' && f.onbeperkt.v === 'ja' && f.hosting.v === 'ja' },
  { id: 'controle', titel: 'Volledige controle', regel: 'Zelf hosten, geen omzetaandeel, onbeperkt producten.', past: (f) => f.hosting.v === 'nee' && f.geenfee.v === 'ja' && f.onbeperkt.v === 'ja' },
];
export function situaties() {
  return SITUATIES.map((s) => {
    const ids = Object.keys(PLATFORMS).filter((id) => s.past(FEATURES[id])).sort((a, b) => VERKOOP_VANAF[a] - VERKOOP_VANAF[b]);
    return { ...s, top: ids[0] || null };
  });
}
