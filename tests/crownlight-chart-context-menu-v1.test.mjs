import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {normalizeWorkspace} from '../functions/api/chart-workspace.js';
const require=createRequire(import.meta.url);
const api=require('../assets/js/crownlight-chart-context-menu-v1.js');
const read=p=>readFileSync(p,'utf8');
const source=read('assets/js/crownlight-chart-studio-v2.js');
const page=read('simulator.html');
const standard={verified:true,selected:'STANDARD',allowed:['STANDARD']};
const advanced={verified:true,selected:'ADVANCED',allowed:['STANDARD','ADVANCED']};
const unverified={verified:false,selected:'ADVANCED',allowed:['STANDARD','ADVANCED']};
const names=['EMA','SMA','VWAP','RSI','MACD','BB','ATR','VOL_SMA','PMH','PML','HOD','LOD','PDH','PDL','ORH','ORL','STRUCTURE'];
test('Full existing catalog is present with one unique code each',()=>{
 assert.deepEqual(api.catalog.map(x=>x.type),names);
 assert.equal(new Set(names).size,17);
 for(const {type,label} of api.catalog){
  assert(label.length>=3);
  assert(source.includes(type+':'),'No invented indicator '+type);
 }
});
test('EMA has 9/20/200 presets and independently customizable period/source/color',()=>{
 const ema=api.catalog.find(x=>x.type==='EMA');assert.deepEqual(ema.presets,[9,20,200]);
 for(const period of ema.presets)assert.equal(api.normalize({type:'EMA',period}).period,period);
 const custom=api.normalize({type:'EMA',period:34,priceSource:'hlc3',color:'#00aaff',lineStyle:'dotted',width:4});
 assert.deepEqual([custom.period,custom.priceSource,custom.color,custom.lineStyle,custom.width],[34,'hlc3','#00aaff','dotted',4]);
});
for(const {type,tier} of api.catalog){
 test('Per-indicator access is fail-closed for unverified and expired premium: '+type,()=>{
  const basic=tier==='STANDARD';
  assert.equal(api.allowed(type,standard),basic);
  assert.equal(api.allowed(type,unverified),basic);
  assert.equal(api.allowed(type,advanced),true);
  assert.equal(api.allowed(type,{...advanced,accessExpiry:'2000-01-01T00:00:00Z'}),basic);
  assert.match(api.explanation(type,standard),basic?/Included in your verified/:/Locked/);
 });
 test('Every catalog indicator supports independent color, thickness and line style: '+type,()=>{
  const s=api.normalize({type,color:'#FEDCBA',lineStyle:'dashed',width:3,period:14});
  assert.equal(s.color,'#fedcba');assert.equal(s.width,3);assert.equal(s.lineStyle,'dashed');
  assert.equal(s.type,type);assert(Object.isFrozen(s));
 });
}
test('Custom MACD and Bollinger methods validate independent parameters',()=>{
 const a=api.normalize({type:'MACD',fast:4,slow:9,signal:3,priceSource:'ohlc4'});
 assert.deepEqual([a.fast,a.slow,a.signal,a.priceSource],[4,9,3,'ohlc4']);
 const b=api.normalize({type:'BB',period:34,multiplier:2.6,priceSource:'hl2'});
 assert.equal(b.multiplier,2.6);assert.equal(b.period,34);assert.equal(b.priceSource,'hl2');
 const bad=api.normalize({type:'MACD',fast:99,slow:4,signal:1000});
 assert(bad.fast<bad.slow);assert.equal(bad.signal,9);
});
test('Unknown and hostile configuration fails into bounded settings only',()=>{
 assert.equal(api.normalize({type:'UNKNOWN'}),null);
 const a=api.normalize({type:'EMA',period:90000,color:'javascript:x',lineStyle:'script',width:-10,priceSource:'TOKEN',apiKey:'SECRET'});
 assert(a.period<=200);assert.equal(a.width,2);assert.equal(a.lineStyle,'solid');
 assert.equal(a.priceSource,'close');assert.match(a.color,/^#[0-9a-f]{6}$/);
 assert.equal('apiKey' in a,false);
});
test('Server workspace preserves only bounded custom settings and no secret extras',()=>{
 const work=normalizeWorkspace({chartStudies:[
 {type:'MACD',fast:5,slow:13,signal:4,priceSource:'ohlc4',token:'private'},
 {type:'BB',period:34,multiplier:2.5,priceSource:'hl2'},
 {type:'VWAP',priceSource:'evil'},
 {type:'EMA',period:200,priceSource:'high'},
 {type:'MACD',fast:55,slow:11,signal:900}
 ]},{tier:'STANDARD',allowed:['STANDARD']}).chartStudies;
 assert.equal(work.length,5);
 assert.deepEqual([work[0].fast,work[0].slow,work[0].signal,work[0].priceSource],[5,13,4,'ohlc4']);
 assert.equal('token' in work[0],false);
 assert.equal(work[1].multiplier,2.5);assert.equal(work[1].priceSource,'hl2');
 assert.equal('priceSource' in work[2],false);assert.equal(work[3].priceSource,'high');
 assert.equal('fast' in work[4],false);assert.equal('slow' in work[4],false);
 assert.equal('signal' in work[4],false);
});
test('Saved restricted studies never render after tier revocation',()=>{
 assert(source.includes('prefs.studies.filter(study=>isStudyAllowed(study.type))'));
 assert(source.includes("study.type==='STRUCTURE'&&isStudyAllowed(study.type)"));
 assert(source.includes('!isStudyAllowed(type)||prefs.studies.length>=18'));
 assert(source.includes('if(!isStudyAllowed(type))return;'));
});
test('Right-click, hover, header, keyboard and readable locking are wired',()=>{
 const s=read('assets/js/crownlight-chart-context-menu-v1.js');
 for(const k of ['contextmenu','preventDefault','mouseenter','aria-disabled','role','aria-live',
  'ArrowUp','ArrowDown','ArrowRight','ArrowLeft','Escape','onCustom','onDrawing','Locked'])
  assert(s.includes(k),'missing '+k);
 assert(page.indexOf('crownlight-chart-context-menu-v1.js')<page.indexOf('crownlight-chart-studio-v2.js'));
 assert(page.includes('crownlight-chart-context-menu-v1.css'));
 assert(source.includes('data-cl="context-menu"'));assert(source.includes('data-cl="drawings"'));
});
test('Every custom setting is actually used in an existing revealed-bar calculation',()=>{
 for(const k of ['studyPrice(bar,source)','m.ema(c,p)','m.sma(c,p)','m.macd(sourced,f,slow,signal)',
  'm.bollinger(sourced,p,Number(study.multiplier)||2)','m.rsi(sourced,p)',
  'study.priceSource=sourceSelect.value','study.multiplier=next','study[key]=next',
  'sim.candles.slice(0,sim.index+1)'])assert(source.includes(k),k);
});
test('Custom client menu contains no network, billing, storage or new auth mechanism',()=>{
 const s=read('assets/js/crownlight-chart-context-menu-v1.js');
 for(const k of ['fetch(', 'localStorage','sessionStorage','supabase','answer_key','service_role','stripe','innerHTML'])assert(!s.includes(k),k);
});
test('Build blocks release if full-catalog tests fail and CSS supports mobile and keyboard',()=>{
 const build=read('scripts/build-pages.sh'),css=read('assets/css/crownlight-chart-context-menu-v1.css');
 assert(build.includes('node --test tests/crownlight-chart-context-menu-v1.test.mjs'));
 for(const k of ['max-height','max-width','focus-visible','min-height:44px','max-width:630px','prefers-reduced-motion'])assert(css.includes(k),k);
});
