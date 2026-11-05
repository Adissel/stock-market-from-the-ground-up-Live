import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTaliaLesson,availableDepths,TUTOR_LESSONS} from '../functions/_lib/talia-classroom-curriculum-v1.js';
import {teachingDepthFromVerifiedRows} from '../functions/_lib/talia-teaching-entitlement-v1.js';
import {onRequest} from '../functions/api/talia-classroom-curriculum-v1.js';
const NOW=Date.parse('2026-11-04T15:00:00Z');
const ACTIVE={status:'active',starts_at:'2026-11-01T00:00:00Z',ends_at:'2026-12-01T00:00:00Z'};
const plan=(code,tier)=>({plan_code:code,metadata:{talia_market_tutor_v1:{tier,release_state:'assigned_not_feature_release'}}});
const grants=(code)=>[{...ACTIVE,plan_code:code}];
const calc=(p,tier,other={})=>teachingDepthFromVerifiedRows({grants:grants(p),plans:[plan(p,tier)],now:NOW,...other});
test('active memberships have precise 4-level teaching-depth inheritance and no beta feature grant',()=>{
 assert.deepEqual(calc('FREE','FOUNDATION').allowedDepths,['FOUNDATION']);
 assert.deepEqual(calc('FOUNDING_30','ADVANCED').allowedDepths,['FOUNDATION','ADVANCED']);
 assert.deepEqual(calc('FOUNDING_60','PROFESSIONAL').allowedDepths,['FOUNDATION','ADVANCED','PROFESSIONAL']);
 assert.deepEqual(calc('LIFETIME','ENTERPRISE').allowedDepths,['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']);
 assert.equal(calc('FULL_MONTHLY','PROFESSIONAL').premiumFeaturesReleased,false);
 assert.equal(calc('FULL_ANNUAL','ENTERPRISE').maximumDepth,'FOUNDATION','Unmapped legacy annual cannot inherit enterprise');
 assert.equal(calc('FOUNDING_30','ENTERPRISE').maximumDepth,'ADVANCED','Configured edition cannot silently exceed Owner approved plan target');
 assert.equal(calc('FOUNDING_60','FOUNDATION').maximumDepth,'FOUNDATION','Owner may explicitly restrict');
});
test('expired grants, subscriptions and unregistered products cannot raise teaching depth',()=>{
 assert.equal(teachingDepthFromVerifiedRows({grants:[{...ACTIVE,ends_at:'2026-11-02T00:00:00Z',plan_code:'LIFETIME'}],
  plans:[plan('LIFETIME','ENTERPRISE')],now:NOW}).maximumDepth,'FOUNDATION');
 assert.equal(teachingDepthFromVerifiedRows({subscriptions:[{status:'canceled',plan_code:'LIFETIME',current_period_end:'2026-12-01T00:00:00Z'}],
  plans:[plan('LIFETIME','ENTERPRISE')],now:NOW}).maximumDepth,'FOUNDATION');
 assert.equal(calc('FOUNDING_30','ADVANCED',{products:[{...ACTIVE,product_key:'UNLISTED_ENTERPRISE'}]}).maximumDepth,'ADVANCED');
 const upgraded=calc('FOUNDING_30','ADVANCED',{products:[{...ACTIVE,product_key:'TALIA_TUTOR_ENTERPRISE'}]});
 assert.equal(upgraded.maximumDepth,'ENTERPRISE');
 assert.deepEqual(upgraded.allowedDepths,availableDepths('ENTERPRISE'));
 assert.equal(upgraded.source,'active_tutor_addon');
 const expired=calc('FOUNDING_30','ADVANCED',{products:[{...ACTIVE,ends_at:'2026-11-01T00:00:00Z',product_key:'TALIA_TUTOR_ENTERPRISE'}]});
 assert.equal(expired.maximumDepth,'ADVANCED');
});
test('all six original classroom topics and five pedagogical steps teach at different depths',()=>{
 assert.equal(TUTOR_LESSONS.length,6);
 for(const topic of TUTOR_LESSONS){
  for(const depth of ['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']){
   for(const phase of ['explain','demonstrate','practice','correct','transfer']){
    const lesson=buildTaliaLesson({topic:topic.id,depth,phase});
    assert.ok(lesson.answer.length>90,topic.id+' '+depth+' '+phase);
    assert.equal(lesson.graded,false);
    assert.equal(lesson.hasFutureBars,false);
    assert.equal(lesson.commercialPremiumFeaturesGranted,false);
   }
  }
 }
 const scan=buildTaliaLesson({topic:'scanner',depth:'ENTERPRISE',phase:'demonstrate'});
 assert.match(scan.answer,/AND/);
 assert.match(scan.answer,/timestamp/);
 assert.match(buildTaliaLesson({topic:'vwap',depth:'FOUNDATION',phase:'demonstrate'}).answer,/2,600/);
 assert.match(buildTaliaLesson({topic:'candlesticks',depth:'FOUNDATION',phase:'demonstrate'}).answer,/50%/);
 assert.throws(()=>buildTaliaLesson({topic:'unknown',depth:'ENTERPRISE',phase:'explain'}),/Unrecognized/);
});
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
const UID='11111111-1111-4111-8111-111111111111';
function mockFetch({code='FOUNDING_30',tier='ADVANCED',addon=null,denied=false,accountKind='member',flagged=false,showcase=false,expired=false}={}){
 return async(url)=>{
  const path=String(url);
  if(path.includes('/auth/v1/user'))return json({id:UID});
  if(path.includes('/rest/v1/profiles?'))return json([{account_kind:accountKind,deleted_at:expired?'2026-11-02T00:00:00Z':null}]);
  if(path.includes('/rest/v1/admin_user_flags?'))return json(flagged?[{status:'restricted'}]:[]);
  if(path.includes('/rest/v1/admin_user_roles?'))return json(showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:[]);
  if(path.includes('/rest/v1/rpc/user_has_tool_access'))return json(!denied);
  if(path.includes('/rest/v1/gu_product_access_config_v1?'))return json([]);
  if(path.includes('/rest/v1/user_plan_grants?'))return json(grants(code));
  if(path.includes('/rest/v1/site_subscriptions?'))return json([]);
  if(path.includes('/rest/v1/entitlements?'))return json(addon?[{...ACTIVE,product_key:addon}]:[]);
  if(path.includes('/rest/v1/platform_plans?'))return json([plan(code,tier)]);
  throw new Error('Unexpected external access: '+path);
 };
}
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public-test-key',
 SUPABASE_SECRET_KEY:'sb_secret_local_synthetic_test'};
const request=(method,body)=>new Request('https://example.test/api/talia-classroom-curriculum-v1',{
 method,headers:{authorization:'Bearer synthetic-auth','content-type':'application/json',origin:'https://example.test'},
 ...(body?{body:JSON.stringify(body)}:{})});
test('server delivers verified member lessons but rejects requested depth above active plan',async()=>{
 const saved=globalThis.fetch;globalThis.fetch=mockFetch();
 try{
  const catalog=await onRequest({request:request('GET'),env});
  const data=await catalog.json();assert.equal(catalog.status,200);
  assert.deepEqual(data.allowedDepths,['FOUNDATION','ADVANCED']);
  assert.equal(data.premiumFeaturesReleased,false);
  const allowed=await onRequest({request:request('POST',{topic:'scanner',depth:'FOUNDATION',phase:'demonstrate'}),env});
  assert.equal(allowed.status,200);
  assert.match((await allowed.json()).answer,/AND/);
  const rejected=await onRequest({request:request('POST',{topic:'scanner',depth:'PROFESSIONAL',phase:'explain'}),env});
  assert.equal(rejected.status,403);
  const forged=await onRequest({request:request('POST',{topic:'scanner',depth:'FOUNDATION',phase:'explain',entitlement:'ENTERPRISE'}),env});
  assert.equal(forged.status,400);
 }finally{globalThis.fetch=saved}
});
test('server honors registered independent active Tutor upgrade and denies restricted accounts',async()=>{
 const saved=globalThis.fetch;
 try{
  globalThis.fetch=mockFetch({code:'FOUNDING_30',tier:'ADVANCED',addon:'TALIA_TUTOR_PROFESSIONAL'});
  const response=await onRequest({request:request('POST',{topic:'ema',depth:'PROFESSIONAL',phase:'transfer'}),env});
  assert.equal(response.status,200);
  assert.match((await response.json()).answer,/whipsaws/);
  globalThis.fetch=mockFetch({denied:true});
  const free=await onRequest({request:request('GET'),env});
  assert.equal(free.status,200,'Eligible Foundation study remains free when premium tool RPC denied');
  // Account eligibility is independently verified by the existing Tutor access route.
 }finally{globalThis.fetch=saved}
});
test('student page has topic, depth, teaching action and no Pack card presentation',()=>{
 const ts=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
 const html=readFileSync('talia-classroom.html','utf8');
 const css=readFileSync('assets/css/talia-curriculum-v1.css','utf8');
 assert.match(ts,/id="tc-teaching-topic"/);
 assert.match(ts,/id="tc-teaching-depth"/);
 assert.match(ts,/teachingCatalog\.allowedDepths\.includes\(teachingDepth\)/);
 assert.match(ts,/onClick=\{\(\)=>void teachSelected\('explain'\)\}/);
 assert.match(ts,/\/api\/talia-classroom-curriculum-v1/);
 assert.match(ts,/aria-label="Talia lesson steps"/);
 assert.match(html,/talia-curriculum-v1\.css/);
 assert.match(css,/#talia-member-beta,\.tc-body \.tc-premium-bridge/);
 assert.doesNotMatch(readFileSync('index.html','utf8'),/talia-curriculum-v1\.css/);
});

test('all seven actual membership policies enforce hierarchical teaching-depth inheritance across six topics and five steps',async()=>{
 const matrix=[
  ['FREE','FOUNDATION'],['FOUNDING_14','FOUNDATION'],
  ['PICK_WHAT_YOU_WANT','FOUNDATION'],['FOUNDING_30','ADVANCED'],
  ['FOUNDING_60','PROFESSIONAL'],['FULL_MONTHLY','PROFESSIONAL'],
  ['LIFETIME','ENTERPRISE']
 ];
 const order=['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'];
 const phases=['explain','demonstrate','practice','correct','transfer'];
 const saved=globalThis.fetch;
 try{
  for(const [code,tier] of matrix){
   globalThis.fetch=mockFetch({code,tier});
   const response=await onRequest({request:request('GET'),env});
   assert.equal(response.status,200,code+' catalog failed');
   const catalog=await response.json();
   assert.deepEqual(catalog.allowedDepths,order.slice(0,order.indexOf(tier)+1),code+' inherited depths');
   assert.equal(catalog.maximumDepth,tier,code+' configured maximum');
   assert.equal(catalog.premiumFeaturesReleased,false,code+' must not release premium analytics');
   for(const depth of catalog.allowedDepths){
    for(const topic of TUTOR_LESSONS){
     for(const phase of phases){
      const r=await onRequest({request:request('POST',{topic:topic.id,depth,phase}),env});
      assert.equal(r.status,200,code+': '+topic.id+' '+depth+' '+phase);
      const lesson=await r.json();
      assert.equal(lesson.ok,true);
      assert.equal(lesson.depth,depth);
      assert.equal(lesson.topic,topic.id);
      assert.equal(lesson.phase,phase);
      assert.equal(lesson.graded,false);
      assert.equal(lesson.masteryAwarded,false);
      assert.equal(lesson.hasFutureBars,false);
      assert.equal(lesson.memberRecordWritten,false);
      assert.equal(lesson.historySaved,false);
      assert.equal(lesson.aiReason,'original_source_only');
     }
    }
   }
   for(const forbidden of order.slice(order.indexOf(tier)+1)){
    const r=await onRequest({request:request('POST',{
      topic:'vwap',depth:forbidden,phase:'explain'}),env});
    assert.equal(r.status,403,code+' must deny '+forbidden);
    assert.equal((await r.json()).maximumDepth,tier);
   }
  }
 }finally{globalThis.fetch=saved}
});
test('deleted, restricted, showcase and anonymous accounts cannot call classroom or select Foundation',async()=>{
 const saved=globalThis.fetch;
 try{
  for(const kind of [
   {accountKind:'showcase'},{expired:true},{flagged:true},{showcase:true}
  ]){
   globalThis.fetch=mockFetch(kind);
   const r=await onRequest({request:request('GET'),env});
   assert.equal(r.status,403,'Not eligible: '+JSON.stringify(kind));
  }
  const r=await onRequest({request:new Request('https://example.test/api/talia-classroom-curriculum-v1'),env});
  assert.equal(r.status,401,'Anonymous classroom API must reject');
 }finally{globalThis.fetch=saved}
});
test('unknown or expired plan grants, invalid add-on states and forged client fields remain fail-closed',async()=>{
 const now=NOW;
 const configured=plan('LIFETIME','ENTERPRISE');
 const notActive=teachingDepthFromVerifiedRows({
  grants:[{...ACTIVE,plan_code:'LIFETIME',status:'suspended'}],plans:[configured],now});
 assert.equal(notActive.maximumDepth,'FOUNDATION');
 const addOnOnly=teachingDepthFromVerifiedRows({
  products:[{...ACTIVE,product_key:'TALIA_TUTOR_ADVANCED',status:'active'}],now});
 assert.equal(addOnOnly.maximumDepth,'ADVANCED','Verified independent add-on may grant teaching depth');
 const revoked=teachingDepthFromVerifiedRows({
  products:[{...ACTIVE,product_key:'TALIA_TUTOR_ENTERPRISE',status:'revoked'}],now});
 assert.equal(revoked.maximumDepth,'FOUNDATION');
 const stale=teachingDepthFromVerifiedRows({grants:[{...ACTIVE,plan_code:'LIFETIME',ends_at:'2026-11-02T00:00:00Z'}],plans:[configured],now});
 assert.equal(stale.maximumDepth,'FOUNDATION');
 const saved=globalThis.fetch;globalThis.fetch=mockFetch({code:'FREE',tier:'FOUNDATION'});
 try{
  for(const fields of [
   {topic:'vwap',depth:'ENTERPRISE',phase:'explain',premiumFeaturesReleased:true},
   {topic:'vwap',depth:'FOUNDATION',phase:'explain',userId:'11111111-1111-4111-8111-111111111111'},
   {topic:'vwap',depth:'FOUNDATION',phase:'explain',historySaved:true}
  ]){
   const r=await onRequest({request:request('POST',fields),env});
   assert.equal(r.status,400,'Client-forged grant/output must fail');
  }
 }finally{globalThis.fetch=saved}
});

test('six lessons disclose specific objectives and accurate ungraded corrections',()=>{
 const expected={
  candlesticks:/40%/,vwap:/\$11\.50/,ema:/\$25\.20/,scanner:/four numeric AND rules pass/,
  volume:/600 volume units/,structure:/lower high.*lower low/s
 };
 for(const topic of TUTOR_LESSONS){
  assert.ok(topic.objective?.length>45,topic.id+' missing objective');
  assert.ok(topic.evidence?.length>20,topic.id+' missing evidence');
  assert.ok(topic.limitation?.length>20,topic.id+' missing limitation');
  const practice=buildTaliaLesson({topic:topic.id,depth:'FOUNDATION',phase:'practice'});
  const review=buildTaliaLesson({topic:topic.id,depth:'FOUNDATION',phase:'correct'});
  assert.doesNotMatch(practice.answer,expected[topic.id],'practice leaked its correction');
  assert.match(review.answer,expected[topic.id],'worked correction missing');
  assert.match(review.answer,/not an automated grade/i);
  assert.equal(review.graded,false);
  assert.equal(review.masteryAwarded,false);
 }
});
test('classroom exposes a local-only practice notebook and distinct chart context notice',()=>{
 const source=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
 const styles=readFileSync('assets/css/talia-curriculum-v1.css','utf8');
 assert.match(source,/id="tc-practice-notes"/);
 assert.match(source,/const comparePractice=\(\)=>/);
 assert.match(source,/teachSelected\('correct'\)/);
 assert.match(source,/setViewedSteps\(\[\]\)/);
 assert.match(source,/Lesson examples do not necessarily match the chart/);
 assert.match(source,/Viewed \{viewedSteps\.length\} of 5 lesson steps/);
 assert.match(styles,/\.tc-teaching-notebook/);
 assert.match(styles,/\.tc-teaching-focus/);
});
