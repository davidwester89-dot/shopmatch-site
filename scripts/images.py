# og:image (1200x630) per pagina en favicons. HTML -> PNG met headless Chrome. Geen foto's, geen personen.
import subprocess, os, tempfile, json
from PIL import Image
B='#4b3fc4';D='#161b2e';S='#efeff8';BG='#f8f8fc';G='#1f3f6b';P='#b9b2f0'
LOGO='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#4b3fc4"/><path d="M10 15h20l-1.6 16.5a2 2 0 0 1-2 1.5H13.6a2 2 0 0 1-2-1.5z" fill="#fff"/><path d="M15 15v-2.5a5 5 0 0 1 10 0V15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="m15.5 23.5 3 3 6-6" fill="none" stroke="#4b3fc4" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="8" r="4" fill="#e7a33e"/></svg>'
cards={
 'home':('Welke webshop of website past bij jou?','Shopify · Wix · JouwWeb · Lightspeed · Hostinger · Mijndomein · WooCommerce'),
 'match':('Doe de ShopMatch','5 vragen, je top 3 met prijs'),
 'platformen':('Alle webshop-platforms','Prijs, checklist-score en voor wie het past'),
 'vergelijken':('Webshop-platforms vergelijken','Prijs, iDEAL, kassa en B2B naast elkaar'),
 'platform-shopify':('Shopify','Prijzen, voor- en nadelen'),
 'platform-wix':('Wix','Prijzen, voor- en nadelen'),
 'platform-jouwweb':('JouwWeb','Prijzen, voor- en nadelen'),
 'platform-lightspeed':('Lightspeed eCom','Prijzen, voor- en nadelen'),
 'platform-hostinger':('Hostinger Website Bouwer','Prijzen, voor- en nadelen'),
 'platform-mijndomein':('Mijndomein MijnWebshop','Prijzen, voor- en nadelen'),
 'platform-woocommerce':('WooCommerce','Kosten, voor- en nadelen'),
 'vs-shopify-vs-lightspeed':('Shopify of Lightspeed eCom?','Prijzen en verschillen'),
 'vs-wix-vs-jouwweb':('Wix of JouwWeb?','Prijzen en verschillen'),
 'vs-shopify-vs-woocommerce':('Shopify of WooCommerce?','Alles geregeld of alles zelf'),
 'beste-webshop-platform':('Het beste webshop-platform van 2026','De keuze per situatie'),
 'webshop-beginnen-kosten':('Webshop beginnen: wat kost het?','Jaarkosten per platform'),
 'gratis-website-maken':('Gratis website maken','Wat kan wel en niet'),
 'website-maken-zzp':("Website maken als zzp'er",'De beste opties in 2026'),
}
art=f'<svg viewBox="0 0 300 300" width="300" height="300"><rect x="20" y="40" width="200" height="140" rx="12" fill="#fff" stroke="{D}" stroke-width="6"/><rect x="5" y="180" width="230" height="14" rx="7" fill="{D}"/><rect x="42" y="62" width="156" height="20" rx="5" fill="{B}"/><rect x="42" y="94" width="44" height="44" rx="6" fill="{P}"/><rect x="98" y="94" width="44" height="44" rx="6" fill="{G}"/><rect x="154" y="94" width="44" height="44" rx="6" fill="#dcdcf0"/><rect x="200" y="110" width="76" height="130" rx="12" fill="#fff" stroke="{D}" stroke-width="6"/><rect x="214" y="128" width="48" height="36" rx="5" fill="{P}"/><rect x="214" y="210" width="48" height="14" rx="7" fill="{B}"/><circle cx="262" cy="46" r="28" fill="{G}"/><path d="m249 47 9 9 18-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
tmp=tempfile.mkdtemp()
def shot(html,out,w,h):
    f=os.path.join(tmp,'p.html');open(f,'w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={w},{h}',f'--screenshot={out}','file://'+f],capture_output=True,check=True)
os.makedirs('src/assets/og',exist_ok=True);os.makedirs('src/assets/icons',exist_ok=True)
for k,(t,sub) in cards.items():
    html=f'''<html><body style="margin:0;width:1200px;height:630px;background:{BG};font-family:'DejaVu Sans',sans-serif;overflow:hidden">
<div style="position:absolute;left:0;top:0;width:1200px;height:18px;background:{B}"></div>
<div style="position:absolute;left:72px;top:70px;display:flex;align-items:center;gap:16px;font-size:40px;font-weight:700;color:{D}"><div style="width:64px;height:64px">{LOGO}</div><span>Shop<span style="color:{B}">Match</span>.nl</span></div>
<div style="position:absolute;left:72px;top:190px;width:700px;font-size:{64 if len(t)<28 else 54}px;line-height:1.12;font-weight:800;color:{D}">{t}</div>
<div style="position:absolute;left:72px;bottom:80px;width:720px;font-size:30px;color:{G};font-weight:700">{sub}</div>
<div style="position:absolute;right:70px;top:170px;background:{S};border-radius:28px;padding:20px">{art}</div></body></html>'''
    shot(html,f'src/assets/og/{k}.png',1200,630)
open('src/assets/icons/favicon.svg','w').write(LOGO)
for size,name in ((32,'favicon-32.png'),(180,'apple-touch-icon.png')):
    shot(f'<html><body style="margin:0;width:{size}px;height:{size}px">{LOGO.replace("<svg ",f"<svg width=\"{size}\" height=\"{size}\" ")}</body></html>',f'src/assets/icons/{name}',size,size)
print('ok',len(cards))
