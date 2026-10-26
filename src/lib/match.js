// ShopMatch: pure matchlogica (ook in de browser gebruikt). Partnerlinks spelen hier geen rol.
// Antwoorden: doel (site|diensten|shop|winkel), producten (0|10|100|1000|meer),
// budget (laag|mid|hoog), techniek (geen|wat|veel), nl (ja|nee).
import { PLATFORMS, VERKOOP_VANAF, MAX_PRODUCTEN } from './platforms.js';

export const VRAGEN = [
  { id: 'doel', vraag: 'Wat wil je online zetten?', opties: [['site', 'Een website zonder verkoop'], ['diensten', 'Diensten of afspraken verkopen'], ['shop', 'Een webshop'], ['winkel', 'Webshop naast mijn fysieke winkel']] },
  { id: 'producten', vraag: 'Hoeveel producten ga je verkopen?', opties: [['0', 'Geen'], ['10', 'Tot 10'], ['100', '10 tot 100'], ['1000', '100 tot 1.000'], ['meer', 'Meer dan 1.000']] },
  { id: 'budget', vraag: 'Wat mag het per maand kosten?', opties: [['laag', 'Zo weinig mogelijk (tot € 10)'], ['mid', '€ 10 tot € 40'], ['hoog', 'Meer dan € 40 als het past']] },
  { id: 'techniek', vraag: 'Hoe technisch ben je?', opties: [['geen', 'Niet: het moet gewoon werken'], ['wat', 'Een beetje'], ['veel', 'Ik regel graag zelf hosting en plug-ins']] },
  { id: 'nl', vraag: 'Hoe belangrijk is een Nederlandse aanbieder?', opties: [['ja', 'Belangrijk'], ['nee', 'Maakt niet uit']] },
];

const N = { '0': 0, '10': 10, '100': 100, '1000': 1000, meer: 5000 };
const NL = ['jouwweb', 'lightspeed', 'mijndomein'];
// Maximaal aantal producten per instappakket met webshop (eigen sites, zie platforms.js). Infinity = onbeperkt.
const MAXPROD = Object.fromEntries(Object.entries(MAX_PRODUCTEN).map(([k, v]) => [k, v ?? Infinity])); // niet vermeld = geen grens aannemen
// Maandprijs van het goedkoopste pakket waarmee je kunt verkopen (jaarbetaling waar dat de vanaf-prijs is).
export const VERKOOPPRIJS = VERKOOP_VANAF;
/** Maandprijs van het goedkoopste pakket dat past bij het aantal producten. */
export function verkoopPrijs(id, n) {
  if (id === 'jouwweb' && n > 10) return 20; // Business, onbeperkt
  if (id === 'mijndomein' && n > 1000) return 43.5; // Pro, € 522 per jaar
  if (id === 'mijndomein' && n > 25) return 27; // Plus, € 324 per jaar
  if (id === 'lightspeed' && n > 5000) return 259; // Professional
  if (id === 'lightspeed' && n > 250) return 120; // Advanced
  return VERKOOPPRIJS[id];
}

export function score(a) {
  const out = [];
  const verkoop = a.doel !== 'site';
  const n = N[a.producten] ?? 0;
  for (const id of Object.keys(PLATFORMS)) {
    let s = 50; const waarom = [];
    const prijs = verkoop ? verkoopPrijs(id, n) : PLATFORMS[id].vanaf;
    if (n > MAXPROD[id]) s -= 100;
    // Budget
    if (a.budget === 'laag') { if (prijs <= 10) { s += 18; waarom.push('Past in een klein budget'); } else if (prijs > 40) s -= 40; else s -= 12; }
    if (a.budget === 'mid') { if (prijs > 40) s -= 25; else if (prijs >= 10) s += 6; }
    if (a.budget === 'hoog' && (id === 'shopify' || id === 'lightspeed')) s += 8;
    // Doel
    if (a.doel === 'site') { if (['wix', 'jouwweb', 'hostinger'].includes(id)) { s += 18; waarom.push('Sterk in gewone websites'); } if (['shopify', 'lightspeed', 'mijndomein'].includes(id)) s -= 25; }
    if (a.doel === 'diensten') { if (['wix', 'jouwweb', 'mijndomein'].includes(id)) { s += 12; waarom.push(id === 'mijndomein' ? 'Afspraken boeken zit in elk pakket' : 'Website en diensten verkopen in één'); } if (id === 'lightspeed') s -= 20; }
    if (a.doel === 'shop') { if (['shopify', 'jouwweb', 'mijndomein', 'woocommerce'].includes(id)) { s += 10; waarom.push('Gebouwd om online te verkopen'); } }
    if (a.doel === 'winkel') { if (id === 'lightspeed') { s += 30; waarom.push('Kassa en webshop van één leverancier'); } if (id === 'shopify') { s += 22; waarom.push('Verkopen in de winkel met Shopify POS'); } if (['hostinger', 'wix'].includes(id)) s -= 10; }
    // Aantal producten
    if (verkoop && n >= 1000 && ['shopify', 'woocommerce', 'lightspeed'].includes(id)) { s += 14; waarom.push('Schaalt naar duizenden producten'); }
    if (verkoop && n <= 10 && id === 'jouwweb') { s += 8; waarom.push('Pro-pakket: webshop tot 10 producten voor € 10'); }
    if (verkoop && n > 10 && n <= 100 && id === 'jouwweb') waarom.push('Business: onbeperkt producten, 0% commissie');
    if (verkoop && n > 25 && id === 'mijndomein') waarom.push(n > 1000 ? 'Pro-pakket nodig voor zoveel producten' : 'Plus-pakket nodig vanaf 26 producten');
    // Techniek
    if (a.techniek === 'geen') { if (id === 'woocommerce') s -= 45; else s += 4; }
    if (a.techniek === 'wat' && id === 'woocommerce') s -= 15;
    if (a.techniek === 'veel' && id === 'woocommerce') { s += 25; waarom.push('Volledige controle, geen platformkosten'); }
    // Nederlands
    if (a.nl === 'ja' && NL.includes(id)) { s += 14; waarom.push(id === 'lightspeed' ? 'Vestiging in Amsterdam' : 'Nederlandse aanbieder'); }
    out.push({ id, score: s, prijs, waarom: waarom.slice(0, 3) });
  }
  return out.sort((x, y) => y.score - x.score || x.prijs - y.prijs);
}

export const compleet = (a) => VRAGEN.every((v) => a[v.id]);
