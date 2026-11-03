import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const ctx={Math,Number,String,Array,Object,Set,RegExp};ctx.globalThis=ctx;
runInNewContext(readFileSync('assets/js/crownlight-scanner-rules-v1.js','utf8'),ctx);
const E=ctx.CrownlightScannerRulesV1;
const rule=(field,op,value)=>({type:'rule',field,op,value});
const row={symbol:'AAA',price:8,change_pct:5,volume:400000,rvol:2,float:14000000,spread_pct:1.4,
 trades:1200,day_high:8.5,vwap:7.2};
const scan=E.analyze([row,{...row,symbol:'BBB',change_pct:5,trades:1800},
 {...row,symbol:'CCC',change_pct:8,trades:500}],
 rule('price','GTE',0.1),{columns:['price','trades','day_high','price_below_high_pct'],
 sort:'change_pct',descending:false,secondarySort:'trades',secondaryDescending:true});
assert.deepEqual(Array.from(scan.rows,x=>x.symbol),['BBB','AAA','CCC']);
assert.deepEqual(Array.from(scan.columns),['price','trades','day_high','price_below_high_pct']);
assert.equal(scan.rows[0].day_high,8.5);
assert.equal(scan.rows[0].price_below_high_pct>5,true);
assert.equal(scan.rows[0].ruleTrail.outcome,'PASS');
assert.equal(scan.rows[0].ruleTrail.details[0].observed,8);
assert.equal(scan.rows[0].ruleTrail.details[0].result,'PASS');
assert.equal(scan.sourceStatus,'UNVERIFIED_MEMBER_IMPORTED_SNAPSHOT');
assert.equal(scan.tradeAuthorization,false);
assert.equal(scan.liveFeed,false);
assert.equal(scan.statisticalEdge,false);
const missing=E.explain(rule('vwap','GT',2),{...row,vwap:''});
assert.equal(missing.outcome,'UNKNOWN');
assert.equal(missing.details[0].target,2);
assert.equal(missing.details[0].observed,null);
assert.equal(E.explain({type:'not',child:rule('vwap','GT',2)},{...row,vwap:''}).outcome,'UNKNOWN');
assert.throws(()=>E.validateView({columns:[]}),/Invalid scanner/);
assert.throws(()=>E.validateView({columns:['__proto__']}),/Invalid scanner/);
assert.throws(()=>E.validateView({columns:['price','price']}),/Invalid scanner/);
assert.throws(()=>E.validateView({columns:Array.from({length:13},()=> 'price')}),/Invalid scanner/);
assert.throws(()=>E.validateView({sort:'price',secondarySort:'price'}),/Invalid scanner/);
assert.throws(()=>E.validateView({secondaryDescending:'false'}),/Invalid scanner/);
assert.throws(()=>E.validateView({limit:0}),/Invalid scanner/);
assert.deepEqual(Array.from(E.validateView().columns),Array.from(E.DEFAULT_COLUMNS));
const large={...row,price:1};
const result=E.analyze([large],rule('price','GTE',0),{sort:'trades',columns:['trades'],limit:1});
assert.equal(result.rows.length,1);
assert.equal(result.rows[0].trades,1200);
console.log('PASS scanner results v2: 12-column whitelist, multi-sort, deterministic provenance-preserving rule traces');
