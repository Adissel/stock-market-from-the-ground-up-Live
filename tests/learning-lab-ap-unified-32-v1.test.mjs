/* SMFGU-LELAB-AP-32-20261103
 * Actual production math functions and complete source acceptance register.
 * No genuine member sessions, historical feed rights or independent releases.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {deriveFictionalCompletedFrames,deriveFictionalCompletedStudies,
 professionalDecisionStudy} from '../functions/_lib/learning-lab-edition-exercises-v1.js';
const manifest=JSON.parse(readFileSync('data/learning-lab-ap-unified-32-v1.json','utf8'));
const register=JSON.parse(readFileSync('data/learning-lab-engine-feature-audit-v1.json','utf8'));
const selected=register.features.filter(x=>['ADVANCED','PROFESSIONAL'].includes(x.edition));
const cases=(length=120,end=length-1)=>({
 provenance:'fictional',asOf:(end+1)*1000,completedIndex:end,
 bars:Array.from({length},(_,i)=>{
  const open=100+i*.15,close=open+.05+(i%4)*.02;
  return {timestamp:(i+1)*1000,open,close,high:close+.4,
   low:open-.3,volume:50+i*2};
 })
});
test('Unified matrix records all 32 Advanced/Professional requirements without duplicate IDs',()=>{
 assert.equal(manifest.schema,'smfgu.learning-lab.ap.unified-32.v1');
 assert.equal(manifest.counts.scope,32);
 assert.equal(manifest.counts.source_partial,28);
 assert.equal(manifest.counts.independent_acceptance_open,4);
 assert.equal(manifest.requirements.length,32);
 assert.equal(new Set(manifest.requirements.map(x=>x.id)).size,32);
 assert.deepEqual(manifest.requirements.map(x=>x.id).sort(),
  selected.map(x=>x.id).sort());
});
test('All 20 cross-cutting release gates are explicit and pending independent evidence',()=>{
 assert.equal(manifest.gate_definitions.length,20);
 assert.equal(new Set(manifest.gate_definitions.map(x=>x.id)).size,20);
 assert(manifest.gate_definitions.every(x=>x.title&&x.category&&
  x.acceptance_state==='pending_independent_evidence'));
 assert(manifest.requirements.every(x=>x.gates==='G01-G20'));
});
test('Frozen Basic, all 419 Labs, competencies and premium hold remain unmodified',()=>{
 assert.equal(register.frozen.learningBasic,'v3.3');
 assert.equal(register.frozen.labBasic,'v3.2');
 assert.equal(register.frozen.labIds,419);
 assert.equal(register.frozen.competencies,30);
 assert.equal(register.frozen.premiumFeaturesReleased,false);
 assert.equal(manifest.controls.learningBasic,'v3.3');
 assert.equal(manifest.controls.labBasic,'v3.2');
 assert.equal(manifest.controls.labs,419);
 assert.equal(manifest.controls.competencies,30);
 assert.equal(manifest.controls.premiumReleased,false);
 assert.equal(manifest.controls.addonCheckout,false);
 assert.equal(manifest.controls.officialGradingUnchanged,true);
 assert.equal(manifest.release_decision,'HOLD');
});
test('Independent release acceptance cannot be inferred from source tests',()=>{
 assert.equal(manifest.independent_approval_uri,null);
 assert(manifest.requirements.every(x=>x.genuine_member_accepted===false));
 assert(manifest.requirements.every(x=>x.independent_release_accepted===false));
 assert(selected.every(x=>x.real_member_accepted===false&&x.independent_release_accepted===false));
});
for(const row of manifest.requirements){
 test('Unomitted Premium requirement: '+row.id+' '+row.title,()=>{
  const reference=selected.find(x=>x.id===row.id);
  assert(reference,row.id);
  assert.equal(row.engine,reference.engine);
  assert.equal(row.edition,reference.edition);
  assert.equal(row.source_status,reference.source_status);
  assert.equal(row.evidence_file,reference.evidence_file);
  assert.equal(row.existing_test_file,reference.existing_test_file);
  assert.equal(row.criterion,reference.acceptance_criterion);
  assert(existsSync(row.evidence_file),'Missing evidence file '+row.id);
  assert(existsSync(row.existing_test_file),'Missing test file '+row.id);
  assert.equal(row.genuine_member_accepted,false,row.id);
  assert.equal(row.independent_release_accepted,false,row.id);
 });
}
for(const engine of ['learning','lab'])for(const edition of ['ADVANCED','PROFESSIONAL']){
 test('Specific release decision remains independently open '+engine+'/'+edition,()=>{
  const rows=manifest.requirements.filter(x=>x.engine===engine&&x.edition===edition);
  assert.equal(rows.length,8);
  assert.equal(rows.filter(x=>x.source_status==='partial').length,7);
  assert.equal(rows.filter(x=>x.source_status==='not_implemented').length,1);
  assert.equal(rows.filter(x=>x.id.endsWith('-08')).length,1);
  assert(rows.every(x=>x.independent_release_accepted===false));
 });
}
for(const [length,period] of [[32,2],[80,5],[120,4],[145,5],[127,12],[150,25],[200,60]]){
 test('Most recent completed Professional replay frames '+length+' bars / '+period+' per group',()=>{
  const source=cases(length);
  const frames=deriveFictionalCompletedFrames({evidence:source,frameSize:period});
  const groups=Math.floor(length/period);
  assert.equal(frames.length,Math.min(groups,6));
  const start=Math.max(0,groups-6);
  for(let i=0;i<frames.length;i++){
   const absolute=start+i+1;
   assert.equal(frames[i].label,'Completed '+period+'-bar group '+absolute);
   assert.equal(frames[i].completedThrough,absolute*period*1000);
   assert.equal(frames[i].close,source.bars[absolute*period-1].close);
   assert.equal(frames[i].sourceVerified,true);
  }
  assert(frames.every((f,i)=>i===0||frames[i-1].completedThrough<f.completedThrough));
 });
}
test('Long 120-bar replay shows groups 19 through 24, never obsolete groups 1-6',()=>{
 const frames=deriveFictionalCompletedFrames({evidence:cases(120),frameSize:5});
 assert.equal(frames.length,6);
 assert.equal(frames[0].label,'Completed 5-bar group 19');
 assert.equal(frames.at(-1).label,'Completed 5-bar group 24');
 assert.equal(frames.at(-1).completedThrough,120000);
});
test('Current incomplete five-bar group is never added to completed frame evidence',()=>{
 const frames=deriveFictionalCompletedFrames({evidence:cases(123),frameSize:5});
 assert.equal(frames.length,6);
 assert.equal(frames.at(-1).label,'Completed 5-bar group 24');
 assert.equal(frames.at(-1).completedThrough,120000);
});
test('Appending corrupted future suffix cannot change completed numerical evidence',()=>{
 const clean=cases(150,89);
 const altered=structuredClone(clean);
 for(let i=90;i<altered.bars.length;i++)
  altered.bars[i]={timestamp:(i+1)*1000,open:-100,high:-10,low:-200,
   close:-50,volume:-100};
 const a=deriveFictionalCompletedStudies({evidence:clean,emaPeriod:9});
 const b=deriveFictionalCompletedStudies({evidence:altered,emaPeriod:9});
 assert.deepEqual(a,b);
 assert.equal(a.evidence.bars.length,90);
 assert.deepEqual(
  deriveFictionalCompletedFrames({evidence:clean,frameSize:5}),
  deriveFictionalCompletedFrames({evidence:altered,frameSize:5})
 );
});
test('Explicit as-of earlier than last completed candle rejects future lookahead',()=>{
 const future=cases(80);future.asOf=79000;
 assert.equal(deriveFictionalCompletedStudies({evidence:future,emaPeriod:9}),null);
 assert.equal(deriveFictionalCompletedFrames({evidence:future,frameSize:5}),null);
});
test('Professional current six-frame decision study is ungraded, nonpredictive, bounded',()=>{
 const src=cases(75);
 const derived=deriveFictionalCompletedStudies({evidence:src,emaPeriod:9});
 const frames=deriveFictionalCompletedFrames({evidence:src,frameSize:5});
 const study=professionalDecisionStudy({evidence:derived.evidence,
  indicators:derived.indicators,frames,
  riskCases:[{entry:40,stop:38,riskBudget:100,availableCash:1000}],
  competencies:[],observations:[]});
 assert(study);
 assert.equal(study.frames.length,6);
 assert.equal(study.frames.at(-1).completedThrough,75000);
 assert.equal(study.noLookahead,true);
 assert.equal(study.graded,false);
 assert.equal(study.masteryAwarded,false);
 assert(study.uncertaintyEvidence.some(x=>/slippage|gaps|fees/i.test(x)));
});
test('HLC3 fictional candle VWAP is visibly labeled a PROXY, not exact trade prints',()=>{
 const output=deriveFictionalCompletedStudies({evidence:cases(45),emaPeriod:9});
 const vwap=output.indicators.find(x=>x.name==='VWAP');
 assert(vwap);
 assert.match(vwap.method,/HLC3/i);
 assert.match(vwap.method,/proxy/i);
 assert.match(vwap.method,/not exact transaction-print VWAP/i);
 const independentTradePrintVwap=(100*1+110*9)/10;
 const independentHlc3=(110+100+110)/3;
 assert(Math.abs(independentTradePrintVwap-independentHlc3)>2);
});
test('Third-party historical bars cannot be disguised as original fictional source',()=>{
 const source=cases(60);
 source.provenance='licensed_historical';
 assert.equal(deriveFictionalCompletedStudies({evidence:source,emaPeriod:9}),null);
 assert.equal(deriveFictionalCompletedFrames({evidence:source,frameSize:5}),null);
});
test('Every final -08 release feature exists exactly once, with explicit HOLD',()=>{
 assert.deepEqual(manifest.requirements.filter(x=>x.id.endsWith('-08'))
  .map(x=>x.id).sort(),['LA-ADV-08','LA-PRO-08','LE-ADV-08','LE-PRO-08']);
 assert.equal(manifest.release_decision,'HOLD');
});
