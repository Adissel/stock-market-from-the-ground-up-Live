import {readFileSync,writeFileSync} from 'node:fs';

const catalogPath='lab-catalog.json',pathsPath='data/competency-lab-paths-v01499.json',bridgePath='data/lab-teaching-bridges-v014168.json';
const catalog=JSON.parse(readFileSync(catalogPath,'utf8'));
const publicLabs=JSON.parse(readFileSync('data/labs.json','utf8'));
const publicIndex=JSON.parse(readFileSync('data/interactive-lab-index.json','utf8'));
const paths=JSON.parse(readFileSync(pathsPath,'utf8'));
const bridge=JSON.parse(readFileSync(bridgePath,'utf8'));
const editorialPath='docs/419_LAB_EDITORIAL_ACCEPTANCE_v014100.csv';let editorial=readFileSync(editorialPath,'utf8');
const researchPath='docs/research/419_LAB_RESEARCH_AND_HISTORICAL_PROVENANCE_CROSSWALK_v014165.csv';let research=readFileSync(researchPath,'utf8');
const ids=['F3-C04-L01','F3-C04-L02','F3-C04-L03','F3-C05-L01','F3-C05-L02','F3-C05-L03','F3-C05-L04','F3-C06-L01','F3-C06-L02','F3-C06-L03','F3-C06-L04','F3-C06-L05','F3-C06-L06'];
for(const id of ids){
 const a=publicLabs.find(x=>x.id===id),b=publicIndex.find(x=>x.id===id),row=catalog.labs.find(x=>x.lab_id===id);
 if(!a||!b||!a.concept||a.concept!==b.concept||a.concept===id)throw Error('No matching authoritative companion concept for '+id);
 const title=a.concept;
 row.title=title;row.metadata.concept=title;
 if(![id,title].includes(paths.byLab[id]?.title))throw Error('Unexpected competency title for '+id);
 paths.byLab[id].title=title;
 const escaped=title.replaceAll('"','""'),needle=`"${id}","${row.book_code}","${row.chapter_number}","${id}","${id}"`,replacement=`"${id}","${row.book_code}","${row.chapter_number}","${escaped}","${id}"`;
 if(editorial.includes(needle))editorial=editorial.replace(needle,replacement);else if(!editorial.includes(replacement))throw Error('Editorial title row not found for '+id);
 const researchNeedle=`"${id}","${row.book_code}","${id}"`,researchReplacement=`"${id}","${row.book_code}","${escaped}"`;
 if(research.includes(researchNeedle))research=research.replace(researchNeedle,researchReplacement);else if(!research.includes(researchReplacement))throw Error('Research title row not found for '+id);
 const lesson=bridge.entries[id];
 if(!lesson||![id,title].includes(lesson.title)||lesson.instructionSource)throw Error('Bridge is not an unauthored recoverable record: '+id);
 lesson.title=title;
 const replace=value=>Array.isArray(value)?value.map(replace):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replace(v)])):value===id?title:typeof value==='string'?value.replaceAll(id,title):value;
 for(const key of ['tabs','selfCheck','transfer'])lesson[key]=replace(lesson[key]);
}
writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+'\n');
writeFileSync(pathsPath,JSON.stringify(paths)+'\n');
writeFileSync(bridgePath,JSON.stringify(bridge,null,2)+'\n');
writeFileSync(editorialPath,editorial);
writeFileSync(researchPath,research);
console.log('Recovered '+ids.length+' canonical Foundation titles from matching existing companion registries.');
