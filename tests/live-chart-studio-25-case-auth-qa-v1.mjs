/* Chart Studio authenticated, strictly read-only 25-case release regression.
 * Uses existing James_Test encrypted GitHub Secrets + GoTrue password grant.
 * No LIVE/TEST payments, no wallet debit, no member workspace modifications.
 * End-user CAPTCHA UI is intentionally outside this test.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const root='https://stock-market-from-the-ground-up-d1r.pages.dev';
const expectedId='f42f9301-18e6-43a3-8531-32d371fd22c1';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
if(!email||!password)throw Error('BLOCKED_AUTH: Existing QA secrets unavailable');
const conf=readFileSync('config.js','utf8');
const supabaseUrl=conf.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const anon=conf.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(supabaseUrl&&anon,'Existing public Auth config missing');
const seen=[];
async function case25(name,fn){
 await fn();
 seen.push(name);
 console.log('QA25 '+String(seen.length).padStart(2,'0')+' PASS '+name);
}
const auth=await fetch(supabaseUrl+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:anon,'content-type':'application/json'},
 body:JSON.stringify({email,password}),signal:AbortSignal.timeout(24000)
});
const authBody=await auth.json().catch(()=>({}));
await case25('Genuine GoTrue password grant accepted',()=>{
 assert.equal(auth.status,200);
 assert(authBody.access_token&&authBody.refresh_token);
});
await case25('Verified exact QA member identity',()=>assert.equal(authBody.user?.id,expectedId));
const req=async(path,options={})=>{
 const r=await fetch(root+path,{cache:'no-store',signal:AbortSignal.timeout(23000),...options});
 return {status:r.status,headers:r.headers,data:await r.json().catch(()=>({}))};
};
const bearer={authorization:'Bearer '+authBody.access_token};
const tier=await req('/api/chart-tier-access',{headers:bearer});
await case25('Authenticated chart tier endpoint HTTP 200',()=>assert.equal(tier.status,200));
await case25('Private entitlement response disables caching',()=>{
 assert.match(tier.headers.get('cache-control')||'',/private/);
 assert.match(tier.headers.get('cache-control')||'',/no-store/);
});
await case25('Actual server-authorized tier is Advanced',()=>{
 assert.equal(tier.data.eligible,true);assert.equal(tier.data.tier,'ADVANCED');
});
await case25('Server enforces exactly Standard and Advanced',()=>{
 assert.deepEqual(tier.data.allowed,['STANDARD','ADVANCED']);
});
const w=await req('/api/chart-workspace',{headers:bearer});
await case25('Own private workspace API HTTP 200',()=>{
 assert.equal(w.status,200);assert.equal(w.data.ok,true);
});
await case25('Private workspace response disables public cache',()=>{
 assert.match(w.headers.get('cache-control')||'',/private/);
 assert.match(w.headers.get('cache-control')||'',/no-store/);
});
await case25('Stored Professional workspace projects safely to Advanced',()=>{
 assert.equal(w.data.workspace?.selected,'ADVANCED');assert.equal(w.data.workspace?.layout,'SIDE_BY_SIDE');
});
await case25('Existing EMA/RSI preferences are intact',()=>assert.deepEqual(w.data.workspace?.studies,['EMA','RSI']));
await case25('Original sync preference remains false',()=>{
 assert.equal(w.data.workspace?.sync,false);assert(w.data.updatedAt);
});
const guest=await req('/api/chart-workspace');
await case25('Anonymous private workspace access denied',()=>assert.equal(guest.status,401));
const forged=await req('/api/chart-workspace?user_id=11111111-1111-4111-8111-111111111111&member_id=11111111-1111-4111-8111-111111111111',{headers:bearer});
await case25('Query-driven cross-member workspace access ignored',()=>{
 assert.equal(forged.status,200);assert.deepEqual(forged.data.workspace,w.data.workspace);
 assert.equal(forged.data.updatedAt,w.data.updatedAt);
});
const hostile=await req('/api/chart-workspace',{method:'PUT',headers:{...bearer,origin:'https://attacker.invalid','content-type':'application/json'},
 body:JSON.stringify({selected:'PROFESSIONAL',expectedUpdatedAt:w.data.updatedAt})});
await case25('Cross-origin private workspace PUT denied before persistence',()=>assert.equal(hostile.status,403));
const unversioned=await req('/api/chart-workspace',{method:'PUT',headers:{...bearer,origin:root,'content-type':'application/json'},
 body:JSON.stringify({selected:'PROFESSIONAL'})});
await case25('Revision-free overwrite is denied HTTP 409',()=>assert.equal(unversioned.status,409));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let protectedWrites=[],browserErrors=[];
try{
 const c=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
 const p=await c.newPage();
 p.on('pageerror',x=>browserErrors.push(String(x.message).slice(0,130)));
 p.on('request',x=>{
  try{
   const url=new URL(x.url());
   if(url.origin===root&&/^\/api\/(?:chart-workspace|chart-mixed|chart-cash|stripe|member-sparks|wallet|lumen|founding)/.test(url.pathname)
    &&!['GET','HEAD','OPTIONS'].includes(x.method()))protectedWrites.push(x.method()+' '+url.pathname);
  }catch{}
 });
 await p.goto(root+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
 await p.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:20000});
 const b=await p.evaluate(async tokens=>{
  const sb=await window.getSupabaseClient();
  const {data,error}=await sb.auth.setSession(tokens);
  return {ok:!error&&!!data?.session?.access_token,userId:data?.user?.id};
 },{access_token:authBody.access_token,refresh_token:authBody.refresh_token});
 await case25('Real GoTrue browser session established with correct identity',()=>{
  assert(b.ok);assert.equal(b.userId,expectedId);
 });
 await p.goto(root+'/simulator.html?studio=ADVANCED',{waitUntil:'domcontentloaded',timeout:30000});
 await p.waitForFunction(()=>window.CrownlightChartTiers?.getStatus?.().verified===true&&
  window.CrownlightWorkspaceV2?.getStatus?.().memberVerified===true,null,{timeout:35000});
 await case25('Actual Chart Studio browser verifies Advanced entitlement',async()=>{
  assert.equal(await p.evaluate(()=>window.CrownlightChartTiers.getStatus().tier),'ADVANCED');
 });
 await p.evaluate(()=>window.CrownlightChartTiers.choose('PROFESSIONAL'));
 await case25('Professional browser choice blocked for Advanced member',async()=>{
  assert.equal(await p.evaluate(()=>window.CrownlightChartTiers.getStatus().selected),'ADVANCED');
  assert.equal(await p.locator('.cl-chart-tier-bar option[value="PROFESSIONAL"]').evaluate(el=>el.disabled),true);
 });
 await case25('Professional-only layout control disabled',async()=>{
  assert.equal(await p.locator('select[data-cl-layout]').isDisabled(),true);
 });
 await case25('Member controls restored from actual saved studies and sync',async()=>{
  assert.equal(await p.locator('input[data-cl-studies]').inputValue(),'EMA, RSI');
  assert.equal(await p.locator('input[data-cl-sync]').isChecked(),false);
 });
 const source=p.locator('#sim-mode-csv'),load=p.locator('#sim-load-fictional');
 await source.click();
 if(!await load.isVisible()){
  const details=p.locator('#cl-replay-import details.cl-workbench-import');
  if(!await details.evaluate(e=>e.open))await details.locator('summary').click();
 }
 await case25('Fictional starter available through visible user controls',async()=>{
  assert.equal(await load.isVisible(),true);assert.equal(await load.isEnabled(),true);
 });
 await load.click();
 await p.waitForFunction(()=>window.CrownlightChartTiers?.getInstances?.().some(x=>x.chart?.getDataList?.().length>=2),null,{timeout:30000});
 await case25('Real KLineChart displays fictional bars in one Advanced pane',async()=>{
  const v=await p.evaluate(()=>{
   const x=window.CrownlightChartTiers;
   return {count:x.getInstances().length,bars:x.getInstances()[0].chart.getDataList().length};
  });
  assert.equal(v.count,1);assert(v.bars>=2);
 });
 await p.setViewportSize({width:390,height:844});
 await case25('Mobile 390px Studio picker stays in viewport and keyboard-usable',async()=>{
  const result=await p.locator('.cl-chart-tier-bar select').evaluate(el=>{
   const box=el.getBoundingClientRect();
   return {x:box.left,right:box.right,width:box.width,viewport:innerWidth};
  });
  assert(result.width>150&&result.x>=-4&&result.right<=result.viewport+4);
  await p.locator('.cl-chart-tier-bar select').focus();
  assert.equal(await p.locator('.cl-chart-tier-bar select').evaluate(el=>document.activeElement===el),true);
 });
 await p.setViewportSize({width:1440,height:900});
 await p.reload({waitUntil:'domcontentloaded',timeout:30000});
 await p.waitForFunction(()=>window.CrownlightWorkspaceV2?.getStatus?.().memberVerified===true,null,{timeout:35000});
 const reload=await req('/api/chart-workspace',{headers:bearer});
 await case25('Reload preserves private revision and no protected browser writes',async()=>{
  assert.equal(reload.data.updatedAt,w.data.updatedAt);
  assert.deepEqual(reload.data.workspace,w.data.workspace);
  assert.equal(protectedWrites.length,0);
  assert.deepEqual(browserErrors,[]);
 });
 await c.close();
}finally{await browser.close()}
assert.equal(seen.length,25,'All twenty-five real QA scenarios must finish');
console.log('QA25 SUMMARY '+JSON.stringify({passed:seen.length,total:25,
 classification:'REAL_AUTH_BROWSER_AND_READ_ONLY_API',livePaidCharges:0,lumenDebits:0,
 humanCaptchaLoginValidated:false,atUtc:new Date().toISOString()}));
