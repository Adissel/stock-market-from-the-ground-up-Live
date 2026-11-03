/* Browser acceptance candidate: two simulated authenticated identities,
 * genuine Chromium DOM controls and deterministic fixture transport.
 * NOT genuine production member acceptance or an independent release signoff.
 */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],
 ...(existsSync(chrome)?{executablePath:chrome}:{})});
try {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.setContent('<!doctype html><html lang="en"><body><main><section id="player-edition-exercise" hidden></section></main></body></html>');
 await page.evaluate(()=>{
  const series=Array.from({length:21},(_,i)=>({timestamp:(i+1)*1000,close:100+i*.2,volume:100+i*5}));
  const studies=['EMA','VWAP','RSI','MACD','ATR','BOLL'].map((name,i)=>({name,value:i+1,method:'Mocked completed-bar study'}));
  const state={allowed:{session_a:true,session_b:true},store:{},history:[],
   chartCount:0,disposed:0};
  globalThis.__professionalWorkspaceFixture=state;
  globalThis.CrownlightECharts={load:async()=>({
   init(){state.chartCount++;return{dispose(){state.disposed++},setOption(){}}},connect(){}
  })};
  const response=(data,status=200)=>new Response(JSON.stringify(data),
   {status,headers:{'content-type':'application/json'}});
  globalThis.fetch=async(raw,opts={})=>{
   const url=new URL(String(raw),'https://local.test');
   const method=opts?.method||'GET',token=String(opts?.headers?.authorization||'').replace('Bearer ','');
   const row=state.store[token],allowed=state.allowed[token];
   const body=method==='POST'?JSON.parse(opts.body):null;
   state.history.push({path:url.pathname,method,token,
    expected:body?.expectedRevision,edition:body?.edition});
   if(!allowed)return response({ok:false,error:'Entitlement revoked'},403);
   if(url.pathname==='/api/learning-lab-edition-exercise'){
    if(body.edition!=='PROFESSIONAL')return response({ok:false},403);
    const budget=body.payload.riskCases[0].riskBudget;
    const result={edition:'PROFESSIONAL',
     evidence:{indicators:studies,completedSeries:series},
     frames:[
      {label:'Completed 5-bar group 1',close:101,changeFromPrior:null,
       interpretation:'No future outcome inferred'},
      {label:'Completed 5-bar group 2',close:102,changeFromPrior:1,
       interpretation:'No future outcome inferred'}],
     hypotheticalRisk:[
      {perShareRisk:2,shares:25,plannedRisk:50,exposure:1000,limitation:'Stops may slip.'},
      {perShareRisk:1,shares:25,plannedRisk:25,exposure:1000,limitation:'Stops may slip.'}],
     remediation:[],uncertaintyEvidence:[],
     limitation:'Private risk budget '+budget+'; fictional training only'};
    return response({ok:true,edition:'PROFESSIONAL',result,officialGrade:false});
   }
   if(url.pathname==='/api/learning-lab-edition-workspace'){
    if(method==='GET'){
     if(!row)return response({ok:true,found:false,workspace:null});
     return response({ok:true,found:true,workspace:structuredClone(row)});
    }
    if(body.family!=='lab'||body.edition!=='PROFESSIONAL'||
       body.caseKey!=='F1-C02-L01')return response({ok:false},400);
    if((row?.revision||0)!==body.expectedRevision)
     return response({ok:false,error:'revision conflict'},409);
    const next={revision:body.expectedRevision+1,
     summary:{edition:'PROFESSIONAL',evidence:{indicators:studies,completedSeries:series},
      frames:[],hypotheticalRisk:[
       {perShareRisk:2,shares:25,plannedRisk:50,exposure:1000,limitation:'Stops may slip.'},
       {perShareRisk:1,shares:25,plannedRisk:25,exposure:1000,limitation:'Stops may slip.'}],
      limitation:'Private risk budget '+body.payload.riskCases[0].riskBudget},
     updated_at:'2026-11-03T18:00:00Z'};
    state.store[token]=next;
    return response({ok:true,workspace:{id:token==='session_a'?1:2,
     revision:next.revision,updated_at:next.updated_at},officialGrade:false});
   }
   throw Error('Unexpected transport '+url.pathname);
  };
 });
 await page.addScriptTag({path:'assets/js/learning-lab-edition-panel-v1.js'});
 const host=page.locator('#player-edition-exercise');
 const mount=async(token,id)=>page.evaluate(({token,id})=>
  globalThis.CrownlightEditionExercisePanelV1.mount({
   host:document.getElementById('player-edition-exercise'),userId:id,
   token,alive:()=>true,labId:'F1-C02-L01',mode:'practice'
  }),{token,id});
 await mount('session_a','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
 await host.getByRole('heading',{name:'Professional decision study'}).waitFor();
 const budget=host.getByRole('spinbutton',{name:'Fictional risk budget in dollars'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
 await host.getByRole('button',{name:'Save private study'}).click();
 await host.getByRole('status').filter({hasText:'Saved private study revision 1'}).waitFor();
 await budget.fill('140');
 await host.getByRole('button',{name:'Recalculate fictional example'}).click();
 await host.getByRole('status').filter({hasText:'Calculation completed'}).waitFor();
 await host.getByRole('button',{name:'Save private study'}).click();
 await host.getByRole('status').filter({hasText:'Saved private study revision 2'}).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__professionalWorkspaceFixture.store.session_a.revision),2);
 assert.match(await host.locator('.gu-edition-exercise-output').textContent(),/Private risk budget 140/);
 // Simulate a separate successful session update and verify CAS protection.
 await page.evaluate(()=>{
  const item=globalThis.__professionalWorkspaceFixture.store.session_a;
  item.revision=3;item.summary.limitation='Private risk budget 250; saved by second session';
 });
 await host.getByRole('button',{name:'Save private study'}).click();
 await host.getByRole('status').filter({hasText:'This study changed in another session'}).waitFor();
 assert.equal(await host.getByRole('button',{name:'Save private study'}).isDisabled(),true);
 assert.equal(await page.evaluate(()=>globalThis.__professionalWorkspaceFixture.store.session_a.revision),3);
 await host.getByRole('button',{name:'Restore private study'}).click();
 await host.getByRole('status').filter({hasText:'Restored private study revision 3'}).waitFor();
 assert.match(await host.locator('.gu-edition-exercise-output').textContent(),/Private risk budget 250/);
 assert.equal(await host.getByRole('button',{name:'Save private study'}).isDisabled(),true,
  'Restored summary and stale risk input may not be silently mixed');
 await host.getByRole('button',{name:'Recalculate fictional example'}).click();
 await host.getByRole('status').filter({hasText:'Calculation completed'}).waitFor();
 assert.equal(await host.getByRole('button',{name:'Save private study'}).isEnabled(),true);
 assert.match(await host.locator('.gu-edition-exercise-output').textContent(),/Private risk budget 140/);
 // Switching accounts scrubs all previous panel output before B can restore.
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.scrub());
 assert.equal(await host.isHidden(),true);
 await mount('session_b','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
 await host.getByRole('heading',{name:'Professional decision study'}).waitFor();
 await host.getByRole('button',{name:'Restore private study'}).click();
 await host.getByRole('status').filter({hasText:'No saved private study exists'}).waitFor();
 assert.doesNotMatch(await host.textContent(),/Private risk budget 250/);
 await host.getByRole('button',{name:'Save private study'}).click();
 await host.getByRole('status').filter({hasText:'Saved private study revision 1'}).waitFor();
 assert.deepEqual(await page.evaluate(()=>{
  const s=globalThis.__professionalWorkspaceFixture.store;
  return [s.session_a.revision,s.session_b.revision]
 }),[3,1]);
 // Downgrade/revocation hides the private UI and preserves the other account.
 await page.evaluate(()=>{globalThis.__professionalWorkspaceFixture.allowed.session_b=false});
 await host.getByRole('button',{name:'Restore private study'}).click();
 await host.waitFor({state:'hidden'});
 assert.equal(await host.locator('*').count(),0);
 assert.equal(await page.evaluate(()=>globalThis.__professionalWorkspaceFixture.store.session_a.revision),3);
 assert.equal(await page.evaluate(()=>globalThis.__professionalWorkspaceFixture.history.every(
  x=>!['payment_intent','orders','grades'].some(v=>x.path.includes(v)))),true);
 await context.close();
 console.log('PASS MOCKED Chromium Professional dual-account workspace: save, risk variation, CAS conflict, restore, identity scrub, second-account isolation, downgrade denial, mobile');
 console.log('ACCEPTANCE_SCOPE=MOCKED_BROWSER genuine_member_auth=false production_member_records_untouched=true');
}finally{await browser.close()}
