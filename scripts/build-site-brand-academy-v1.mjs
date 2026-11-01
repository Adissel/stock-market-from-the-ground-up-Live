/* Website-only academy subtitle for the existing static Cloudflare Pages build.
 * Idempotent and scoped exclusively to authored brand anchors in site headers.
 * Does not alter books, business names, URLs, route permissions, protected keys, or content.
 */
import {existsSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const output=resolve(process.env.GU_SITE_BUILD_DIR||'public');
const stylesheet='/assets/css/site-brand-academy-v1.css';
if(!existsSync(join(output,'assets/css/site-brand-academy-v1.css')))throw Error('Academy identity CSS is missing');
let scanned=0,withBrand=0,changed=0;
const brandAnchor=/<a\b([^>]*\bclass\s*=\s*(['"])[^'"]*\bbrand\b[^'"]*\2[^>]*)>([\s\S]*?)<\/a>/gi;
for(const file of readdirSync(output).filter(x=>x.endsWith('.html')&&!/^google[\w-]+\.html$/i.test(x))){
 const location=join(output,file),before=readFileSync(location,'utf8');
 if(!/<head\b|<header\b/i.test(before))continue;
 let detected=false;
 let html=before.replace(brandAnchor,(full,attributes,_quote,body)=>{
  // Only the existing academic site name in a real site-header brand link.
  if(!/THE STOCK MARKET\s*:/i.test(body)||!/FROM THE GROUND UP/i.test(body))return full;
  detected=true;
  if(/gu-academy-brand-subtitle/.test(body)){
   // Previously branded source HTML may still carry the superseded subtitle.
   const updated=body.replace(/(gu-academy-brand-subtitle[^>]*>)Learning Academy(<\/span>)/i,'$1Training Academy$2');
   return updated===body?full:'<a'+attributes+'>'+updated+'</a>';
  }
  const newAttrs=attributes.replace(/\bclass\s*=\s*(['"])([^'"]*)\1/i,(_m,q,classes)=>
   'class='+q+classes+' gu-academy-brand'+q);
  return '<a'+newAttrs+'><span class="gu-academy-brand-title">'+body.trim()+
   '</span><span class="gu-academy-brand-subtitle">Training Academy</span></a>';
 });
 if(detected){
  withBrand++;
  if(!html.includes('site-brand-academy-v1.css')){
   if(!/<\/head>/i.test(html))throw Error('Academy-branded document lacks head: '+file);
   html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="'+stylesheet+'"></head>');
  }
  if(!/gu-academy-brand-subtitle/.test(html)||!/gu-academy-brand-title/.test(html))
   throw Error('Academy identity missing semantic text: '+file);
 }
 if(html!==before){writeFileSync(location,html);changed++;}
 scanned++;
}
if(scanned>=20&&withBrand<10)throw Error('Unexpectedly few canonical website headers; manual review required');
console.log('Academy branding: '+withBrand+' recognized site headers across '+scanned+' HTML files; '+changed+' updated.');
