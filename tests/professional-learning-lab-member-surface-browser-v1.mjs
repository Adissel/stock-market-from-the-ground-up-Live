/* Local Chromium rendering for the server-gated Professional member surface.
 * Deterministic transport fixtures; not genuine member or release acceptance.
 */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

const series=Array.from({length:21},(_,i)=>({timestamp:(i+1)*1000,close:100+i*.2,volume:800+i*20}));
const indicators=['EMA','VWAP','RSI','MACD','ATR','BOLL'].map((name,i)=>({name,value:50+i,method:name+' completed fictional method'}));
const result={edition:'PROFESSIONAL',evidence:{indicators,completedSeries:series},
 frames:[
  {label:'Completed 5-bar group 1',close:100.8,changeFromPrior:null,interpretation:'A completed frame is context evidence, not a future-price signal.'},
  {label:'Completed 5-bar group 2',close:101.8,changeFromPrior:1,interpretation:'A completed frame is context evidence, not a future-price signal.'}
 ],
 remediation:[{sequence:['CANDLE_READING','EMA_CONTEXT']}],
 uncertaintyEvidence:[
  'Completed fictional observations do not reveal the next outcome.',
  'Planned stop risk excludes gaps, slippage, fees and uncertain execution.',
  'Indicator agreement is descriptive evidence, not independent confirmation of a trade.'
 ],
 hypotheticalRisk:[{shares:25,perShareRisk:2,plannedRisk:50,exposure:1000,limitation:'A stop may slip.'},
 {shares:25,perShareRisk:1,plannedRisk:25,exposure:1000,limitation:'A stop may slip.'}],
 limitation:'Fictional decision study only; no order is placed.'};
const installedChrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(existsSync(installedChrome)?{executablePath:installedChrome}:{})});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await page.setContent('<!doctype html><html lang="en"><body><div id="player-edition-exercise" hidden></div></body></html>');
 await page.evaluate(result=>{
  globalThis.__pro={result,charts:[],requests:0};
  globalThis.CrownlightECharts={load:async()=>({init(element){const c={element,dispose(){},setOption(option){this.option=option}};globalThis.__pro.charts.push(c);return c},connect(){}})};
  globalThis.fetch=async(_url,options)=>{globalThis.__pro.requests++;const body=JSON.parse(options.body);globalThis.__pro.lastBody=body;
   if(body.edition!=='PROFESSIONAL')return new Response('{}',{status:403});
   return new Response(JSON.stringify({ok:true,edition:'PROFESSIONAL',result:globalThis.__pro.result}),{status:200,headers:{'content-type':'application/json'}})};
 },result);
 await page.addScriptTag({path:'assets/js/learning-lab-edition-panel-v1.js'});
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.mount({host:document.getElementById('player-edition-exercise'),
  userId:'11111111-1111-4111-8111-111111111111',token:'professional_fixture',alive:()=>true,labId:'LAB-PRO-FICTIONAL'}));
 const host=page.locator('#player-edition-exercise');
 await host.getByRole('heading',{name:'Professional decision study'}).waitFor();
 await page.waitForFunction(()=>globalThis.__pro.charts.length===2);
 assert.equal(await host.locator('caption').filter({hasText:'Completed timeframe decision evidence'}).count(),1);
 assert.equal(await host.locator('caption').filter({hasText:'Completed fictional observations'}).count(),1);
 assert.equal(await host.getByRole('region',{name:'Reviewed prerequisite practice route'}).getByText(/CANDLE_READING.*EMA_CONTEXT/).count(),1);
 assert.equal(await host.getByRole('region',{name:'Professional uncertainty evidence'}).locator('li').count(),3);
 assert.equal(await host.getByText(/Illustrative whole shares: 25/).count(),1);
 assert.equal(await host.getByRole('table',{name:'Fictional stop-risk comparison'}).locator('tbody tr').count(),2);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
 await host.getByRole('spinbutton',{name:'Fictional risk budget in dollars'}).fill('120');
 await host.getByRole('button',{name:'Recalculate fictional example'}).click();
 await host.getByRole('status').filter({hasText:'Calculation completed'}).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__pro.requests),3,'Enterprise denial, Professional approval and Professional recalculation');
 assert.deepEqual(await page.evaluate(()=>globalThis.__pro.lastBody.payload.riskCases.map(x=>x.riskBudget)),[120,120]);
 await host.getByRole('spinbutton',{name:'Fictional risk budget in dollars'}).fill('0');
 await host.getByRole('button',{name:'Recalculate fictional example'}).click();
 await host.getByRole('status').filter({hasText:'Enter a fictional risk budget'}).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__pro.requests),3,'Invalid budget must not generate an API call');
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.scrub());
 assert.equal(await host.isHidden(),true);assert.equal(await host.locator('*').count(),0);
 await context.close();
 console.log('PASS MOCKED Chromium Professional member surface: completed frames, reviewed prerequisites, uncertainty boundaries, risk, linked charts, mobile layout and identity scrub');
 console.log('ACCEPTANCE_SCOPE=MOCKED_BROWSER production_member_auth=false production_records_untouched=true');
}finally{await browser.close()}
