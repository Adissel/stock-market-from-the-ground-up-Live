/* Public Sitemap V2 — authoritative static sitemap artifact for Cloudflare Pages.
 * The SEO builder supplies its reviewed public allowlist; this writer verifies
 * real output files and canonical tags before publishing. Private pages stay out.
 * No invented lastmod dates, crawl promises, user records or external requests.
 */
import assert from 'node:assert/strict';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const privateRoute=/^\/(?:api|admin|owner|dashboard|account|my-|journal|simulator|site-lab|lab-player|market-tutor|training|checkout|settings|signin|forum|market-commons|labs|bootcamp|prototype)(?:[/-]|$)/i;
const xmlEscape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));

export function buildPublicSitemapV2({root,origin,pages}){
 assert(typeof root==='string'&&root.length>0,'Output directory is required');
 const base=new URL(origin);
 assert(base.protocol==='https:'&&!base.username&&!base.password&&!base.port&&
  base.pathname==='/'&&!base.search&&!base.hash&&base.origin===origin,
  'Sitemap must use the single approved HTTPS canonical origin');
 assert(Array.isArray(pages)&&pages.length>0&&pages.length<=50000,
  'Sitemap needs a bounded, nonempty public-page inventory');
 const urls=[],seen=new Set();
 for(const page of pages){
  const path=page?.path;
  assert(typeof path==='string'&&(path==='/'||/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)),
   'Sitemap page must be a final extensionless route');
  assert(!privateRoute.test(path),'Private or membership route excluded: '+path);
  const url=origin+path;
  assert(page.canonical===url,'SEO canonical and sitemap URL must match: '+path);
  assert(!seen.has(url),'Duplicate public sitemap location: '+url);seen.add(url);
  const htmlFile=join(root,path==='/'?'index.html':path.slice(1)+'.html');
  assert(existsSync(htmlFile),'Cannot list a page absent from the actual deployment: '+path);
  const html=readFileSync(htmlFile,'utf8');
  assert(html.includes('<link rel="canonical" href="'+url+'">'),'Published page missing matching canonical: '+path);
  assert(!/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)&&
   !/<meta\b[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots/i.test(html),
   'Noindex content cannot appear in a public sitemap: '+path);
  urls.push(url);
 }
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n'+
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
  urls.map(url=>'  <url><loc>'+xmlEscape(url)+'</loc></url>').join('\n')+
  '\n</urlset>\n';
 assert(Buffer.byteLength(xml,'utf8')<=50*1024*1024,'Sitemap exceeds protocol size cap');
 writeFileSync(join(root,'sitemap.xml'),xml,'utf8');
 return Object.freeze({count:urls.length,urls:Object.freeze(urls),xml});
}
