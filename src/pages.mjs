import { SITE, esc, ORG, GA_ID, ICONS, fmtDate } from './layout.mjs';
import { IDS, CHECKED, prijsNootVan, FEATURES, BEST_FOR, VERKOOP_VANAF, VERKOOP_PAKKET } from './lib/platforms.js';
import { knop } from './lib/partnerlinks.js';
import { VRAGEN } from './lib/match.js';
import { GROEPEN, PUNTEN, IDS_PUNTEN, score, fmtScore, ranglijst, situaties } from './lib/checklist.js';
import { P, by, bron, featureBronnen, matchCta, article, faqHtml, plansTable, pcard, matrix, methodBox, scoreBlock, scoreBadge, bars, fv, checklistTable, verkoopTekst, maxProdTekst } from './parts.mjs';

const KORT = { shopify: 'Shopify', wix: 'Wix', jouwweb: 'JouwWeb', lightspeed: 'Lightspeed', hostinger: 'Hostinger', mijndomein: 'Mijndomein', woocommerce: 'WooCommerce' };
const RANG = ranglijst();
const wordmark = (id) => `<span class="wordmark">${esc(KORT[id])}</span>`;

const homeFaq = [
  ['Wat is het beste webshop-platform voor een starter?', 'Dat hangt af van je aantal producten en budget. Met een paar producten start je goedkoop met JouwWeb Pro (€ 10 per maand, tot 10 producten). Wil je groeien of over de grens verkopen, dan is Shopify sterker. Zie <a href="/beste-webshop-platform/">beste webshop-platform 2026</a>.'],
  ['Hoe komt de checklist-score tot stand?', 'We tellen 10 vaste punten, zoals iDEAL, kassa, B2B en contractvorm. Ja is 1 punt, deels een half punt, nee of niet vermeld 0. Alles komt van de site van de aanbieder. Prijs staat er apart naast. Zie <a href="/over/#methode">zo vergelijken we</a>.'],
  ['Verdient ShopMatch aan de aanbevelingen?', 'Bij sommige aanbieders kunnen we in de toekomst een vergoeding krijgen via een partnerlink. Die links hebben altijd het label "partnerlink" en tellen nooit mee in de match, de score of de volgorde.'],
];
const VS = [['/vergelijken/shopify-vs-lightspeed/', 'Shopify of Lightspeed', 'Voor winkels die ook online verkopen.'], ['/vergelijken/wix-vs-jouwweb/', 'Wix of JouwWeb', 'Websitebouwers voor zzp\'ers en kleine shops.'], ['/vergelijken/shopify-vs-woocommerce/', 'Shopify of WooCommerce', 'Alles geregeld of alles zelf in de hand.']];
const vsCards = () => `<div class="grid cards">${VS.map(([h, t, d]) => `<a class="card" href="${h}"><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="more">Bekijk de vergelijking →</span></a>`).join('')}</div>`;
const miniRows = RANG.map((id) => `<tr><th scope="row"><a href="/platformen/${P[id].slug}/">${esc(P[id].naam)}</a></th><td>${scoreBadge(id)}</td><td class="n">${verkoopTekst(id)}</td>${['ideal', 'pos', 'b2b', 'talen'].map((k) => `<td>${fv(FEATURES[id][k], false)}</td>`).join('')}</tr>`).join('');

export const home = {
  path: '/', title: 'ShopMatch: webshop-platforms vergelijken (2026)', ogTitle: 'ShopMatch: welk webshop-platform past bij jouw bedrijf?', h1: 'ShopMatch.nl', og: 'home',
  description: 'Vergelijk Shopify, Wix, JouwWeb, Lightspeed, Hostinger, Mijndomein en WooCommerce op prijs, iDEAL, kassa en B2B. Doe de match en zie je top 3.',
  schema: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: homeFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }],
  body: `<section class="hero"><div>
<h1 class="h1-brand">Shop<b>Match</b>.nl</h1>
<p class="tagline">Webshop kiezen? Vergelijk eerst.</p>
<p class="lead">Welk webshop-platform past bij jouw bedrijf? Zeven platforms naast elkaar op prijs, iDEAL, kassa, B2B en contract. Beantwoord 5 vragen en zie je top 3.</p>
<div class="actions"><a class="btn" href="/shop-match/" data-cta="home_hero">Start de match</a><a class="btn ghost" href="/vergelijken/">Vergelijk alle 7 platforms</a></div>
</div>
<div class="hero-q"><p class="hero-q-step">Vraag 1 van 5</p><p class="hero-q-title" id="hq">${esc(VRAGEN[0].vraag)}</p><div class="hero-q-opts" role="group" aria-labelledby="hq">${VRAGEN[0].opties.map(([v, l]) => `<a class="choice" href="/shop-match/?doel=${v}" rel="nofollow">${esc(l)}<span aria-hidden="true">→</span></a>`).join('')}</div><p class="hero-q-foot">Daarna nog 4 korte vragen. Gratis, zonder account.</p></div>
</section>
<ul class="trustbar">
<li>${ICONS.kalender}<span>Prijzen gecontroleerd op <time datetime="${CHECKED}">${fmtDate(CHECKED)}</time></span></li>
<li>${ICONS.bron}<span>Bron bij elke prijs en functie</span></li>
<li>${ICONS.schild}<span>Volgorde nooit betaald</span></li>
<li>${ICONS.gratis}<span>Gratis, zonder account</span></li>
</ul>
<section class="logobar" aria-labelledby="h-pl"><h2 id="h-pl">Deze 7 platforms vergelijken we</h2><div class="logos seven">${[...IDS].sort((a, b) => KORT[a].localeCompare(KORT[b], 'nl')).map((id) => `<a class="logo-tile" href="/platformen/${P[id].slug}/" title="${esc(P[id].naam)}">${wordmark(id)}</a>`).join('')}</div></section>
<h2>Beste keuze per situatie</h2>
<p class="sub">Een vaste regel op functies en prijs, uit de sites van de aanbieders. Partnerschappen tellen niet mee.</p>
<ol class="sitlist">
${situaties().filter((x) => x.top).map((x) => `<li><span class="sit-logo">${wordmark(x.top)}</span><span class="sit-txt"><strong>${esc(x.titel)}</strong><span>${esc(x.regel)}</span></span><span class="sit-pick">${esc(P[x.top].naam)}<b>${verkoopTekst(x.top)}</b></span><a class="sit-why" href="/platformen/${P[x.top].slug}/">Waarom?<span class="sr-only"> ${esc(P[x.top].naam)}</span></a></li>`).join('\n')}
</ol>
<p><a href="/shop-match/">Jouw situatie is anders? Start de match →</a></p>
<h2>De platforms op een rij</h2>
<p class="sub">Gesorteerd op checklist-score, bij gelijke stand op prijs. Verkopen vanaf = goedkoopste pakket waarmee je online kunt verkopen, zoals de aanbieder het toont. Niet elke aanbieder vermeldt of btw inbegrepen is; dat staat per platform bij de prijzen.</p>
<div class="table-wrap"><table class="data"><thead><tr><th scope="col">Platform</th><th scope="col">Score</th><th scope="col">Verkopen vanaf</th><th scope="col">iDEAL</th><th scope="col">Kassa</th><th scope="col">B2B</th><th scope="col">Meerdere talen</th></tr></thead><tbody>${miniRows}</tbody></table></div>
<p><a href="/vergelijken/">Alle 10 checklistpunten, met filters →</a></p>
<section class="band method-band">
<h2>Zo vergelijken we</h2>
<ol class="steps">
<li><strong>Prijs van de aanbieder zelf.</strong> Elke prijs komt van de prijspagina van de aanbieder, met link naar de bron.</li>
<li><strong>Een vaste checklist.</strong> Tien punten die ondernemers nodig hebben, van iDEAL tot kassa. De score telt wat de aanbieder zelf noemt.</li>
<li><strong>Partnerlinks veranderen niets.</strong> Eerst wat past, dan je budget, dan de prijs. Commissie telt nooit mee.</li>
</ol>
<p class="author">Door de <a href="/over/">${SITE.owner}</a> · <a href="/over/#methode">Hoe de score werkt</a></p>
</section>
<h2>Populaire vergelijkingen</h2>${vsCards()}
<h2>Gidsen</h2><ul class="gidslijst"><li><a href="/beste-webshop-platform/">Het beste webshop-platform van 2026, per situatie</a></li><li><a href="/webshop-beginnen-kosten/">Webshop beginnen: wat kost het?</a></li><li><a href="/gratis-website-maken/">Gratis website maken: wat kan wel en niet?</a></li><li><a href="/website-maken-zzp/">Website maken als zzp'er</a></li></ul>
${faqHtml(homeFaq)}`,
};

export const quiz = {
  path: '/shop-match/', title: 'Webshop-platform kiezen: doe de ShopMatch', h1: 'Welk webshop-platform past bij jou?', crumb: 'De match', og: 'match', noCta: true,
  description: 'Vijf vragen over je plannen, aantal producten, budget en ervaring. Je krijgt de drie platforms die het best passen, met prijs en uitleg.',
  scripts: ['/js/quiz.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'ShopMatch', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE.domain + '/shop-match/', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: ORG }],
  body: `<h1>Welk webshop-platform past bij jou?</h1><p class="lead">Beantwoord 5 korte vragen. Je ziet meteen wat past, wat het kost en waarom.</p>
<div class="mgrid">
<form id="form" class="quiz card" novalidate>
<div class="qprog"><p id="q-prog" aria-live="polite">0 van ${VRAGEN.length} vragen beantwoord</p><div class="qbar"><span id="q-bar"></span></div></div>
${VRAGEN.map((v, i) => `<fieldset class="q"><legend>${i + 1}. ${esc(v.vraag)}</legend><div class="opts">${v.opties.map(([val, t]) => `<label><input type="radio" name="${v.id}" value="${val}" required><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`).join('')}
<div class="qdone"><button class="btn" type="submit">Toon mijn match</button><p class="sub">Gratis, zonder account. Je antwoorden blijven in je browser.</p></div>
</form>
<aside class="card mpanel" id="result" aria-live="polite"><h2>Jouw beste match</h2><p class="mwait">Beantwoord de vragen. Je top 3 verschijnt hier, met prijs en uitleg.</p><p class="sub">Of bekijk <a href="/vergelijken/">alle 7 platforms naast elkaar</a>.</p></aside>
</div>
<noscript><p class="alert">De match werkt met JavaScript. Zonder JavaScript vind je alle platforms naast elkaar op <a href="/vergelijken/">vergelijken</a>.</p></noscript>
<section class="method" id="methode"><h2>Zo werkt de match</h2><ol><li><strong>Eerst wat past.</strong> Wat je wilt verkopen, hoeveel producten en of je een winkel hebt. Platforms waarvan het grootste pakket te weinig producten aankan, vallen af.</li><li><strong>Dan je budget.</strong> We rekenen met de maandprijs van het goedkoopste pakket dat bij je aantal producten past.</li><li><strong>Dan techniek en voorkeur.</strong> Wil je niets zelf regelen, dan komt WooCommerce niet in je top 3. Vind je een Nederlandse aanbieder belangrijk, dan telt dat mee.</li><li><strong>Bij gelijke stand: de laagste prijs.</strong> Partnerlinks tellen nooit mee.</li></ol><p class="src">Prijzen gecontroleerd op ${fmtDate(CHECKED)} bij de aanbieders.</p></section>`,
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
  const pos = RANG.indexOf(id) + 1;
  const alt = RANG.filter((x) => x !== id).slice(0, 3);
  const t = `${p.naam} prijzen 2026 | ShopMatch`;
  return {
    ...article({ path, title: t.length <= 60 ? t : `${p.naam} prijzen 2026`, h1, description: `${p.naam} vanaf ${p.vanafTekst}. Alle pakketten, de checklist van 10 punten, voor wie het past en de nadelen, met bron.`, og: `platform-${id}`, parents: [['/platformen/', 'Platforms']] }),
    navPath: '/platformen/',
    body: `<article><span class="tag best">Beste voor: ${esc(BEST_FOR[id])}</span><h1>${esc(h1)}</h1>${by()}<p class="lead">${esc(p.kort)}</p>
<div class="pcard first"><div class="pc-head"><span class="sc-lbl">Verkopen vanaf</span><p class="pc-price"><strong>${verkoopTekst(id)}</strong>${esc(VERKOOP_PAKKET[id])}</p>${p.vanaf !== VERKOOP_VANAF[id] && id !== 'woocommerce' ? `<p class="pc-price">Website zonder verkoop: vanaf ${esc(p.vanafTekst)}</p>` : ''}</div>
<ul class="pc-facts"><li><span>Producten</span><span>${maxProdTekst(id)}</span></li><li><span>iDEAL</span><span>${fv(FEATURES[id].ideal, false)}</span></li><li><span>Kassa</span><span>${fv(FEATURES[id].pos, false)}</span></li><li><span>B2B</span><span>${fv(FEATURES[id].b2b, false)}</span></li><li><span>Plek in de vergelijking</span><span>${pos} van ${IDS.length}</span></li></ul>
${scoreBlock(id)}
<div class="pc-cta">${knop(id, 'platform_top')}<a href="/shop-match/">Past het bij mij? Start de match →</a></div></div>
<h2>Pakketten en prijzen</h2><p class="sub">${esc(prijsNootVan(p))}</p>${plansTable(p)}${p.actie ? `<p class="alert">${esc(p.actie)}</p>` : ''}
<h2>Checklist: wat zit erin?</h2><p class="sub">Tien vaste punten, uit de site van de aanbieder. Niet vermeld telt als 0. <a href="/over/#methode">Zo tellen we</a></p>${checklistTable(id)}
<h2>Voor- en nadelen</h2><div class="pm"><div class="card plus"><h3>Sterk</h3><ul>${p.plus.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="card min"><h3>Let op</h3><ul>${p.min.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
<h2>Voor wie?</h2><p>${esc(p.voor)}</p>
<div class="out">${knop(id, 'platform_bottom')}</div>
<h2>Alternatieven</h2><ul class="gidslijst">${alt.map((x) => `<li><a href="/platformen/${P[x].slug}/">${esc(P[x].naam)}</a> · ${esc(BEST_FOR[x])} · score ${fmtScore(score(x).totaal)}/10 · ${verkoopTekst(x)}</li>`).join('')}${(RELATED[id] || []).map(([h, tt]) => `<li><a href="${h}">${esc(tt)}</a></li>`).join('')}<li><a href="/vergelijken/">Alle platforms naast elkaar</a></li></ul>
${matchCta(`Is ${esc(p.naam)} de beste keuze voor jou?`)}${bron(p.bronnen, featureBronnen(id))}</article>`,
  };
});

export const platformHub = {
  path: '/platformen/', title: 'Webshop-platforms 2026: prijzen en score | ShopMatch', h1: 'Alle webshop-platforms op een rij', crumb: 'Platforms', og: 'platformen', stamp: { checked: CHECKED, updated: CHECKED },
  description: 'Shopify, Wix, JouwWeb, Lightspeed eCom, Hostinger, Mijndomein en WooCommerce: per platform de prijs, checklist-score, voor- en nadelen en voor wie het past.',
  schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: RANG.map((id, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.domain}/platformen/${P[id].slug}/`, name: P[id].naam })) }],
  body: `<h1>Alle webshop-platforms op een rij</h1><p class="lead">Zeven manieren om online te verkopen, van gratis plugin tot compleet platform met kassa. Gesorteerd op checklist-score, bij gelijke stand op prijs.</p>
<div class="actions"><a class="btn" href="/shop-match/">Liever advies op maat? Start de match</a><a class="btn ghost" href="/vergelijken/">Filter en vergelijk</a></div>
<ol class="plist">${RANG.map((id, i) => pcard(id, { rank: i + 1, pos: 'lijst' })).join('')}</ol>
${methodBox()}`,
};

// ---- Vergelijken ----
const BUDGET = [['', 'Maakt niet uit'], ['10', 'Tot € 10 per maand'], ['25', 'Tot € 25 per maand'], ['70', 'Tot € 70 per maand']];
const PROD = [['', 'Maakt niet uit'], ['10', 'Tot 10'], ['100', 'Tot 100'], ['1000', 'Tot 1.000'], ['20000', 'Tot 20.000'], ['50000', 'Meer dan 20.000']];
const FILTERS = ['ideal', 'pos', 'b2b', 'talen', 'nl', 'geenfee', 'hosting', 'maand'];
const sel = (id, label, opts) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}">${opts.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select></div>`;

export const vsHub = {
  path: '/vergelijken/', title: 'Webshop-platforms vergelijken 2026 | ShopMatch', h1: 'Webshop-platforms vergelijken', crumb: 'Vergelijken', og: 'vergelijken', stamp: { checked: CHECKED, updated: CHECKED },
  scripts: ['/js/vergelijk.js'],
  description: 'Alle 7 webshop-platforms in één tabel: prijs, aantal producten, iDEAL, kassa, B2B, talen en contract. Filter op wat jij nodig hebt.',
  body: `<h1>Webshop-platforms vergelijken (2026)</h1><p class="lead">Zeven platforms op prijs en 10 vaste punten. Filter op wat jouw bedrijf nodig heeft.</p>
<div class="actions"><a class="btn" href="/shop-match/">Liever advies op maat? Start de match</a></div>
<form class="filters card" id="filters" aria-labelledby="h-f"><h2 id="h-f">Filter de platforms</h2>
<div class="fgrid">${sel('f-budget', 'Budget per maand', BUDGET)}${sel('f-prod', 'Aantal producten', PROD)}</div>
<fieldset class="q"><legend>Moet kunnen</legend><div class="fchecks">${FILTERS.map((k) => `<label class="check"><input type="checkbox" name="need" value="${k}"><span>${esc(PUNTEN[k].lang)}</span></label>`).join('')}</div></fieldset>
<p class="sub">"Deels" telt mee als het kan, bijvoorbeeld met een extensie. Niet vermeld telt niet mee.</p>
<p class="count" id="f-count" aria-live="polite">${IDS.length} van ${IDS.length} platforms</p>
<p id="f-ids" class="alert" hidden></p>
</form>
<div class="sortbar"><h2 style="margin:0">Alle platforms naast elkaar</h2>${sel('f-sort', 'Sorteer op', [['score', 'Checklist-score'], ['prijs', 'Laagste prijs'], ['naam', 'Naam']])}</div>
${matrix(RANG)}
<p class="empty" id="f-empty" hidden>Geen platform voldoet aan alles. Zet een filter uit of <a href="/shop-match/">start de match</a>.</p>
<p class="src">Verkopen vanaf = goedkoopste pakket waarmee je online kunt verkopen, per maand, zoals de aanbieder het toont. JouwWeb, Hostinger en Mijndomein noemen excl. btw, Wix exclusief toeslagen; Shopify, Lightspeed en WooCommerce vermelden het niet. Bronnen staan op de pagina van elk platform.</p>
${methodBox()}
<h2>Twee platforms naast elkaar</h2>${vsCards()}${matchCta()}`,
};

const sideRow = (label, a, b) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`;
const cmp = ({ slug, a, b, h1, title, description, intro, rows, kiesA, kiesB, faq }) => {
  const side = (id, kies, posn) => `<div class="card"><span class="tag best">${esc(BEST_FOR[id])}</span><h2>${esc(P[id].naam)}</h2><p class="pc-price"><strong>${verkoopTekst(id)}</strong>${esc(VERKOOP_PAKKET[id])}</p><div class="pc-score" style="margin-top:12px"><span class="sc-lbl">Checklist-score</span>${scoreBadge(id)}${bars(id)}</div><p class="lbl" style="margin-top:14px">Kies ${esc(P[id].naam)} als</p><ul>${kies.map((x) => `<li>${x}</li>`).join('')}</ul><div class="out">${knop(id, posn, 'btn sm')}<a href="/platformen/${P[id].slug}/">Alles over ${esc(P[id].naam.split(' ')[0])} →</a></div></div>`;
  return {
    ...article({ path: `/vergelijken/${slug}/`, title, h1, description, og: `vs-${slug}`, parents: [['/vergelijken/', 'Vergelijken']], faq }),
    navPath: '/vergelijken/',
    body: `<article><h1>${esc(h1)}</h1>${by()}<p class="lead">${intro}</p>
<h2>Snel antwoord</h2><div class="verdict">${side(a, kiesA, 'vs_a')}${side(b, kiesB, 'vs_b')}</div>
<h2>Prijs en pakketten</h2><div class="table-wrap"><table class="data side"><thead><tr><th scope="col"></th><th scope="col">${esc(P[a].naam)}</th><th scope="col">${esc(P[b].naam)}</th></tr></thead><tbody>${rows.map((r) => sideRow(...r)).join('')}</tbody></table></div>
<h2>Checklist naast elkaar</h2><p class="sub">Tien vaste punten uit de sites van de aanbieders. <a href="/over/#methode">Zo tellen we</a></p>
<div class="table-wrap"><table class="data side"><thead><tr><th scope="col">Checklistpunt</th><th scope="col">${esc(P[a].naam)}</th><th scope="col">${esc(P[b].naam)}</th></tr></thead><tbody>${GROEPEN.map((g) => `<tr><th colspan="3" scope="colgroup" style="background:var(--sand)">${esc(g.naam)}</th></tr>${g.punten.map((k) => sideRow(esc(PUNTEN[k].lang), fv(FEATURES[a][k]), fv(FEATURES[b][k]))).join('')}`).join('')}<tr><th scope="row">Checklist-score</th><td>${scoreBadge(a)}</td><td>${scoreBadge(b)}</td></tr></tbody></table></div>
${faqHtml(faq)}${matchCta()}<p>Meer weten? <a href="/platformen/${P[a].slug}/">${esc(P[a].naam)}</a> · <a href="/platformen/${P[b].slug}/">${esc(P[b].naam)}</a> · <a href="/vergelijken/">alle platforms</a></p>${bron(P[a].bronnen, P[b].bronnen, featureBronnen(a, b))}</article>`,
  };
};

export const vsPages = [
  cmp({
    slug: 'shopify-vs-lightspeed', a: 'shopify', b: 'lightspeed', h1: 'Shopify of Lightspeed eCom: welke past bij je winkel?',
    title: 'Shopify vs Lightspeed eCom 2026 | ShopMatch',
    description: 'Shopify vanaf € 21, Lightspeed eCom vanaf € 68 per maand. De verschillen in prijs, limieten, support en kassa, en wanneer je welke kiest.',
    intro: 'Allebei bouwen ze webshops én kassasystemen. Shopify is goedkoper om te starten. Lightspeed heeft een vestiging in Amsterdam en telefonische support vanaf Advanced.',
    rows: [['Instapprijs', '€ 21 per maand (Basic, jaar)', '€ 68 per maand (Essential)'], ['Producten', 'Onbeperkt', '250 varianten (Essential), 5.000 (Advanced)'], ['Gebruikers', '1 (Basic), tot 5 (Grow)', '1 (Essential), 3 (Advanced)'], ['Support', 'Online', 'E-mail (Essential), telefonisch vanaf Advanced'], ['Winkelkassa', 'Shopify POS', 'Lightspeed kassa'], ['B2B', 'Vanaf Basic, tot 3 catalogi', 'In Professional (€ 259)'], ['Extra transactiekosten', '2% op Basic bij externe betaalprovider', 'Geen bij externe betaalproviders']],
    kiesA: ['je met een kleiner budget start', 'je onbeperkt producten wilt zonder hoger pakket', 'je ook in andere landen wilt verkopen'],
    kiesB: ['je een fysieke winkel hebt en voorraad op één plek wilt', 'je telefonische support in het Nederlands belangrijk vindt', 'je zonder extra transactiekosten je eigen betaalprovider wilt gebruiken'],
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

// ---- Gidsen ----
const G = [['/gidsen/', 'Gidsen']];
const kostRows = [
  ['jouwweb', 'Pro (tot 10 producten)', '€ 120', 'Business (onbeperkt): € 240 per jaar'],
  ['hostinger', 'Onbeperkt', '€ 191,52 voor 48 maanden', 'Daarna € 16,99 per maand'],
  ['mijndomein', 'MijnWebshop Start (25 producten)', '€ 126', 'Pakket loopt 12 maanden'],
  ['shopify', 'Basic', '€ 252', '2% extra per transactie bij externe betaalprovider'],
  ['wix', 'Core', '€ 300', 'Betalingen ontvangen vanaf Core'],
  ['lightspeed', 'Essential', '€ 816', '250 productvarianten'],
  ['woocommerce', 'Plugin', '€ 0', 'Plus hosting: WooCommerce noemt $ 25 tot $ 350 per maand'],
];
const besteFaq = [
  ['Wat is het beste webshop-platform in 2026?', 'Er is geen platform dat voor iedereen het beste is. Voor een kleine start is JouwWeb het goedkoopst met een volwaardige webshop, voor groei en verkoop over de grens is Shopify het sterkst en voor een winkel met webshop past Lightspeed eCom.'],
  ['Wat is het goedkoopste webshop-platform?', 'Hostinger Website Bouwer Onbeperkt kost € 3,99 per maand als je 48 maanden vooraf betaalt. Bij maandelijks opzegbare pakketten is JouwWeb Pro met € 10 per maand het goedkoopst.'],
];
export const beste = {
  ...article({ path: '/beste-webshop-platform/', title: 'Beste webshop-platform 2026: keuze per situatie', h1: 'Het beste webshop-platform van 2026', description: 'Welk webshop-platform is het beste in 2026? Per situatie de beste keuze: starters, klein budget, groei, winkel met webshop en volledige controle.', og: 'beste-webshop-platform', parents: G, faq: besteFaq }),
  navPath: '/gidsen/',
  body: `<article class="prose"><h1>Het beste webshop-platform van 2026</h1>${by()}<p class="lead">Het beste platform hangt af van wat je verkoopt, hoeveel producten je hebt en hoeveel tijd je in techniek wilt steken. Dit is onze keuze per situatie.</p>
<h2>Beste voor starters met een paar producten: JouwWeb</h2><p>JouwWeb Pro kost € 10 per maand voor een webshop tot 10 producten, zonder verkoopcommissie. Met Business (€ 20) verkoop je onbeperkt. iDEAL en koppelingen met boekhoudprogramma's zitten erin.</p><div class="out">${knop('jouwweb', 'gids_beste')}</div>
<h2>Beste met het kleinste budget: Hostinger Website Bouwer</h2><p>Het Onbeperkt-pakket met e-commerce kost € 3,99 per maand, maar alleen als je 48 maanden vooraf betaalt (€ 191,52). Daarna verleng je voor € 16,99 per maand.</p><div class="out">${knop('hostinger', 'gids_beste')}</div>
<h2>Beste om te groeien en internationaal te verkopen: Shopify</h2><p>Onbeperkt producten vanaf Basic (€ 21 per maand bij jaarbetaling) en een grote appwinkel. Let op de 2% extra transactiekosten als je niet met Shopify Payments werkt.</p><div class="out">${knop('shopify', 'gids_beste')}</div>
<h2>Beste voor een winkel met webshop: Lightspeed eCom</h2><p>Webshop en kassa van één leverancier. Essential kost € 68 per maand; telefonische support krijg je vanaf Advanced (€ 120).</p><div class="out">${knop('lightspeed', 'gids_beste')}</div>
<h2>Beste alles-in-één bij een Nederlandse partij: Mijndomein</h2><p>Domein, e-mail, cookiebanner en webshop in één pakket. MijnWebshop Start kost € 15 per maand voor 25 producten; het pakket loopt 12 maanden.</p><div class="out">${knop('mijndomein', 'gids_beste')}</div>
<h2>Beste voor ontwerpvrijheid: Wix</h2><p>Veel vrijheid in vormgeving. Online betalingen ontvangen kan vanaf Core (€ 25 per maand).</p><div class="out">${knop('wix', 'gids_beste')}</div>
<h2>Beste voor volledige controle: WooCommerce</h2><p>Gratis plugin voor WordPress, zonder platformkosten of omzetaandeel. Je regelt zelf hosting, updates en beveiliging.</p><div class="out">${knop('woocommerce', 'gids_beste')}</div>
<h2>Alles op een rij</h2><div class="table-wrap"><table class="data"><thead><tr><th>Situatie</th><th>Platform</th><th>Vanaf per maand</th></tr></thead><tbody><tr><td>Paar producten</td><td><a href="/platformen/jouwweb/">JouwWeb</a></td><td>€ 10</td></tr><tr><td>Kleinste budget</td><td><a href="/platformen/hostinger/">Hostinger</a></td><td>€ 3,99 (48 mnd vooraf)</td></tr><tr><td>Groei en buitenland</td><td><a href="/platformen/shopify/">Shopify</a></td><td>€ 21</td></tr><tr><td>Winkel met webshop</td><td><a href="/platformen/lightspeed/">Lightspeed eCom</a></td><td>€ 68</td></tr><tr><td>Alles bij één partij</td><td><a href="/platformen/mijndomein/">Mijndomein</a></td><td>€ 15</td></tr><tr><td>Ontwerpvrijheid</td><td><a href="/platformen/wix/">Wix</a></td><td>€ 25</td></tr><tr><td>Volledige controle</td><td><a href="/platformen/woocommerce/">WooCommerce</a></td><td>€ 0 + hosting</td></tr></tbody></table></div>
${faqHtml(besteFaq)}${matchCta('Welke past bij jouw situatie?')}${bron(...['jouwweb', 'hostinger', 'shopify', 'lightspeed', 'mijndomein', 'wix', 'woocommerce'].map((i) => P[i].bronnen))}</article>`,
};

const kostenFaq = [
  ['Wat kost een webshop beginnen per jaar?', 'Alleen aan platformkosten tussen € 0 (WooCommerce, plus hosting) en € 816 (Lightspeed eCom Essential). Een kleine webshop bij JouwWeb Pro kost € 120 per jaar.'],
  ['Welke kosten komen er nog bij?', 'Een domeinnaam, transactiekosten per betaling, eventueel betaalde apps of een thema, en je boekhouding.'],
];
export const kosten = {
  ...article({ path: '/webshop-beginnen-kosten/', title: 'Webshop beginnen: wat kost het in 2026?', h1: 'Webshop beginnen: wat kost het?', description: 'Wat kost een webshop beginnen in 2026? De jaarkosten per platform, van € 0 tot € 816, plus domein, transactiekosten en apps.', og: 'webshop-beginnen-kosten', parents: G, faq: kostenFaq }),
  navPath: '/gidsen/',
  body: `<article class="prose"><h1>Webshop beginnen: wat kost het?</h1>${by()}<p class="lead">De grootste vaste post is het abonnement van je platform. Dit betaal je in het eerste jaar voor het goedkoopste pakket waarmee je kunt verkopen, zoals de aanbieder het toont. Niet elke aanbieder vermeldt of btw inbegrepen is.</p>
<h2>Platformkosten in het eerste jaar</h2><div class="table-wrap"><table class="data"><thead><tr><th>Platform</th><th>Pakket</th><th>Eerste jaar</th><th>Let op</th></tr></thead><tbody>${kostRows.map(([id, pk, j, l]) => `<tr><th scope="row"><a href="/platformen/${P[id].slug}/">${esc(P[id].naam)}</a></th><td>${esc(pk)}</td><td>${esc(j)}</td><td>${esc(l)}</td></tr>`).join('')}</tbody></table></div>
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
  body: `<article class="prose"><h1>Gratis website maken: wat kan wel en niet?</h1>${by()}<p class="lead">Een gratis website is prima om te proberen. Voor een zakelijke site wil je een eigen domeinnaam, en die zit niet in de gratis pakketten.</p>
<h2>Gratis pakketten</h2><div class="table-wrap"><table class="data"><thead><tr><th>Aanbieder</th><th>Gratis</th><th>Grens</th></tr></thead><tbody><tr><th scope="row"><a href="/platformen/jouwweb/">JouwWeb</a></th><td>Gratis pakket, altijd</td><td>Geen eigen domeinnaam</td></tr><tr><th scope="row"><a href="/platformen/wix/">Wix</a></th><td>Gratis website</td><td>Wix-advertenties en een Wix-adres</td></tr><tr><th scope="row"><a href="/platformen/woocommerce/">WooCommerce</a></th><td>Gratis plugin</td><td>Hosting en domein betaal je zelf</td></tr></tbody></table></div>
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
  body: `<article class="prose"><h1>Website maken als zzp'er</h1>${by()}<p class="lead">Een goede zzp-site heeft een eigen domeinnaam, laat zien wat je doet en maakt contact makkelijk. Dat kan zonder webbouwer.</p>
<h2>Wat je nodig hebt</h2><ul><li>Een eigen domeinnaam en een e-mailadres op dat domein.</li><li>Een pagina per dienst, met prijzen of een vanaf-prijs.</li><li>Een contactformulier of afsprakenplanner.</li><li>Je bedrijfsgegevens in de footer.</li></ul>
<h2>Welke bouwer past?</h2><div class="table-wrap"><table class="data"><thead><tr><th>Bouwer</th><th>Vanaf per maand</th><th>Sterk punt</th></tr></thead><tbody><tr><th scope="row"><a href="/platformen/jouwweb/">JouwWeb</a></th><td>€ 5,50 (Lite)</td><td>Domeinnaam eerste jaar gratis, Nederlandstalig</td></tr><tr><th scope="row"><a href="/platformen/hostinger/">Hostinger</a></th><td>€ 2,99 (48 mnd vooraf)</td><td>Laagste prijs, AI-bouwer</td></tr><tr><th scope="row"><a href="/platformen/wix/">Wix</a></th><td>€ 14 (Light)</td><td>Ontwerpvrijheid</td></tr><tr><th scope="row"><a href="/platformen/mijndomein/">Mijndomein</a></th><td>€ 15 (Start)</td><td>Afspraken boeken en e-mail inbegrepen</td></tr></tbody></table></div>
<h2>Factureren en btw</h2><p>Verkoop je via je site, dan wil je facturen en btw goed op orde. JouwWeb koppelt met onder meer e-Boekhouden, Moneybird, Jortt en SnelStart. Welk boekhoudprogramma bij je past, zie je op <a href="https://boekhoudmatch.nl/">BoekhoudMatch</a>.</p>
<div class="out">${knop('jouwweb', 'gids_zzp')}${knop('wix', 'gids_zzp', 'btn ghost')}</div>
${faqHtml(zzpFaq)}${matchCta()}${bron(P.jouwweb.bronnen, P.hostinger.bronnen, P.wix.bronnen, P.mijndomein.bronnen)}</article>`,
};
export const guides = [beste, kosten, gratis, zzp];

export const gidsHub = {
  path: '/gidsen/', title: 'Gidsen: webshop en website beginnen | ShopMatch', h1: 'Gidsen', crumb: 'Gidsen', og: 'home',
  description: 'Gidsen over het beste webshop-platform, de kosten van een webshop, gratis een website maken en een website als zzp\'er.',
  body: `<h1>Gidsen</h1><div class="grid cards two">${guides.map((g) => `<a class="card" href="${g.path}"><h2 class="h3">${esc(g.h1)}</h2><p>${esc(g.description)}</p><span class="more">Lees de gids →</span></a>`).join('')}</div>${matchCta()}`,
};

// ---- Statisch ----
export const over = {
  path: '/over/', title: 'Over ShopMatch: wie we zijn en hoe we werken', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'ShopMatch helpt ondernemers kiezen tussen webshop-platforms en websitebouwers. Wie we zijn, hoe we prijzen controleren en hoe we onafhankelijk blijven.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over ShopMatch', about: ORG }],
  body: `<article class="prose"><h1>Over ons</h1><p class="lead">ShopMatch komt van het team achter BoekhoudMatch en VerduurzaamMatch. We zagen steeds dezelfde vraag bij startende ondernemers: waar bouw ik mijn webshop of website?</p>
<p>Veel vergelijkingen zijn geschreven door webbouwers die je hun eigen favoriet willen verkopen, of door buitenlandse sites met dollarprijzen. Wij zetten de platforms die Nederlandse ondernemers echt gebruiken naast elkaar, met de prijzen van de aanbieders zelf.</p>
<h2>Wat we elke week doen</h2><ul><li><strong>Prijzen checken</strong> op de prijspagina's van de aanbieders.</li><li><strong>Acties bijhouden</strong>, zoals tijdelijke kortingen en gratis maanden.</li><li><strong>De match testen</strong>, zodat de uitkomst klopt met de pakketten.</li><li><strong>Gidsen bijwerken</strong> zodra er iets verandert.</li></ul>
<h2>Hoe we werken</h2><ul><li><strong>Alleen de bron.</strong> Elk bedrag komt van de site van de aanbieder, met link.</li><li><strong>Niets verzonnen.</strong> Staat iets niet op de site van de aanbieder, dan zeggen we dat.</li><li><strong>Onafhankelijk.</strong> We bouwen geen webshops en verkopen geen pakketten.</li><li><strong>Partnerlinks tellen nooit mee</strong> in de match of de volgorde. Ze hebben altijd het label "partnerlink".</li></ul>
</article>${methodBox()}<article class="prose"><h2>Wat telt de checklist?</h2><ul>${GROEPEN.map((g) => `<li><strong>${esc(g.naam)}:</strong> ${g.punten.map((k) => esc(/^Nederland/.test(PUNTEN[k].lang) || !/^[A-Z][a-z]/.test(PUNTEN[k].lang) ? PUNTEN[k].lang : PUNTEN[k].lang[0].toLowerCase() + PUNTEN[k].lang.slice(1))).join(', ')}.</li>`).join('')}</ul><p>Noemt een aanbieder een punt niet op de eigen site, dan staat er "niet vermeld" en telt het als 0. Zo kan een platform lager uitkomen omdat de aanbieder minder openbaar maakt. Mist er iets? Mail ons, dan passen we het aan met bron.</p>
<p>Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | ShopMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home',
  description: 'Hoe ShopMatch met je gegevens omgaat: geen account, je antwoorden blijven in je browser en statistieken alleen na jouw toestemming.',
  body: `<article class="prose"><h1>Privacy en cookies</h1>
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
  body: `<div class="notfound"><h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn" href="/shop-match/">Start de match</a><a class="btn ghost" href="/platformen/">Alle platforms</a><a class="btn ghost" href="/">Homepage</a></div></div>`,
};
