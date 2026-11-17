// E-CTA-1 B: tekstlink in paginabronnen. Geen componentlogica; rendert één partnerlink
// via de bestaande partnerconfig. Meting volgt de vendor-tip (17-11): data-vendor =
// vendor-ID (partnerkaart), data-pos = mid (B, naast A=top en C=eind), data-cta = outbound.
import { uitgaand, wixTrafcat } from './lib/partnerlinks.js';
import { ECTA } from './e-cta-1.config.mjs';

const POS_B = 'mid';

function slugVan(path) {
  const parts = String(path || '').replace(/\/$/, '').split('/').filter(Boolean);
  return parts.at(-1) || 'home';
}

function hrefMetSubid(href, partner, path, pos = POS_B) {
  const s = partner.subid;
  if (!s || !s.param) return href;
  const u = new URL(href);
  const waarde = String(s.waarde || '')
    .replaceAll('{site}', ECTA.site)
    .replaceAll('{slug}', slugVan(path))
    .replaceAll('{pos}', pos);
  u.searchParams.set(s.param, waarde);
  return u.toString();
}

/** Tekstlink naar een betaalde partner. Anker is de merknaam of een eigen zin;
 *  ' (partnerlink)' staat ernaast, niet in de ankerttekst. rel/data-* blijven. */
export function bTekstlink(partnerId, path, tekst) {
  const cfg = ECTA.partners[partnerId];
  if (!cfg || !cfg.reflink) throw new Error(`bTekstlink: geen betaalde partner ${partnerId}`);
  const vendor = cfg.vendor || partnerId;
  const trafcat = partnerId === 'wixWsb' ? 'wsb' : partnerId === 'wix' ? 'ecom' : undefined;
  const o = uitgaand(vendor, wixTrafcat(vendor, trafcat));
  if (!o.partner) throw new Error(`bTekstlink: ${partnerId} heeft geen partnerlink`);
  const href = hrefMetSubid(o.href, cfg, path, POS_B);
  const label = tekst || cfg.naam;
  return `<a href="${href}" rel="${o.rel}" target="_blank" data-ecta="B" data-vendor="${vendor}" data-cta="outbound" data-pos="${POS_B}">${label}</a> (partnerlink)`;
}

/** Eigen alinea per hub (niet dezelfde pastAls-reeks). */
export function bHub(path) {
  const L = (id) => bTekstlink(id, path);
  switch (path) {
    case '/platformen/':
      return `<p>Op deze lijst staan onder meer ${L('shopify')}, ${L('wix')} en ${L('hostinger')}. Per platform zie je de prijs, de checklist en voor wie het past.</p>`;
    case '/vergelijken/':
      return `<p>In de tabel filter je onder meer ${L('shopify')}, ${L('wix')} en ${L('hostinger')} op prijs, producten en checklistpunten, naast JouwWeb, Lightspeed, Mijndomein en WooCommerce.</p>`;
    case '/gidsen/':
      return `<p>De gidsen hieronder gaan over beginnen en kiezen. ${L('shopify')}, ${L('wix')} en ${L('hostinger')} komen daarin terug waar ze bij de situatie passen.</p>`;
    case '/blog/':
      return `<p>De artikelen gaan over kiezen en starten, met de prijzen van de aanbieders zelf en bronnen. ${L('shopify')}, ${L('wix')} en ${L('hostinger')} komen in meerdere stukken terug.</p>`;
    default:
      return bAndere(path);
  }
}

export function bAndere(path, skip = []) {
  const skipSet = new Set(skip);
  const ids = (ECTA.pages[path]?.partners || []).filter((id) => {
    const p = ECTA.partners[id];
    return p?.reflink && !skipSet.has(id);
  });
  if (!ids.length) return '';
  const zinnen = ids.map((id) => {
    const als = ECTA.partners[id].pastAls ? ` ${ECTA.partners[id].pastAls}` : '';
    return `${bTekstlink(id, path)}.${als}`;
  });
  return `<p>${zinnen.join(' ')}</p>`;
}

export function vervangTekstlinks(html, path) {
  return html.replace(/\{\{tekstlink:([A-Za-z]+)(?:\|([^}]+))?\}\}/g, (_, id, tekst) => bTekstlink(id, path, tekst || undefined));
}
