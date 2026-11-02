/* Compatibility-only route: the Cloudflare Pages static sitemap.xml built by
 * scripts/build-public-sitemap-v2.mjs is the authoritative public sitemap.
 * _routes.json excludes /sitemap.xml from Functions routing. Keep this fallback
 * restricted to those same 19 reviewed public canonical, extensionless paths.
 */
export const PUBLIC_PAGES=Object.freeze([
 '/',
 '/about',
 '/books',
 '/store',
 '/learn',
 '/tools',
 '/lab-samples',
 '/membership',
 '/help',
 '/philosophy',
 '/how-stock-market-works',
 '/how-to-read-candlestick-charts',
 '/vwap-explained',
 '/bid-ask-spread-explained',
 '/stock-trading-risk-management',
 '/candle-practice',
 '/free-foundations-challenge',
 '/market-vs-limit-orders',
 '/support-resistance-basics'
]);
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function onRequestGet({request,env}){
 // One configured canonical public domain is preferred. Until installed,
 // use the request host only if it is HTTPS and has no URL credentials.
 const configured=String(env?.PUBLIC_SITE_ORIGIN||'').trim();
 let host;try{host=new URL(configured||request.url)}catch{return new Response('Sitemap host unavailable',{status:503})}
 if(host.protocol!=='https:'||host.username||host.password||host.search||host.hash||
 (configured && host.pathname!=='/' && host.pathname!==''))
 return new Response('Public sitemap host is not verified',{status:503});
 const origin=host.origin;
 const payload='<?xml version="1.0" encoding="UTF-8"?>\n'+
 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
 PUBLIC_PAGES.map(path=>'  <url><loc>'+xml(origin+path)+'</loc></url>').join('\n')+
 '\n</urlset>';
 return new Response(payload,{headers:{'content-type':'application/xml; charset=utf-8',
  'cache-control':'public, max-age=3600','x-content-type-options':'nosniff'}});
}
