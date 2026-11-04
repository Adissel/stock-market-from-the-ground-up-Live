import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync('assets/js/crownlight-sec-scanner-tier-ui-v1.js','utf8');
const A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function flush(){for(let n=0;n<8;n++)await tick();}

class Element{
 constructor(tag,doc){
  this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];
  this.parentElement=null;this.attributes={};this.textContent='';
  this.value='';this.disabled=false;this.hidden=false;this.id='';this.className='';
 }
 append(...items){for(const node of items){if(node==null)continue;node.parentElement=this;this.children.push(node);}}
 replaceChildren(...items){for(const item of this.children)item.parentElement=null;this.children=[];this.append(...items);}
 setAttribute(name,value){this.attributes[name]=String(value);}
 getAttribute(name){return this.attributes[name]||null;}
 addEventListener(name,callback){this['on'+name]=callback;}
 contains(node){return node===this||this.children.some(x=>x.contains?.(node));}
 closest(selector){let n=this;while(n){if(selector.startsWith('#')&&n.id===selector.slice(1))return n;n=n.parentElement;}return null;}
 querySelector(selector){
  const needle=selector.startsWith('#')?(x=>x.id===selector.slice(1)):
   selector==='[value="fundamentals"]'?(x=>x.value==='fundamentals'):(()=>false);
  return this.find(needle);
 }
 find(predicate){for(const x of this.children){if(predicate(x))return x;const nested=x.find?.(predicate);if(nested)return nested;}return null;}
 all(predicate,out=[]){for(const x of this.children){if(predicate(x))out.push(x);x.all?.(predicate,out);}return out;}
 get text(){return String(this.textContent||'')+this.children.map(x=>x.text||'').join(' ');}
}
function makeHarness({user=A,owner=false,tier='BASIC',sourceAllowed=true,grant={tier:'ADVANCED',status:'active',version:4,expires_at:null},
 switchDuring=null}={}){
 const doc={createElement:tag=>new Element(tag,doc)};
 const outer=new Element('main',doc);outer.id='tool-content';
 const host=new Element('div',doc);host.id='tool-workbench';outer.append(host);
 let currentUser=user,queries=[],ownerPosts=[],briefs=0;
 const baseSource={ok:true,identityStatus:'MATCHED',source:'SEC_EDGAR_PRIMARY',symbol:'GUSIM',
  company:'Gusim Educational Inc',cik:789019,observedAt:'2026-11-03T18:00:00.000Z',
  filings:[{form:'8-K',filedDate:'2026-11-03',acceptedAt:'2026-11-03T17:00:00.000Z',
   accession:'0000789019-26-000001',sourceUrl:'https://www.sec.gov/Archives/edgar/data/789019/000078901926000001/event.htm'}],
  capabilities:{acceptedTimeWindows:tier!=='BASIC',fundamentals:tier==='ADVANCED'},
  fundamentals:tier==='ADVANCED'?[{metric:'Revenue',available:true,observations:[
   {value:1500000,unit:'USD',periodEnd:'2026-09-30',acceptedAt:null}]}]:null,tier};
 const makeResponse=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
 const api=async(url,init={})=>{
  queries.push({url,method:init.method||'GET',authorization:init.headers?.authorization});
  if(switchDuring&&String(url).includes(switchDuring))currentUser=B;
  if(String(url).startsWith('/api/sec-scanner-tier-v1'))
   return sourceAllowed?makeResponse({ok:true,tier,capabilities:baseSource.capabilities,sourceMode:'AUDITED_QA'}):
    makeResponse({ok:false,error:'SEC source access is restricted to approved QA members.'},403);
  if(String(url).startsWith('/api/sec-scanner-research-v1'))return makeResponse(baseSource);
  if(String(url).startsWith('/api/owner-sec-scanner-tier-v1')){
   if(!owner)return makeResponse({ok:false,error:'OWNER_ACCESS_REQUIRED'},403);
   if(init.method==='POST'){const input=JSON.parse(init.body);ownerPosts.push(input);
    return makeResponse({ok:true,grant:{version:input.expectedVersion+1,tier:input.tier,status:input.status}});
   }
   const target=new URL('https://test.invalid'+url).searchParams.get('target')||A;
   return makeResponse({ok:true,owner:true,target,grant:target===A?grant:null,nextExpectedVersion:target===A?4:0});
  }
  throw Error('Unexpected endpoint '+url);
 };
 const context={
  document:doc,Response,fetch:api,
  addEventListener(){},
  CrownlightSecEvidenceV1:{safeFilingUrl:()=>true},
  CrownlightScannerSecBriefV4:{mount:()=>{briefs++}},
  globalThis:null
 };
 context.globalThis=context;
 runInNewContext(source,context,{filename:'crownlight-sec-scanner-tier-ui-v1.js'});
 const SB={auth:{getSession:async()=>({data:{session:currentUser?{user:{id:currentUser},access_token:'TEST_JWT'}:null}})}};
 const app=context.CrownlightSecScannerTierUIV1;
 const mount=()=>app.mount({host,SB,USER:{id:user}});
 const find=pred=>host.find(pred);
 const all=pred=>host.all(pred);
 return {mount,host,find,all,queries,ownerPosts,getBriefs:()=>briefs,changeUser:x=>{currentUser=x},baseSource};
}
await test('Basic panel validates actual authorization and locks Advanced fundamentals',async()=>{
 const h=makeHarness({tier:'BASIC'});
 h.mount();await flush();
 const panel=h.find(x=>x.id==='cl-sec-tier-panel');
 assert.ok(panel);assert.match(panel.text,/Verified SEC Scanner tier: BASIC/);
 const selected=h.find(x=>x.tagName==='OPTION'&&x.value==='fundamentals');
 assert.equal(selected.disabled,true);
 const ticker=h.find(x=>x.tagName==='INPUT'&&x.maxLength===12);
 ticker.value='GUSIM';
 const fetchButton=h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer'));
 assert.equal(fetchButton.disabled,false);
 await fetchButton.onclick();await flush();
 assert.match(panel.text,/Gusim Educational Inc/);
 assert.match(panel.text,/Plus: SEC acceptance-time lookbacks/);
 assert.equal(h.getBriefs(),0);
 assert.equal(h.queries.filter(q=>q.url.includes('/api/sec-scanner-research-v1')).length,1);
});
await test('QA-denied source leaves retrieval disabled and produces no issuer request',async()=>{
 const h=makeHarness({sourceAllowed:false});
 h.mount();await flush();
 const panel=h.find(x=>x.id==='cl-sec-tier-panel');
 assert.match(panel.text,/restricted to approved QA members/);
 const button=h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer'));
 assert.equal(button.disabled,true);
 assert.equal(h.queries.filter(q=>q.url.includes('/api/sec-scanner-research-v1')).length,0);
});
await test('Plus can see evidence but cannot request financial facts from the UI',async()=>{
 const h=makeHarness({tier:'PLUS'});
 h.mount();await flush();
 assert.equal(h.find(x=>x.tagName==='OPTION'&&x.value==='fundamentals').disabled,true);
 h.find(x=>x.tagName==='INPUT'&&x.maxLength===12).value='GUSIM';
 await h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer')).onclick();
 assert.equal(h.getBriefs(),1);
});
await test('Advanced chart failure preserves accessible financial table',async()=>{
 const h=makeHarness({tier:'ADVANCED'});
 h.mount();await flush();
 assert.equal(h.find(x=>x.tagName==='OPTION'&&x.value==='fundamentals').disabled,false);
 h.find(x=>x.tagName==='INPUT'&&x.maxLength===12).value='GUSIM';
 const m=h.find(x=>x.tagName==='SELECT'&&x.children.some(y=>y.value==='fundamentals'));m.value='fundamentals';
 await h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer')).onclick();
 const panel=h.find(x=>x.id==='cl-sec-tier-panel');
 assert.match(panel.text,/1500000 USD/);
 const plot=h.find(x=>x.tagName==='BUTTON'&&x.textContent==='Plot SEC-reported values');
 assert.ok(plot);await plot.onclick();
 assert.match(panel.text,/Chart unavailable; use the numeric table/);
 assert.match(panel.text,/Reporting period/);
});
await test('Non-Owner cannot see member UUID or grant editor',async()=>{
 const h=makeHarness({owner:false});
 h.mount();await flush();
 assert.equal(h.find(x=>x.className==='cl-sec-tier-owner'),null);
 assert.equal(h.ownerPosts.length,0);
});
await test('Owner must reload grant after editing account ID; cannot send stale account grant',async()=>{
 const h=makeHarness({owner:true});
 h.mount();await flush();
 const owner=h.find(x=>x.className==='cl-sec-tier-owner');assert.ok(owner);
 const inputs=owner.all(x=>x.tagName==='INPUT');
 const target=inputs.find(x=>x.maxLength===36),reason=inputs.find(x=>x.maxLength===500);
 reason.value='QA source verification with recorded owner approval';
 const save=owner.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Save audited SEC grant'));
 target.value=B;
 await save.onclick();assert.equal(h.ownerPosts.length,0);
 assert.match(owner.text,/Reload the member grant before saving/);
 const load=owner.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Load account grant'));
 await load.onclick();
 await save.onclick();
 assert.equal(h.ownerPosts.length,1);
 assert.equal(h.ownerPosts[0].target,B);
 assert.equal(h.ownerPosts[0].expectedVersion,0);
});
await test('Account switched before server response cannot activate tier or issuer controls',async()=>{
 const h=makeHarness({switchDuring:'/api/sec-scanner-tier-v1'});
 h.mount();await flush();
 const button=h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer'));
 assert.equal(button.disabled,true);
 assert.match(h.find(x=>x.id==='cl-sec-tier-panel').text,/Sign-in context changed/);
});
await test('Missing signed-in session cannot trigger any SEC network request',async()=>{
 const h=makeHarness();h.changeUser(null);
 h.mount();await flush();
 assert.equal(h.queries.length,0);
 assert.equal(h.find(x=>x.tagName==='BUTTON'&&x.textContent.includes('Retrieve SEC issuer')).disabled,true);
});
