import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const cat=read('lab-catalog.json').labs,publicLabs=read('data/labs.json'),idx=read('data/interactive-lab-index.json');
const paths=read('data/competency-lab-paths-v01499.json').byLab,bridge=read('data/lab-teaching-bridges-v014168.json').entries;
const ids=['F3-C04-L01','F3-C04-L02','F3-C04-L03','F3-C05-L01','F3-C05-L02','F3-C05-L03','F3-C05-L04','F3-C06-L01','F3-C06-L02','F3-C06-L03','F3-C06-L04','F3-C06-L05','F3-C06-L06'];
test('thirteen formerly ID-only Foundation titles match both pre-existing companion registries',()=>{
 assert.equal(cat.length,419);assert.equal(ids.length,13);
 for(const id of ids){const title=publicLabs.find(x=>x.id===id).concept;assert.equal(idx.find(x=>x.id===id).concept,title);assert.notEqual(title,id);assert.equal(cat.find(x=>x.lab_id===id).title,title);assert.equal(paths[id].title,title);assert.equal(bridge[id].title,title)}
});
test('title recovery neither authors lessons nor changes protected grading',()=>{for(const id of ids){const x=bridge[id];assert.equal(x.instructionSource,undefined);assert.equal(x.transfer.graded,false);assert(!JSON.stringify(x).includes('officialAnswer'))}});
