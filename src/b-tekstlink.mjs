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

/** Tekstlink naar een betaalde partner uit ECTA. Alleen merken met reflink. */
export function bTekstlink(partnerId, path) {
  const cfg = ECTA.partners[partnerId];
  if (!cfg || !cfg.reflink) throw new Error(`bTekstlink: geen betaalde partner ${partnerId}`);
  const vendor = cfg.vendor || partnerId;
  const trafcat = partnerId === 'wixWsb' ? 'wsb' : partnerId === 'wix' ? 'ecom' : undefined;
  const o = uitgaand(vendor, wixTrafcat(vendor, trafcat));
  if (!o.partner) throw new Error(`bTekstlink: ${partnerId} heeft geen partnerlink`);
  const href = hrefMetSubid(o.href, cfg, path, POS_B);
  return `<a href="${href}" rel="${o.rel}" target="_blank" data-ecta="B" data-vendor="${vendor}" data-cta="outbound" data-pos="${POS_B}">${cfg.naam} (partnerlink)</a>`;
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
  return html.replace(/\{\{tekstlink:([A-Za-z]+)\}\}/g, (_, id) => bTekstlink(id, path));
}
