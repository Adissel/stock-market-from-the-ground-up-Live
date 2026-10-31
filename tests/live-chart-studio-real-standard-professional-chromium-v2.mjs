/* Actual authenticated Standard + Professional production Chromium QA.
 * Disposable GoTrue members are created ONLY through GitHub-signed OIDC.
 * Two-tab revision CAS, user-owned layouts, upgrade locks, 390px phone
 * and account isolation. No Founder, payment or Lumens writes.
 * Passwords, user session tokens and GitHub OIDC are never logged.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const site='https://stock-market-from-the-ground-up-d1r.pages.dev';
const fn='https://oxihglyfgzywsupnyicb.supabase.co/functions/v1/smfgu-chart-browser-oidc-qa-v2';
const orig=process.env.ACTIONS_ID_TOKEN_REQUEST_URL||'';
const gate=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN||'';
assert(orig&&gate,'Only signed GitHub Actions runners can run this QA');
const t=new URL(orig);t.searchParams.set('audience','smfgu-chart-browser-acceptance-v2-20261031');
const v=await fetch(t,{headers:{authorization:'Bearer '+gate},signal:AbortSignal.timeout(15000)});
assert.equal(v.status,200,'GitHub workflow OIDC issuance refused');
const token=(await v.json()).value;assert(token&&token.split('.').length===3);
const request=async(action,body={})=>{
 const r=await fetch(fn,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},
  body:JSON.stringify({action,...body}),signal:AbortSignal.timeout(25000)});
 const b=await r.json().catch(()=>({}));
 return {status:r.status,body:b};
};
let ids=[],browser;
try{
 const start=await request('begin');
 assert.equal(start.status,200,'QA provisioning refused '+String(start.body.error||''));
 assert.equal(start.body.ok,true);
 ids=start.body.ids||[];
 const sessions=start.body.sessions||[];
 assert.equal(ids.length,2);assert.equal(new Set(ids).size,2);
 assert.deepEqual(sessions.map(x=>x.tier),['STANDARD','PROFESSIONAL']);
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const s of sessions){
  const c=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  try{
   const p=await c.newPage(),errors=[],payments=[];
   p.on('pageerror',e=>errors.push(String(e.message).slice(0,160)));
   p.on('request',r=>{
    const u=new URL(r.url());
    if(u.origin===site&&!['GET','HEAD','OPTIONS'].includes(r.method())&&
      /^\/api\/(?:stripe|chart-mixed|member-sparks|lumen|wallet|founding)/.test(u.pathname))
     payments.push(r.method()+' '+u.pathname);
   });
   await p.goto(site+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
   await p.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:25000});
   const signed=await p.evaluate(async val=>{
    const client=await window.getSupabaseClient();
    const r=await client.auth.setSession({access_token:val.access,refresh_token:val.refresh});
    return {id:r.data?.user?.id,ok:!r.error&&!!r.data?.session?.access_token};
   },s);
   assert(signed.ok&&signed.id===s.id,'GoTrue identity mismatch in Chromium');
   await p.goto(site+'/simulator.html?studio='+s.tier,{waitUntil:'domcontentloaded',timeout:30000});
   await p.waitForFunction(()=>window.CrownlightChartTiers?.getStatus?.().verified===true,null,{timeout:40000});
   await p.waitForFunction(()=>window.CrownlightWorkspaceV2?.getStatus?.().memberVerified===true,null,{timeout:40000});
   const ent=await p.evaluate(()=>window.CrownlightChartTiers.getStatus());
   assert.equal(ent.tier,s.tier,'Server tier must be authoritative');
   assert.deepEqual(ent.allowed,s.tier==='STANDARD'?['STANDARD']:['STANDARD','ADVANCED','PROFESSIONAL']);
   const selected=await p.evaluate(async tier=>{
    await window.CrownlightChartTiers.choose(tier);
    return window.CrownlightChartTiers.getStatus().selected;
   },s.tier);
   assert.equal(selected,s.tier,'Allowed Chart Studio must be selectable');
   if(s.tier==='STANDARD'){
    await p.evaluate(()=>window.CrownlightChartTiers.choose('PROFESSIONAL'));
    assert.equal(await p.evaluate(()=>window.CrownlightChartTiers.getStatus().selected),'STANDARD',
     'Standard cannot mount Professional');
    assert.equal(await p.locator('select[data-cl-layout]').isDisabled(),true);
   }else{
    assert.equal(await p.locator('select[data-cl-layout]').isDisabled(),false,
     'Professional-only layout selector must be operable');
    await p.locator('select[data-cl-layout]').selectOption('PRICE_FOCUS');
   }
   await p.setViewportSize({width:390,height:844});
   const area=await p.locator('.cl-chart-tier-bar select').evaluate(el=>{
    const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,viewport:innerWidth};
   });
   assert(area.left>=-3&&area.right<=area.viewport+4&&area.width>150,
    'Mobile tier selector must be within viewport');
   await p.locator('.cl-chart-tier-bar select').focus();
   assert.equal(await p.locator('.cl-chart-tier-bar select').evaluate(el=>document.activeElement===el),true);
   await p.setViewportSize({width:1440,height:900});
   // Legitimate browser must restore its own private settings; tests do not
   // access another user's workspace via admin or shared elevated sessions.
   const endpoint=async(method,payload)=>p.evaluate(async ({method,payload})=>{
    const client=await window.getSupabaseClient();
    const {data}=await client.auth.getSession();
    const r=await fetch('/api/chart-workspace',{method,headers:{authorization:'Bearer '+data.session.access_token,
      ...(payload?{'content-type':'application/json'}:{})},body:payload?JSON.stringify(payload):undefined});
    return {status:r.status,body:await r.json()};
   },{method,payload});
   const initial=await endpoint('GET');
   assert.equal(initial.status,200);assert.equal(initial.body.updatedAt,null);
   const study=s.tier==='STANDARD'?'MA':'EMA';
   const layout=s.tier==='STANDARD'?'SIDE_BY_SIDE':'PRICE_FOCUS';
   const first=await endpoint('PUT',{selected:s.tier,layout,sync:true,studies:[study],
     drawings:[],expectedUpdatedAt:null});
   assert.equal(first.status,200,'Save with valid new-user CAS expected '+s.tier+' got '+JSON.stringify(first.body));
   assert(first.body.updatedAt);
   const stored=await endpoint('GET');
   assert.equal(stored.status,200);
   assert.equal(stored.body.updatedAt,first.body.updatedAt);
   assert.deepEqual(stored.body.workspace.studies,[study]);
   assert.equal(stored.body.workspace.layout,layout);
   // Both actual Chromium tabs use the same signed-in member identity and
   // obtain one revision; stale tab MUST receive 409, never overwrite.
   const p2=await c.newPage();
   await p2.goto(site+'/simulator.html',{waitUntil:'domcontentloaded',timeout:30000});
   await p2.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:25000});
   const get2=await p2.evaluate(async()=>{
    const {data}=await(await window.getSupabaseClient()).auth.getSession();
    const r=await fetch('/api/chart-workspace',{headers:{authorization:'Bearer '+data.session.access_token}});
    return {status:r.status,body:await r.json()};
   });
   assert.equal(get2.status,200);
   assert.equal(get2.body.updatedAt,stored.body.updatedAt);
   const later=await endpoint('PUT',{selected:s.tier,layout,sync:false,studies:[study,'RSI'],
     drawings:[],expectedUpdatedAt:stored.body.updatedAt});
   assert.equal(later.status,200);
   const stale=await p2.evaluate(async ({expectedUpdatedAt,selected,layout,study})=>{
    const {data}=await(await window.getSupabaseClient()).auth.getSession();
    const r=await fetch('/api/chart-workspace',{method:'PUT',
      headers:{authorization:'Bearer '+data.session.access_token,'content-type':'application/json'},
      body:JSON.stringify({selected,layout,sync:true,studies:[study,'ATR'],drawings:[],expectedUpdatedAt})});
    return {status:r.status,body:await r.json()};
   },{expectedUpdatedAt:stored.body.updatedAt,selected:s.tier,layout,study});
   assert.equal(stale.status,409,'Concurrent stale Chromium tab must be denied');
   assert.equal(stale.body.error,'WORKSPACE_CHANGED');
   const latest=await endpoint('GET');
   assert.equal(latest.body.updatedAt,later.body.updatedAt);
   assert.deepEqual(latest.body.workspace.studies,[study,'RSI'],
    'Stale tab must not overwrite more recent workspace changes');
   await p.reload({waitUntil:'domcontentloaded'});
   await p.waitForFunction(()=>window.CrownlightWorkspaceV2?.getStatus?.().memberVerified===true,null,{timeout:35000});
   assert.equal(await p.locator('input[data-cl-studies]').inputValue(),study+', RSI');
   assert.equal(await p.locator('input[data-cl-sync]').isChecked(),false);
   assert.equal(await p.locator('select[data-cl-layout]').inputValue(),layout);
   assert.deepEqual(payments,[],'QA browser must not spend Lumens or create payments');
   assert.equal(errors.length,0,'Unhandled browser errors');
   console.log('PASS REAL QA CHROMIUM '+s.tier+' permitted controls, mobile/keyboard, 2-tab CAS 409, own saved layout+studies reload, no payments');
  }finally{await c.close()}
 }
 console.log('RESULT '+JSON.stringify({accepted:true,scope:'REAL_GOTRUE_STANDARD_AND_PROFESSIONAL_CHROMIUM',
  twoTabConflict:true,restoration:true,mobile:true,liveCharge:false,founderBillingTested:false,
  captchaFormTested:false,at:new Date().toISOString()}));
}finally{
 if(browser)await browser.close().catch(()=>{});
 if(ids.length){
  const clean=await request('finish',{ids});
  console.log('CLEANUP '+JSON.stringify({ok:clean.body.ok===true,deleted:clean.body.deleted||0,
   failed:clean.body.failed||0}));
  assert(clean.status===200&&clean.body.ok===true&&clean.body.deleted===ids.length,
   'Temporary QA account cleanup did not complete');
 }
}
