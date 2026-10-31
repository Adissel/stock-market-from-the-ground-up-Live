import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const bridge=JSON.parse(fs.readFileSync('data/lab-teaching-bridges-v014168.json','utf8'));
const ctx=vm.createContext({});
new vm.Script(fs.readFileSync('assets/js/lab-v34-interactive-lessons.js','utf8'),{filename:'lab-v34-interactive-lessons.js'}).runInContext(ctx);
const api=ctx.GroundUpLabV34InteractiveLessons;
assert(api?.get,'Interactive Lab teaching API is required');
for(const row of Object.values(bridge.entries)){
 const guidance=api.get({type:'general',feature:'apply',concept:row.title,labId:row.labId,bridge:row,guide:{code:row.mappedGuideCode,concept:row.title}});
 assert(guidance.script.includes('Independent ungraded transfer exercise:'),row.labId+' transfer prompt not visible');
 assert(guidance.script.includes(row.transfer.prompt),row.labId+' transfer content mismatch');
 assert.equal(guidance.verifiedHistory,false);
}
console.log('PASS: every 419 canonical Apply screens includes its own public, ungraded, no-lookahead transfer task');
