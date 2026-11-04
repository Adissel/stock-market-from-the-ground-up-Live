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
function mockFetch({code='FOUNDING_30',tier='ADVANCED',addon=null,denied=false}={}){
 return async(url)=>{
  const path=String(url);
  if(path.includes('/auth/v1/user'))return json({id:UID});
  if(path.includes('/rest/v1/profiles?'))return json([{account_kind:'member',deleted_at:null}]);
  if(path.includes('/rest/v1/admin_user_flags?'))return json([]);
  if(path.includes('/rest/v1/admin_user_roles?'))return json([]);
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
  globalThis.fetch=async(url)=>String(url).includes('/rest/v1/profiles?')?json([{account_kind:'member',deleted_at:null}]):mockFetch()(...arguments);
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
