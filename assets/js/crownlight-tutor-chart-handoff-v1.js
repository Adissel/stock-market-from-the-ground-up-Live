/* SMFGU-VIS-INT-005: one-time, user-initiated, same-origin chart -> Market Tutor.
 * Does not persist chart data in URLs, browser storage, analytics or server.
 * All chart values must originate in the existing verified, revealed-only bridge.
 * No automatic Tutor submission, grading, new entitlements or trade advice.
 */
(function(root){
 'use strict';
 const VERSION=1,TYPE='smfgu:chart-tutor-handoff-v1';
 const url=new URL(root.location.href);
 const receiverNonce=url.searchParams.get('chartHandoff');
 const senderHost=document.getElementById('crownlight-talia-echarts-visual');
 const questionBox=document.getElementById('tutor-question');
 let context=null,pending=null,receiverId=null,used=false;
 const cleanText=x=>typeof x==='string'&&x.length>0&&x.length<=450&&
  !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(x);
 const validNonce=x=>typeof x==='string'&&/^[a-f0-9]{32}$/.test(x);
 const feedback=senderHost?.querySelector('[data-talia-handoff-status]');
 const sendButton=senderHost?.querySelector('[data-talia-tutor-handoff]');
 const status=message=>{if(feedback)feedback.textContent=message};
 const fail=message=>{status(message);pending=null};
 async function member(){
  try{
   const sb=await root.getSupabaseClient?.();
   const auth=sb?.auth;
   if(!auth?.getSession||!auth?.getUser)return null;
   const session=(await auth.getSession()).data?.session;
   if(!session?.access_token||!session.user?.id)return null;
   const verified=(await auth.getUser()).data?.user;
   if(!verified?.id||verified.id!==session.user.id)return null;
   return {id:verified.id,token:session.access_token};
  }catch{return null}
 }
 function clear(){
  context=null;pending=null;receiverId=null;
  if(sendButton)sendButton.disabled=true;
  status('Chart context cleared. Reveal an authorized candle to prepare a new question.');
 }
 function setContext(item){
  // This input is produced by the currently revealed, verified chart bridge.
  if(!senderHost||!item||!cleanText(item.question))return false;
  context=item.question.trim().slice(0,450);
  if(sendButton)sendButton.disabled=false;
  status('Chart evidence ready. Opening Talia is optional; the question remains editable.');
  return true;
 }
 function createNonce(){
  const bytes=new Uint8Array(16);
  if(!root.crypto?.getRandomValues)return null;
  root.crypto.getRandomValues(bytes);
  return Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
 }
 function openTutor(){
  if(!context||pending||!root.CrownlightTaliaEChartsBridgeV1?.getStatus?.().memberVerified){
   status('Sign in and reveal a completed candle first.');return false;
  }
  const nonce=createNonce();if(!nonce){status('Secure browser randomness is unavailable.');return false}
  const target=new URL('/market-tutor.html',root.location.origin);
  target.searchParams.set('chartHandoff',nonce);
  // Only a click opens the tab; no secrets or OHLCV travel in its URL.
  const tab=root.open(target.pathname+target.search,'_blank');
  if(!tab){status('The browser blocked the Tutor tab. Permit this requested popup.');return false}
  pending={tab,nonce,question:context,started:Date.now()};
  status('Talia opened. Verify the same signed-in member; the evidence is not sent until confirmed.');
  return true;
 }
 if(sendButton)sendButton.addEventListener('click',openTutor);
 root.addEventListener('message',async event=>{
  const data=event?.data;
  if(event.origin!==root.location.origin||!data||data.type!==TYPE||data.v!==VERSION)return;
  if(senderHost){
   const state=pending;
   if(!state||data.action!=='ready'||event.source!==state.tab||
    data.nonce!==state.nonce||!validNonce(data.nonce)||Date.now()-state.started>120000)return;
   const account=await member();
   if(state!==pending||!account||account.id!==data.memberId||
    !root.CrownlightTaliaEChartsBridgeV1?.getStatus?.().memberVerified){
    fail('Tutor is signed into a different or unverified member. No chart values transferred.');return
   }
   event.source.postMessage({type:TYPE,v:VERSION,action:'evidence',
    nonce:state.nonce,memberId:account.id,question:state.question},root.location.origin);
   pending=null;
   status('The same signed-in member received an editable chart question. No message was automatically sent.');
   return;
  }
  if(!questionBox||!validNonce(receiverNonce)||used||data.action!=='evidence'||
   event.source!==root.opener||data.nonce!==receiverNonce||data.memberId!==receiverId||
   !cleanText(data.question))return;
  const account=await member();
  if(used||!account||account.id!==receiverId)return;
  used=true;questionBox.value=data.question;
  questionBox.dispatchEvent(new Event('input',{bubbles:true}));
  const note=document.getElementById('tutor-chart-handoff-status');
  if(note)note.textContent='Visible chart evidence transferred from your authorized chart. Review or edit the question, then choose Ask Talia. Nothing has been automatically sent.';
  questionBox.focus();
 });
 async function initReceiver(){
  if(!questionBox||!validNonce(receiverNonce)||!root.opener)return;
  const account=await member();
  if(!account)return;
  // Reuse the actual server entitlement check, do not trust the URL or DOM.
  try{
   const response=await root.fetch('/api/member-tool-access?tool=MARKET_TUTOR',{
    cache:'no-store',headers:{authorization:'Bearer '+account.token}});
   const body=await response.json().catch(()=>null);
   if(!response.ok||body?.ok!==true||
    (body.authorized!==true&&body.freeEligible!==true))return;
  }catch{return}
  receiverId=account.id;
  root.opener.postMessage({type:TYPE,v:VERSION,action:'ready',
   nonce:receiverNonce,memberId:receiverId},root.location.origin);
 }
 if(senderHost){
  clear();
  root.addEventListener('crownlight:member-changed',clear);
  root.addEventListener('pagehide',clear);
 }
 if(questionBox)void initReceiver();
 root.CrownlightTutorChartHandoffV1=Object.freeze({setContext,clear,getStatus:()=>({
  hasContext:!!context,waitingForVerifiedTutor:!!pending,received:used
 })});
})(window);
