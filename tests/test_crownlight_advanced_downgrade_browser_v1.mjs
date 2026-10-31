/* Free local Chromium acceptance: real source-based workspace projection,
 * mocked authenticated transport, NO production credentials or member writes.
 * Genuine signed-in production acceptance remains separately required.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {normalizeWorkspace} from '../functions/api/chart-workspace.js';
const origin='https://advanced-restore-fixture.test';
const raw={version:2,selected:'PROFESSIONAL',layout:'PRICE_FOCUS',sync:false,
 studies:['EMA','RSI'],drawings:[],drawingContext:null,drawingSets:[]};
const entitlement={tier:'ADVANCED',allowed:['STANDARD','ADVANCED']};
const revision='2026-10-30T15:11:58.748874Z';
let snapshot=JSON.stringify(raw), reads=0, deniedWrites=0;
const project=()=>normalizeWorkspace(raw,entitlement);
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1280,height:780}});
 const page=await context.newPage();
 await page.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.origin!==origin)return route.abort();
  if(url.pathname==='/studio'){
   return route.fulfill({contentType:'text/html',
    body:'<!doctype html><html lang="en"><body><div id="cl-chart-tier-switcher"></div></body></html>'});
  }
  if(url.pathname==='/api/chart-workspace'){
   assert.equal(request.headers().authorization,'Bearer offline_qa_fixture');
   if(request.method()==='GET'){
    reads++;
    return route.fulfill({contentType:'application/json',headers:{'cache-control':'private, no-store'},
     body:JSON.stringify({ok:true,tier:'ADVANCED',workspace:project(),updatedAt:revision})});
   }
   if(request.method()==='PUT'){
    deniedWrites++;
    const attempt=request.postDataJSON();
    assert.equal(attempt.expectedUpdatedAt,revision);
    assert.equal(attempt.selected,'ADVANCED');
    return route.fulfill({status:409,contentType:'application/json',
     body:JSON.stringify({ok:false,error:'PREMIUM_WORKSPACE_PRESERVED',savedTier:'PROFESSIONAL'})});
   }
   throw Error('Unexpected workspace method '+request.method());
  }
  return route.abort();
 });
 async function mount(){
  await page.evaluate(()=>{
   window.getSupabaseClient=async()=>({auth:{getSession:async()=>({data:{session:{
    user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},access_token:'offline_qa_fixture'}}})}});
   const state={verified:true,tier:'ADVANCED',allowed:['STANDARD','ADVANCED'],selected:'STANDARD',symbol:'REPLAY',source:'FICTIONAL'};
   window.CrownlightChartTiers={
    getStatus:()=>({...state}),
    getInstances:()=>[],
    getRevealedBars:()=>[],
    balancePanels(){},
    choose:async selected=>{
     if(!state.verified||!state.allowed.includes(selected))return false;
     state.selected=selected;
     window.dispatchEvent(new CustomEvent('crownlight:tier-mounted',{detail:{tier:selected}}));
     return true;
    }
   };
  });
  await page.addScriptTag({path:'assets/js/crownlight-workspace-v2.js'});
  await page.locator('[data-cl-restore]').waitFor();
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('crownlight:tier-permission',{detail:{verified:true,tier:'ADVANCED'}})));
  await page.waitForFunction(()=>{
   const w=window.CrownlightWorkspaceV2?.getStatus();
   return w?.memberVerified===true&&w.selected==='ADVANCED'&&window.CrownlightChartTiers.getStatus().selected==='ADVANCED';
  },null,{timeout:10000});
  assert.equal(await page.locator('[data-cl-studies]').inputValue(),'EMA, RSI');
  assert.equal(await page.locator('[data-cl-sync]').isChecked(),false);
  assert.equal(await page.locator('[data-cl-layout]').isDisabled(),true,
   'Professional-only layout control must remain locked under Advanced');
  assert.equal(await page.locator('[data-cl-layout]').inputValue(),'SIDE_BY_SIDE');
  assert.equal(await page.evaluate(()=>window.CrownlightChartTiers.choose('PROFESSIONAL')),false);
  assert.equal(await page.evaluate(()=>window.CrownlightChartTiers.getStatus().selected),'ADVANCED');
  assert.equal(await page.locator('.cl-workspace-status').textContent(),'Private workspace loaded.');
 }
 await page.goto(origin+'/studio');await mount();
 assert.equal(project().selected,'ADVANCED','Actual server normalization must project into allowed Advanced');
 assert.equal(JSON.stringify(raw),snapshot,'Original Professional workspace must be immutable on read');
 await page.locator('[data-cl-save]').click();
 await page.waitForFunction(()=>document.querySelector('.cl-workspace-status')?.textContent.includes('saved higher-tier workspace is protected'),null,{timeout:10000});
 assert.equal(deniedWrites,1,'Protected save must reject downgraded overwrite');
 assert.equal(JSON.stringify(raw),snapshot);
 await page.reload();await mount();
 assert.equal(reads,2,'Refresh must read the same private workspace again');
 assert.equal(JSON.stringify(raw),snapshot);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('crownlight:member-changed')));
 assert.equal(await page.locator('[data-cl-studies]').inputValue(),'');
 assert.equal(await page.evaluate(()=>window.CrownlightWorkspaceV2.getStatus().memberVerified),false);
 assert.equal(JSON.stringify(raw),snapshot);
 await page.close();await context.close();
 console.log('PASS MOCKED Chromium Advanced restored and reloaded from a protected saved Professional workspace; Professional layout locked; saved EMA/RSI retained; higher-tier overwrite denied; account change scrubbed private state');
 console.log('ACCEPTANCE_SCOPE=MOCKED_BROWSER real_sources=true production_member_auth=false live_member_state_untouched=true');
}finally{await browser.close()}
