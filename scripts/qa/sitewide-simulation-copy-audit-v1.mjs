/* Crownlight controlled site-wide visible terminology inventory.
 * Source-only audit: never modify member content, files, billing or data. */
import {readdirSync,readFileSync,mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {join,relative,extname} from 'node:path';
const cwd=process.cwd();
const dirs=['assets/js','src/experience','src/ts'];
const term=/\b(?:fictional|illustrative)\b/gi;
const terms=s=>Array.from(String(s||'').matchAll(term)).map(x=>x[0]);
function collect(folder){
 try{return readdirSync(folder,{withFileTypes:true}).flatMap(ent=>{
  const path=join(folder,ent.name);
  return ent.isDirectory()?collect(path):ent.isFile()&&/\.(?:js|mjs|cjs|ts|tsx|jsx)$/.test(ent.name)?[path]:[];
 })}catch{return []}
}
const protectedBaselines=['lab-v32-reference.html','lab-v32-member.html'];
const pages=readdirSync(cwd).filter(f=>f.endsWith('.html')&&!protectedBaselines.includes(f)).map(f=>join(cwd,f));
const scripts=dirs.flatMap(dir=>collect(join(cwd,dir)));
const pageResults=[];
for(const file of pages){
 const source=readFileSync(file,'utf8');
 const text=source.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,' ')
  .replace(/<!--[\s\S]*?-->/g,' ');
 const visibleText=text.replace(/<[^>]*>/g,' ');
 const accessible=[...text.matchAll(/\b(?:aria-label|title|placeholder|alt)="([^"]*)"/gi)]
  .map(x=>x[1]).join(' ');
 const matched=terms(visibleText+' '+accessible);
 if(matched.length)pageResults.push({file:relative(cwd,file),count:matched.length,
  excerpt:(visibleText+' '+accessible).replace(/\s+/g,' ').match(/.{0,65}\b(?:fictional|illustrative)\b.{0,75}/i)?.[0]||''});
}
const sourceResults=[];
for(const file of scripts){
 const source=readFileSync(file,'utf8'),matched=terms(source);
 if(matched.length)sourceResults.push({file:relative(cwd,file),count:matched.length,
  preview:source.replace(/\s+/g,' ').match(/.{0,50}\b(?:fictional|illustrative)\b.{0,65}/i)?.[0]||''});
}
pageResults.sort((a,b)=>b.count-a.count||a.file.localeCompare(b.file));
sourceResults.sort((a,b)=>b.count-a.count||a.file.localeCompare(b.file));
const result={auditVersion:'1.0.0',generatedAt:new Date().toISOString(),scope:{
 htmlPages:pages.length,jsTsSource:scripts.length},
 staticHtmlVisibleRemaining:pageResults.length,protectedReferenceExceptions:protectedBaselines,jsTsSourceCandidates:sourceResults.length,
 note:'JS/TS hits include comments, API keys, source contracts and nonvisible strings: manual review required. HTML excludes script/style source and examines visible text and accessible labels.',
 staticHtml:pageResults,sourceCandidates:sourceResults};
mkdirSync('artifacts/site-copy',{recursive:true});
writeFileSync('artifacts/site-copy/visible-terminology-inventory-v1.json',JSON.stringify(result,null,2)+'\n');
console.log('SITEWIDE_COPY_AUDIT '+JSON.stringify({pagesScanned:pages.length,scriptsScanned:scripts.length,htmlPagesRemaining:pageResults.length,jsSourceCandidates:sourceResults.length}));
for(const p of pageResults.slice(0,65))console.log('HTML_VISIBLE_REVIEW '+p.file+' '+p.count+' '+p.excerpt);
for(const s of sourceResults.slice(0,25))console.log('JS_SOURCE_REVIEW '+s.file+' '+s.count);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,
 '## Site-wide terminology inventory\n\n'+
 'Scanned '+pages.length+' HTML pages and '+scripts.length+' JS/TS assets.\n\n'+
 'Visible HTML source pages needing review: '+pageResults.length+'.\n\n'+
 'JS/TS sources containing candidate wording (not all user-visible): '+sourceResults.length+'.\n\n'+
 'No member content, runtime state, source, or financial data was modified by this scan.\n\n'+
 'See workflow artifact for each matching file and excerpt.\n');
