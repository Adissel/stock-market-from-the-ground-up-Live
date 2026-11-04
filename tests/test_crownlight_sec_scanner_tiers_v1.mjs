import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const catalog=JSON.parse(readFileSync('data/crownlight-sec-scanner-tiers-v1.json','utf8'));
const r={Math,Number,String,Array,Object,Set,RegExp,URL,Date};r.globalThis=r;
for(const f of ['assets/js/crownlight-scanner-sec-evidence-v1.js','assets/js/crownlight-scanner-sec-brief-v4.js'])
 runInNewContext(readFileSync(f,'utf8'),r,{filename:f});
const E=r.CrownlightSecEvidenceV1,B=r.CrownlightScannerSecBriefV4;
const at='2026-11-03T18:00:00Z';
const filing=(form,n,time)=>({form,accession:'0000123456-26-'+String(n).padStart(6,'0'),filedDate:'2026-11-03',acceptedAt:time,
 sourceUrl:'https://www.sec.gov/Archives/edgar/data/123456/000012345626'+String(n).padStart(6,'0')+'/event.htm'});
const response={ok:true,identityStatus:'MATCHED',authorizedSource:true,source:'SEC_EDGAR_PRIMARY',
 symbol:'TEST',cik:123456,observedAt:at,filings:[
 filing('8-K',1,'2026-11-03T17:00:00Z'),filing('10-Q',2,'2026-11-03T16:30:00Z'),
 filing('S-1',3,'2026-11-03T15:00:00Z'),filing('4',4,null)]};

test('SEC Research tiers remain separated from stock presets, with no implied member activation',()=>{
 assert.deepEqual(catalog.tiers.map(x=>x.id),['BASIC','PLUS','ADVANCED','PROFESSIONAL']);
 assert.equal(catalog.product.separateFromStockScanner,true);
 assert.equal(catalog.product.screenshotsAreStockPresets,true);
 assert.equal(catalog.product.pricing,'NOT_APPROVED_OR_CHANGED');
 assert.equal(catalog.product.marketWideSecFeed,'NOT_IMPLEMENTED');
 assert.equal(catalog.product.dedicatedTierServerGrants,'NOT_IMPLEMENTED');
 assert.equal(catalog.product.existingGateway,'WATCHLIST_WORKBENCH');
 assert.equal(catalog.sourceScorecard.releaseAcceptedPercent,0);
 assert.ok(catalog.tiers.every(x=>!x.memberEntitlementAssigned&&!x.productionAccepted));
 assert.ok(catalog.tiers.every(x=>x.milestones.length===8));
 assert.equal(catalog.tiers.reduce((s,t)=>s+t.sourceMilestones,0),catalog.sourceScorecard.sourceMilestones);
 for(const tier of catalog.tiers){
  assert.equal(tier.sourceMilestones,tier.milestones.filter(m=>m.sourceEvidencePresent).length);
  assert.equal(tier.sourcePercent,100*tier.sourceMilestones/8);
  for(const feature of tier.features)if(feature.source)assert.ok(existsSync(feature.source));
 }
});

test('SEC form selection filters authorized issuer records without new network calls',()=>{
 const common=B.summarize(response,'TEST',at);
 assert.equal(common.hours24.acceptedFilings.length,2);
 assert.equal(common.hours72.acceptedFilings.length,2);
 const eightK=B.summarize(response,'TEST',at,['8-K']);
 assert.equal(eightK.hours24.acceptedFilings.length,1);
 assert.equal(eightK.hours24.acceptedFilings[0].form,'8-K');
 const s1=B.summarize(response,'TEST',at,['S-1']);
 assert.equal(s1.hours24.acceptedFilings.length,1);
 assert.equal(s1.hours24.acceptedFilings[0].form,'S-1');
 assert.equal(s1.hours24.tradeSignal,false);
 assert.equal(s1.firstPublicDisseminationKnown,false);
 assert.equal(B.summarize(response,'TEST',at,['4']).hours24.match,'INSUFFICIENT_EVENT_TIME');
 assert.throws(()=>B.summarize(response,'TEST',at,['MADE-UP']),/valid unique/);
});

test('SEC controls prohibit treating wrong source or future acceptance as valid',()=>{
 assert.equal(B.summarize({...response,authorizedSource:false},'TEST',at,['8-K']).hours24.match,'UNAVAILABLE');
 assert.equal(B.summarize(response,'OTHER',at,['8-K']).hours24.match,'UNAVAILABLE');
 const future={...response,filings:[filing('8-K',7,'2026-11-03T19:00:00Z')]};
 assert.equal(B.summarize(future,'TEST',at,['8-K']).hours24.acceptedFilings.length,0);
 assert.equal(B.summarize(future,'TEST',at,['8-K']).hours24.excluded.future,1);
});

test('browser filtering remains local-only and existing server SEC gateway remains protected',()=>{
 const ui=readFileSync('assets/js/crownlight-scanner-sec-brief-v4.js','utf8');
 const api=readFileSync('functions/api/sec-issuer-research-v1.js','utf8');
 assert.ok(ui.includes("Filter official SEC filings by form type"));
 assert.ok(ui.includes("formSelect.addEventListener('change',render)"));
 assert.ok(ui.includes("SEC acceptance-time evidence"));
 assert.doesNotMatch(ui,/\bfetch\s*\(|localStorage|sessionStorage|innerHTML/);
 assert.match(api,/advancedToolContext\(env,request,'WATCHLIST_WORKBENCH'\)/);
 assert.match(api,/gu_sec_edgar_take_budget_v1/);
 const qaGuard=readFileSync('functions/_lib/sec-edgar-qa-gate-v1.js','utf8');
 assert.match(qaGuard,/SEC_EDGAR_BETA_ENABLED/);
 assert.match(api,/requireSecSourceRelease/);
 assert.equal(E.TYPES.includes('S-1'),true);
});
