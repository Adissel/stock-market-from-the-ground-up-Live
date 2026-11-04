/* Read-only public-copy provenance audit; no database access or credentials. */
import {readFileSync,readdirSync,appendFileSync} from 'node:fs';
import path from 'node:path';
const roots=['.','assets/js','src','functions'];
const hits=[];
const blocked=new Set(['node_modules','.git','tests','docs','data','supabase','workers','public']);
function walk(folder,depth=0){
 if(depth>5)return;
 for(const d of readdirSync(folder,{withFileTypes:true})){
  if(d.isDirectory()){if(!blocked.has(d.name))walk(path.join(folder,d.name),depth+1);continue}
  if(!d.isFile()||!/\.(html|js|tsx)$/.test(d.name))continue;
  const file=path.join(folder,d.name).replaceAll('\\','/');
  if(folder==='.'&&!file.endsWith('.html'))continue;
  const source=readFileSync(file,'utf8');
  source.split('\n').forEach((line,index)=>{
   const count=(line.match(/\bfictional\b/gi)||[]).length;
   if(count)hits.push({file,line:index+1,count,sample:line.trim().replace(/\s+/g,' ').slice(0,150)});
  });
 }
}
for(const root of roots)walk(root);
const groups=new Map();
for(const item of hits)groups.set(item.file,(groups.get(item.file)||0)+item.count);
const ranked=[...groups].sort((a,b)=>b[1]-a[1]);
console.log('SOURCE_COPY_AUDIT files='+ranked.length+' tokens='+hits.reduce((a,x)=>a+x.count,0));
for(const [file,count] of ranked.slice(0,120))
 console.log('COPY_AUDIT '+JSON.stringify({file,count,sample:hits.find(x=>x.file===file)?.sample}));
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,
 '## Sitewide practice terminology audit\n\nThese are all matching code/source tokens including technical enums and comments; only member-facing copy should change.\n\n'+
 '| File | Tokens |\n|---|---:|\n'+ranked.slice(0,140).map(([file,n])=>'| '+file+' | '+n+' |').join('\n')+'\n');
