import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTaliaLesson,availableDepths,TUTOR_LESSONS} from '../functions/_lib/talia-classroom-curriculum-v1.js';
import {teachingDepthFromVerifiedRows} from '../functions/_lib/talia-teaching-entitlement-v1.js';
import {onRequest} from '../functions/api/talia-classroom-curriculum-v1.js';
import {TALIA_REPLAY,getTaliaChartEvidence} from '../src/tutor/talia-chart-evidence-v1.js';
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


test('regression: all four teaching editions start with instruction, worked evidence, and a learner turn',()=>{
 const order=['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'];
 for(const topic of TUTOR_LESSONS){
  const delivered=order.map(depth=>buildTaliaLesson({topic:topic.id,depth,phase:'explain'}));
  for(const lesson of delivered){
   assert.match(lesson.answer,/I DO — UNDERSTAND/);
   assert.match(lesson.answer,/I DO — SHOW THE EVIDENCE AND WORK THE NUMBERS/);
   assert.match(lesson.answer,/WE DO — RECOGNIZE/);
   assert.match(lesson.answer,/COMMON MISTAKE AND LIMITATION/);
   assert.match(lesson.answer,/YOU DO — UNGRADED CHECK/);
   assert.doesNotMatch(lesson.answer,/What would you like me to clarify before the worked example\?/);
   assert.equal(lesson.graded,false);
   assert.equal(lesson.masteryAwarded,false);
   assert.equal(lesson.hasFutureBars,false);
   assert.ok(lesson.answer.length<=7000,'The member client truncates longer replies');
  }
  assert.ok(delivered[0].answer.length<delivered[1].answer.length);
  assert.ok(delivered[1].answer.length<delivered[2].answer.length);
  assert.ok(delivered[2].answer.length<delivered[3].answer.length);
  assert.match(delivered[1].answer,/ADVANCED — Compare/);
  assert.match(delivered[2].answer,/PROFESSIONAL — Test/);
  assert.match(delivered[3].answer,/ENTERPRISE — Make/);
 }
 const [f,a,p,e]=order.map(depth=>buildTaliaLesson({topic:'candlesticks',depth,phase:'explain'}).answer);
 assert.match(f,/upper wick = \$32\.50/);
 assert.match(f,/lower wick = \$31\.00/);
 assert.match(a,/54\.55%/);
 assert.match(p,/20%/);
 assert.match(e,/high \$31\.80 and close \$32\.00 is invalid/);
 const independent=buildTaliaLesson({topic:'candlesticks',depth:'ENTERPRISE',phase:'practice'}).answer;
 assert.doesNotMatch(independent,/body percentage = .*40%/i);
 assert.match(independent,/Show your own steps/);
});


test('server and classroom share canonical 260 completed fictional bars, including screenshot candle seven',()=>{
 assert.equal(TALIA_REPLAY.length,260);
 const e=getTaliaChartEvidence({visible:7,index:6,timeframe:1});
 assert.deepEqual([e.bar.open,e.bar.high,e.bar.low,e.bar.close],[20.62,20.73,20.44,20.58]);
 assert.equal(e.bar.body.toFixed(2),'0.04');
 assert.equal(e.bar.range.toFixed(2),'0.29');
 assert.equal(e.bar.upperWick.toFixed(2),'0.11');
 assert.equal(e.bar.lowerWick.toFixed(2),'0.14');
 assert.equal(e.bar.bodyPercent.toFixed(1),'13.8');
 assert.equal(e.selectedNumber,7);
 assert.equal(e.hiddenSourceBars,253);
 const three=getTaliaChartEvidence({visible:7,index:1,timeframe:3});
 assert.deepEqual([three.bar.open,three.bar.high,three.bar.low,three.bar.close],[20.12,20.71,20.08,20.62]);
 assert.equal(three.lastSourceBar,6,'The seventh one-minute candle cannot complete a third 3m candle');
 assert.equal(three.uncompletedSourceBars,1);
});
test('chart-based Talia teaches the exact selected candle in all editions with valid phased pedagogy',()=>{
 const snapshot={visible:7,index:6,timeframe:1};
 for(const topic of ['candlesticks','vwap','ema','volume','structure']){
  const intro=buildTaliaLesson({topic,depth:'FOUNDATION',phase:'explain',chartContext:snapshot});
  assert.match(intro.answer,/completed 1-minute candle #7/);
  assert.match(intro.answer,/O \$20\.62 · H \$20\.73 · L \$20\.44 · C \$20\.58/);
  assert.doesNotMatch(intro.answer,/open \$31\.00, high \$32\.50/,'Separate worksheet example must not replace chart evidence');
  assert.equal(intro.chartEvidence?.sourceOnly,true);
  assert.equal(intro.chartEvidence?.noFuture,true);
  assert.equal(intro.graded,false);
  const practice=buildTaliaLesson({topic,depth:'FOUNDATION',phase:'practice',chartContext:snapshot});
  const correct=buildTaliaLesson({topic,depth:'FOUNDATION',phase:'correct',chartContext:snapshot});
  assert.match(practice.answer,/YOU DO — UNGRADED/);
  assert.doesNotMatch(practice.answer,/= \$0\.04/,'Practice must not leak the worked calculation');
  assert.match(correct.answer,/REVIEW — SAME CHART CANDLE/);
  const transfer=buildTaliaLesson({topic,depth:'FOUNDATION',phase:'transfer',chartContext:snapshot});
  assert.match(transfer.answer,/previously completed 1-minute bar #6/);
 }
 for(const depth of ['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE']){
  const r=buildTaliaLesson({topic:'candlesticks',depth,phase:'explain',chartContext:snapshot});
  assert.match(r.answer,/\$20\.62/);
  assert.equal(r.chartEvidence.selectedNumber,7);
  assert.equal(r.hasFutureBars,false);
  if(depth!=='FOUNDATION')assert.match(r.answer,/ADVANCED — OBSERVATIONAL COMPARISON/);
  if(['PROFESSIONAL','ENTERPRISE'].includes(depth))assert.match(r.answer,/PROFESSIONAL — TIMEFRAME AND INFERENCE TEST/);
  if(depth==='ENTERPRISE')assert.match(r.answer,/ENTERPRISE — VALIDATION AND REPRODUCIBILITY/);
 }
});
test('chart evidence refuses future/incomplete candles and forged prices',()=>{
 for(const input of [
  {visible:7,index:7,timeframe:1},
  {visible:7,index:2,timeframe:3},
  {visible:7,index:1,timeframe:5},
  {visible:7,index:-1,timeframe:1},
  {visible:261,index:0,timeframe:1},
  {visible:7,index:6,timeframe:1,close:999},
  {visible:7,index:6,timeframe:1,memberId:'forged'},
  {visible:7,index:0,timeframe:2}
 ]) assert.throws(()=>getTaliaChartEvidence(input),/chart|candle|reveal|interval|fields|completed/i);
});
test('member API rebuilds selected chart evidence; rejects invented bars and nonchart context',async()=>{
 const saved=globalThis.fetch;globalThis.fetch=mockFetch({code:'LIFETIME',tier:'ENTERPRISE'});
 try{
  const selected={topic:'candlesticks',depth:'ENTERPRISE',phase:'explain',chartContext:{visible:7,index:6,timeframe:1}};
  const ok=await onRequest({request:request('POST',selected),env});
  assert.equal(ok.status,200);
  const r=await ok.json();
  assert.equal(r.chartEvidence.open,20.62);
  assert.equal(r.chartEvidence.close,20.58);
  assert.equal(r.chartEvidence.sourceOnly,true);
  assert.match(r.answer,/Upper wick \$0\.11, lower wick \$0\.14/);
  for(const body of [
   {...selected,chartContext:{visible:7,index:7,timeframe:1}},
   {...selected,chartContext:{visible:7,index:6,timeframe:1,close:1000}},
   {...selected,chartContext:{visible:7,index:2,timeframe:3}},
   {topic:'scanner',depth:'ENTERPRISE',phase:'explain',chartContext:{visible:7,index:6,timeframe:1}}
  ]){
   const denied=await onRequest({request:request('POST',body),env});
   assert.equal(denied.status,400);
  }
  globalThis.fetch=mockFetch({code:'FREE',tier:'FOUNDATION'});
  const denied=await onRequest({request:request('POST',selected),env});
  assert.equal(denied.status,403,'Chart context may never override Tutor tier entitlement');
 }finally{globalThis.fetch=saved}
});
test('chart interaction selects the SAME highlighted group, updates timeframe and verifies API evidence before showing',()=>{
 const react=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
 const chart=readFileSync('src/prototype/PrototypeExperiences.tsx','utf8');
 const pages=readFileSync('scripts/build-pages.sh','utf8');
 assert.match(react,/onCandleSelect\(index,interval\)/);
 assert.match(react,/body:JSON\.stringify\(\{topic,depth,phase,\.\.\.\(chartContext\?\{chartContext\}:\{\}\)\}\)/);
 assert.match(react,/evidence\.open!==verified\.bar\.open/);
 assert.match(react,/Teaching from displayed/);
 assert.match(react,/Talia uses the exact completed candles displayed below/);
 assert.match(chart,/onTimeframeChangeRef\.current\?\.\(appearance\.timeframe\)/);
 assert.match(chart,/completedBars\.slice\(focusStart,focusStart\+appearance\.timeframe\)/);
 assert.match(pages,/talia-chart-evidence-v1\.d\.ts/);
});
