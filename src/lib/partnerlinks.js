// Goedgekeurde partnerlinks per platform-id. LEEG zolang er geen goedgekeurd programma is.
// Pas invullen na goedkeuring, bv. jouwweb: 'https://tc.tradetracker.net/?c=...'.
// De match leest dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
import { PLATFORMS } from './platforms.js';

/** Wix Impact (25616): eCommerce-CTA's. */
export const WIX_ECOM = 'https://wix.pxf.io/c/7989613/2152481/25616?trafcat=ecom';
/** Wix Impact (25616): websitebouwer-CTA's. */
export const WIX_WSB = 'https://wix.pxf.io/c/7989613/2152480/25616?trafcat=wsb';

export const PARTNERLINKS = {
  shopify: 'https://shopify.pxf.io/c/7989613/1061744/13624',
  // Default = ecom (webshop-CTA's). Voor websitebouwer: knop('wix', pos, cls, { trafcat: 'wsb' }).
  wix: WIX_ECOM,
  // Hostinger: Daisycon campagne 16780, media ShopMatch 438840 goedgekeurd 19-10-2026; NL-deeplink 20-10-2026: landt op hostinger.com/nl/website-maken.
  hostinger: 'https://jf79.net/c/?si=16780&li=1722914&wi=438840&ws=shopmatch&dl=nl%2Fwebsite-maken',
};

/** Alle goedgekeurde Wix-URL's (voor tests en live-checks). */
export const WIX_URLS = [WIX_ECOM, WIX_WSB];

/**
 * 4e argument van knop/uitgaand: óf een PARTNERLINKS-override-map (tests),
 * óf { trafcat?: 'ecom'|'wsb', partnerlinks?: map }.
 */
function opts(arg) {
  if (arg == null) return { partnerlinks: PARTNERLINKS };
  if (typeof arg === 'object' && ('trafcat' in arg || 'partnerlinks' in arg)) {
    return { partnerlinks: arg.partnerlinks || PARTNERLINKS, trafcat: arg.trafcat };
  }
  return { partnerlinks: arg };
}

function hrefVoor(id, partnerlinks, trafcat) {
  const base = partnerlinks[id];
  if (!base) return undefined;
  if (id === 'wix' && trafcat === 'wsb' && (base === WIX_ECOM || base === PARTNERLINKS.wix)) return WIX_WSB;
  if (id === 'wix' && trafcat === 'ecom') return WIX_ECOM;
  return base;
}

/** Uitgaande link: partnerlink (rel sponsored nofollow, zonder zichtbaar label) als die er is, anders de officiële site. */
export function uitgaand(id, arg) {
  const p = PLATFORMS[id];
  if (!p) throw new Error('Onbekend platform ' + id);
  const { partnerlinks, trafcat } = opts(arg);
  const pl = hrefVoor(id, partnerlinks, trafcat);
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true, naam: p.knopnaam || p.naam } : { href: p.url, rel: 'noopener', partner: false, naam: p.knopnaam || p.naam };
}

/** Knop naar de aanbieder. Partnerlink: rel sponsored nofollow noopener, geen zichtbaar label (uitleg in de FAQ). */
export function knop(id, pos, cls = 'btn', arg) {
  const o = uitgaand(id, arg);
  return `<a class="${cls}" href="${o.href}" rel="${o.rel}" target="_blank" data-vendor="${id}" data-pos="${pos}" data-cta="outbound" data-partner-slot="${id}">Naar ${o.naam}</a>`;
}

/** Alleen voor Wix: geef { trafcat } door; anders undefined (andere platforms negeren het). */
export function wixTrafcat(id, trafcat) {
  return id === 'wix' && trafcat ? { trafcat } : undefined;
}

// Partnerzin: geen label per knop, maar precies één korte zin direct na elk blok waarin een partnerlink staat
// (rel sponsored). Werkt automatisch: staat er geen partnerlink in een blok, dan komt er ook geen zin.
export const PARTNER_NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
export const NOOT_HTML = `<p class="pnoot">${PARTNER_NOOT}</p>`;
const SPONSORED = /<a\s[^>]*rel="[^"]*\bsponsored\b/;
/** Eén blok als string: de zin erachter als er een partnerlink in staat. */
export const metNoot = (html) => (SPONSORED.test(html) ? html + NOOT_HTML : html);
/** Blokken (op class) met knoppen of links naar aanbieders. Het buitenste blok telt; binnen een blok komt geen tweede zin. */
export const BLOKKEN = ['plist', 'verdict', 'out', 'pc-cta'];
/** Begin en eind van elk blok in html (buitenste eerst), en of er een partnerlink in staat. kaal = ook <p>, <ul>, <ol> zonder class. */
export function partnerBlokken(html, { blokken = BLOKKEN, kaal = false } = {}) {
  const cls = `<(div|ol|ul|p|aside|section)\\s[^>]*class="(?:[^"]*\\s)?(?:${blokken.join('|')})(?:\\s[^"]*)?"[^>]*>`;
  const re = new RegExp(kaal ? `${cls}|<(p|ul|ol)>` : cls, 'g');
  const res = []; let m;
  while ((m = re.exec(html))) {
    const tag = m[1] || m[2];
    const t = new RegExp(`<${tag}\\b|</${tag}>`, 'g'); t.lastIndex = m.index;
    let d = 0, eind = -1, x;
    while ((x = t.exec(html))) { if (x[0][1] === '/') { if (--d === 0) { eind = x.index + x[0].length; break; } } else d++; }
    if (eind < 0) continue;
    res.push({ start: m.index, end: eind, partner: SPONSORED.test(html.slice(m.index, eind)) });
    re.lastIndex = eind;
  }
  return res;
}
/** Hele pagina: precies één zin direct na elk blok met een partnerlink. */
export function partnerNoten(html, opts) {
  let out = '', i = 0;
  for (const b of partnerBlokken(html, opts)) if (b.partner && !html.startsWith(NOOT_HTML, b.end)) { out += html.slice(i, b.end) + NOOT_HTML; i = b.end; }
  return out + html.slice(i);
}
