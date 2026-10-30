import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { layout, SITE, BASE, PREVIEW } from './src/layout.mjs';
import { partnerNoten } from './src/lib/partnerlinks.js';
import * as P from './src/pages.mjs';
import { maakLogoCellen } from './src/lib/logo-cellen.mjs';
import { PLATFORMS } from './src/lib/platforms.js';
import { ZONDER_LOGO } from './src/lib/logo-rechten.js';
import { loadPosts, postPage, blogIndex, latestHtml, feed } from './src/blog.mjs';
const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
// Logo's in tabelcellen met precies de naam van een platform (30-10); zelfde vak voor elk platform, alleen beeld.
// Niet voor merken in ZONDER_LOGO (merkrichtlijn vraagt toestemming; SC 30-10): daar blijft alleen de naam.
const logoCellen = maakLogoCellen(Object.entries(PLATFORMS).filter(([id]) => !ZONDER_LOGO.has(id)).map(([id, p]) => ({ namen: [...new Set([p.naam, p.naam.split(' ')[0]])], src: `${BASE}/logos/${id}.svg`, merk: p.naam.split(' ')[0] })));
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, p.endsWith('.html') ? logoCellen(s) : s); };
// Blog: content/blog/*.md (nieuwste eerst; posts met een datum in de toekomst worden overgeslagen).
const posts = loadPosts();
const home = { ...P.home, body: P.home.body.replace('{{latest}}', latestHtml(posts)) };
export const pages = [home, P.quiz, P.platformHub, ...P.platformPages, P.vsHub, ...P.vsPages, P.gidsHub, ...P.guides, ...(posts.length ? [blogIndex(posts), ...posts.map((x) => postPage(x, posts))] : []), P.over, P.privacy, P.notfound];
for (const p of pages) write(p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html'), partnerNoten(layout(p)));
// Doorverwijzingen voor weggehaalde pagina's. GitHub Pages kan geen 301 sturen: statische pagina met meta refresh,
// canonical naar het doel en noindex. Staan niet in de sitemap.
export const REDIRECTS = { '/platformen/squarespace/': '/platformen/' }; // Squarespace uit de vergelijking (26-10-2026)
const redirectHtml = (to) => `<!doctype html>\n<html lang="nl"><head><meta charset="utf-8"><title>Doorverwijzing | ${SITE.name}</title><meta name="robots" content="noindex"><link rel="canonical" href="${SITE.domain}${to}"><meta http-equiv="refresh" content="0; url=${BASE}${to}"><script>location.replace(${JSON.stringify(BASE + to)})</script></head><body><p>Deze pagina is verhuisd naar <a href="${BASE}${to}">${SITE.domain}${to}</a>.</p></body></html>\n`;
for (const [from, to] of Object.entries(REDIRECTS)) write(join(OUT, from, 'index.html'), redirectHtml(to));
cpSync('src/assets/js', join(OUT, 'js'), { recursive: true });
cpSync('src/lib', join(OUT, 'js/lib'), { recursive: true, filter: (p) => !/(logo-(rechten|cellen)\.m?js|[\\/]checklist\.js)$/.test(p) }); // alleen build-time, niet publiceren (checklist.js: SC 30-10)
cpSync('src/assets/og', join(OUT, 'og'), { recursive: true });
cpSync('src/assets/logos', join(OUT, 'logos'), { recursive: true, filter: (f) => !f.endsWith('.md') });
cpSync('src/assets/icons', OUT, { recursive: true });
cpSync('src/assets/fonts', join(OUT, 'fonts'), { recursive: true });
cpSync('src/root', OUT, { recursive: true });
// CNAME pas bij livegang (GO_LIVE=1). Zonder CNAME blijft dit een preview op github.io.
if (process.env.GO_LIVE === '1') write(join(OUT, 'CNAME'), 'shopmatch.nl\n');
write(join(OUT, '.nojekyll'), '');
if (posts.length) write(join(OUT, 'blog/feed.xml'), feed(posts));
write(join(OUT, 'robots.txt'), PREVIEW ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
write(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => !p.noindex).map((p) => `<url><loc>${SITE.domain}${p.path}</loc><lastmod>${p.lastmod || SITE.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${pages.length} pages (${posts.length} blogposts) → ${OUT}/${PREVIEW ? ` (preview, BASE=${BASE || '/'})` : ''}`);
