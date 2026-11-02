import {readFileSync,writeFileSync} from 'node:fs';

const catalogPath='lab-catalog.json',pathsPath='data/competency-lab-paths-v01499.json',bridgePath='data/lab-teaching-bridges-v014168.json';
const catalog=JSON.parse(readFileSync(catalogPath,'utf8'));
const publicLabs=JSON.parse(readFileSync('data/labs.json','utf8'));
const publicIndex=JSON.parse(readFileSync('data/interactive-lab-index.json','utf8'));
const paths=JSON.parse(readFileSync(pathsPath,'utf8'));
const bridge=JSON.parse(readFileSync(bridgePath,'utf8'));
const ids=catalog.labs.filter(x=>x.title===x.lab_id).map(x=>x.lab_id);
if(ids.length!==13)throw Error('Expected exactly 13 ID-only canonical Labs; found '+ids.length);
for(const id of ids){
 const a=publicLabs.find(x=>x.id===id),b=publicIndex.find(x=>x.id===id),row=catalog.labs.find(x=>x.lab_id===id);
 if(!a||!b||!a.concept||a.concept!==b.concept||a.concept===id)throw Error('No matching authoritative companion concept for '+id);
 const title=a.concept;
 row.title=title;row.metadata.concept=title;
 if(paths.byLab[id]?.title!==id)throw Error('Competency title was not ID-only for '+id);
 paths.byLab[id].title=title;
 const lesson=bridge.entries[id];
 if(!lesson||lesson.title!==id||lesson.instructionSource)throw Error('Bridge is not an unauthored ID-only record: '+id);
 lesson.title=title;
 const replace=value=>Array.isArray(value)?value.map(replace):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replace(v)])):value===id?title:typeof value==='string'?value.replaceAll(id,title):value;
 for(const key of ['tabs','selfCheck','transfer'])lesson[key]=replace(lesson[key]);
}
writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+'\n');
writeFileSync(pathsPath,JSON.stringify(paths)+'\n');
writeFileSync(bridgePath,JSON.stringify(bridge,null,2)+'\n');
console.log('Recovered '+ids.length+' canonical Foundation titles from matching existing companion registries.');
