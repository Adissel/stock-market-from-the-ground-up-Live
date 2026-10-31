import assert from 'node:assert/strict';
import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('data/lab-teaching-bridges-v014168.json','utf8'));
const e=Object.values(d.entries);
assert.equal(d.version,'0.14.0.168');
assert.equal(e.length,419);
assert.equal(new Set(e.map(x=>x.labId)).size,419);
const forbidden='Before practicing, understand what the visible observation does and does not establish.';
const tabs=['understand','recognize','apply','mistake','limits'];
for (const row of e) {
 for(const name of tabs)assert(row.tabs[name]?.length>=3,row.labId+' missing '+name);
 assert(row.selfCheck,row.labId+' lacks check');
 assert(!row.tabs.understand.includes(forbidden),row.labId+' retains generic instruction');
 assert.equal(row.transfer?.graded,false,row.labId+' transfer cannot grade');
 assert.equal(row.transfer?.requiresNewEvidence,true,row.labId+' needs fresh evidence');
 assert.equal(row.transfer?.noLookahead,true,row.labId+' may not use future bars');
 assert(row.transfer?.prompt?.length>45,row.labId+' missing substantive transfer task');
 assert.equal(row.transfer?.topic,row.title,row.labId+' transfer topic mismatch');
}
assert.equal(d.independentGradesIncluded,false);
assert.equal(d.historicalBarDataIncluded,false);
console.log('PASS: 419 bridge identifiers, 5 teaching facets, 419 ungraded evidence-based transfer prompts; generic boilerplate removed');
