import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const c={Math,Number,String,Array,Object,Set,RegExp,URL,Date};c.globalThis=c;
for(const path of ['assets/js/crownlight-scanner-sec-evidence-v1.js','assets/js/crownlight-scanner-sec-brief-v4.js'])
 runInNewContext(readFileSync(path,'utf8'),c);
const B=c.CrownlightScannerSecBriefV4;
const at='2026-11-03T18:00:00Z',acc='0000123456-26-000001';
const f={form:'8-K',accession:acc,filedDate:'2026-11-03',
 acceptedAt:'2026-11-03T17:00:00Z',
 sourceUrl:'https://www.sec.gov/Archives/edgar/data/123456/'+acc.replaceAll('-','')+'/event.htm'};
const p={ok:true,source:'SEC_EDGAR_PRIMARY',authorizedSource:true,
 identityStatus:'MATCHED',symbol:'TEST',cik:123456,observedAt:at,filings:[f]};
const success=B.summarize(p,'TEST',at);
assert.equal(success.hours24.match,'SEC_ACCEPTED_IN_WINDOW');
assert.equal(success.hours72.acceptedFilings.length,1);
assert.equal(success.firstPublicDisseminationKnown,false);
assert.equal(success.historicalTradingSignal,false);
assert.equal(B.summarize({...p,symbol:'OTHER'},'TEST',at).hours24.match,'UNAVAILABLE');
assert.equal(B.summarize({...p,authorizedSource:false},'TEST',at).hours24.match,'UNAVAILABLE');
assert.equal(B.summarize({...p,filings:[{...f,acceptedAt:null}]},'TEST',at).hours24.match,'INSUFFICIENT_EVENT_TIME');
assert.equal(B.summarize({...p,filings:[{...f,acceptedAt:'2026-11-03T19:00:00Z'}]},'TEST',at).hours24.acceptedFilings.length,0);
const source=readFileSync('assets/js/crownlight-scanner-sec-brief-v4.js','utf8');
assert(!/fetch\s*\(|localStorage|sessionStorage|innerHTML/.test(source));
assert(source.includes('safeFilingUrl'));
console.log('PASS scanner Wave4: authorized read-only SEC evidence and strict unknown/publication boundaries');
