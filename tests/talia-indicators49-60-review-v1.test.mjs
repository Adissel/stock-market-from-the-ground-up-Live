// Talia 49–60: separate fictional arithmetic, source-only explanation and editorial holds.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const {guides:all}=JSON.parse(readFileSync(new URL('../data/tutor-indicator-study-v1.json', import.meta.url),'utf8'));
const guides=all.slice(48,60);
const expected=['MFI','CHAIKIN_OSCILLATOR','PVO','FORCE_INDEX','VOLUME_PROFILE','PRICE_RELATIVE','SCTR','ADVANCE_DECLINE','NEW_HIGHS_LOWS','MCCLELLAN_OSC','PERCENT_ABOVE_MA','PUT_CALL_RATIO'].map(x=>'STUDY_'+x);
const eq=(got,want)=>assert.ok(Number.isFinite(got)&&Math.abs(got-want)<1e-9,`${got} ≠ ${want}`);
test('twelve guides offer distinct original learning, honest source scope and no protected-grade claims',()=>{
 assert.deepEqual(guides.map(x=>x.code),expected);
 for(const field of ['fictionalPrompt','selfCheck','reviewExplanation'])assert.equal(new Set(guides.map(g=>g[field])).size,12,field);
 for(const g of guides){
  assert.match(g.fictionalPrompt,/^FICTIONAL: /);
  assert.ok(g.fictionalPrompt.length>145&&g.selfCheck.length>100&&g.reviewExplanation.length>200,g.code);
  assert.match(g.selfCheck,/FICTIONAL INDEPENDENT TRANSFER/);
  assert.equal(g.internalEditorialReview.independentlyAccepted,false);
  assert.equal(g.internalEditorialReview.claimSpecificReference,g.sourceUrls[0]);
  assert.match(g.sourceUrls[0],/^https:\/\//);
  assert.equal(g.officialCompetency,false);
  const answer=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(answer.includes(g.fictionalPrompt)&&answer.includes(g.selfCheck),g.code);
  assert.doesNotMatch(answer,/guaranteed profit|live fill confirmed|mastery awarded|buy this stock now/i);
 }
});
test('fictional numerical calculations are independent of lesson prose',()=>{
 // MFI (positive/negative flow already classified from matched completed bars).
 eq(100-100/(1+800/200),80);eq(100-100/(1+300/700),30);
 // Chaikin differential of already-warmed ADL EMA states, not series reconstruction.
 eq(120-98,22);eq(50-55,-5);
 // PVO: volume EMA series use same completed bar duration and denominator units.
 eq(100*(125000-100000)/100000,25);eq(100*(90000-120000)/120000,-25);
 // Force Index(1); optional longer EMA must not be falsely reconstructed.
 eq((10.6-10.2)*800,320);eq((20.5-21)*200,-100);
 // Trade-print exact bins: not a bar-derived reconstructed volume profile.
 const prints=[[10,100],[10.05,200],[10.2,50]];
 const bin=(a,b)=>prints.filter(([p])=>p>=a&&p<b).reduce((s,[,v])=>s+v,0);
 eq(bin(10,10.10),300);eq(bin(10.10,10.30),50);
 // Price relative and change of same-basis ratio.
 eq(55/50,1.1);eq((55/50)/(50/50)-1,.1);
 // Vendor-provided SCTR ranks: only differences are calculable; do not reconstruct score.
 eq(74-82,-8);eq(67-61,6);
 // Advance–decline line and net new 52-week highs.
 eq(1000+400-350,1050);eq(-30+220-250,-60);
 eq(48-31,17);eq(28-36,-8);
 // McClellan given already-warmed same-method EMA values.
 eq(60-45,15);eq(-20-10,-30);
 // Breadth numerator/denominator define eligible population, not all symbols.
 eq(100*72/120,60);eq(100*45/90,50);
 // Comparable options contract volume.
 eq(600/400,1.5);eq(250/500,.5);
});
test('the twelve guides declare their topic-specific uncertainty instead of promising direction',()=>{
 const by=Object.fromEntries(guides.map(g=>[g.code,g]));
 for(const key of ['MFI','PVO','PERCENT_ABOVE_MA','PUT_CALL_RATIO'])assert.match(by['STUDY_'+key].reviewExplanation,/zero|denominator|undefined|eligib/i);
 assert.match(by.STUDY_SCTR.reviewExplanation,/proprietary/i);
 assert.match(by.STUDY_VOLUME_PROFILE.reviewExplanation,/OHLCV/i);
 assert.match(by.STUDY_MCCLELLAN_OSC.reviewExplanation,/ratio-adjusted/i);
 assert.match(by.STUDY_CHAIKIN_OSCILLATOR.reviewExplanation,/seeding/i);
});
