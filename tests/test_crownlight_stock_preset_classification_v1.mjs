import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const contract=read('data/crownlight-stock-preset-classification-v1.json');
const sec=read(contract.secResearch.source);
const sandbox={Math,Number,String,Array,Object,Set,RegExp,Map,JSON};
sandbox.globalThis=sandbox;
for(const path of [
  contract.stockScanner.evaluator,
  contract.stockScanner.legacySource,
  contract.stockScanner.source
])runInNewContext(readFileSync(path,'utf8'),sandbox,{filename:path});
const rules=sandbox.CrownlightScannerRulesV1;
const legacy=sandbox.CrownlightScannerTemplatesV1;
const presets=sandbox.CrownlightScannerPresetsV2;

test('owner correction categorizes executable presets as stocks, not SEC filings',()=>{
  assert.equal(contract.classificationDecision.stockPresetProduct,'Crownlight Stock Scanner');
  assert.equal(contract.classificationDecision.secResearchProduct,'SEC Filing and Fundamental Research');
  assert.equal(contract.classificationDecision.noAutomaticReclassificationOfSECResearch,true);
  assert.equal(presets.count,contract.stockScanner.expectedPresets);
  assert.equal(legacy.items.length,contract.stockScanner.expectedLegacy);
  assert.equal(presets.addedCount,contract.stockScanner.expectedAdditional);
  assert.deepEqual(Array.from(presets.categories),contract.stockScanner.families);
  for(const p of presets.items){
    assert.ok(contract.stockScanner.families.includes(p.category),p.id);
    for(const field of p.requiredFields)assert.ok(Object.hasOwn(rules.FIELDS,field),p.id+': '+field);
  }
});

test('SEC research codes remain separate from executable stock scanner preset input contract',()=>{
  assert.equal(sec.documentControl.status,'RESEARCH ONLY, NO PRODUCTION LIVE APPROVAL');
  assert.equal(contract.secResearch.notExecutableStockPresetInputs,true);
  assert.deepEqual(sec.featureMapping.map(item=>item.code),contract.secResearch.secCodes);
  const scannerFields=new Set(Object.keys(rules.FIELDS));
  const secCodes=new Set(contract.secResearch.secCodes);
  for(const code of secCodes)assert.equal(scannerFields.has(code),false,code);
  for(const p of presets.items){
    assert.equal(secCodes.has(p.id),false,p.id);
    assert.equal(p.requiredFields.some(field=>secCodes.has(field)),false,p.id);
  }
});

test('legacy rules and protected release boundaries remain unchanged',()=>{
  for(const old of legacy.items){
    const current=presets.lookup(old.id);
    assert.ok(current,old.id);
    assert.equal(JSON.stringify(current.rules),JSON.stringify(rules.validate(old.rules)),old.id);
  }
  assert.equal(contract.guards.preserveChampionSignatures,true);
  assert.equal(contract.guards.noLiveFeeds,true);
  assert.equal(contract.guards.noTradingRecommendations,true);
  assert.equal(contract.verification.screenshotsMatched,0);
});
