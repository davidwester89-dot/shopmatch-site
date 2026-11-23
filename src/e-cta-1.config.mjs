// E-CTA-1 golf 1 – ShopMatch: pagina → betaalde partners (config voor src/e-cta.mjs).
// Bron: PM-partnerkaart /workspace/plannen/e-cta-1/partnerkaart-shopmatch.md (17-11-2026).
// Reflinks: één veld per partner. Leeg veld = partner valt weg (bij < 2 over: alleen keuzehulp/vergelijker).
// Een nieuwe reflink (bv. JouwWeb na TT-acceptatie) invullen kan zonder copywijziging; pagina-indeling + MM/SC blijven nodig.
// Volgorde: zoals op de kaart = neutrale paginavolgorde: op een platformpagina het onderwerp eerst, verder de vaste
// sitevolgorde Shopify → Wix → Hostinger (volgorde op /platformen/). Nooit op commissie.
// subID: alleen Daisycon ws= (bevestigd op de kaart), waarde sm-<slug>-top|eind. impact (Shopify, Wix): bewust leeg
// (subid: false) tot de parameternotatie bevestigd is; niet zelf verzinnen.
// Wix: ecom op webshoppagina's, wsb op websitebouwerpagina's (kaart); telt als één partner.
import { PARTNERLINKS, WIX_ECOM, WIX_WSB } from './lib/partnerlinks.js';

const p = (...ids) => ({ partners: ids });
const KEUZEHULP = { partners: [] };

export const ECTA = {
  site: 'sm',
  pmKaart: '/workspace/plannen/e-cta-1/partnerkaart-shopmatch.md',
  ankerA: 'lead',
  ankersC: ['<h2>Veelgestelde vragen</h2>', '<h2>Bronnen</h2>', '<aside class="cta">', '<div class="cta">', '</article>', '<p class="report">'],
  keuzehulp: { href: '/shop-match/', tekst: 'Doe de keuzehulp' },
  vergelijker: { href: '/vergelijken/', tekst: 'Vergelijk de webshopplatforms' },
  partners: {
    shopify: { naam: 'Shopify', reflink: PARTNERLINKS.shopify, subid: false, pastAls: 'Past als je wilt groeien of in meerdere landen wilt verkopen.' }, // impact 13624; pastAls uit platforms.js voor
    wix: { naam: 'Wix', reflink: WIX_ECOM, subid: false, pastAls: 'Past als je veel vrijheid in het ontwerp wilt, als dienstverlener of creatieve ondernemer.' }, // impact 25616 ecom; pastAls uit platforms.js voor
    wixWsb: { naam: 'Wix', vendor: 'wix', reflink: WIX_WSB, subid: false, pastAls: 'Past als je veel vrijheid in het ontwerp wilt, als dienstverlener of creatieve ondernemer.' }, // impact 25616 wsb; zelfde voor-tekst
    hostinger: { naam: 'Hostinger', reflink: PARTNERLINKS.hostinger, subid: { param: 'ws', waarde: '{site}-{slug}-{pos}' }, pastAls: 'Past als je een eenvoudige site of kleine shop wilt starten.' }, // Daisycon 16780; pastAls uit platforms.js voor, zonder prijsclaim
    // Wacht (kaart): JouwWeb (TT 21002), Mijndomein (TT 27013), Lightspeed eCom. Leeg = geen CTA.
    jouwweb: { naam: 'JouwWeb', reflink: '', subid: null },
    mijndomein: { naam: 'Mijndomein', reflink: '', subid: null },
    lightspeed: { naam: 'Lightspeed eCom', reflink: '', subid: null },
  },
  pages: {
    // Platformen
    '/platformen/': p('shopify', 'wix', 'hostinger'),
    '/platformen/shopify/': p('shopify', 'wix'),
    '/platformen/wix/': p('wixWsb', 'shopify', 'hostinger'),
    '/platformen/hostinger/': p('hostinger', 'wixWsb'),
    '/platformen/jouwweb/': p('wixWsb', 'hostinger'),
    '/platformen/lightspeed/': p('shopify', 'wix'),
    '/platformen/mijndomein/': p('wixWsb', 'hostinger'),
    '/platformen/woocommerce/': p('shopify', 'wix'),
    // Vergelijken
    '/vergelijken/': p('shopify', 'wix', 'hostinger'),
    '/vergelijken/shopify-vs-lightspeed/': KEUZEHULP, // kaart: alleen Shopify betaald
    '/vergelijken/wix-vs-jouwweb/': KEUZEHULP, // kaart: alleen Wix betaald
    '/vergelijken/shopify-vs-woocommerce/': KEUZEHULP, // kaart: alleen Shopify betaald
    // Gidsen
    '/gidsen/': p('shopify', 'wix', 'hostinger'),
    '/beste-webshop-platform/': p('shopify', 'wix', 'hostinger'),
    '/webshop-beginnen-kosten/': p('shopify', 'wix', 'hostinger'),
    '/gratis-website-maken/': p('wixWsb', 'hostinger'),
    '/website-maken-zzp/': p('wixWsb', 'hostinger', 'shopify'),
    // Blog
    '/blog/': p('shopify', 'wix', 'hostinger'),
    '/blog/webshop-maken-met-ideal/': p('shopify', 'wix'),
    '/blog/herroepingsknop-webshop/': p('shopify', 'wix', 'hostinger'),
    '/blog/shopify-wix-jouwweb-kleine-webshop/': p('shopify', 'wix'),
    '/blog/b2b-webshop-beginnen/': KEUZEHULP, // kaart: alleen Shopify past inhoudelijk
    // Niet op de kaart (posts van 18-11 en 20-11, na de sitemap van 17-11): voorlopig alleen keuzehulp.
    '/blog/hostinger-website-webshop-kosten/': KEUZEHULP,
    '/blog/dropshipping-webshop-maken/': KEUZEHULP,
    '/blog/webshop-maken-met-ai/': KEUZEHULP, // wk48, push 01-12: niet op de kaart, alleen keuzehulp
  },
};
