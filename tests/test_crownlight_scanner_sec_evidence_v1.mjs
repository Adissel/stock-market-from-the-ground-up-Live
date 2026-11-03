import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const c={Math,Number,String,Array,Object,Set,RegExp,URL,Date};c.globalThis=c;
runInNewContext(readFileSync('assets/js/crownlight-scanner-sec-evidence-v1.js','utf8'),c);
const E=c.CrownlightSecEvidenceV1,time='2026-11-03T18:00:00Z';
const filing=(acc,accepted,form='8-K')=>({form,accession:acc,filedDate:'2026-11-03',
 acceptedAt:accepted,sourceUrl:'https://www.sec.gov/Archives/edgar/data/123456/'+acc.replaceAll('-','')+'/event.htm',
 publicationTimeKnown:false,historicalReplayEligible:false});
const f1=filing('0000123456-26-000001','2026-11-03T17:00:00Z'),
 f2=filing('0000123456-26-000002','2026-11-03T19:00:00Z'),
 f3=filing('0000123456-26-000003',null),
 f4={...filing('0000123456-26-000004','2026-11-01T08:00:00Z'),filedDate:'2026-11-01'};
const payload={ok:true,source:'SEC_EDGAR_PRIMARY',authorizedSource:true,
 identityStatus:'MATCHED',symbol:'TEST',cik:123456,observedAt:time,filings:[f1,f2,f3,f4]};
const r=E.assess(payload,'TEST',time);
assert.equal(r.match,'SEC_ACCEPTED_IN_WINDOW');
assert.deepEqual(Array.from(r.acceptedFilings,x=>x.accession),[f1.accession]);
assert.equal(r.excluded.future,1);
assert.equal(r.excluded.unknownTime,1);
assert.equal(r.excluded.outsideWindow,1);
assert.equal(r.firstPublicDisseminationKnown,false);
assert.equal(r.historicalTradeDecisionEligible,false);
assert.equal(r.tradeSignal,false);
assert.equal(E.assess({...payload,symbol:'OTHER'},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,observedAt:'2026-11-03T20:00:00Z'},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,source:'VENDOR'},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,authorizedSource:false},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,identityStatus:'AMBIGUOUS_TICKER'},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,cik:'abc'},'TEST',time).match,'UNAVAILABLE');
assert.equal(E.assess({...payload,filings:[{...f1,sourceUrl:'https://evil.com/doc'}]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[{...f1,sourceUrl:'https://www.sec.gov.evil.com/doc'}]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[{...f1,sourceUrl:'https://www.sec.gov/Archives/edgar/data/999999/000012345626000001/event.htm'}]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[f3]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[f4]},'TEST',time,{windowHours:72}).match,'SEC_ACCEPTED_IN_WINDOW');
assert.equal(E.assess({...payload,filings:[{...f1,filedDate:'2026-99-99'}]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[{...f1,filedDate:'2026-10-01'}]},'TEST',time).match,'INSUFFICIENT_EVENT_TIME');
assert.equal(E.assess({...payload,filings:[f1,f1]},'TEST',time).acceptedFilings.length,1);
assert.throws(()=>E.assess(payload,'TEST','2026-11-03'),/exact evaluation time/);
assert.throws(()=>E.assess(payload,'TEST',time,{windowHours:30}),/24h and 72h/);
assert.throws(()=>E.assess(payload,'TEST',time,{forms:['FAKE']}),/valid unique/);
console.log('PASS SEC evidence: issuer and CIK validation, allowlisted archive, 24/72h boundaries, no-lookahead and publication limits');
