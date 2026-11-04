/* Talia 60-task unified source-prototype test; no genuine member QA or publication approval. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 TALIA_EVIDENCE_PREMIUM_RELEASED,completedOHLCVAggregate,completedEMA,fictionalTradeVWAP,
 fictionalHLC3VWAP,verifiedEffectiveEdition,boundedStudyRecommendations,
 guardedEditorialRevision,citationAsOfGuard,officialMethodHold,pointInTimeDebrief
} from '../functions/_lib/talia-evidence-kernel-v1.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const bars=Array.from({length:200},(_,i)=>({
 time:i*60000,open:10,high:12,low:10,close:11,volume:100,completed:true
}));
test('B07/B08: only contiguous completed historical candles may form 1, 3, 5m OHLCV',()=>{
 assert.equal(TALIA_EVIDENCE_PREMIUM_RELEASED,false);
 for(const [minutes,count] of [[1,200],[3,66],[5,40]]){
  const r=completedOHLCVAggregate(bars,minutes);
  assert.equal(r.ok,true);assert.equal(r.barCount,count);
  assert.equal(r.hasFutureBars,false);assert.equal(r.officialGrade,false);
  if(minutes===3)assert.equal(r.droppedPartial,2);
 }
 const eligible=completedOHLCVAggregate(bars,1,{asOf:100*60000});
 assert.equal(eligible.barCount,100);
 const incomplete=[...bars];incomplete.at(-1).completed=false;
 assert.equal(completedOHLCVAggregate(incomplete,1).ok,false);
 const gap=bars.map(x=>({...x}));gap[12].time+=60000;
 assert.equal(completedOHLCVAggregate(gap,3).ok,false);
 assert.equal(completedOHLCVAggregate(bars,7).ok,false);
});
test('B09: EMA9/20/200 full-seed warmup; never prefill EMA200',()=>{
 for(const n of [9,20,200]){
  const r=completedEMA(Array(n).fill(11),n);
  assert.equal(r.ok,true);assert.equal(r.series[n-2],null);
  assert.equal(r.series[n-1],11);
  assert.equal(r.seed,'SMA_first_N_completed_closes');
 }
 const short=completedEMA(Array(199).fill(11),200);
 assert.equal(short.ok,true);assert.equal(short.warmupComplete,false);
 assert(short.series.every(x=>x===null));
 assert.equal(completedEMA([11,NaN],9).ok,false);
});
test('B10: exact fictional prints 11.50 versus HLC3 proxy 11.333333 are distinct',()=>{
 const exact=fictionalTradeVWAP([{time:0,receivedAt:0,price:11,size:100},
  {time:60000,receivedAt:60000,price:12,size:100}]);
 const proxy=fictionalHLC3VWAP([{time:0,open:10,high:12,low:10,close:12,
  volume:200,completed:true}],{asOf:60000});
 assert.equal(exact.ok,true);assert.equal(exact.value,11.5);
 assert.equal(exact.kind,'exact_fictional_trade_print');
 assert.equal(proxy.ok,true);assert(Math.abs(proxy.value-11.333333333333334)<1e-9);
 assert.match(proxy.label,/NOT exact trade-print/i);
 assert.equal(fictionalHLC3VWAP([{...bars[0],volume:0}],{asOf:60000}).ok,false);
 const late=fictionalTradeVWAP([{time:0,receivedAt:0,price:11,size:100},
  {time:60000,receivedAt:180000,price:12,size:100}],{asOf:120000});
 assert.equal(late.value,11,'late-arriving print excluded from earlier as-of answer');
});
test('B11/B12: point-in-time debrief never leaks later bar before explicit release',()=>{
 const known=bars.slice(0,10),later=bars.slice(10,12);
 const held=pointInTimeDebrief({before:known,after:later,decisionTime:600000,afterReleased:false});
 assert.equal(held.ok,true);assert.equal(held.laterReleasedEvidence,null);
 assert.equal(held.knownAtDecision.length,10);assert.equal(held.officialGrade,false);
 const revealed=pointInTimeDebrief({before:known,after:later,decisionTime:600000,afterReleased:true});
 assert.equal(revealed.laterReleasedEvidence.count,2);
 const future=[...known,{...bars[10]}];
 assert.equal(pointInTimeDebrief({before:future,decisionTime:600000}).ok,false);
});
test('B01/B04/B05/B06: no client tier, cross-member prerequisites or unaudited owner edit',()=>{
 const uid='member-1',other='member-2';
 const grant={userId:uid,origin:'server_verified_membership_entitlement',
  active:true,verifiedAt:10000,planCode:'Founding 30-Day',effectiveVersion:'Advanced'};
 assert.deepEqual(verifiedEffectiveEdition({actorId:uid,grant}).edition,'Advanced');
 assert.equal(verifiedEffectiveEdition({actorId:other,grant}).authorized,false);
 assert.equal(verifiedEffectiveEdition({actorId:uid,grant:{...grant,planCode:'Full Annual'}}).authorized,false);
 assert.equal(verifiedEffectiveEdition({actorId:uid,grant:{...grant,active:false}}).authorized,false);
 const registered=[{code:'VWAP',labId:'LAB_VWAP'}];
 const own={userId:uid,source:'verified_own_learning_summary',code:'VWAP',independentAssessments:2};
 let ret=boundedStudyRecommendations({actorId:uid,identity:{userId:uid,origin:'server_authenticated_competency_summary'},
   verifiedSkills:[own],registry:registered,entitledLabIds:['LAB_VWAP']});
 assert.equal(ret.ok,true);assert.equal(ret.recommendations.length,1);assert.equal(ret.memberProgressWritten,false);
 ret=boundedStudyRecommendations({actorId:other,identity:{userId:other,origin:'server_authenticated_competency_summary'},
   verifiedSkills:[own],registry:registered,entitledLabIds:['LAB_VWAP']});
 assert.equal(ret.recommendations.length,0);
 assert.equal(guardedEditorialRevision({expectedRevision:1,currentRevision:2,authorizedOwner:true,auditReady:true}).ok,false);
 assert.equal(guardedEditorialRevision({expectedRevision:2,currentRevision:2,authorizedOwner:false,auditReady:true}).ok,false);
 assert.equal(guardedEditorialRevision({expectedRevision:2,currentRevision:2,authorizedOwner:true,auditReady:true}).mayPublish,false);
});
test('C01–C06: as-of citation rights, provenance and licensed export holds',()=>{
 const citations=[{id:'SRC_001',rights:'public_reference_only',
  independentlyRightsChecked:true,publishedAt:100,url:'https://www.sec.gov/example'},
  {id:'SRC_FUTURE',rights:'public_reference_only',
   independentlyRightsChecked:true,publishedAt:300,url:'https://www.sec.gov/future'},
  {id:'SRC_PAID',rights:'licensed_quote',
   independentlyRightsChecked:true,publishedAt:100,url:'https://example.com/quote'}];
 const r=citationAsOfGuard({asOf:200,sources:citations});
 assert.equal(r.ok,true);assert.equal(r.references.length,1);
 assert.deepEqual(r.rejected,['SRC_FUTURE','SRC_PAID']);
 assert.equal(r.rawFeedIncluded,false);assert.equal(r.premiumRuntimeReleased,false);
 assert.equal(citationAsOfGuard({asOf:NaN,sources:citations}).ok,false);
});
test('C07–C12: all 73 method specs retained and vendor calculations remain on hold',()=>{
 const data=read('data/talia-chat-mode-p3-indicator73-standards-v1.json');
 assert.equal(data.standards.length,73);
 assert.equal(new Set(data.standards.map(x=>x.studyId)).size,73);
 assert.equal(data.stats.sourceMethodIndependentlyApproved,0);
 assert.equal(data.stats.productionRuntimeApproved,0);
 for(const x of data.standards){
  assert.ok(x.initializationWarmup&&x.missingAndInvalidData&&x.sourceOfTruth);
  assert.equal(x.independentNumericalPublicationAcceptance,false);
  assert.equal(x.memberRuntimeAccepted,false);
 }
 for(const key of ['STUDY_SCTR','STUDY_VIX_CONTEXT']){
  const r=officialMethodHold(key);
  assert.equal(r.approved,false);assert.equal(r.computedValue,null);
  assert.equal(r.teaching,'concept_only');
 }
});
test('D01–D12: preserve approved eight safe states and source-only frontend constraints',()=>{
 const ux=read('data/talia-chat-mode-p9-ux-accessibility-v1.json');
 const p4=read('data/talia-chat-mode-p4-instruction-contract-v1.json');
 assert.equal(ux.errorStates.length,8);
 assert.equal(new Set(ux.errorStates.map(x=>x.code)).size,8);
 assert.equal(p4.modes.length,4);
 assert.equal(p4.phases.length,6);
 assert.equal(p4.perspectives.length,5);
 assert.equal(p4.methods.length,5);
 const classic=readFileSync(new URL('../assets/js/market-tutor.js',import.meta.url),'utf8');
 const react=readFileSync(new URL('../src/tutor/TaliaClassroom.tsx',import.meta.url),'utf8');
 assert.match(classic,/const submittedPreferences=\{allowModel:!sourceOnly&&\$\('tutor-ai-consent'\)\?\.checked===true/);
 assert.match(classic,/allowModel:preferences.allowModel===true/);
 const html=readFileSync(new URL('../market-tutor.html',import.meta.url),'utf8');
 assert.match(html,/id="tutor-save-history" type="checkbox">/);
 assert.match(classic,/void ask\(\{sourceOnly:true\}\)/);
 assert.match(classic,/token\(expectedUserId/);
 assert.match(react,/allowModel:false,saveHistory:currentSave/);
 assert.match(react,/pending\.current\?\.abort\(\)/);
 assert.equal(ux.openIndependentA11yReview!=null,true);
});
test('E01–E12: all 60 tasks and 12 release gates accounted for; no forged acceptance',()=>{
 const source=read('data/talia-chat-mode-p10-codex-backlog-release-gates-v1.json');
 const ledger=read('data/talia-consolidated-60-execution-ledger-v1.json');
 assert.equal(source.tasks.length,60);assert.equal(ledger.tasks.length,60);
 assert.equal(source.releaseGates.length,12);assert.equal(ledger.releaseGates.length,12);
 for(const w of source.waves){
  const members=ledger.tasks.filter(t=>t.wave===w.code);
  assert.equal(members.length,12,'Missing tasks in wave '+w.code);
  assert.deepEqual(members.map(x=>x.id),w.taskIds);
 }
 const originals=new Map(source.tasks.map(x=>[x.id,x]));
 for(const item of ledger.tasks){
  assert.equal(item.title,originals.get(item.id)?.title);
  assert.equal(item.releaseAccepted,false);
  assert(item.sourceReferences.length>=1);
  assert.equal(item.genuineMemberBrowserEvidence,'NOT_ACCEPTED_THIS_BATCH');
  assert.equal(item.sourceTestEvidence,'PENDING_NEW_EXACT_SHA_CI');
 }
 const codes=source.releaseGates.map(x=>x.id);
 assert.deepEqual(ledger.releaseGates.map(x=>x.id),codes);
 assert(ledger.releaseGates.every(x=>x.releaseAcceptance===false));
 assert.equal(ledger.counts.masterClassifiedRequirements,229);
 assert.equal(ledger.counts.foundationDrafts,600);
 assert.equal(ledger.counts.premiumCapabilities,9);
 assert.equal(ledger.counts.indicators,73);
 assert.equal(ledger.baselineFrozen.labs,419);
 assert.equal(ledger.baselineFrozen.academyDays,274);
 assert.equal(ledger.baselineFrozen.paidAiEnabledByThisBatch,false);
 assert.equal(ledger.releaseDecision,'HOLD_UNTIL_ALL_REQUIRED_EVIDENCE_ACCEPTED');
});
