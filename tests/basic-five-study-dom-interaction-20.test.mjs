import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const base=require('../assets/js/learning-quant-studies-v1.js');
const indicators=require('../assets/js/learning-indicators-v1.js');
const uiSource=readFileSync('assets/js/learning-quant-studies-ui-v1.js','utf8');
const bridge=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
const studies=[
 {id:'ema',context:{topic:'EMA 9: exponential moving average',competencies:['EMA_CONTEXT'],primaryCode:'EMA_CONTEXT'}},
 {id:'rsi',context:{labId:'F3-C07-L01',topic:bridge['F3-C07-L01'].title}},
 {id:'macd',context:{labId:'F3-C07-L03',topic:bridge['F3-C07-L03'].title}},
 {id:'atr',context:{labId:'DT-C19-L03',topic:bridge['DT-C19-L03'].title}},
 {id:'bollinger',context:{labId:'F3-C07-L04',topic:bridge['F3-C07-L04'].title}}
];
function render(study){
 const doc={};
 class Node {
  constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.listeners={};
   this.textContent='';this.value='';this.ownerDocument=doc;this.isConnected=true;this.focused=false}
  setAttribute(name,value){this.attrs[name]=String(value)}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=[...nodes]}
  addEventListener(name,handler){this.listeners[name]=handler}
  focus(){this.focused=true}
  remove(){this.isConnected=false}
 }
 doc.createElement=(tag)=>new Node(tag);
 const target=new Node('div');
 const window={document:doc,GroundUpLearningQuantStudiesV1:base,GroundUpLearningIndicatorsV1:indicators};
 vm.runInNewContext(uiSource,{window,globalThis:window,Promise,WeakMap},{timeout:3000});
 const mount=window.GroundUpLearningQuantStudiesUIV1.mount;
 const controller=mount({target,studyId:study.id,mode:'guided',context:study.context});
 const all=(node)=>[node,...node.children.flatMap(all)];
 return {target,controller,all:()=>all(target),mount};
}
for(const study of studies){
 test(study.id+' / 1: authorized member workbench mounts and unmapped topic is rejected',()=>{
  const view=render(study);assert.ok(view.controller);
  const denied=view.mount({target:view.target,studyId:study.id,mode:'guided',context:{topic:'unrelated subject'}});
  assert.equal(denied,null);
 });
 test(study.id+' / 2: chart uses accessible name and numerical tables independent of SVG canvas',()=>{
  const view=render(study),nodes=view.all(),charts=nodes.filter(n=>n.attrs.role==='img'),tables=nodes.filter(n=>n.tag==='table');
  assert.equal(charts.length,1);assert.match(charts[0].attrs['aria-label'],/equivalent values provided in the following table/);
  assert.equal(tables.length,2);assert.ok(tables.some(n=>n.className?.includes('gu-quant-series-table')));
 });
 test(study.id+' / 3: numerical alternatives expose column and row headers, warmup and series captions',()=>{
  const view=render(study),nodes=view.all(),captions=nodes.filter(n=>n.tag==='caption'),col=nodes.filter(n=>n.tag==='th'&&n.attrs.scope==='col'),row=nodes.filter(n=>n.tag==='th'&&n.attrs.scope==='row');
  assert.equal(captions.length,2);assert.ok(col.length>=4);assert.ok(row.length>=3);
  assert.ok(nodes.some(n=>n.tag==='td'&&n.textContent==='Not available — warmup'));
 });
 test(study.id+' / 4: worked values, clear/retry and ungraded live feedback remain keyboard-operable',()=>{
  const view=render(study);let nodes=view.all();
  const buttons=nodes.filter(n=>n.tag==='button'),worked=buttons.find(n=>n.textContent==='Show worked values in practice fields');
  const clear=buttons.find(n=>n.textContent==='Clear and retry'),check=buttons.find(n=>n.textContent==='Check ungraded method');
  const fields=nodes.filter(n=>n.tag==='input');
  assert.ok(worked?.listeners.click&&clear?.listeners.click&&check?.listeners.click);
  assert.equal(fields.length,3);worked.listeners.click();
  assert.ok(fields.every(n=>n.value!==''));assert.equal(fields[0].focused,true);
  check.listeners.click();nodes=view.all();
  assert.ok(nodes.some(n=>n.tag==='div'&&n.attrs['aria-live']==='polite'));
  assert.ok(nodes.some(n=>n.tag==='p'&&/All three steps match/.test(n.textContent)));
  clear.listeners.click();assert.ok(fields.every(n=>n.value===''));
  assert.ok(view.controller);view.controller.dispose();
 });
}
