/* Regression against recoverable first-option private answers.
 * Server uses a secret-keyed HMAC; member-visible ID, question and public
 * source code must not suffice to invert the original private option order.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../functions/api/interactive-training.js',import.meta.url),'utf8');
assert(source.includes('shuffledChoiceOptions(set.questions[step].options,attempt.id,set.questions[step].id,env)'));
assert(source.includes("crypto.subtle.importKey('raw'"));
assert(source.includes("crypto.subtle.sign('HMAC'"));
assert(source.includes('ASSESSMENT_OPTION_HMAC_KEY||env?.SUPABASE_SECRET_KEY'));
assert(source.includes('await publicState(record,pinned,env)'));
assert(source.includes('await publicState(a,set,env)'));
assert(source.includes("const arr=[...options]"),'Do not mutate frozen authored choices');
assert(!source.includes('Math.imul(seed,1664525)+1013904223'),'Public deterministic seed is not an assessment secret');
const choices=['Correct option','Plausible distractor','Incorrect future prediction'];
async function keyedOrder(arr,attempt,id,secret){
 const enc=new TextEncoder();
 const key=await crypto.subtle.importKey('raw',enc.encode(secret),
  {name:'HMAC',hash:'SHA-256'},false,['sign']);
 const dv=new DataView(await crypto.subtle.sign('HMAC',key,
  enc.encode('SMFGU|private-training-choice|v1|'+attempt+'|'+id)));
 const out=[...arr];
 for(let i=out.length-1,k=0;i>0;i--,k+=4){
  const j=dv.getUint32(k,false)%(i+1);
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
const placements=new Set();let changedByKey=0;
for(let i=0;i<75;i++){
 const attempt=String(i).padStart(8,'0')+'-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
 const first=await keyedOrder(choices,attempt,'EVIDENCE','private-high-entropy-fixture-1');
 assert.deepEqual([...first].sort(),[...choices].sort());
 assert.deepEqual(await keyedOrder(choices,attempt,'EVIDENCE','private-high-entropy-fixture-1'),first,
  'Refreshing pinned attempts must preserve displayed order');
 const second=await keyedOrder(choices,attempt,'EVIDENCE','different-secret-fixture-2');
 if(JSON.stringify(first)!==JSON.stringify(second))changedByKey++;
 placements.add(first.indexOf('Correct option'));
}
assert.deepEqual(placements,new Set([0,1,2]));
assert(changedByKey>=20,'Private HMAC key must materially affect otherwise identical attempt permutations');
console.log('PASS private choice-order safeguard: HMAC keyed by server-only secret, stable by attempt/question, position varied; no public reversible seed.');
