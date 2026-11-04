/* Site-wide approved Learning Academy header.
 * Normalize the website header ONLY; preserve each destination, navigation,
 * account permissions, book titles, and publishing imprint. Idempotent.
 */
import {existsSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const output=resolve(process.env.GU_SITE_BUILD_DIR||'public');
const stylesheet='/assets/css/site-brand-academy-v1.css';
const runtimeScript='/assets/js/site-brand-academy-sync-v1.js';
const versionedStylesheet=stylesheet+'?v=20261104-sitewide-emerald3';
if(!existsSync(join(output,'assets/js/site-brand-academy-sync-v1.js')))throw Error('Shared Academy header runtime asset missing');
if(!existsSync(join(output,'assets/css/site-brand-academy-v1.css')))throw Error('Academy identity CSS is missing');
const title='<span class="gu-academy-brand-title">THE STOCK MARKET <span>FROM THE GROUND UP</span></span>';
const subtitle='<span class="gu-academy-brand-subtitle">LEARNING ACADEMY</span>';
const brandAnchor=/<a\b([^>]*\bclass\s*=\s*(['"])[^'"]*\bbrand\b[^'"]*\2[^>]*)>([\s\S]*?)<\/a>/gi;
let scanned=0,withBrand=0,changed=0,normalized=0;
for(const file of readdirSync(output).filter(x=>x.endsWith('.html')&&!/^google[\w-]+\.html$/i.test(x))){
 const location=join(output,file),before=readFileSync(location,'utf8');
 if(!/<head\b|<header\b/i.test(before))continue;
 let matched=false;
 // Restrict replacements to navigation inside the real site header.
 // Do not rewrite body copy, books, product labels or links outside the header.
 let html=before.replace(/<header\b[^>]*\bclass\s*=\s*(['"])[^'"]*\bsite-header\b[^'"]*\1[^>]*>[\s\S]*?<\/header>/gi,header=>{
  return header.replace(brandAnchor,(full,attributes,_quote,body)=>{
   const recognizable=/THE STOCK MARKET\b/i.test(body)&&/FROM THE GROUND UP/i.test(body);
   if(!recognizable)return full;
   matched=true;
   const attrs=attributes.replace(/\bclass\s*=\s*(['"])([^'"]*)\1/i,(_m,q,classes)=>
    'class='+q+[...new Set((classes+' gu-academy-brand').split(/\s+/).filter(Boolean))].join(' ')+q);
   const desired='<a'+attrs+'>'+title+subtitle+'</a>';
   if(desired!==full)normalized++;
   return desired;
  });
 });
 if(matched){
  withBrand++;
  if(/<link\b[^>]*site-brand-academy-v1\.css[^>]*>/i.test(html)){
   // Upgrade existing homepage or themed-page links, not just missing links.
   // A stable, old stylesheet URL could otherwise retain the previous colors.
   html=html.replace(/(<link\b[^>]*\bhref\s*=\s*['"])[^'"]*site-brand-academy-v1\.css(?:\?[^'"]*)?(['"][^>]*>)/gi,
     (_match,opening,closing)=>opening+versionedStylesheet+closing);
  }else{
   if(!/<\/head>/i.test(html))throw Error('Academy-branded document lacks head: '+file);
   html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="'+versionedStylesheet+'"></head>');
  }
  if(!/gu-academy-brand-title/.test(html)||!/gu-academy-brand-subtitle/.test(html))
   throw Error('Approved Academy header incomplete: '+file);
  // Last-mile runtime protection for authenticated navigation and Owner style
  // changes. This is additive to the static rendered header and preserves URLs.
  if(!html.includes(runtimeScript)){
   if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,
     '<script defer src="'+runtimeScript+'?v=20261104-global3"></script></body>');
   else throw Error('Academy-branded document lacks body close: '+file);
  }
 }
 if(html!==before){writeFileSync(location,html);changed++}
 scanned++;
}
if(scanned>=20&&withBrand<10)throw Error('Unexpectedly few canonical website headers; manual review required');
console.log('Approved Academy header: '+withBrand+' website headers across '+scanned+' HTML files; '+normalized+' anchor updates; '+changed+' files changed.');
