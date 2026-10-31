/* Fixture: no payment, private SQL or member-state mutations. */
import assert from 'node:assert/strict';
import {onRequestGet as tier} from '../functions/api/chart-tier-access.js';
import {onRequest as workspace} from '../functions/api/chart-workspace.js';
const env={SUPABASE_URL:'https://offline-fixture.supabase.co',SUPABASE_SECRET_KEY:'fixture',SUPABASE_PUBLISHABLE_KEY:'public'};
const req=(method='GET')=>new Request('https://test.example/api/chart-workspace',{method,
 headers:{authorization:'Bearer fixture',...(method==='PUT'?{origin:'https://test.example','content-type':'application/json'}:{})},
 body:method==='PUT'?JSON.stringify({selected:'PROFESSIONAL',expectedUpdatedAt:null}):undefined});
const original=globalThis.fetch;let seen=0;
try{
 globalThis.fetch=async()=>{seen++;return new Response('{"error":"offline"}',{status:503,headers:{'content-type':'application/json'}})};
 const t=await tier({request:new Request('https://test.example/api/chart-tier-access',{headers:{authorization:'Bearer fixture'}}),env});
 const x=await t.json();assert.equal(t.status,503);assert.equal(x.eligible,false);assert.deepEqual(x.allowed,[]);assert.equal(x.tier,null);
 assert.match(t.headers.get('cache-control')||'',/no-store/);
 const w=await workspace({request:req(),env});const y=await w.json();assert.equal(w.status,503);assert.equal(y.ok,false);assert(!('workspace' in y));
 assert.match(w.headers.get('cache-control')||'',/no-store/);
 const put=await workspace({request:req('PUT'),env});const z=await put.json();assert.equal(put.status,503);assert.equal(z.ok,false);
 assert(seen>=3);
 console.log('PASS FIXTURE backend outage: no premium entitlement, no private workspace exposure, no false-positive save; all no-store');
}finally{globalThis.fetch=original}
