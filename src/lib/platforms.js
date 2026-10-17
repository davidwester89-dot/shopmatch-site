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
      ['Basic', '€ 21 (jaar) · € 28 (maand)', 'Webshop met onbeperkt producten, 2% extra transactiekosten bij een externe betaalprovider'],
      ['Grow', '€ 59 (jaar) · € 78 (maand)', 'Tot 5 medewerkersaccounts'],
      ['Advanced', '€ 289 (jaar) · € 384 (maand)', 'Tot 15 medewerkersaccounts'],
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
    kort: 'Goedkope websitebouwer met AI, webshop in het Business-pakket.',
    vanaf: 2.99, vanafTekst: '€ 2,99 per maand (Premium, 48 maanden vooraf)',
    plannen: [
      ['Premium', '€ 2,99 (48 mnd vooraf, € 143,52)', 'Verlenging € 9,99 per maand'],
      ['Business', '€ 3,99 (48 mnd vooraf, € 191,52)', 'Met e-commerce; verlenging € 16,99 per maand'],
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
      ['Plus', '€ 324 per jaar', 'Voor groeiende webshops'],
      ['Pro', '€ 522 per jaar', 'Voor grote webshops'],
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
