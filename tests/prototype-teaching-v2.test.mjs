/* Prototype V2: independently execute Cloudflare Pages Function auth and numerical case contracts.
 * These are synthetic authorization tests; actual Supabase account-browser QA remains separate.
 */
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/prototype-training-cases.js';
import fs from 'node:fs';
import vm from 'node:vm';
const frontend=fs.readFileSync('assets/js/prototype-teaching-v2.js','utf8');
new vm.Script(frontend,{filename:'prototype-teaching-v2.js'});
assert.match(frontend,/prototype-training-cases/);
assert.match(frontend,/privateAnswerKeysIncluded!==false/);
assert.match(frontend,/gradingEnabled!==false/);
assert.match(frontend,/state\.tab==='replay'\?state\.revealed/);
const controller=fs.readFileSync('assets/js/prototype-center-v1.js','utf8');
assert.match(controller,/CrownlightPrototypeTeaching\.mount/);
assert.match(controller,/getChartCandles/);
const html=fs.readFileSync('prototype.html','utf8');
assert.ok(html.indexOf('/assets/js/prototype-teaching-v2.js')<html.indexOf('/assets/js/prototype-center-v1.js'));
const api=fs.readFileSync('functions/api/prototype-training-cases.js','utf8');
assert.doesNotMatch(api,/serviceKey\(env\.SUPABASE_SECRET_KEY\)[^]*?return response\(\{ok:true[^]*?secret:/i);
const env={SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co',SUPABASE_PUBLISHABLE_KEY:'SYNTHETIC_PUBLIC',SUPABASE_SECRET_KEY:'sb_secret_synthetic'};
const actor={roles:['OWNER'],permissions:['control_panel.access'],account_kind:'member',status:'active',expired:false};
let identityCalls=0;
const oldFetch=globalThis.fetch;
globalThis.fetch=async(url)=>{
 const path=String(url);const json=value=>({ok:true,status:200,json:async()=>value});
 if(path.includes('/auth/v1/user')){identityCalls++;return json({id:'synthetic-admin'})}
 if(path.includes('/rest/v1/admin_user_roles'))return json(actor.roles.map(role_code=>({role_code,expires_at:actor.expired?'2020-01-01T00:00:00Z':null})));
 if(path.includes('/rest/v1/profiles'))return json([{account_kind:actor.account_kind,deleted_at:null}]);
 if(path.includes('/rest/v1/admin_user_flags'))return json([{status:actor.status}]);
 if(path.includes('/rest/v1/admin_role_permissions'))return json(actor.permissions.map(permission_code=>({permission_code})));
 throw Error('Unexpected mock request '+path);
};
async function request(jwt='synthetic-jwt',method='GET'){
 const headers=jwt?{authorization:'Bearer '+jwt}:{};
 const response=await onRequest({request:new Request('https://example.test/api/prototype-training-cases',{method,headers}),env});
 return {status:response.status,body:await response.json(),headers:response.headers};
}
try{
 let outcome=await request('', 'GET');assert.equal(outcome.status,401);
 outcome=await request('token','POST');assert.equal(outcome.status,405);
 actor.roles=['MODERATOR'];outcome=await request();assert.equal(outcome.status,403);
 actor.roles=['SHOWCASE_VIEWER'];outcome=await request();assert.equal(outcome.status,403);
 actor.roles=['OWNER','SHOWCASE_VIEWER'];outcome=await request();assert.equal(outcome.status,403);
 actor.roles=['ADMIN'];actor.permissions=[];outcome=await request();assert.equal(outcome.status,403);
 actor.permissions=['control_panel.access'];actor.status='suspended';outcome=await request();assert.equal(outcome.status,403);
 actor.status='active';actor.account_kind='showcase';outcome=await request();assert.equal(outcome.status,403);
 actor.account_kind='member';actor.expired=true;outcome=await request();assert.equal(outcome.status,403);
 actor.expired=false;outcome=await request();assert.equal(outcome.status,200);
 assert.equal(outcome.body.ok,true);assert.equal(outcome.body.source,'FICTIONAL_PROTOTYPE');
 assert.equal(outcome.body.gradingEnabled,false);assert.equal(outcome.body.privateAnswerKeysIncluded,false);
 assert.equal(outcome.body.cases.length,3);
 assert.match(outcome.headers.get('cache-control'),/no-store/);
 for(const c of outcome.body.cases){
  assert.equal(c.type,'FICTIONAL');assert.equal(c.candles.length,4);
  assert.equal(c.expectedNumerator,undefined);assert.equal(c.expectedDenominator,undefined);
  let sum=0,weighted=0;
  for(const v of c.candles){
   assert.ok(v.high>=Math.max(v.open,v.close));assert.ok(v.low<=Math.min(v.open,v.close));assert.ok(v.volume>0);
   const tp=(v.high+v.low+v.close)/3;sum+=v.volume;weighted+=tp*v.volume;
  }
  assert.ok(Number.isFinite(weighted/sum));
 }
 assert.equal(identityCalls,8,'Two early denials must avoid identity provider calls');
 console.log('PASS Prototype V2: 9 API authentication scenarios + 3 fictional case provenance/calculation contracts.');
}finally{globalThis.fetch=oldFetch}
