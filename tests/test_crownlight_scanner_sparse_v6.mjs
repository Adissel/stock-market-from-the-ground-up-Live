import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const context={Math,Number,String,Array,Object,Set,RegExp,Map,TextEncoder,JSON};
context.globalThis=context;
for(const path of ['assets/js/market-research-engine-v014145.js','assets/js/crownlight-scanner-rules-v1.js',
 'assets/js/crownlight-scanner-templates-v1.js','assets/js/crownlight-scanner-presets-v2.js',
 'assets/js/crownlight-scanner-evidence-v6.js'])
 runInNewContext(readFileSync(path,'utf8'),context,{filename:path});
const M=context.GroundUpScannerV014145,C=context.CrownlightScannerRulesV1,
 P=context.CrownlightScannerPresetsV2,E=context.CrownlightScannerEvidenceV6;
const rule=(field,op,value)=>({type:'rule',field,op,value});
const csv='symbol,price,volume,change_pct\nAAA,10,1000000,\nBBB,8,500000,5\n';
test('legacy Market Discovery 7-column import stays strict, new scanner mode accepts only 3 core columns',()=>{
 assert.throws(()=>M.csv(csv),/Required CSV headers/);
 const rows=M.csv(csv,{mode:'SCANNER_PRESET_V2'});
 assert.equal(rows.length,2);assert.deepEqual(Object.keys(rows[0]),['symbol','price','volume','change_pct']);
 const minimal=M.csv('symbol,price,volume\nAAA,10,200000\n',{mode:'SCANNER_PRESET_V2'});
 assert.equal(minimal.length,1);
 assert.throws(()=>M.csv('symbol,price\nAAA,10\n',{mode:'SCANNER_PRESET_V2'}),/Required CSV headers/);
 assert.throws(()=>M.csv(csv,{mode:'NOT_A_MODE'}),/Unsupported CSV schema/);
 assert.throws(()=>M.csv(csv,{mode:'SCANNER_PRESET_V2',admin:true}),/Unsupported CSV schema/);
});
test('presets can match supplied core fields without demanding unrelated RVOL, float and spread',()=>{
 const rows=M.csv(csv,{mode:'SCANNER_PRESET_V2'});
 const res=C.analyze(rows,rule('price','GTE',9),{allowSparse:true});
 assert.equal(res.inspected,2);assert.equal(res.matched,1);
 assert.equal(res.rows[0].symbol,'AAA');
 assert.equal(res.rejections.invalidInput,0);
 assert.equal(C.analyze(rows,rule('price','GTE',9)).matched,0);
 assert.equal(C.analyze(rows,rule('rvol','GTE',2),{allowSparse:true}).rejections.missingEvidence,2);
 assert.equal(C.analyze(rows,{type:'group',op:'OR',children:[rule('price','GT',9),rule('rvol','GT',2)]},{allowSparse:true}).matched,1);
});
test('malformed present numbers remain rejected and absent comparison remains UNKNOWN',()=>{
 const sparse=M.csv('symbol,price,volume,rvol\nAAA,10,200000,bad\nBBB,8,100000,\n',{mode:'SCANNER_PRESET_V2'});
 const scan=C.analyze(sparse,rule('price','GT',3),{allowSparse:true});
 assert.equal(scan.rejections.invalidInput,1);assert.equal(scan.matched,1);
 assert.equal(C.evaluate({type:'not',child:rule('rvol','GT',2)},sparse[1]),null);
 const invalid=C.analyze([{symbol:'AAA',price:10,volume:200000,day_high:8}],rule('price','GT',5),{allowSparse:true});
 assert.equal(invalid.matched,0);assert.equal(invalid.rejections.invalidInput,1);
});
test('all 48 presets remain valid under a sparse-only schema and missing evidence is observable',()=>{
 const rows=M.csv('symbol,price,volume\nAAB,8,400000\n',{mode:'SCANNER_PRESET_V2'});
 assert.equal(P.count,48);
 for(const preset of P.items){
  const result=C.analyze(rows,preset.rules,{allowSparse:true});
  assert.equal(result.inspected,1);
  assert.equal(result.tradeAuthorization,false);
  assert.equal(result.sourceStatus,'UNVERIFIED_MEMBER_IMPORTED_SNAPSHOT');
  assert.equal(result.rejections.invalidInput,0);
  const coverage=E.audit(rows,preset.rules,C);
  assert.equal(coverage.inspected,1);assert.equal(coverage.sourceVerified,false);
  assert.ok(coverage.fields.length>0);
  assert.ok(coverage.fields.every(x=>x.missingOrInvalid>=0&&x.missingOrInvalid<=1));
 }
});
test('source-field audit expands derived values and never claims source rights',()=>{
 const source=M.csv('symbol,price,volume,vwap\nAAA,10,500000,\n',{mode:'SCANNER_PRESET_V2'});
 const a=E.audit(source,rule('vwap_distance_pct','GTE',1),C);
 assert.deepEqual(Array.from(a.fields,x=>x.field),['price','vwap']);
 assert.equal(a.fields[0].valid,1);
 assert.equal(a.fields[1].supplied,0);
 assert.equal(a.fields[1].missingOrInvalid,1);
 assert.equal(a.sourceVerified,false);assert.equal(a.tradeSignal,false);
 assert.throws(()=>E.audit(source,rule('__proto__','GT',1),C),/Unsupported/);
});
