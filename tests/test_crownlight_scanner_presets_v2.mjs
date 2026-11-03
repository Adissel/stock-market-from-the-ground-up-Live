import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const s={Math,Number,String,Array,Object,Set,RegExp,Map,JSON};s.globalThis=s;
for(const path of ['assets/js/crownlight-scanner-rules-v1.js','assets/js/crownlight-scanner-templates-v1.js','assets/js/crownlight-scanner-presets-v2.js'])runInNewContext(readFileSync(path,'utf8'),s,{filename:path});
const C=s.CrownlightScannerRulesV1,L=s.CrownlightScannerTemplatesV1,P=s.CrownlightScannerPresetsV2;
test('48 distinct original source recipes, preserving five legacy templates',()=>{
 assert.equal(P.count,48);assert.equal(P.addedCount,43);assert.equal(P.originalCount,5);
 assert.equal(L.items.length,5);
 assert.equal(P.lookup('NEGATIVE_5M').category,'Momentum');
 assert.equal(P.lookup('TWO_DAY_CHANGE').category,'Momentum');
 assert.equal(P.lookup('SUPPLIED_VWAP').category,'VWAP & levels');
 assert.equal(P.lookup('DAY_HIGH').category,'VWAP & levels');
 assert.equal(new Set(Array.from(P.items,x=>x.id)).size,48);
 for(const old of L.items){
  const modern=P.lookup(old.id);
  assert.ok(modern);assert.equal(JSON.stringify(modern.rules),JSON.stringify(C.validate(old.rules)));
  assert.equal(modern.origin,'LEGACY_FIVE_PRESERVED');
 }
 assert.equal(P.lookup('__proto__'),null);
 assert.equal(P.lookup('NOT_REAL'),null);
 assert.equal(P.liveFeed,false);
 assert.equal(P.provenTradingStrategies,0);
 assert.equal(P.sourceFolderPicturesReviewed,0);
});
test('all 48 presets validate on original nested rule evaluator, never certify trading edges',()=>{
 const row={symbol:'TEST',price:5,change_pct:6,volume:500000,rvol:2.5,
  float:12000000,spread_pct:1,change_5m_pct:2,change_2d_pct:12,
  vwap:4.5,day_high:5.5,day_low:4.6,prev_close:4.8,
  trades:1500,yesterday_volume:450000,gap_pct:6,market_cap:200000000};
 for(const preset of P.items){
  assert.equal(preset.statisticalEdgeValidated,false,preset.id);
  assert.equal(preset.recommendedTrade,false,preset.id);
  assert.equal(preset.imagesReviewed,false,preset.id);
  assert.equal(preset.membershipTierChanged,false,preset.id);
  assert.equal(preset.sourceStatus,'UNVERIFIED_SNAPSHOT_CRITERIA',preset.id);
  assert.equal(JSON.stringify(C.validate(preset.rules)),JSON.stringify(preset.rules),preset.id);
  assert.ok(preset.requiredFields.length>0,preset.id);
  for(const key of preset.requiredFields)assert.ok(Object.hasOwn(C.FIELDS,key),preset.id+': '+key);
  for(const path of preset.sourceFiles)assert.ok(existsSync(path),preset.id+': '+path);
  const output=C.evaluate(preset.rules,row);
  assert.ok(output===true||output===false||output===null,preset.id);
  assert.ok(Object.isFrozen(preset.rules)&&Object.isFrozen(preset.requiredFields),preset.id);
  assert.doesNotThrow(()=>C.analyze([row],preset.rules),preset.id);
 }
});
test('six categories and case-insensitive search are deterministic and bounded',()=>{
 assert.equal(P.categories.length,6);
 assert.equal(P.filter({}).length,48);
 assert.ok(P.filter({query:'VWAP'}).length>=3);
 assert.ok(P.filter({category:'Momentum',query:'two-session'}).length>=2);
 assert.equal(P.filter({category:'UNDEFINED'}).length,0);
 assert.equal(P.filter({query:'NONEXISTENTTHING'}).length,0);
 assert.equal(P.filter({query:'PRICE'}).length,P.filter({query:'price'}).length);
 for(const category of P.categories)assert.ok(P.filter({category}).length>1);
});
test('tri-state NOT/OR and non-fabrication of supplied fields',()=>{
 const row={symbol:'FICTY',price:5,change_pct:5,volume:500000,
  rvol:2.2,float:12000000,spread_pct:1,vwap:4.5,day_high:5.1,gap_pct:6};
 assert.equal(C.evaluate(P.lookup('NOT_REPORTED_WIDE_SPREAD').rules,row),true);
 assert.equal(C.evaluate(P.lookup('NOT_REPORTED_WIDE_SPREAD').rules,{...row,spread_pct:''}),null);
 assert.equal(C.evaluate(P.lookup('HIGH_VOLUME_OR_RVOL').rules,row),true);
 assert.equal(C.evaluate(P.lookup('LOW_FLOAT_REPORTED_RVOL').rules,row),true);
 assert.equal(C.evaluate(P.lookup('GAP_UP_ABOVE_VWAP').rules,row),true);
 assert.equal(C.evaluate(P.lookup('GAP_UP_ABOVE_VWAP').rules,{...row,vwap:''}),null);
 assert.equal(C.evaluate(P.lookup('GAP_UP_ABOVE_VWAP').rules,{...row,gap_pct:''}),null);
 assert.equal(C.evaluate(P.lookup('NEAR_SUPPLIED_HIGH_ONE').rules,row),false);
 assert.equal(C.evaluate(P.lookup('NEAR_SUPPLIED_HIGH_ONE').rules,{...row,day_high:4.5}),null);
 assert.equal(C.evaluate(P.lookup('DOLLAR_VOLUME_PROXY_5M').rules,{...row,price:10,volume:500000}),true);
});
test('all 50 strategy-study names remain separately withheld from executable scanner',()=>{
 const a=JSON.parse(readFileSync('data/crownlight-scanner-presets-source-audit-v2.json','utf8'));
 const b=JSON.parse(readFileSync('data/crownlight-scanner-preset-strategy-holds-v2.json','utf8'));
 assert.equal(a.github.gitTreeTruncated,false);
 assert.ok(a.github.trackedFileCount>4000);
 assert.equal(a.github.sourceFolderPicturesReviewed,0);
 assert.equal(a.github.sourceFolderPathsFound.length,0);
 assert.equal(a.activeResearch.totalSelectableResearchRecipes,48);
 assert.equal(a.pending.independentDataRightsCleared,false);
 assert.equal(b.researchWorkflows.length,50);
 assert.ok(b.researchWorkflows.every(x=>x.independentEdgeValidated===false));
 assert.equal(a.otherSources.sourceScreenshotsMentionedInPreviousGithubCatalog,98);
});
