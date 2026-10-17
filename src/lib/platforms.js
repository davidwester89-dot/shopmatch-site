// Platformdata. Alleen feiten van de eigen site van de aanbieder, met bron en controledatum.
// Bedragen in euro, per maand, zoals de aanbieder ze toont (excl. btw tenzij anders vermeld).
// nlCheck: true = bedrag in euro moet nog vanaf een Nederlands IP op de eigen prijspagina bevestigd worden
// (de box ziet daar dollars). Site-controleur bevestigt dit vóór livegang.
export const CHECKED = '2026-10-17';

export const PLATFORMS = {
  shopify: {
    naam: 'Shopify', slug: 'shopify', soort: 'Webshopplatform', url: 'https://www.shopify.com/nl',
    kort: 'Webshopplatform voor wie serieus wil verkopen, ook buiten Nederland.',
    vanaf: 21, vanafTekst: '€ 21 per maand (Basic, jaarbetaling)', nlCheck: true,
    plannen: [
      ['Basic', '€ 21 (bij jaarbetaling) · € 28 bij maandbetaling', 'Webshop met onbeperkt producten, 2% extra transactiekosten bij een externe betaalprovider'],
      ['Grow', '€ 59 (bij jaarbetaling) · € 78 bij maandbetaling', 'Tot 5 medewerkersaccounts'],
      ['Advanced', '€ 289 (bij jaarbetaling) · € 384 bij maandbetaling', 'Tot 15 medewerkersaccounts'],
    ],
    plus: ['Proefperiode van 3 dagen, daarna de eerste 3 maanden voor € 1 per maand', 'Hosting, SSL en een gratis myshopify.com-adres inbegrepen', 'Verkopen in een fysieke winkel met Shopify POS'],
    min: ['Extra transactiekosten (Basic 2%) als je niet met Shopify Payments werkt', 'Veel functies via betaalde apps'],
    voor: 'Starters met groeiplannen en shops die willen verkopen in meerdere landen.',
    bronnen: [['Shopify prijzen', 'https://www.shopify.com/nl/prijzen']],
  },
  wix: {
    naam: 'Wix', slug: 'wix', soort: 'Websitebouwer', url: 'https://nl.wix.com/',
    kort: 'Flexibele websitebouwer met webshopfuncties vanaf het Core-pakket.',
    vanaf: 14, vanafTekst: '€ 14 per maand (Light, jaarbetaling)', nlCheck: true,
    plannen: [
      ['Light', '€ 14', 'Eigen domein, geen Wix-advertenties, geen online betalingen'],
      ['Core', '€ 25', 'Online betalingen en basis-webshop'],
      ['Business', '€ 34', 'Uitgebreidere webshop en meer opslag'],
      ['Business Elite', '€ 149', 'Geavanceerde webshop en ontwikkelaarstools'],
    ],
    plus: ['Gratis versie om de editor te proberen', '14 dagen geld-terug-garantie op een premiumpakket', 'Domeinnaam het eerste jaar inbegrepen bij de meeste jaarpakketten'],
    min: ['Betalingen ontvangen pas vanaf Core', 'Gratis versie met Wix-advertenties en een Wix-adres'],
    voor: 'Dienstverleners en creatieve ondernemers die veel vrijheid in het ontwerp willen.',
    bronnen: [['Wix pakketten', 'https://nl.wix.com/upgrade/website'], ['Wix pakketten FAQ', 'https://www.wix.com/plans']],
  },
  jouwweb: {
    naam: 'JouwWeb', slug: 'jouwweb', soort: 'Websitebouwer', url: 'https://www.jouwweb.nl/',
    kort: 'Websitebouwer uit Eindhoven met webshop zonder verkoopcommissie.',
    vanaf: 5.5, vanafTekst: '€ 5,50 per maand (Lite, jaarbetaling)',
    plannen: [
      ['Gratis', '€ 0', 'Editor proberen, geen eigen domeinnaam'],
      ['Lite', '€ 5,50', 'Eigen domeinnaam (eerste jaar gratis)'],
      ['Pro', '€ 10', 'Webshop tot 10 producten, 1 mailbox'],
      ['Business', '€ 20', 'Webshop met onbeperkt producten, 1 XL-mailbox'],
    ],
    plus: ['0% verkoopcommissie', 'iDEAL, Bancontact, PayPal, Klarna en meer', 'Koppelingen met o.a. e-Boekhouden, Moneybird, Jortt en SnelStart', 'Verzendlabels voor PostNL, DHL, DPD, GLS en UPS'],
    min: ['Pro is beperkt tot 10 producten', 'Domeinnaam na het eerste jaar € 20 per jaar'],
    voor: 'Zzp\'ers en kleine webshops die snel en in het Nederlands willen starten.',
    actie: 'Tot en met 31 oktober 2026 betaal je de eerste 12 maanden de helft.',
    bronnen: [['JouwWeb prijzen', 'https://www.jouwweb.nl/prijzen'], ['JouwWeb webshop', 'https://www.jouwweb.nl/webshop'], ['Over JouwWeb', 'https://www.jouwweb.nl/over-ons']],
  },
  lightspeed: {
    naam: 'Lightspeed eCom', slug: 'lightspeed', soort: 'Webshopplatform', url: 'https://www.lightspeedhq.nl/ecommerce/',
    kort: 'Webshopplatform van kassaleverancier Lightspeed, voor winkels die ook online verkopen.',
    vanaf: 68, vanafTekst: '€ 68 per maand (Essential)',
    plannen: [
      ['Essential', '€ 68', '250 productvarianten, 1 gebruiker, 1 taal, e-mailsupport'],
      ['Advanced', '€ 120', '5.000 varianten, 3 gebruikers, 3 talen, telefonische support'],
      ['Professional', '€ 259', '15.000 varianten, onbeperkt gebruikers, 7 talen, B2B'],
    ],
    plus: ['Vestiging in Amsterdam (Lightspeed Netherlands B.V.)', 'Webshop en kassa van één leverancier', 'Telefonische support vanaf Advanced', 'Maandelijks op te zeggen en te wijzigen'],
    min: ['Duurste instap van deze vergelijking', 'Essential heeft geen telefonische support en geen blog'],
    voor: 'Winkels die hun voorraad in de winkel en online samen willen beheren.',
    bronnen: [['Lightspeed eCom prijzen', 'https://www.lightspeedhq.nl/ecommerce/prijzen/']],
  },
  hostinger: {
    naam: 'Hostinger Website Bouwer', slug: 'hostinger', soort: 'Websitebouwer', url: 'https://www.hostinger.com/nl/website-maken',
    kort: 'Goedkope websitebouwer met AI, webshop vanaf het Onbeperkt-pakket.',
    vanaf: 2.99, vanafTekst: '€ 2,99 per maand (Premium, 48 maanden vooraf)',
    plannen: [
      ['Premium', '€ 2,99 (48 mnd vooraf, € 143,52)', 'Verlenging € 9,99 per maand'],
      ['Onbeperkt', '€ 3,99 (48 mnd vooraf, € 191,52)', 'Met e-commerce, onbeperkt websites; verlenging € 16,99 per maand'],
      ['Cloud Startup', '€ 7,99 (48 mnd vooraf, € 383,52)', 'Verlenging € 23,99 per maand'],
    ],
    plus: ['Laagste instapprijs', '30 dagen geld-terug-garantie', 'Gratis domeinnaam bij jaarpakketten', '24/7 ondersteuning'],
    min: ['Lage prijs alleen bij 48 maanden vooraf betalen', 'Verlenging is duidelijk duurder'],
    voor: 'Starters met een klein budget die een eenvoudige site of kleine shop willen.',
    bronnen: [['Hostinger Website Bouwer', 'https://www.hostinger.com/nl/website-maken']],
  },
  mijndomein: {
    naam: 'Mijndomein MijnWebshop', slug: 'mijndomein', soort: 'Webshopbouwer', url: 'https://www.mijndomein.nl/producten/webshop',
    kort: 'Webshopbouwer van een Nederlandse domeinaanbieder, alles in één pakket.',
    vanaf: 15, vanafTekst: '€ 15 per maand (Start)',
    plannen: [
      ['Start', '€ 15 per maand · € 126 per jaar', '25 producten, voor starters'],
      ['Plus', '€ 29,50 per maand · € 324 per jaar', '1.000 producten, 300 varianten per product'],
      ['Pro', '€ 43,50 per maand · € 522 per jaar', '20.000 producten, 400 varianten per product'],
    ],
    plus: ['Mollie en Stripe: iDEAL, Klarna, PayPal en Apple Pay', 'E-mail, cookiebanner en afspraken boeken in elk pakket', 'Live chat op werkdagen'],
    min: ['Pakketten lopen 12 maanden en verlengen automatisch', 'Start is beperkt tot 25 producten'],
    voor: 'Starters die domein, e-mail en webshop bij één Nederlandse partij willen.',
    actie: 'Bij maandbetaling zijn de eerste 6 maanden nu gratis.',
    bronnen: [['Mijndomein MijnWebshop', 'https://www.mijndomein.nl/producten/webshop'], ['Mijndomein actievoorwaarden', 'https://www.mijndomein.nl/actievoorwaarden']],
  },
  woocommerce: {
    naam: 'WooCommerce', slug: 'woocommerce', soort: 'Open source (WordPress)', url: 'https://woocommerce.com/nl/',
    kort: 'Gratis webshop-plugin voor WordPress: maximale vrijheid, zelf hosten.',
    vanaf: 0, vanafTekst: 'Gratis plugin, je betaalt hosting en extensies',
    plannen: [
      ['WooCommerce', '€ 0', 'Geen abonnement, geen omzetaandeel'],
      ['Hosting', 'Zelf kiezen', 'WooCommerce noemt $ 25 tot $ 350 per maand voor de meeste shops'],
      ['Extensies', 'Per stuk', 'WooCommerce noemt $ 29 tot $ 299 per jaar per extensie'],
    ],
    plus: ['Geen platformkosten of omzetaandeel', 'Onbeperkt producten en varianten', 'Vrije keuze van betaalprovider'],
    min: ['Je regelt zelf hosting, updates en beveiliging', 'Meer technische kennis nodig'],
    voor: 'Wie al met WordPress werkt of volledige controle wil.',
    bronnen: [['WooCommerce prijzen', 'https://woocommerce.com/nl/pricing/']],
  },
};
export const IDS = Object.keys(PLATFORMS);

// ---- Vergelijkingsdata (v2) ----
// Situatie-label per platform (redactie, op basis van pakketten en checklist; zie /beste-webshop-platform/). Nooit op basis van partnerschappen.
export const BEST_FOR = {
  shopify: 'Groei en verkoop over de grens',
  wix: 'Ontwerpvrijheid',
  jouwweb: 'Starters en zzp\'ers',
  lightspeed: 'Winkel met webshop',
  hostinger: 'Laagste instapprijs',
  mijndomein: 'Alles bij één Nederlandse partij',
  woocommerce: 'Volledige controle',
};
// Maandprijs van het goedkoopste pakket waarmee je online kunt verkopen (zelfde bedragen als in PLATFORMS.plannen).
export const VERKOOP_VANAF = { shopify: 21, wix: 25, jouwweb: 10, lightspeed: 68, hostinger: 3.99, mijndomein: 15, woocommerce: 0 };
export const VERKOOP_PAKKET = { shopify: 'Basic, jaarbetaling', wix: 'Core', jouwweb: 'Pro, tot 10 producten', lightspeed: 'Essential', hostinger: 'Onbeperkt, 48 maanden vooraf', mijndomein: 'Start, 25 producten', woocommerce: 'plugin, plus hosting' };
// Maximaal aantal producten in het grootste standaardpakket. Infinity = onbeperkt; null = niet vermeld door de aanbieder.
export const MAX_PRODUCTEN = { shopify: Infinity, wix: Infinity, jouwweb: Infinity, lightspeed: 15000, hostinger: null, mijndomein: 20000, woocommerce: Infinity };

// Checklist per platform. v: 'ja' | 'deels' | 'nee' | null (= niet vermeld op de site van de aanbieder).
// t: korte toelichting. s: bron-URL (alleen sites van de aanbieder zelf, of de plugin bij WooCommerce).
const S = {
  shopPrijs: 'https://www.shopify.com/nl/prijzen', shopPay: 'https://help.shopify.com/nl/manual/payments/shopify-payments/local-payment-methods',
  shopB2b: 'https://help.shopify.com/nl/manual/b2b', shopTaal: 'https://help.shopify.com/nl/manual/markets/languages', shopPos: 'https://www.shopify.com/nl/pos',
  wixPlan: 'https://nl.wix.com/upgrade/website', wixIdeal: 'https://support.wix.com/nl/article/ideal-als-betaalmethode-koppelen-via-wix-payments',
  wixTaal: 'https://support.wix.com/nl/article/wix-multilingual-een-overzicht', wixMaand: 'https://support.wix.com/nl/article/een-maandelijks-pakket-kopen',
  jwPrijs: 'https://www.jouwweb.nl/prijzen', jwShop: 'https://www.jouwweb.nl/webshop', jwOver: 'https://www.jouwweb.nl/over-ons',
  jwTaal: 'https://help.jouwweb.nl/hc/nl/articles/28594189281809-Kan-ik-een-meertalige-website-maken',
  lsPrijs: 'https://www.lightspeedhq.nl/ecommerce/prijzen/', lsIdeal: 'https://ecom-support.lightspeedhq.com/hc/nl/articles/360001446194-Kies-een-betaalmethode-die-bij-je-past',
  lsPay: 'https://www.lightspeedhq.nl/ecommerce/betaalmethodes/',
  hoBouw: 'https://www.hostinger.com/nl/website-maken', hoIdeal: 'https://www.hostinger.com/support/6538716-hostinger-ecommerce-accepting-payments-via-ideal/',
  mdShop: 'https://www.mijndomein.nl/producten/webshop',
  wooPrijs: 'https://woocommerce.com/nl/pricing/', wooPay: 'https://woocommerce.com/document/woopayments/payment-methods/',
  wooB2b: 'https://woocommerce.com/products/b2b-for-woocommerce/', wooPos: 'https://woocommerce.com/woocommerce-pos/', wpml: 'https://wpml.org/',
};
export const FEATURES = {
  shopify: {
    ideal: { v: 'ja', t: 'Via Shopify Payments', s: S.shopPay },
    geenfee: { v: 'deels', t: 'Alleen met Shopify Payments; anders 2% extra op Basic', s: S.shopPrijs },
    nl: { v: 'nee', t: 'Internationale aanbieder' },
    onbeperkt: { v: 'ja', t: 'Vanaf Basic', s: S.shopPrijs },
    b2b: { v: 'ja', t: 'Vanaf Basic, tot 3 catalogi', s: S.shopB2b },
    talen: { v: 'ja', t: 'Meerdere talen per markt', s: S.shopTaal },
    pos: { v: 'ja', t: 'Shopify POS', s: S.shopPos },
    hosting: { v: 'ja', t: 'Hosting en SSL inbegrepen', s: S.shopPrijs },
    proberen: { v: 'ja', t: '3 dagen gratis, daarna 3 maanden € 1 per maand', s: S.shopPrijs },
    maand: { v: 'ja', t: 'Basic € 28 bij maandbetaling', s: S.shopPrijs },
  },
  wix: {
    ideal: { v: 'ja', t: 'Via Wix Payments of Stripe', s: S.wixIdeal },
    geenfee: { v: null },
    nl: { v: 'nee', t: 'Internationale aanbieder' },
    onbeperkt: { v: 'ja', t: 'Vanaf Core', s: S.wixPlan },
    b2b: { v: null },
    talen: { v: 'ja', t: 'Wix Multilingual', s: S.wixTaal },
    pos: { v: null },
    hosting: { v: 'ja', t: 'Hosting inbegrepen', s: S.wixPlan },
    proberen: { v: 'ja', t: 'Gratis versie en 14 dagen geld terug', s: S.wixPlan },
    maand: { v: 'ja', t: 'Maandpakket mogelijk', s: S.wixMaand },
  },
  jouwweb: {
    ideal: { v: 'ja', t: 'Zonder commissie', s: S.jwShop },
    geenfee: { v: 'ja', t: '0% verkoopcommissie', s: S.jwPrijs },
    nl: { v: 'ja', t: 'Eindhoven', s: S.jwOver },
    onbeperkt: { v: 'ja', t: 'Business', s: S.jwPrijs },
    b2b: { v: 'ja', t: 'B2B-webshop en btw verleggen', s: S.jwShop },
    talen: { v: 'deels', t: 'Eén extra site per taal', s: S.jwTaal },
    pos: { v: null },
    hosting: { v: 'ja', t: 'Hosting inbegrepen', s: S.jwPrijs },
    proberen: { v: 'ja', t: 'Gratis pakket', s: S.jwPrijs },
    maand: { v: 'ja', t: 'Maandbetaling, 1 maand opzegtermijn', s: S.jwPrijs },
  },
  lightspeed: {
    ideal: { v: 'ja', t: 'Via Lightspeed Payments of een betaalprovider', s: S.lsIdeal },
    geenfee: { v: 'ja', t: 'Geen transactiekosten bij externe betaalproviders', s: S.lsPay },
    nl: { v: 'ja', t: 'Vestiging in Amsterdam', s: S.lsPrijs },
    onbeperkt: { v: 'nee', t: 'Maximaal 15.000 varianten (Professional)', s: S.lsPrijs },
    b2b: { v: 'ja', t: 'In Professional (€ 259)', s: S.lsPrijs },
    talen: { v: 'ja', t: '3 talen (Advanced), 7 (Professional)', s: S.lsPrijs },
    pos: { v: 'ja', t: 'Kassa van Lightspeed', s: S.lsPrijs },
    hosting: { v: 'ja', t: 'Hosting inbegrepen', s: S.lsPrijs },
    proberen: { v: null },
    maand: { v: 'ja', t: 'Maandelijks op te zeggen', s: S.lsPrijs },
  },
  hostinger: {
    ideal: { v: 'ja', t: 'Via Stripe', s: S.hoIdeal },
    geenfee: { v: 'ja', t: '0% transactiekosten', s: S.hoBouw },
    nl: { v: 'nee', t: 'Internationale aanbieder' },
    onbeperkt: { v: null },
    b2b: { v: null },
    talen: { v: null },
    pos: { v: null },
    hosting: { v: 'ja', t: 'Hosting inbegrepen', s: S.hoBouw },
    proberen: { v: 'ja', t: '30 dagen geld terug', s: S.hoBouw },
    maand: { v: 'nee', t: 'Je betaalt de looptijd vooraf', s: S.hoBouw },
  },
  mijndomein: {
    ideal: { v: 'ja', t: 'Via Mollie en Stripe', s: S.mdShop },
    geenfee: { v: null },
    nl: { v: 'ja', t: 'Nederlandse aanbieder', s: S.mdShop },
    onbeperkt: { v: 'nee', t: 'Maximaal 20.000 producten (Pro)', s: S.mdShop },
    b2b: { v: null },
    talen: { v: null },
    pos: { v: null },
    hosting: { v: 'ja', t: 'Hosting en e-mail inbegrepen', s: S.mdShop },
    proberen: { v: 'deels', t: 'Actie: eerste 6 maanden gratis bij maandbetaling', s: S.mdShop },
    maand: { v: 'deels', t: 'Per maand betalen, maar het pakket loopt 12 maanden', s: S.mdShop },
  },
  woocommerce: {
    ideal: { v: 'ja', t: 'Via WooPayments of een betaalplugin', s: S.wooPay },
    geenfee: { v: 'ja', t: 'Geen omzetaandeel', s: S.wooPrijs },
    nl: { v: 'nee', t: 'Internationale aanbieder' },
    onbeperkt: { v: 'ja', t: 'Onbeperkt producten en varianten', s: S.wooPrijs },
    b2b: { v: 'deels', t: 'Via een betaalde extensie', s: S.wooB2b },
    talen: { v: 'deels', t: 'Via een plugin, zoals WPML', s: S.wpml },
    pos: { v: 'ja', t: 'WooCommerce POS in de app (tablet)', s: S.wooPos },
    hosting: { v: 'nee', t: 'Hosting, updates en beveiliging regel je zelf', s: S.wooPrijs },
    proberen: { v: 'ja', t: 'De plugin is gratis; hosting betaal je zelf', s: S.wooPrijs },
    maand: { v: 'ja', t: 'Geen abonnement voor de plugin', s: S.wooPrijs },
  },
};
