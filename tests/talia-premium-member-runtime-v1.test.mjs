import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {betaTesterAllowed,onRequest} from '../functions/api/talia-premium-member-v1.js';
import {betaTier,authenticLearningEvidence,authenticReplayEvidence,authenticEnterpriseEvidence,tierIndex}
 from '../functions/_lib/talia-member-evidence-v1.js';
const read=p=>readFileSync(p,'utf8');

test('All four editions and inherited boundaries are explicit',()=>{
 assert.deepEqual(['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'].map(tierIndex),[0,1,2,3]);
 assert.deepEqual(betaTier({planCode:'FOUNDING_60',configured:'PROFESSIONAL',requested:'PROFESSIONAL',allowlisted:false,enabled:false}),
  {target:'PROFESSIONAL',effective:'FOUNDATION',beta:false});
 const s=betaTier({planCode:'FOUNDING_60',configured:'PROFESSIONAL',requested:'ENTERPRISE',allowlisted:true,enabled:true,allTiers:false});
 assert.equal(s.requestDenied,true);
 assert.equal(s.effective,'FOUNDATION');
 const e=betaTier({planCode:'FOUNDING_60',configured:'PROFESSIONAL',requested:'ENTERPRISE',allowlisted:true,enabled:true,allTiers:true});
 assert.equal(e.beta,true);assert.equal(e.effective,'ENTERPRISE');
 assert.equal(betaTier({planCode:'FULL_ANNUAL',requested:'ENTERPRISE',allowlisted:false,enabled:false}).effective,'FOUNDATION');
});
test('Member beta allowlist is exact, flag-gated and rejects malformed or ambiguous inputs',()=>{
 const member='11111111-1111-1111-1111-111111111111',another='22222222-2222-2222-2222-222222222222';
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'true',TALIA_PREMIUM_BETA_USER_IDS:member},member),true);
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'false',TALIA_PREMIUM_BETA_USER_IDS:member},member),false);
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'true',TALIA_PREMIUM_BETA_USER_IDS:another},member),false);
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'true',TALIA_PREMIUM_BETA_USER_IDS:member+','+member},member),false);
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'true',TALIA_PREMIUM_BETA_USER_IDS:'James_Test'},member),false);
 assert.equal(betaTesterAllowed({TALIA_PREMIUM_BETA_ENABLED:'true',TALIA_PREMIUM_BETA_USER_IDS:member},'not-a-uuid'),false);
});
test('Unassessed member is not labeled deficient or independently graded',()=>{
 const skills=[{code:'VWAP_CONTEXT',name:'VWAP Context',status:'Not Yet Assessed',independentAssessments:0,completeAssessments:0},
  {code:'EMA_CONTEXT',name:'EMA Context',status:'Developing',independentAssessments:0,completeAssessments:1}];
 const x=authenticLearningEvidence({skills,labs:[{lab_id:'F2-C07-L01',status:'started'}],
  academy:[{program_code:'risk60',day_number:2,status:'reflected'}]});
 assert.equal(x.a01.evidenceStatus,'not_independently_assessed');
 assert.equal(x.a01.independentAssessedCompetencies,0);
 assert.equal(x.a02.specificMisconceptionDiagnosed,false);
 assert.match(x.a02.explanation,/insufficient independent competency evidence/);
 assert.equal(x.a03.learnerLabRecords,1);
 assert.equal(x.a03.learnerAcademyDayRecords,1);
 assert.equal(JSON.stringify(x).includes('officialGrade:true'),false);
});
test('Verified member status affects focus without leaking a numerical score or raw rubric',()=>{
 const skills=[{code:'VWAP_CONTEXT',name:'VWAP Context',status:'Needs Work',criticalErrors:1,
  independentAssessments:2,completeAssessments:2,nextStep:'Practice corrected VWAP reasoning',score:43},
 {code:'EMA_CONTEXT',name:'EMA Context',status:'Proficient',criticalErrors:0,
  independentAssessments:3,completeAssessments:3,nextStep:'Review EMA',score:95}];
 const x=authenticLearningEvidence({skills});
 assert.equal(x.a01.topic.code,'VWAP_CONTEXT');
 assert.equal(x.a01.evidenceStatus,'independently_assessed');
 assert.equal(x.a02.criticalErrorEvidencePresent,true);
 assert.equal(x.a02.specificMisconceptionDiagnosed,false);
 assert.equal(x.a03.suggestedAction,'Practice corrected VWAP reasoning');
 assert.equal(JSON.stringify(x).includes('"score"'),false);
 assert.equal(JSON.stringify(x).includes('43'),false);
});
test('Client-like unknown topic is not treated as a verified competency diagnosis',()=>{
 const x=authenticLearningEvidence({topicCode:'FORGED_COMPLETE',skills:[]});
 assert.equal(x.a01.topic,null);
 assert.equal(x.a02.specificMisconceptionDiagnosed,false);
});
const src={dataset_code:'GUSIM_TEST',title:'Original fictional'};
const candles=[
 {bar_index:0,bar_at:'2040-01-02T09:30:00Z',open:'10',high:'11',low:'9',close:'10.5',volume:1000},
 {bar_index:1,bar_at:'2040-01-02T09:31:00Z',open:'10.5',high:'11.5',low:'10',close:'11',volume:1200},
 {bar_index:2,bar_at:'2040-01-02T09:32:00Z',open:'11',high:'50',low:'10',close:'49',volume:2000}
];
const session={dataset_code:'GUSIM_TEST',current_index:1,decision_locked:true,decision:'WAIT'};
test('Professional chart and debrief include ONLY server-revealed completed candles',()=>{
 const x=authenticReplayEvidence({dataset:src,session,bars:candles.slice(0,2)});
 assert.equal(x.p01.lastCandle.close,11);
 assert.equal(x.p01.bars.length,2);
 assert.equal(x.p01.visibleThrough,1);
 assert.equal(x.p02.futureBarsReturned,0);
 assert.equal(x.p03.lockedDecision,true);
 assert.equal(x.p03.priceChangeFromPriorClose,0.5);
 assert.equal(x.p03.notAnActualFill,true);
 assert.equal(JSON.stringify(x).includes('"close":49'),false);
});
test('Professional rejects a future bar, nonchronological bars and fabricated cursor',()=>{
 assert.throws(()=>authenticReplayEvidence({dataset:src,session,bars:candles}),/validation/);
 assert.throws(()=>authenticReplayEvidence({dataset:src,session,bars:[candles[1],candles[0]]}),/validation/);
 assert.throws(()=>authenticReplayEvidence({dataset:src,session:{...session,dataset_code:'OTHER'},bars:candles.slice(0,2)}),/mismatch/);
 assert.throws(()=>authenticReplayEvidence({dataset:src,session,bars:[candles[0]]}),/current/);
});
test('Without an explicitly locked decision, Professional does not invent a debrief conclusion',()=>{
 const x=authenticReplayEvidence({dataset:src,session:{...session,decision_locked:false},bars:candles.slice(0,2)});
 assert.equal(x.p03.lockedDecision,false);assert.equal(x.p03.decision,null);
 assert.match(x.p03.debrief,/Record and lock/);
});
const active=[{program_code:'risk60',status:'active'},{program_code:'tape10',status:'active'},
 {program_code:'filings7',status:'inactive'}];
const own=[{program_code:'risk60',day_number:1,status:'reflected'},
 {program_code:'tape10',day_number:2,status:'started'},
 {program_code:'filings7',day_number:3,status:'completed'}];
test('Enterprise cross-course report filters unenrolled or inactive course and suppresses raw reflection and IDs',()=>{
 const x=authenticEnterpriseEvidence({enrollments:active,progress:own,labs:[{lab_id:'L1',status:'started'}],
  guides:[{title:'EMA',concept:'Historical moving average',sourceUrls:['https://chartschool.stockcharts.com/a','http://invalid.local/a']} ]});
 assert.equal(x.e01.activeEnrolledCourses,2);
 assert.equal(x.e01.courses.length,2);
 assert.equal(x.e01.crossCourseEvidenceAvailable,true);
 assert.equal(x.e03.recordedCourseDays,2);
 assert.equal(x.e03.reflectedDays,1);
 assert.equal(x.e03.recordedLabEntries,1);
 assert.equal(x.e03.recordsAreGrades,false);
 assert.equal(x.e03.includesMemberIdentifiers,false);
 assert.equal(x.e02.comparisons[0].citationLinks.length,1);
 assert.equal(x.e02.pointInTimePublicationVerified,false);
 assert.equal(JSON.stringify(x).includes('filings7'),false);
});
test('Enterprise never infers comparative history from enrollment without progress',()=>{
 const x=authenticEnterpriseEvidence({enrollments:active,progress:[],labs:[]});
 assert.equal(x.e01.crossCourseEvidenceAvailable,false);
 assert.equal(x.e03.recordedCourseDays,0);
});
test('Premium member API rejects POST and invalid tier before server identity operations',async()=>{
 const post=await onRequest({request:new Request('https://example.test/api/talia-premium-member-v1',{method:'POST'}),env:{}});
 assert.equal(post.status,405);
 const invalid=await onRequest({request:new Request('https://example.test/api/talia-premium-member-v1?tier=GODMODE'),env:{}});
 assert.equal(invalid.status,400);
 const anon=await onRequest({request:new Request('https://example.test/api/talia-premium-member-v1?tier=ENTERPRISE'),env:{}});
 assert.equal(anon.status,401);
});
test('Browser beta is member-authenticated and does not consume a client-provided score or release flag',()=>{
 const api=read('functions/api/talia-premium-member-v1.js'),client=read('assets/js/talia-premium-member-v1.js');
 const html=read('talia-classroom.html'),policy=read('functions/api/member-learning-engine-versions.js');
 for(const token of ['toolAccess(env,request','betaTesterAllowed(env,userId)','competenciesRoute({request:req,env})',
  'memberReplay(env,member.userId)','readOwnLearning(env,member.userId)','authenticEnterpriseEvidence'])
  assert.ok(api.includes(token),token);
 for(const token of ['getUser()','getSession()','/api/talia-premium-member-v1','/api/market-tutor','allowModel:false',
  'saveHistory:false','crypto.randomUUID','textContent','replaceChildren'])
  assert.ok(client.includes(token),token);
 assert.doesNotMatch(client,/localStorage|sessionStorage|innerHTML|service_role|AI_TUTOR_API_KEY/);
 assert.match(html,/id="talia-member-beta".*hidden/);
 assert.match(html,/data-tmb-tier="ADVANCED"/);
 assert.match(policy,/const effectiveEdition='FOUNDATION'/);
 assert.doesNotMatch(api,/request\.json\(|clientGrade|raw_app_meta_data/);
});
