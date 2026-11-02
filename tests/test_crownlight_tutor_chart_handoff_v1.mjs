/* SMFGU-VIS-INT-005 source/runtime test: no network persistence or fake grade.
 * The live signed-in browser suite remains independent of this isolated test.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync('assets/js/crownlight-tutor-chart-handoff-v1.js','utf8');
assert.doesNotMatch(script,/\blocalStorage\b|\bsessionStorage\b|\bdocument\.cookie\b/);
for(const route of ['simulator.html','verified-replay.html']){
 const html=readFileSync(route,'utf8');
 assert(html.includes('data-talia-tutor-handoff'));
 assert(html.indexOf('crownlight-tutor-chart-handoff-v1.js')<
   html.indexOf('crownlight-talia-echarts-bridge-v1.js'));
}
const html=readFileSync('market-tutor.html','utf8');
assert(html.includes('id="tutor-chart-handoff-status"'));
assert(html.includes('crownlight-tutor-chart-handoff-v1.js'));
const tick=async()=>{for(let i=0;i<50;i++)await Promise.resolve()};
class Node{
 constructor(){this.disabled=true;this.textContent='';this.events={};this.value='';this.focused=false}
 addEventListener(type,cb){this.events[type]=cb}
 dispatchEvent(e){this.lastEvent=e.type}
 focus(){this.focused=true}
}
const create=(member='same',eligible=true)=>{
 const origin='https://stock.example',senderMessage=[],receiverMessage=[];
 const button=new Node(),status=new Node(),question=new Node(),note=new Node();
 const listenersA={},listenersB={};
 const owner='member-A',guest=member==='same'?owner:'member-B';
 const auth=(uid)=>({getSession:async()=>({data:{session:{access_token:'test-only-not-a-real-secret',user:{id:uid}}}}),
  getUser:async()=>({data:{user:{id:uid}}})});
 let pendingURL=null,sent=0;
 const receiver={
  location:{origin,href:origin+'/market-tutor.html'},
  opener:null,addEventListener:(k,fn)=>{listenersB[k]=fn},
  fetch:async()=>({ok:eligible,json:async()=>eligible?{ok:true,freeEligible:true}:{ok:false}}),
  getSupabaseClient:async()=>({auth:auth(guest)}),
  postMessage(data,target){
   assert.equal(target,origin);
   receiverMessage.push(data);
   listenersB.message?.({origin,source:sender,data});
  }
 };
 const sender={
  location:{origin,href:origin+'/simulator.html'},open(path){
   pendingURL=new URL(path,origin);
   receiver.location.href=pendingURL.href;
   return receiver
  },addEventListener:(k,fn)=>{listenersA[k]=fn},
  getSupabaseClient:async()=>({auth:auth(owner)}),
  CrownlightTaliaEChartsBridgeV1:{getStatus:()=>({memberVerified:true})},
  crypto:{getRandomValues(arr){arr.forEach((_,i)=>arr[i]=i+1);return arr}},
  postMessage(data,target){
   assert.equal(target,origin);sent++;
   senderMessage.push(data);
   listenersA.message?.({origin,source:receiver,data});
  }
 };
 receiver.opener=sender;
 const domA={getElementById:id=>id==='crownlight-talia-echarts-visual'?{
  querySelector:key=>({'[data-talia-handoff-status]':status,
   '[data-talia-tutor-handoff]':button})[key]}:null};
 const domB={getElementById:id=>({'tutor-question':question,
  'tutor-chart-handoff-status':note})[id]||null};
 const makeContext=(win,dom)=>vm.runInNewContext(script,{
  window:win,document:dom,URL,Uint8Array,Date,Event:class{constructor(type){this.type=type}},
  setTimeout,console
 },{timeout:2500});
 makeContext(sender,domA);
 return {sender,receiver,button,status,question,note,makeContext,domB,
  getURL:()=>pendingURL,getSent:()=>sent,receiverMessage,senderMessage};
};
{
 const c=create();
 assert.equal(c.sender.CrownlightTutorChartHandoffV1.setContext({
  question:'Explain the observed EMA 9 and HLC3 VWAP without future bars.'}),true);
 assert.equal(c.button.disabled,false);
 c.button.events.click();
 assert.match(c.getURL().search,/chartHandoff=[0-9a-f]{32}/);
 assert.doesNotMatch(c.getURL().href,/EMA|VWAP|observed|trade|Bearer/);
 c.makeContext(c.receiver,c.domB);
 await tick();
 assert.match(c.question.value,/EMA 9 and HLC3 VWAP/);
 assert.equal(c.question.focused,true);
 assert.equal(c.question.lastEvent,'input');
 assert.match(c.note.textContent,/Nothing has been automatically sent/);
 assert.equal(c.sender.CrownlightTutorChartHandoffV1.getStatus().waitingForVerifiedTutor,false);
 assert.equal(c.receiver.CrownlightTutorChartHandoffV1.getStatus().received,true);
 assert(c.getSent()===1);
 assert(c.senderMessage[0].memberId==='member-A');
 assert(!JSON.stringify(c.senderMessage).includes('test-only-not-a-real-secret'));
}
{
 const c=create('different');
 c.sender.CrownlightTutorChartHandoffV1.setContext({question:'Visible candle teaching only'});
 c.button.events.click();
 c.makeContext(c.receiver,c.domB);await tick();
 assert.equal(c.question.value,'','Different user must never receive source account evidence');
 assert.match(c.status.textContent,/different or unverified member/);
}
{
 const c=create('same',false);
 c.sender.CrownlightTutorChartHandoffV1.setContext({question:'Visible candle teaching only'});
 c.button.events.click();
 c.makeContext(c.receiver,c.domB);await tick();
 assert.equal(c.question.value,'','Server-denied Tutor access must prevent transfer');
 assert.equal(c.getSent(),0,'No ready handshake for denied Tutor member');
}
{
 const c=create();
 assert.equal(c.button.disabled,true);
 assert.equal(c.sender.CrownlightTutorChartHandoffV1.setContext({question:''}),false);
 c.button.events.click();assert.equal(c.getURL(),null);
}
console.log('PASS chart->Tutor one-time session-confirmed consent; source URL empty; no storage; mismatch and denied entitlement fail closed');
