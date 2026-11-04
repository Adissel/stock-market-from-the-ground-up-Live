/* A07–A12 source and negative acceptance. All HTTP and identities are fictional.
 * Genuine two-member browser acceptance and independent publication remain HOLD.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {onRequest as tutor} from '../functions/api/market-tutor-v01492.js';
import {onRequest as history} from '../functions/api/member-tutor-history-v014102.js';
import {onRequest as conversations} from '../functions/api/member-tutor-conversations.js';

const a='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const exchange='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const requestId='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',SUPABASE_SECRET_KEY:'sb_secret_test'};
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json'}});
const ask=(token='member-A',body={})=>new Request('https://school.test/api/market-tutor',{
 method:'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},
 body:JSON.stringify({question:'Explain VWAP evidence without predicting a trade.',mode:'explain',
  allowModel:false,saveHistory:false,requestId,...body})
});
const privateRequest=(path,token='member-A',method='GET',body)=>new Request('https://school.test/api/'+path,{
 method,headers:{authorization:'Bearer '+token,...(body?{'content-type':'application/json'}:{})},
 ...(body?{body:JSON.stringify(body)}:{})
});

test('A07/A08/A10/A12 — identity, consent, isolation, no grade and no paid provider',async()=>{
 const previous=globalThis.fetch;
 let kind='member',suspended=false,showcase=false,premium=false,expired=false;
 const events=[],rows=[];
 globalThis.fetch=async(url,opts={})=>{
  const u=String(url),auth=opts.headers?.authorization||'';
  events.push({url:u,method:opts.method||'GET',body:opts.body||null,auth});
  if(u.endsWith('/auth/v1/user')){
   if(auth==='Bearer expired')return json({message:'invalid JWT'},401);
   if(auth==='Bearer member-A')return json({id:a});
   if(auth==='Bearer member-B')return json({id:b});
   return json({message:'invalid session'},401);
  }
  if(u.includes('/profiles?'))return json([{account_kind:kind,deleted_at:null}]);
  if(u.includes('/admin_user_flags?'))return json(suspended?[{status:'suspended'}]:[]);
  if(u.includes('/admin_user_roles?'))return json(showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:[]);
  if(u.includes('/rpc/user_has_tool_access'))return json(premium);
  if(u.includes('gu_product_access_config_v1?'))return json([]);
  if(u.includes('/rpc/gu_v014107_take_tutor_request'))return json({accepted:true,reason:'allowed'});
  if(u.includes('/rpc/gu_v014102_save_member_tutor_exchange')){
   const data=JSON.parse(opts.body);
   rows.push({id:exchange,user_id:data.p_user_id,question:data.p_question,
    learner_answer:data.p_learner_answer,mode:data.p_mode,answer:data.p_answer,
    generation:data.p_generation,source_titles:data.p_source_titles,created_at:'2026-11-03T00:00:00Z'});
   return json(exchange);
  }
  if(u.includes('/gu_member_tutor_exchanges_v014102?')){
   const who=u.includes('user_id=eq.'+a)?a:u.includes('user_id=eq.'+b)?b:null;
   assert.ok(who,'History queries must always include the server-derived member ID');
   const found=rows.filter(x=>x.user_id===who);
   return json(u.includes('select=question,learner_answer')?found.map(x=>({
    question:x.question,learner_answer:x.learner_answer,mode:x.mode,
    answer:x.answer,generation:x.generation})):found);
  }
  if(u.includes('/gu_member_tutor_conversations_v014149?')){
   assert.match(u,/user_id=eq\./);
   return json([]);
  }
  if(u.includes('api.openai.com')||u.includes('workers.ai')||u.includes('/rpc/gu_v014103_'))
   throw Error('Unexpected paid provider or reservation');
  throw Error('Unexpected network route '+u);
 };
 try{
  let response=await tutor({request:ask(null),env});
  assert.equal(response.status,401,'A07: guests must be rejected');
  response=await tutor({request:ask('expired'),env});
  assert.equal(response.status,401,'A07: expired sessions must be rejected');
  kind='showcase';response=await tutor({request:ask(),env});
  assert.equal(response.status,403,'A07: non-member profiles must be rejected');
  kind='member';suspended=true;response=await tutor({request:ask(),env});
  assert.equal(response.status,403,'A07: suspended members must be rejected');
  suspended=false;showcase=true;response=await tutor({request:ask(),env});
  assert.equal(response.status,403,'A07: showcase cannot become a regular member');
  showcase=false;
  const before=events.length;
  response=await tutor({request:ask('member-A',{userId:b,officialGrade:100,allowModel:true}),env});
  assert.equal(response.status,400,'A07/A10: cannot spoof member or grading authority');
  assert.equal(events.length,before,'Invalid client claims must fail before any DB call');
  response=await tutor({request:ask('member-A',{allowModel:true}),env});
  let data=await response.json();
  assert.equal(response.status,200,'A12: eligible Free member must receive source Tutor');
  assert.equal(data.ok,true);
  assert.equal(data.graded,false);
  assert.equal(data.masteryAwarded,false);
  assert.notEqual(data.generation,'grounded-model-draft','Free must not enable paid model');
  assert.equal(data.historySaved,false,'A08: no opt-in means no saving');
  assert.equal(rows.length,0,'A08: no saved transcript without explicit opt-in');
  response=await tutor({request:ask('member-A',{saveHistory:true,allowModel:false}),env});
  data=await response.json();
  assert.equal(response.status,200);
  assert.equal(data.historySaved,true,'A08: explicit consent allows owned ungraded history');
  assert.equal(rows.length,1);
  assert.equal(rows[0].user_id,a);
  assert.ok(!('grade' in rows[0])&&!('mastery' in rows[0]));
  response=await history({request:privateRequest('member-tutor-history','member-A'),env});
  data=await response.json();
  assert.equal(response.status,200);assert.equal(data.history.length,1);
  response=await history({request:privateRequest('member-tutor-history','member-B'),env});
  data=await response.json();
  assert.equal(response.status,200);assert.equal(data.history.length,0,'A08: second member cannot read first history');
  response=await conversations({request:privateRequest('member-tutor-conversations','member-B'),env});
  assert.equal(response.status,200);
  assert.equal((await response.json()).conversations.length,0);
  premium=false;expired=true;
  response=await tutor({request:ask('member-B',{question:'Teach this in more depth: VWAP',allowModel:true}),env});
  data=await response.json();
  assert.equal(response.status,200,'A12: no premium entitlement must still allow Free instruction');
  assert.notEqual(data.generation,'grounded-model-draft');
  assert.equal(data.historySaved,false);
  const restricted=events.filter(x=>/api\.openai|\/rpc\/gu_v014103_|workers\.ai/.test(x.url));
  assert.equal(restricted.length,0,'A12: no provider or paid reservation permitted');
  const gradeWrites=events.filter(x=>/competency_evidence|lab_training_attempts|lumen.*ledger|grade/i.test(x.url)&&x.method!=='GET');
  assert.equal(gradeWrites.length,0,'A10: no grades, awards or official progress writes');
  assert.equal(expired,true);
 }finally{globalThis.fetch=previous}
});

test('A09 — a delayed token lookup cannot send an old question with a new member token',async()=>{
 const source=readFileSync(new URL('../assets/js/market-tutor.js',import.meta.url),'utf8');
 const outbound=[];
 const globals={
  document:{readyState:'loading',addEventListener(){}},window:{},URL,URLSearchParams,
  AbortController,Request,Response,TextEncoder,crypto,
  console,setTimeout,clearTimeout,
  fetch:async(url,opts)=>{outbound.push({url:String(url),opts});return json({
   ok:true,answer:'Original source only',generation:'reviewed-glossary-logic',sources:[]});}
 };
 const ctx=vm.createContext(globals);
 vm.runInContext(source,ctx,{filename:'assets/js/market-tutor.js'});
 let resolveSession;
 globals.__deferred=()=>new Promise(resolve=>{resolveSession=resolve});
 vm.runInContext("TUTOR.user={id:'"+a+"'};TUTOR.sb={auth:{getSession:__deferred}};",ctx);
 const pending=vm.runInContext("memberExplanation('Explain VWAP','explain','',null,new AbortController().signal,'"+a+"',0,'"+requestId+"')",ctx);
 await Promise.resolve();
 vm.runInContext("TUTOR.user={id:'"+b+"'};TUTOR.identityEpoch++;",ctx);
 resolveSession({data:{session:{access_token:'B-TOKEN',user:{id:b}}}});
 await assert.rejects(pending,/Member session changed|expired/i);
 assert.equal(outbound.length,0,'A09: must never dispatch old member question under second member token');
 // Normal same-member dispatch must still work, with the original request ID.
 globals.__steady=async()=>({data:{session:{access_token:'A-TOKEN',user:{id:a}}}});
 vm.runInContext("TUTOR.user={id:'"+a+"'};TUTOR.identityEpoch=5;TUTOR.sb={auth:{getSession:__steady}};",ctx);
 const next=await vm.runInContext("memberExplanation('Explain VWAP','explain','',null,new AbortController().signal,'"+a+"',5,'"+requestId+"')",ctx);
 assert.equal(next.answer,'Original source only');
 assert.equal(outbound.length,1);
 assert.equal(outbound[0].opts.headers.authorization,'Bearer A-TOKEN');
 assert.equal(JSON.parse(outbound[0].opts.body).requestId,requestId);
 assert.equal(JSON.parse(outbound[0].opts.body).allowModel,false);
 // Destructive history operations must be bound to their initiating identity
 // BEFORE awaiting the asynchronous session lookup. No second-account DELETE.
 globals.confirm=()=>true;
 let resolveDelete;
 globals.__deleteSession=()=>new Promise(resolve=>{resolveDelete=resolve});
 vm.runInContext("TUTOR.user={id:'"+a+"'};TUTOR.identityEpoch=8;TUTOR.sb={auth:{getSession:__deleteSession}};",ctx);
 const deletePromise=vm.runInContext("deleteAll()",ctx);
 await Promise.resolve();
 vm.runInContext("TUTOR.user={id:'"+b+"'};TUTOR.identityEpoch=9;",ctx);
 resolveDelete({data:{session:{user:{id:b},access_token:'B-TOKEN'}}});
 await deletePromise;
 assert.equal(outbound.length,1,'A09: old member bulk deletion may not target newly signed-in account');
 assert.equal(outbound.filter(x=>String(x.url).includes('member-tutor-data-delete')).length,0);
 // Ordinary private reads and writes must similarly refuse stale member tokens.
 let resolvePrivate;
 globals.__privateSession=()=>new Promise(resolve=>{resolvePrivate=resolve});
 vm.runInContext("TUTOR.user={id:'"+a+"'};TUTOR.identityEpoch=10;TUTOR.sb={auth:{getSession:__privateSession}};",ctx);
 const privatePromise=vm.runInContext("privateApi('','GET')",ctx);
 await Promise.resolve();
 vm.runInContext("TUTOR.user={id:'"+b+"'};TUTOR.identityEpoch=11;",ctx);
 resolvePrivate({data:{session:{user:{id:b},access_token:'B-TOKEN'}}});
 await assert.rejects(privatePromise,/Member session changed/i);
 assert.equal(outbound.length,1,'A09: no prior account private request dispatched with new token');
 const contract=readFileSync(new URL('../assets/js/market-tutor.js',import.meta.url),'utf8');
 assert.match(contract,/TUTOR\.identityEpoch===submittingEpoch&&TUTOR\.user\?\.id===submittingUser&&/);
 assert.match(contract,/TUTOR\.abortController===controller/);
 assert.match(contract,/TUTOR\.busy=false;\$\('tutor-ask'\)\.disabled=true/);
});

test('A11 — original 30 competency IDs preserved with four non-award instructional dimensions',()=>{
 const reg=JSON.parse(readFileSync(new URL('../data/competency-study-guides-v01499.json',import.meta.url),'utf8'));
 const map=JSON.parse(readFileSync(new URL('../data/competency-lab-paths-v01499.json',import.meta.url),'utf8'));
 assert.equal(reg.guides.length,30);
 assert.equal(map.totalCanonicalLabs,419);
 assert.equal(Object.keys(map.bySkill).length,30);
 for(const guide of reg.guides){
  assert.equal(typeof guide.code,'string');
  assert.ok(map.bySkill[guide.code], 'Missing canonical mapping '+guide.code);
  assert.ok(guide.concept&&guide.procedure&&guide.limit&&guide.invalidation);
 }
 const ui=readFileSync(new URL('../src/tutor/TaliaClassroom.tsx',import.meta.url),'utf8');
 for(const dimension of ['Knowledge','Recognition','Decision','Process'])
  assert.ok(ui.includes("'"+dimension+"'"),'Missing instructional dimension: '+dimension);
 assert.match(ui,/Do not grade or award mastery/);
 assert.match(ui,/allowModel:false,saveHistory:/);
});
