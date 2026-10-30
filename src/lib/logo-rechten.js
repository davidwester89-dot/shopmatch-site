// Gebruiksrecht van de logo's (nagekeken 30-10-2026 op de merkrichtlijn of perskit van de maker; SC 30-10).
// ZONDER_LOGO: de maker staat logogebruik alleen toe met toestemming, licentie of partnerovereenkomst.
// Die merken krijgen geen logo in de tabelcellen: de naam blijft gewoon staan, net als bij elk ander merk zonder logo.
// 'Geen gepubliceerde beperking gevonden' is geen toestemming: MM beslist; bij een bezwaar gaat het logo eruit.
export const ZONDER_LOGO = new Set(['hostinger', 'lightspeed', 'shopify', 'woocommerce']);
export const LOGO_RECHTEN = {
  'hostinger': { richtlijn: 'https://www.hostinger.com/legal/brand-guidelines-permissions', status: 'GEEN LOGO: vooraf goedkeuring nodig' },
  'jouwweb': { richtlijn: 'geen merkrichtlijn gevonden (jouwweb.nl, 30-10)', status: 'logo: geen gepubliceerde beperking gevonden' },
  'lightspeed': { richtlijn: 'https://www.lightspeedhq.com/legal/lightspeed-trademark-and-copyright-guidelines/', status: 'GEEN LOGO: logogebruik alleen met specifieke licentie of toestemming' },
  'mijndomein': { richtlijn: 'https://press.thesharinggroup.com/assets/217798/', status: "logo: perskit met logo's openbaar" },
  'shopify': { richtlijn: 'https://www.shopify.com/legal/trademarks', status: 'GEEN LOGO: logo en merkmateriaal alleen met uitdrukkelijke schriftelijke toestemming (partners binnen het Partner Program)' },
  'wix': { richtlijn: 'https://www.wix.com/about/design-assets', status: 'logo: toegestaan om Wix aan te duiden; volledig logo ongewijzigd, geen suggestie van partnerschap' },
  'woocommerce': { richtlijn: 'https://woocommerce.com/trademark-guidelines/', status: 'GEEN LOGO: logo alleen met merklicentie van Automattic; naam in platte tekst mag' },
};
