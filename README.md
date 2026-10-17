# ShopMatch.nl
Statische site (Node, geen frameworks), zelfde opbouw en huisstijl als BoekhoudMatch (Inter, tokens, header met menu, footer met "Ook van ons"); eigen accent indigo `#4b3fc4`. `npm test`, `npm run build`, `npm run images` (og-afbeeldingen en favicons).
- Platformdata: `src/lib/platforms.js` (alleen feiten van de eigen site van de aanbieder, met bron). `nlCheck: true` = euro-bedrag nog bevestigen vanaf een Nederlands IP.
- Vergelijking: `FEATURES` in `src/lib/platforms.js` (10 checklistpunten per platform: ja/deels/nee/null = niet vermeld, met bron). Score en situaties: `src/lib/checklist.js` (ja 1, deels 0,5, rest 0; prijs telt apart; volgorde = score, dan prijs). Filters: `src/assets/js/vergelijk.js`.
- Match: `src/lib/match.js` (puur, getest). Antwoorden mogen in de URL staan (`/shop-match/?doel=shop&producten=100&budget=mid&techniek=geen&nl=ja`). Partnerlinks: `src/lib/partnerlinks.js` (leeg tot goedkeuring; `rel="sponsored nofollow noopener"` + label "partnerlink"; nooit invloed op de match).
- Netwerkfooter: `src/network.mjs`. GA: `src/analytics.config.mjs` (leeg = geen cookies en geen cookiemelding).
- IndexNow-sleutel: `src/root/<sleutel>.txt`.

## Preview en livegang
- Preview: push naar main → Actions → https://davidwester89-dot.github.io/shopmatch-site/ (noindex, robots Disallow, geen CNAME).
- Live (pas na akkoord Dave): in `.github/workflows/pages.yml` `BASE: ''` en `GO_LIVE: '1'`; custom domain shopmatch.nl verwijderen uit repo `shopmatch` (placeholder) en zetten op deze repo; DNS staat al op GitHub Pages.

## Schrijfregels
Bylines "Redactie ShopMatch". Geen namen of foto's van personen, geen verzonnen experts. Geen disclaimerzinnen ("geraadpleegd op", "check altijd de actuele prijs"). Bron = kale naam + link. Nooit batterijmatch.nl, geen Goodfellas-links, geen Reddit.
