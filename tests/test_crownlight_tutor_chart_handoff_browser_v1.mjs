/* True Chromium same-origin chart -> Market Tutor handoff.
 * Auth is intentionally simulated; real signed-in acceptance remains OPEN.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const script=readFileSync('assets/js/crownlight-tutor-chart-handoff-v1.js','utf8');
const origin='https://chart-handoff-fixture.test';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const failures=[];
const fixture=async(receiverUser='MemberA',allowed=true)=>{
 const context=await browser.newContext({viewport:{width:390,height:780}});
 await context.addInitScript(({targetUser})=>{
  const id=location.pathname.includes('market-tutor.html')?targetUser:'MemberA';
  window.getSupabaseClient=async()=>({auth:{
   getSession:async()=>({data:{session:{access_token:'fixture-test-only',user:{id}}}}),
   getUser:async()=>({data:{user:{id}}})
  }});
  window.__submitted=0;
  window.CrownlightTaliaEChartsBridgeV1={getStatus:()=>({memberVerified:true})};
 },{targetUser:receiverUser});
 const shell='<script defer src="/assets/js/crownlight-tutor-chart-handoff-v1.js"></script>';
 await context.route('**/assets/js/crownlight-tutor-chart-handoff-v1.js',route=>
  route.fulfill({status:200,contentType:'application/javascript',body:script}));
 await context.route('**/api/member-tool-access?tool=MARKET_TUTOR',route=>
  route.fulfill({status:allowed?200:403,contentType:'application/json',
   body:JSON.stringify(allowed?{ok:true,freeEligible:true}:{ok:false})}));
 await context.route('**/simulator.html',route=>route.fulfill({status:200,contentType:'text/html',
  body:'<!doctype html><html><head>'+shell+'</head><body>'+
   '<section id="crownlight-talia-echarts-visual">'+
   '<button data-talia-tutor-handoff disabled>Ask Talia</button>'+
   '<p role="status" data-talia-handoff-status></p></section></body></html>'}));
 await context.route('**/market-tutor.html?chartHandoff=*',route=>
  route.fulfill({status:200,contentType:'text/html',
   body:'<!doctype html><html><head>'+shell+'</head><body>'+
    '<textarea id="tutor-question" maxlength="450"></textarea>'+
    '<p role="status" id="tutor-chart-handoff-status"></p>'+
    '<button id="tutor-ask" onclick="window.__submitted++">Ask</button></body></html>'}));
 const source=await context.newPage();
 source.on('pageerror',e=>failures.push('Source: '+e.message));
 await source.goto(origin+'/simulator.html');
 await source.waitForFunction(()=>!!window.CrownlightTutorChartHandoffV1);
 const opened=await source.evaluate(()=>window.CrownlightTutorChartHandoffV1.setContext({
  question:'Explain the revealed EMA 9 and HLC3 bar-VWAP without future candles.'}));
 assert.equal(opened,true);
 const popupEvent=source.waitForEvent('popup');
 await source.locator('[data-talia-tutor-handoff]').click();
 const receiver=await popupEvent;
 receiver.on('pageerror',e=>failures.push('Receiver: '+e.message));
 await receiver.waitForLoadState('domcontentloaded');
 assert.match(receiver.url(),/chartHandoff=[0-9a-f]{32}/);
 assert.doesNotMatch(receiver.url(),/EMA|VWAP|candle|MemberA|fixture-test-only/);
 if(allowed&&receiverUser==='MemberA'){
  await receiver.waitForFunction(()=>document.querySelector('#tutor-question').value.includes('revealed EMA 9'));
  assert.match(await receiver.locator('#tutor-chart-handoff-status').innerText(),/Nothing has been automatically sent/);
  assert.equal(await receiver.evaluate(()=>window.__submitted),0);
  assert.equal(await source.evaluate(()=>window.CrownlightTutorChartHandoffV1.getStatus().waitingForVerifiedTutor),false);
 }else if(allowed){
  await source.waitForFunction(()=>document.querySelector('[data-talia-handoff-status]').textContent.includes('different or unverified'));
  assert.equal(await receiver.locator('#tutor-question').inputValue(),'');
 }else{
  await receiver.waitForTimeout(140);
  assert.equal(await receiver.locator('#tutor-question').inputValue(),'');
 }
 await context.close();
};
try{
 await fixture('MemberA',true);
 await fixture('MemberB',true);
 await fixture('MemberA',false);
 assert.deepEqual(failures,[]);
 console.log('PASS Chromium handoff: same member editable question, same-origin nonce, mismatch/denial rejection, no automatic Tutor post');
}finally{await browser.close()}
