/* Site-wide approved Learning Academy header.
 * Normalize the website header ONLY; preserve each destination, navigation,
 * account permissions, book titles, and publishing imprint. Idempotent.
 */
import {existsSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const output=resolve(process.env.GU_SITE_BUILD_DIR||'public');
const stylesheet='/assets/css/site-brand-academy-v1.css';
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
  if(!html.includes('site-brand-academy-v1.css')){
   if(!/<\/head>/i.test(html))throw Error('Academy-branded document lacks head: '+file);
   html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="'+stylesheet+'?v=20261104-sitewide1"></head>');
  }
  if(!/gu-academy-brand-title/.test(html)||!/gu-academy-brand-subtitle/.test(html))
   throw Error('Approved Academy header incomplete: '+file);
 }
 if(html!==before){writeFileSync(location,html);changed++}
 scanned++;
}
if(scanned>=20&&withBrand<10)throw Error('Unexpectedly few canonical website headers; manual review required');
console.log('Approved Academy header: '+withBrand+' website headers across '+scanned+' HTML files; '+normalized+' anchor updates; '+changed+' files changed.');
