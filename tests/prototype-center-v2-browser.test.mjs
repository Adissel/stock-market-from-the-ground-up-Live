/* Synthetic Prototype Center Chromium browser acceptance; no LIVE sign-ins or payment calls. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.PT_BROWSER_BASE||'http://127.0.0.1:8768';
const fakeCases=[
 {id:'CL-PROTO-VWAP-01',topic:'VWAP reclaim',name:'Fictional VWAP calculation',type:'FICTIONAL',objective:'Calculate volume-weighted average price.',note:'Synthetic example only.',candles:[
 {time:'09:30',open:10,high:10.4,low:9.8,close:10.2,volume:1000},{time:'09:31',open:10.2,high:10.5,low:10.1,close:10.4,volume:1500},
 {time:'09:32',open:10.4,high:10.4,low:10,close:10.1,volume:2000},{time:'09:33',open:10.1,high:10.6,low:10.1,close:10.5,volume:2500}
 ],question:'What is the typical price of the first candle?',instructor:'Compare the candle close to VWAP and check later confirmation.'},
 {id:'CL-PROTO-BREAKOUT-02',topic:'Breakout',name:'Fictional breakout rejection',type:'FICTIONAL',objective:'Compare breakout and failed breakout.',note:'Synthetic only.',candles:[
 {time:'09:30',open:20,high:20.3,low:19.9,close:20.2,volume:1200},{time:'09:31',open:20.2,high:20.35,low:20.05,close:20.25,volume:900},
 {time:'09:32',open:20.25,high:20.6,low:20.1,close:20.15,volume:2200},{time:'09:33',open:20.15,high:20.25,low:19.8,close:19.9,volume:1800}
 ],question:'What is the typical price of the third candle?',instructor:'Observe the wick rejection.'},
 {id:'CL-PROTO-RISK-03',topic:'Risk planning',name:'Fictional risk/reward',type:'FICTIONAL',objective:'Compute dollar risk per share.',note:'Synthetic only.',candles:[
 {time:'09:30',open:15,high:15.15,low:14.85,close:15.05,volume:800},{time:'09:31',open:15.05,high:15.3,low:15,close:15.25,volume:1200},
 {time:'09:32',open:15.25,high:15.45,low:15.1,close:15.3,volume:1400},{time:'09:33',open:15.3,high:15.55,low:15.15,close:15.5,volume:1700}
 ],question:'What is per-share risk for entry $15.25 and stop $15.00?',instructor:'Risk is $0.25 per share.'}
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function session(role,viewport){
 let currentRole=role;
 const context=await browser.newContext({viewport,serviceWorkers:'block'});
 await context.route('**/assets/js/supabase-client.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:`
window.getSupabaseClient=async()=>({auth:{
 getSession:async()=>({data:{session:{access_token:'qa-test-token',user:{id:'qa-user'}}}}),
 getUser:async()=>({data:{user:{id:'qa-user'}},error:null}),
 onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
}});
`}));
 await context.route('**/api/admin?action=context',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,roles:[currentRole],permissions:currentRole==='OWNER'||currentRole==='ADMIN'?['control_panel.access']:[]})}));
 await context.route('**/api/prototype-training-cases',route=>route.fulfill({status:currentRole==='OWNER'||currentRole==='ADMIN'?200:403,contentType:'application/json',body:JSON.stringify({ok:currentRole==='OWNER'||currentRole==='ADMIN',source:'FICTIONAL_PROTOTYPE',gradingEnabled:false,privateAnswerKeysIncluded:false,cases:fakeCases})}));
 const page=await context.newPage();return{context,page,revoke:()=>{currentRole='MODERATOR'}};
}
try{
 for(const role of ['MODERATOR','SHOWCASE_VIEWER','FREE']){
  const {context,page}=await session(role,{width:1100,height:750});
  await page.goto(BASE+'/prototype.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('pt-gate')?.textContent?.includes('Owner or authorized Administrator'),{timeout:12000});
  assert.equal(await page.locator('#pt-app').isVisible(),false,role+' must not see workbench');
  await context.close();
 }
 for(const [role,viewport] of [['OWNER',{width:1280,height:900}],['ADMIN',{width:768,height:900}],['OWNER',{width:390,height:844}]]){
  const {context,page,revoke}=await session(role,viewport);
  const exceptions=[];page.on('pageerror',error=>exceptions.push(error.message));
  await page.goto(BASE+'/prototype.html',{waitUntil:'domcontentloaded'});
  await page.locator('#pt-app').waitFor({state:'visible',timeout:16000});
  await page.locator('[data-prototype-case]').waitFor({state:'visible',timeout:14000});
  assert.equal(await page.locator('#pt-nav button').count(),23);
  await page.waitForFunction(()=>document.querySelector('#pt-chart-status')?.textContent?.startsWith('Interactive'),null,{timeout:20000});
  await page.locator('[data-prototype-case] button:has-text("Reveal next candle")').click();
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Visible 3 of 4 candles/);
  await page.locator('#pt-nav button:has-text("Boot Camp Classroom")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  await page.locator('#pt-nav button:has-text("Admin Control Panel")').click();
  assert.match(await page.locator('#pt-content').textContent(),/Security & Governance/);
  await page.locator('#pt-nav button:has-text("Classroom Builder")').click();
  await page.locator('.pt-options button:has-text("Chart-first")').click();
  assert.equal(await page.locator('.pt-classroom').getAttribute('data-layout'),'Chart-first');
  await page.locator('#pt-device').selectOption('mobile');
  assert.equal(await page.locator('#pt-content').getAttribute('data-device'),'mobile');
  const bounds=await page.evaluate(()=>({body:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
  assert.ok(bounds.body<=bounds.width+12,'no significant horizontal overflow at '+viewport.width+': '+JSON.stringify(bounds));
  assert.deepEqual(exceptions,[],'browser JavaScript exceptions');
  if(role==='OWNER'&&viewport.width===1280){
   revoke();await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
   await page.waitForFunction(()=>document.querySelector('#pt-gate')?.textContent?.includes('no longer has Prototype Center permissions'),null,{timeout:12000});
   assert.equal(await page.locator('#pt-app').isVisible(),false,'role revocation must immediately hide the workbench');
  }
  await context.close();
  console.log('PASS role '+role+' at '+viewport.width+'px: navigation, protected case, layout, replay and responsive shell');
 }
}finally{await browser.close()}
