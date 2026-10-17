import { SITE, esc, ORG, GA_ID } from './layout.mjs';
import { IDS, CHECKED } from './lib/platforms.js';
import { knop } from './lib/partnerlinks.js';
import { VRAGEN } from './lib/match.js';
import { P, by, bron, matchCta, article, faqHtml, plansTable, card } from './parts.mjs';

const HERO_ART = `<svg viewBox="0 0 480 360" role="img" aria-label="Illustratie: webshop op laptop en telefoon"><rect width="480" height="360" fill="#f3e7d8"/><rect x="60" y="70" width="290" height="190" rx="14" fill="#fff" stroke="#2b1d16" stroke-width="6"/><rect x="40" y="260" width="330" height="18" rx="9" fill="#2b1d16"/><rect x="84" y="96" width="242" height="26" rx="6" fill="#b44d22"/><rect x="84" y="136" width="70" height="70" rx="8" fill="#f0a37c"/><rect x="170" y="136" width="70" height="70" rx="8" fill="#1f5f4f"/><rect x="256" y="136" width="70" height="70" rx="8" fill="#ead9c4"/><rect x="84" y="218" width="110" height="18" rx="9" fill="#b44d22"/><rect x="330" y="140" width="96" height="170" rx="14" fill="#fff" stroke="#2b1d16" stroke-width="6"/><rect x="346" y="162" width="64" height="48" rx="6" fill="#f0a37c"/><rect x="346" y="222" width="64" height="12" rx="6" fill="#ead9c4"/><rect x="346" y="244" width="40" height="12" rx="6" fill="#ead9c4"/><rect x="346" y="276" width="64" height="18" rx="9" fill="#b44d22"/><circle cx="410" cy="78" r="34" fill="#1f5f4f"/><path d="m394 79 11 11 22-22" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const homeFaq = [
  ['Wat is het beste webshop-platform voor een starter?', 'Dat hangt af van je aantal producten en budget. Met een paar producten en een klein budget start je goedkoop met JouwWeb Pro (€ 10 per maand, tot 10 producten). Wil je groeien of over de grens verkopen, dan is Shopify sterker. Zie <a href="/beste-webshop-platform/">beste webshop-platform 2026</a>.'],
  ['Kan ik gratis een website maken?', 'Ja, bij JouwWeb en Wix kan dat met een gratis pakket, maar zonder eigen domeinnaam. Lees <a href="/gratis-website-maken/">gratis website maken</a>.'],
  ['Verdient ShopMatch aan de aanbevelingen?', 'Bij sommige aanbieders kunnen we in de toekomst een vergoeding krijgen via een partnerlink. Die links hebben altijd het label "partnerlink" en tellen nooit mee in de match of de volgorde.'],
];

export const home = {
  path: '/', title: 'ShopMatch: welk webshop-platform past bij jou?', h1: 'Welke webshop of website past bij jou?', og: 'home',
  description: 'Vergelijk Shopify, Wix, JouwWeb, Lightspeed, Hostinger, Mijndomein en WooCommerce. Doe de match en zie in 1 minuut welk platform bij je past.',
  schema: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: homeFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }],
  body: `<section class="hero"><div><h1>Welke <b>webshop</b> of website past bij jou?</h1><p class="tagline">Shopify, Wix, JouwWeb en meer naast elkaar.</p><p class="lead">Zeven platforms met de prijzen van de aanbieders zelf. Vijf vragen en je weet welke drie bij je passen.</p><div class="actions"><a class="btn" href="/shop-match/" data-cta="home_hero">Doe de match</a><a class="btn ghost" href="/vergelijken/">Alles vergelijken</a></div></div><div class="art">${HERO_ART}</div></section>
<h2>Zo werkt het</h2><ol class="steps"><li>Vertel wat je wilt verkopen en hoeveel producten je hebt.</li><li>Geef je budget en hoe technisch je bent.</li><li>Zie de drie platforms die passen, met prijs en uitleg.</li></ol>
<h2>De platforms</h2><div class="grid">${IDS.map(card).join('')}</div>
<h2>Populaire vergelijkingen</h2><div class="grid"><a class="card link" href="/vergelijken/shopify-vs-lightspeed/"><h3 class="h3">Shopify of Lightspeed</h3><p class="meta">Voor winkels die ook online verkopen.</p></a><a class="card link" href="/vergelijken/wix-vs-jouwweb/"><h3 class="h3">Wix of JouwWeb</h3><p class="meta">Websitebouwers voor zzp'ers en kleine shops.</p></a><a class="card link" href="/vergelijken/shopify-vs-woocommerce/"><h3 class="h3">Shopify of WooCommerce</h3><p class="meta">Alles geregeld of alles zelf in de hand.</p></a></div>
<h2>Gidsen</h2><ul><li><a href="/beste-webshop-platform/">Het beste webshop-platform van 2026, per situatie</a></li><li><a href="/webshop-beginnen-kosten/">Webshop beginnen: wat kost het?</a></li><li><a href="/gratis-website-maken/">Gratis website maken: wat kan wel en niet?</a></li><li><a href="/website-maken-zzp/">Website maken als zzp'er</a></li></ul>
<h2>Waarom ShopMatch</h2><ul><li><strong>Prijzen van de bron.</strong> Elk bedrag komt van de site van de aanbieder, met link.</li><li><strong>Onafhankelijk.</strong> We bouwen geen webshops en verkopen geen pakketten.</li><li><strong>Eerlijke match.</strong> Partnerlinks tellen nooit mee in het advies.</li></ul>
${faqHtml(homeFaq)}`,
};

export const quiz = {
  path: '/shop-match/', title: 'ShopMatch: vind in 1 minuut je webshop-platform', h1: 'Doe de ShopMatch', crumb: 'De match', og: 'match', noCta: true,
  description: 'Vijf vragen over je plannen, aantal producten, budget en ervaring. Je krijgt de drie platforms die het best passen, met prijs.',
  scripts: ['/js/quiz.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'ShopMatch', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE.domain + '/shop-match/', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: ORG }],
  body: `<h1>Doe de ShopMatch</h1><p class="lead">Vijf vragen. Je antwoorden blijven in je browser.</p>
<form id="form" class="quiz" novalidate>${VRAGEN.map((v) => `<fieldset><legend>${esc(v.vraag)}</legend><div class="opts">${v.opties.map(([val, t]) => `<label><input type="radio" name="${v.id}" value="${val}" required><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`).join('')}
<button class="btn" type="submit">Toon mijn match</button></form>
<noscript><p class="note">De match werkt met JavaScript. Zonder JavaScript vind je alle platforms naast elkaar op <a href="/vergelijken/">vergelijken</a>.</p></noscript>
<section id="result" class="result" hidden aria-live="polite"></section>
<p class="src">Prijzen gecontroleerd op 17 oktober 2026 bij de aanbieders. Partnerlinks tellen niet mee in de volgorde.</p>`,
};

// ---- Platformpagina's ----
const RELATED = {
  shopify: [['/vergelijken/shopify-vs-lightspeed/', 'Shopify of Lightspeed'], ['/vergelijken/shopify-vs-woocommerce/', 'Shopify of WooCommerce']],
  lightspeed: [['/vergelijken/shopify-vs-lightspeed/', 'Shopify of Lightspeed']],
  woocommerce: [['/vergelijken/shopify-vs-woocommerce/', 'Shopify of WooCommerce']],
  wix: [['/vergelijken/wix-vs-jouwweb/', 'Wix of JouwWeb']],
  jouwweb: [['/vergelijken/wix-vs-jouwweb/', 'Wix of JouwWeb']],
  hostinger: [['/gratis-website-maken/', 'Gratis website maken']],
  mijndomein: [['/webshop-beginnen-kosten/', 'Wat kost een webshop?']],
};
export const platformPages = IDS.map((id) => {
  const p = P[id];
  const path = `/platformen/${p.slug}/`;
  const h1 = `${p.naam}: prijzen, voor- en nadelen`;
  return {
    ...article({ path, title: `${p.naam} prijzen 2026 | ShopMatch`, h1, description: `${p.naam} vanaf ${p.vanafTekst}. Alle pakketten, wat je krijgt, voor wie het past en de nadelen, met prijzen van de site van ${p.naam.split(' ')[0]}.`, og: `platform-${id}`, parents: [['/platformen/', 'Platformen']] }),
    navPath: '/platformen/',
    body: `<article><h1>${esc(h1)}</h1>${by()}<p class="lead">${esc(p.kort)} Vanaf ${esc(p.vanafTekst)}.</p>
<div class="out">${knop(id, 'platform_top')}<a class="btn ghost small" href="/shop-match/">Past het bij mij?</a></div>
<h2>Pakketten en prijzen</h2>${plansTable(p)}${p.actie ? `<p class="note">${esc(p.actie)}</p>` : ''}
<h2>Voor- en nadelen</h2><div class="pm"><div class="card plus"><h3>Sterk</h3><ul>${p.plus.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="card min"><h3>Let op</h3><ul>${p.min.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
<h2>Voor wie?</h2><p>${esc(p.voor)}</p>
${(RELATED[id] || []).length ? `<p>Lees ook: ${RELATED[id].map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join(' · ')}</p>` : ''}
<div class="out">${knop(id, 'platform_bottom')}</div>
${matchCta(`Is ${esc(p.naam)} de beste keuze voor jou?`)}${bron(p.bronnen)}</article>`,
  };
});

export const platformHub = {
  path: '/platformen/', title: 'Webshop-platforms 2026: alle prijzen | ShopMatch', h1: 'Alle platforms', crumb: 'Platformen', og: 'platformen', stamp: { checked: CHECKED },
  description: 'Shopify, Wix, JouwWeb, Lightspeed eCom, Hostinger, Mijndomein en WooCommerce: per platform de pakketten, prijzen en voor wie het past.',
  schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: IDS.map((id, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.domain}/platformen/${P[id].slug}/`, name: P[id].naam })) }],
  body: `<h1>Alle platforms</h1><p class="lead">Zeven manieren om online te gaan, van gratis plugin tot compleet webshopplatform.</p><div class="grid">${IDS.map(card).join('')}</div>${matchCta()}`,
};

// ---- Vergelijkingen ----
const cmpRow = (label, a, b) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`;
const cmpTable = (a, b, rows) => `<div class="tbl"><table><thead><tr><th></th><th>${esc(P[a].naam)}</th><th>${esc(P[b].naam)}</th></tr></thead><tbody>${rows.map((r) => cmpRow(...r)).join('')}</tbody></table></div>`;
const cmp = ({ slug, a, b, h1, title, description, intro, rows, kiesA, kiesB, faq }) => ({
  ...article({ path: `/vergelijken/${slug}/`, title, h1, description, og: `vs-${slug}`, parents: [['/vergelijken/', 'Vergelijken']], faq }),
  navPath: '/vergelijken/',
  body: `<article><h1>${esc(h1)}</h1>${by()}<p class="lead">${intro}</p>${cmpTable(a, b, rows)}
<h2>Kies ${esc(P[a].naam)} als</h2><ul>${kiesA.map((x) => `<li>${x}</li>`).join('')}</ul><div class="out">${knop(a, 'vs_a')}</div>
<h2>Kies ${esc(P[b].naam)} als</h2><ul>${kiesB.map((x) => `<li>${x}</li>`).join('')}</ul><div class="out">${knop(b, 'vs_b')}</div>
${faqHtml(faq)}${matchCta()}<p>Meer weten? <a href="/platformen/${P[a].slug}/">${esc(P[a].naam)}</a> · <a href="/platformen/${P[b].slug}/">${esc(P[b].naam)}</a></p>${bron(P[a].bronnen, P[b].bronnen)}</article>`,
});

export const vsPages = [
  cmp({
    slug: 'shopify-vs-lightspeed', a: 'shopify', b: 'lightspeed', h1: 'Shopify of Lightspeed eCom: welke past bij je winkel?',
    title: 'Shopify vs Lightspeed eCom 2026 | ShopMatch',
    description: 'Shopify vanaf € 21, Lightspeed eCom vanaf € 68 per maand. De verschillen in prijs, limieten, support en kassa, en wanneer je welke kiest.',
    intro: 'Allebei bouwen ze webshops én kassasystemen. Shopify is goedkoper om te starten. Lightspeed heeft een vestiging in Amsterdam en telefonische support vanaf Advanced.',
    rows: [['Instapprijs', '€ 21 per maand (Basic, jaar)', '€ 68 per maand (Essential)'], ['Producten', 'Onbeperkt', '250 varianten (Essential), 5.000 (Advanced)'], ['Gebruikers', '1 (Basic), tot 5 (Grow)', '1 (Essential), 3 (Advanced)'], ['Support', 'Online', 'E-mail (Essential), telefonisch vanaf Advanced'], ['Winkelkassa', 'Shopify POS', 'Lightspeed kassa'], ['Extra transactiekosten', '2% op Basic bij externe betaalprovider', 'Niet vermeld op de prijspagina']],
    kiesA: ['je met een kleiner budget start', 'je onbeperkt producten wilt zonder hoger pakket', 'je ook in andere landen wilt verkopen'],
    kiesB: ['je een fysieke winkel hebt en voorraad op één plek wilt', 'je telefonische support in het Nederlands belangrijk vindt', 'je B2B wilt verkopen (Professional)'],
    faq: [['Is Shopify goedkoper dan Lightspeed?', 'Bij de instap wel: Shopify Basic kost € 21 per maand bij jaarbetaling, Lightspeed eCom Essential € 68 per maand.'], ['Hebben beide een kassasysteem?', 'Ja. Shopify heeft Shopify POS en Lightspeed levert eigen kassasystemen.']],
  }),
  cmp({
    slug: 'wix-vs-jouwweb', a: 'wix', b: 'jouwweb', h1: 'Wix of JouwWeb: welke websitebouwer kies je?',
    title: 'Wix vs JouwWeb 2026: prijzen en verschillen',
    description: 'JouwWeb vanaf € 5,50, Wix vanaf € 14 per maand. Webshop, betaalmethoden, boekhoudkoppelingen en ontwerp naast elkaar.',
    intro: 'Twee websitebouwers met een gratis versie. JouwWeb komt uit Eindhoven en is goedkoper; Wix geeft meer ontwerpvrijheid.',
    rows: [['Instapprijs', '€ 14 per maand (Light)', '€ 5,50 per maand (Lite)'], ['Webshop vanaf', '€ 25 per maand (Core)', '€ 10 per maand (Pro, 10 producten)'], ['Onbeperkt producten', 'Vanaf Core', 'Business, € 20 per maand'], ['Verkoopcommissie', 'Niet vermeld op de prijspagina', '0%'], ['Boekhoudkoppelingen', 'Niet vermeld op de prijspagina', 'o.a. e-Boekhouden, Moneybird, Jortt, SnelStart'], ['Gratis versie', 'Ja, met Wix-advertenties', 'Ja, zonder eigen domeinnaam'], ['Geld terug', '14 dagen', 'Niet vermeld']],
    kiesA: ['ontwerp en vrijheid voor je het belangrijkst zijn', 'je eerst 14 dagen met geld-terug-garantie wilt proberen'],
    kiesB: ['je goedkoop wilt starten met een kleine webshop', 'je een koppeling met je boekhoudprogramma wilt', 'je hulp in het Nederlands wilt'],
    faq: [['Is JouwWeb goedkoper dan Wix?', 'Ja. Een webshop kost bij JouwWeb vanaf € 10 per maand (Pro), bij Wix vanaf € 25 per maand (Core).'], ['Kan ik bij Wix gratis een webshop maken?', 'Nee. Online betalingen ontvangen kan bij Wix vanaf het Core-pakket.']],
  }),
  cmp({
    slug: 'shopify-vs-woocommerce', a: 'shopify', b: 'woocommerce', h1: 'Shopify of WooCommerce: alles geregeld of alles zelf?',
    title: 'Shopify vs WooCommerce 2026: kosten | ShopMatch',
    description: 'Shopify kost vanaf € 21 per maand all-in, WooCommerce is gratis maar je betaalt hosting en extensies. Zo kies je.',
    intro: 'Shopify regelt hosting, beveiliging en updates voor je. WooCommerce is een gratis plugin voor WordPress: je hebt alles in de hand, maar regelt het ook zelf.',
    rows: [['Platformkosten', '€ 21 per maand (Basic, jaar)', '€ 0'], ['Hosting', 'Inbegrepen', 'Zelf regelen; WooCommerce noemt $ 25 tot $ 350 per maand'], ['Extensies', 'Apps, vaak betaald', '$ 29 tot $ 299 per jaar per extensie'], ['Betaalprovider', 'Shopify Payments, anders 2% extra (Basic)', 'Vrij te kiezen, geen extra kosten'], ['Onderhoud', 'Door Shopify', 'Zelf: updates en beveiliging'], ['Technische kennis', 'Weinig nodig', 'Meer nodig']],
    kiesA: ['je snel wilt starten zonder technisch gedoe', 'je geen tijd wilt steken in updates en beveiliging'],
    kiesB: ['je al een WordPress-site hebt', 'je vrij wilt kiezen in betaalprovider en hosting', 'je zelf (of je bouwer) technisch onderhoud aankunt'],
    faq: [['Is WooCommerce echt gratis?', 'De plugin wel. Hosting, een domein en betaalde extensies betaal je zelf.'], ['Rekent Shopify transactiekosten?', 'Werk je met een externe betaalprovider in plaats van Shopify Payments, dan rekent Shopify op Basic 2% extra per transactie.']],
  }),
];

const allRows = IDS.map((id) => `<tr><th scope="row"><a href="/platformen/${P[id].slug}/">${esc(P[id].naam)}</a></th><td>${esc(P[id].soort)}</td><td>${esc(P[id].vanafTekst)}</td><td>${esc(P[id].voor)}</td></tr>`).join('');
export const vsHub = {
  path: '/vergelijken/', title: 'Webshop-platforms vergelijken 2026 | ShopMatch', h1: 'Vergelijken', crumb: 'Vergelijken', og: 'vergelijken', stamp: { checked: CHECKED },
  description: 'Alle zeven platforms in één tabel: soort, instapprijs en voor wie het past. Plus de vergelijkingen Shopify vs Lightspeed, Wix vs JouwWeb en Shopify vs WooCommerce.',
  body: `<h1>Webshop-platforms vergelijken</h1><p class="lead">Instapprijzen van de aanbieders zelf, excl. btw.</p><div class="tbl"><table><thead><tr><th>Platform</th><th>Soort</th><th>Vanaf</th><th>Past bij</th></tr></thead><tbody>${allRows}</tbody></table></div>
<h2>Twee platforms naast elkaar</h2><div class="grid">${vsPages.map((v) => `<a class="card link" href="${v.path}"><h3 class="h3">${esc(v.h1.split(':')[0])}</h3><p class="meta">${esc(v.description)}</p></a>`).join('')}</div>${matchCta()}`,
};

// ---- Gidsen ----
const G = [['/gidsen/', 'Gidsen']];
const kostRows = [
  ['jouwweb', 'Pro (tot 10 producten)', '€ 120', 'Business (onbeperkt): € 240 per jaar'],
  ['hostinger', 'Business', '€ 191,52 voor 48 maanden', 'Daarna € 16,99 per maand'],
  ['mijndomein', 'MijnWebshop Start (25 producten)', '€ 126', 'Pakket loopt 12 maanden'],
  ['shopify', 'Basic', '€ 252', '2% extra per transactie bij externe betaalprovider'],
  ['wix', 'Core', '€ 300', 'Betalingen ontvangen vanaf Core'],
  ['lightspeed', 'Essential', '€ 816', '250 productvarianten'],
  ['woocommerce', 'Plugin', '€ 0', 'Plus hosting: WooCommerce noemt $ 25 tot $ 350 per maand'],
];
const besteFaq = [
  ['Wat is het beste webshop-platform in 2026?', 'Er is geen platform dat voor iedereen het beste is. Voor een kleine start is JouwWeb het goedkoopst met een volwaardige webshop, voor groei en verkoop over de grens is Shopify het sterkst en voor een winkel met webshop past Lightspeed eCom.'],
  ['Wat is het goedkoopste webshop-platform?', 'Hostinger Website Bouwer Business kost € 3,99 per maand als je 48 maanden vooraf betaalt. Bij maandelijks opzegbare pakketten is JouwWeb Pro met € 10 per maand het goedkoopst.'],
];
export const beste = {
  ...article({ path: '/beste-webshop-platform/', title: 'Beste webshop-platform 2026: keuze per situatie', h1: 'Het beste webshop-platform van 2026', description: 'Welk webshop-platform is het beste in 2026? Per situatie de beste keuze: starters, klein budget, groei, winkel met webshop en volledige controle.', og: 'beste-webshop-platform', parents: G, faq: besteFaq }),
  navPath: '/gidsen/',
  body: `<article><h1>Het beste webshop-platform van 2026</h1>${by()}<p class="lead">Het beste platform hangt af van wat je verkoopt, hoeveel producten je hebt en hoeveel tijd je in techniek wilt steken. Dit is onze keuze per situatie.</p>
<h2>Beste voor starters met een paar producten: JouwWeb</h2><p>JouwWeb Pro kost € 10 per maand voor een webshop tot 10 producten, zonder verkoopcommissie. Met Business (€ 20) verkoop je onbeperkt. iDEAL en koppelingen met boekhoudprogramma's zitten erin.</p><div class="out">${knop('jouwweb', 'gids_beste')}</div>
<h2>Beste met het kleinste budget: Hostinger Website Bouwer</h2><p>Het Business-pakket met e-commerce kost € 3,99 per maand, maar alleen als je 48 maanden vooraf betaalt (€ 191,52). Daarna verleng je voor € 16,99 per maand.</p><div class="out">${knop('hostinger', 'gids_beste')}</div>
<h2>Beste om te groeien en internationaal te verkopen: Shopify</h2><p>Onbeperkt producten vanaf Basic (€ 21 per maand bij jaarbetaling) en een grote appwinkel. Let op de 2% extra transactiekosten als je niet met Shopify Payments werkt.</p><div class="out">${knop('shopify', 'gids_beste')}</div>
<h2>Beste voor een winkel met webshop: Lightspeed eCom</h2><p>Webshop en kassa van één leverancier. Essential kost € 68 per maand; telefonische support krijg je vanaf Advanced (€ 120).</p><div class="out">${knop('lightspeed', 'gids_beste')}</div>
<h2>Beste alles-in-één bij een Nederlandse partij: Mijndomein</h2><p>Domein, e-mail, cookiebanner en webshop in één pakket. MijnWebshop Start kost € 15 per maand voor 25 producten; het pakket loopt 12 maanden.</p><div class="out">${knop('mijndomein', 'gids_beste')}</div>
<h2>Beste voor ontwerpvrijheid: Wix</h2><p>Veel vrijheid in vormgeving. Online betalingen ontvangen kan vanaf Core (€ 25 per maand).</p><div class="out">${knop('wix', 'gids_beste')}</div>
<h2>Beste voor volledige controle: WooCommerce</h2><p>Gratis plugin voor WordPress, zonder platformkosten of omzetaandeel. Je regelt zelf hosting, updates en beveiliging.</p><div class="out">${knop('woocommerce', 'gids_beste')}</div>
<h2>Alles op een rij</h2><div class="tbl"><table><thead><tr><th>Situatie</th><th>Platform</th><th>Vanaf per maand</th></tr></thead><tbody><tr><td>Paar producten</td><td><a href="/platformen/jouwweb/">JouwWeb</a></td><td>€ 10</td></tr><tr><td>Kleinste budget</td><td><a href="/platformen/hostinger/">Hostinger</a></td><td>€ 3,99 (48 mnd vooraf)</td></tr><tr><td>Groei en buitenland</td><td><a href="/platformen/shopify/">Shopify</a></td><td>€ 21</td></tr><tr><td>Winkel met webshop</td><td><a href="/platformen/lightspeed/">Lightspeed eCom</a></td><td>€ 68</td></tr><tr><td>Alles bij één partij</td><td><a href="/platformen/mijndomein/">Mijndomein</a></td><td>€ 15</td></tr><tr><td>Ontwerpvrijheid</td><td><a href="/platformen/wix/">Wix</a></td><td>€ 25</td></tr><tr><td>Volledige controle</td><td><a href="/platformen/woocommerce/">WooCommerce</a></td><td>€ 0 + hosting</td></tr></tbody></table></div>
${faqHtml(besteFaq)}${matchCta('Welke past bij jouw situatie?')}${bron(...['jouwweb', 'hostinger', 'shopify', 'lightspeed', 'mijndomein', 'wix', 'woocommerce'].map((i) => P[i].bronnen))}</article>`,
};

const kostenFaq = [
  ['Wat kost een webshop beginnen per jaar?', 'Alleen aan platformkosten tussen € 0 (WooCommerce, plus hosting) en € 816 (Lightspeed eCom Essential). Een kleine webshop bij JouwWeb Pro kost € 120 per jaar.'],
  ['Welke kosten komen er nog bij?', 'Een domeinnaam, transactiekosten per betaling, eventueel betaalde apps of een thema, en je boekhouding.'],
];
export const kosten = {
  ...article({ path: '/webshop-beginnen-kosten/', title: 'Webshop beginnen: wat kost het in 2026?', h1: 'Webshop beginnen: wat kost het?', description: 'Wat kost een webshop beginnen in 2026? De jaarkosten per platform, van € 0 tot € 816, plus domein, transactiekosten en apps.', og: 'webshop-beginnen-kosten', parents: G, faq: kostenFaq }),
  navPath: '/gidsen/',
  body: `<article><h1>Webshop beginnen: wat kost het?</h1>${by()}<p class="lead">De grootste vaste post is het abonnement van je platform. Dit betaal je in het eerste jaar voor het goedkoopste pakket waarmee je kunt verkopen, excl. btw.</p>
<h2>Platformkosten in het eerste jaar</h2><div class="tbl"><table><thead><tr><th>Platform</th><th>Pakket</th><th>Eerste jaar</th><th>Let op</th></tr></thead><tbody>${kostRows.map(([id, pk, j, l]) => `<tr><th scope="row"><a href="/platformen/${P[id].slug}/">${esc(P[id].naam)}</a></th><td>${esc(pk)}</td><td>${esc(j)}</td><td>${esc(l)}</td></tr>`).join('')}</tbody></table></div>
<p>Shopify, Wix en Lightspeed: maandprijs × 12, bij Shopify en Wix met jaarbetaling. Acties zoals de korting van JouwWeb tot en met 31 oktober 2026 en de 6 gratis maanden bij Mijndomein zijn niet meegerekend.</p>
<h2>Wat er nog bijkomt</h2><ul><li><strong>Domeinnaam.</strong> Vaak het eerste jaar inbegrepen. Bij JouwWeb betaal je daarna € 20 per jaar.</li><li><strong>Transactiekosten.</strong> Elke betaalprovider rekent per betaling. Shopify rekent op Basic 2% extra als je niet met Shopify Payments werkt.</li><li><strong>Apps en thema's.</strong> Bij Shopify en WooCommerce betaal je extra functies vaak los. WooCommerce noemt $ 29 tot $ 299 per jaar per extensie.</li><li><strong>Boekhouding.</strong> Met een webshop heb je een boekhoudprogramma nodig voor facturen en btw. Vergelijk ze op <a href="https://boekhoudmatch.nl/">BoekhoudMatch</a>.</li></ul>
<h2>Zo houd je de kosten laag</h2><ol class="steps"><li>Begin met het kleinste pakket dat bij je aantal producten past.</li><li>Kies een platform zonder verkoopcommissie of met de betaalprovider van het platform.</li><li>Betaal per jaar zodra je zeker bent van je keuze.</li></ol>
${faqHtml(kostenFaq)}${matchCta('Welk platform past bij jouw budget?')}${bron(...['jouwweb', 'hostinger', 'mijndomein', 'shopify', 'wix', 'lightspeed', 'woocommerce'].map((i) => P[i].bronnen))}</article>`,
};

const gratisFaq = [
  ['Kan ik echt gratis een website maken?', 'Ja, bij JouwWeb en Wix. Je krijgt dan geen eigen domeinnaam en bij Wix staan er Wix-advertenties op je site.'],
  ['Kan ik gratis een webshop maken?', 'Niet blijvend bij een websitebouwer: verkopen kan bij JouwWeb vanaf Pro (€ 10) en bij Wix vanaf Core (€ 25 per maand). WooCommerce is gratis, maar hosting niet.'],
];
export const gratis = {
  ...article({ path: '/gratis-website-maken/', title: 'Gratis website maken 2026: wat kan wel en niet?', h1: 'Gratis website maken: wat kan wel en niet?', description: 'Gratis een website maken kan bij JouwWeb en Wix, zonder eigen domein. Wat je gratis krijgt, waar de grenzen liggen en wat de goedkoopste betaalde stap is.', og: 'gratis-website-maken', parents: G, faq: gratisFaq }),
  navPath: '/gidsen/',
  body: `<article><h1>Gratis website maken: wat kan wel en niet?</h1>${by()}<p class="lead">Een gratis website is prima om te proberen. Voor een zakelijke site wil je een eigen domeinnaam, en die zit niet in de gratis pakketten.</p>
<h2>Gratis pakketten</h2><div class="tbl"><table><thead><tr><th>Aanbieder</th><th>Gratis</th><th>Grens</th></tr></thead><tbody><tr><th scope="row"><a href="/platformen/jouwweb/">JouwWeb</a></th><td>Gratis pakket, altijd</td><td>Geen eigen domeinnaam</td></tr><tr><th scope="row"><a href="/platformen/wix/">Wix</a></th><td>Gratis website</td><td>Wix-advertenties en een Wix-adres</td></tr><tr><th scope="row"><a href="/platformen/woocommerce/">WooCommerce</a></th><td>Gratis plugin</td><td>Hosting en domein betaal je zelf</td></tr></tbody></table></div>
<h2>Gratis proberen</h2><ul><li><a href="/platformen/shopify/">Shopify</a>: 3 dagen gratis, daarna de eerste 3 maanden € 1 per maand.</li><li><a href="/platformen/hostinger/">Hostinger</a>: 30 dagen geld-terug-garantie.</li><li><a href="/platformen/wix/">Wix</a>: 14 dagen geld-terug-garantie op een premiumpakket.</li><li><a href="/platformen/mijndomein/">Mijndomein</a>: bij maandbetaling de eerste 6 maanden gratis, binnen een pakket van 12 maanden.</li></ul>
<h2>De goedkoopste stap naar een eigen domein</h2><p>JouwWeb Lite kost € 5,50 per maand met het eerste jaar een gratis domeinnaam. Hostinger Premium kost € 2,99 per maand, maar alleen bij 48 maanden vooraf (€ 143,52).</p>
<div class="out">${knop('jouwweb', 'gids_gratis')}${knop('hostinger', 'gids_gratis', 'btn ghost')}</div>
${faqHtml(gratisFaq)}${matchCta()}${bron(P.jouwweb.bronnen, P.wix.bronnen, P.woocommerce.bronnen, P.shopify.bronnen, P.hostinger.bronnen, P.mijndomein.bronnen)}</article>`,
};

const zzpFaq = [
  ['Welke websitebouwer is het beste voor een zzp\'er?', 'Voor een dienstensite zonder webshop zijn JouwWeb (vanaf € 5,50) en Hostinger (vanaf € 2,99 bij 48 maanden vooraf) het voordeligst. Wix geeft de meeste ontwerpvrijheid.'],
  ['Kan ik afspraken laten boeken op mijn site?', 'Ja. Bij Mijndomein zit boekingen en afspraken in elk MijnWebshop-pakket.'],
];
export const zzp = {
  ...article({ path: '/website-maken-zzp/', title: 'Website maken als zzp\'er: beste opties 2026', h1: 'Website maken als zzp\'er', description: 'Als zzp\'er een website maken: wat je nodig hebt en welke websitebouwer past. JouwWeb, Wix, Hostinger en Mijndomein met prijzen.', og: 'website-maken-zzp', parents: G, faq: zzpFaq }),
  navPath: '/gidsen/',
  body: `<article><h1>Website maken als zzp'er</h1>${by()}<p class="lead">Een goede zzp-site heeft een eigen domeinnaam, laat zien wat je doet en maakt contact makkelijk. Dat kan zonder webbouwer.</p>
<h2>Wat je nodig hebt</h2><ul><li>Een eigen domeinnaam en een e-mailadres op dat domein.</li><li>Een pagina per dienst, met prijzen of een vanaf-prijs.</li><li>Een contactformulier of afsprakenplanner.</li><li>Je bedrijfsgegevens in de footer.</li></ul>
<h2>Welke bouwer past?</h2><div class="tbl"><table><thead><tr><th>Bouwer</th><th>Vanaf per maand</th><th>Sterk punt</th></tr></thead><tbody><tr><th scope="row"><a href="/platformen/jouwweb/">JouwWeb</a></th><td>€ 5,50 (Lite)</td><td>Domeinnaam eerste jaar gratis, Nederlandstalig</td></tr><tr><th scope="row"><a href="/platformen/hostinger/">Hostinger</a></th><td>€ 2,99 (48 mnd vooraf)</td><td>Laagste prijs, AI-bouwer</td></tr><tr><th scope="row"><a href="/platformen/wix/">Wix</a></th><td>€ 14 (Light)</td><td>Ontwerpvrijheid</td></tr><tr><th scope="row"><a href="/platformen/mijndomein/">Mijndomein</a></th><td>€ 15 (Start)</td><td>Afspraken boeken en e-mail inbegrepen</td></tr></tbody></table></div>
<h2>Factureren en btw</h2><p>Verkoop je via je site, dan wil je facturen en btw goed op orde. JouwWeb koppelt met onder meer e-Boekhouden, Moneybird, Jortt en SnelStart. Welk boekhoudprogramma bij je past, zie je op <a href="https://boekhoudmatch.nl/">BoekhoudMatch</a>.</p>
<div class="out">${knop('jouwweb', 'gids_zzp')}${knop('wix', 'gids_zzp', 'btn ghost')}</div>
${faqHtml(zzpFaq)}${matchCta()}${bron(P.jouwweb.bronnen, P.hostinger.bronnen, P.wix.bronnen, P.mijndomein.bronnen)}</article>`,
};
export const guides = [beste, kosten, gratis, zzp];

export const gidsHub = {
  path: '/gidsen/', title: 'Gidsen: webshop en website beginnen | ShopMatch', h1: 'Gidsen', crumb: 'Gidsen', og: 'home',
  description: 'Gidsen over het beste webshop-platform, de kosten van een webshop, gratis een website maken en een website als zzp\'er.',
  body: `<h1>Gidsen</h1><div class="grid">${guides.map((g) => `<a class="card link" href="${g.path}"><h2 class="h3">${esc(g.h1)}</h2><p class="meta">${esc(g.description)}</p></a>`).join('')}</div>${matchCta()}`,
};

// ---- Statisch ----
export const over = {
  path: '/over/', title: 'Over ShopMatch: wie we zijn en hoe we werken', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'ShopMatch helpt ondernemers kiezen tussen webshop-platforms en websitebouwers. Wie we zijn, hoe we prijzen controleren en hoe we onafhankelijk blijven.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over ShopMatch', about: ORG }],
  body: `<article><h1>Over ons</h1><p class="lead">ShopMatch komt van het team achter BoekhoudMatch en VerduurzaamMatch. We zagen steeds dezelfde vraag bij startende ondernemers: waar bouw ik mijn webshop of website?</p>
<p>Veel vergelijkingen zijn geschreven door webbouwers die je hun eigen favoriet willen verkopen, of door buitenlandse sites met dollarprijzen. Wij zetten de platforms die Nederlandse ondernemers echt gebruiken naast elkaar, met de prijzen van de aanbieders zelf.</p>
<h2>Wat we elke week doen</h2><ul><li><strong>Prijzen checken</strong> op de prijspagina's van de aanbieders.</li><li><strong>Acties bijhouden</strong>, zoals tijdelijke kortingen en gratis maanden.</li><li><strong>De match testen</strong>, zodat de uitkomst klopt met de pakketten.</li><li><strong>Gidsen bijwerken</strong> zodra er iets verandert.</li></ul>
<h2>Hoe we werken</h2><ul><li><strong>Alleen de bron.</strong> Elk bedrag komt van de site van de aanbieder, met link.</li><li><strong>Niets verzonnen.</strong> Staat iets niet op de site van de aanbieder, dan zeggen we dat.</li><li><strong>Onafhankelijk.</strong> We bouwen geen webshops en verkopen geen pakketten.</li><li><strong>Partnerlinks tellen nooit mee</strong> in de match of de volgorde. Ze hebben altijd het label "partnerlink".</li></ul>
<p>Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | ShopMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home',
  description: 'Hoe ShopMatch met je gegevens omgaat: geen account, je antwoorden blijven in je browser en statistieken alleen na jouw toestemming.',
  body: `<article><h1>Privacy en cookies</h1>
<p>Vragen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Wie is verantwoordelijk?</h2><p>Verantwoordelijk voor de verwerking van persoonsgegevens op deze site: ShopMatch, <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Welke gegevens?</h2><p>Je antwoorden in de ShopMatch blijven in je browser. We slaan ze niet op en sturen ze nergens heen. We vragen geen naam, e-mailadres of andere persoonsgegevens.</p>
${GA_ID ? `<h2 id="cookies">Cookies en statistieken</h2><p>We gebruiken geen advertentiecookies. Statistieken met Google Analytics zetten we alleen aan als je in de cookiemelding op "Accepteren" klikt. Zonder toestemming laden we Google Analytics niet en gaat er niets naar Google.</p>
<p>Geef je toestemming, dan plaatst Google Analytics cookies (zoals <code>_ga</code>) en meten we welke pagina's bezocht worden en op welke knoppen en partnerlinks wordt geklikt. Google Analytics 4 slaat geen IP-adressen op. We gebruiken de gegevens alleen voor statistieken en bewaren ze maximaal 14 maanden. Google verwerkt de gegevens als verwerker; zie het <a href="https://policies.google.com/privacy" rel="noopener">privacybeleid van Google</a>.</p>
<p>Je keuze bewaren we 12 maanden in je browser (localStorage). Je kunt je toestemming altijd intrekken via <a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a> (ook onderaan elke pagina). Dan stoppen we Google Analytics en wissen we de <code>_ga</code>-cookies.</p>
` : '<h2 id="cookies">Cookies en statistieken</h2><p>We plaatsen geen cookies: geen advertentiecookies en geen statistiekcookies. Zetten we later statistieken aan, dan vragen we eerst je toestemming in een cookiemelding en passen we deze pagina aan.</p>'}<h2>Links naar aanbieders</h2><p>Klik je door naar een aanbieder, dan geldt de privacyverklaring van die aanbieder. Bij een partnerlink ziet de aanbieder dat je via ShopMatch komt.</p>
<h2>Hosting</h2><p>De site draait op GitHub Pages. GitHub verwerkt technische gegevens zoals je IP-adres om de site te leveren.</p>
<h2>Je rechten</h2><p>Je mag vragen welke gegevens we van je hebben en die laten verwijderen. Een klacht kun je indienen bij de Autoriteit Persoonsgegevens.</p></article>`,
};

export const notfound = {
  path: '/404.html', title: 'Pagina niet gevonden | ShopMatch', h1: 'Niet gevonden', noindex: true, og: 'home',
  description: 'Deze pagina bestaat niet.',
  body: `<h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn" href="/shop-match/">Doe de match</a><a class="btn ghost" href="/platformen/">Alle platforms</a><a class="btn ghost" href="/">Homepage</a></div>`,
};
