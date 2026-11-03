/* Real local Chromium rendering of the Advanced member surface.
 * Transport and entitlement responses are deterministic fixtures. This is not
 * genuine member, production, editorial, billing, or release acceptance.
 */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

const indicators=['EMA','VWAP','RSI','MACD','ATR','BOLL'];
const series=Array.from({length:21},(_,i)=>({timestamp:(i+1)*1000,close:100+i*.25,volume:1000+i*25}));
const result={
 edition:'ADVANCED',
 evidence:{
  indicators:indicators.map((name,i)=>({name,value:100+i/10,method:name+' completed-bar method'})),
  completedSeries:series
 },
 hypotheticalRisk:[{shares:50,plannedRisk:100}],
 limitation:'Fictional completed observations only. No investment recommendation or official mastery.'
};

const installedChrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],
 ...(existsSync(installedChrome)?{executablePath:installedChrome}:{})});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 let allowed=true,recalculations=0,disposed=0;
 await page.setContent('<!doctype html><html lang="en"><body><main><div id="player-edition-exercise" hidden></div></main></body></html>');
 await page.evaluate(({result})=>{
  const chartInstances=[];
  globalThis.__fixture={result,chartInstances,allowed:true,recalculations:0,disposed:0};
  globalThis.CrownlightECharts={load:async()=>({
   init(element){
    const chart={element,option:null,dispose(){globalThis.__fixture.disposed++},setOption(option){this.option=option}};
    chartInstances.push(chart);return chart;
   },
   connect(charts){globalThis.__fixture.connected=charts.length}
  })};
  globalThis.fetch=async(_url,options)=>{
   const body=JSON.parse(options.body);
   globalThis.__fixture.recalculations++;
   if(!globalThis.__fixture.allowed||body.edition!=='ADVANCED')return new Response(JSON.stringify({ok:false}),{status:403,headers:{'content-type':'application/json'}});
   return new Response(JSON.stringify({ok:true,edition:'ADVANCED',result:globalThis.__fixture.result}),{status:200,headers:{'content-type':'application/json'}});
  };
 },{result});
 await page.addScriptTag({path:'assets/js/learning-lab-edition-panel-v1.js'});
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.mount({
  host:document.getElementById('player-edition-exercise'),userId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  token:'offline_advanced_fixture',alive:()=>true,labId:'LAB-ADV-FICTIONAL'
 }));
 const host=page.locator('#player-edition-exercise');
 await host.locator('h2', {hasText:'Advanced indicator study'}).waitFor();
 await page.waitForFunction(()=>globalThis.__fixture.chartInstances.length===2);
 assert.equal(await host.isHidden(),false);
 assert.equal(await host.locator('table').count(),2);
 assert.equal(await host.locator('caption').allTextContents().then(x=>x.includes('Completed fictional data — computed by the server')),true);
 assert.deepEqual(await host.locator('table').first().locator('tbody th').allTextContents(),indicators);
 assert.equal(await host.locator('table').nth(1).locator('tbody tr').count(),21);
 assert.equal(await host.locator('[aria-label="Completed fictional close chart"]').count(),1);
 assert.equal(await host.locator('[aria-label="Completed fictional volume chart"]').count(),1);
 assert.equal(await page.evaluate(()=>globalThis.__fixture.connected),2);
 assert.equal(await page.evaluate(()=>globalThis.__fixture.chartInstances.every(x=>x.option?.aria?.enabled===true)),true);
 assert.equal(await host.locator('[role="status"]').textContent(),'Server-approved educational calculation. No member progress was changed.');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'Mobile surface must not overflow the viewport');

 await host.getByRole('button',{name:'Recalculate fictional example'}).focus();
 assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Recalculate fictional example');
 await host.getByRole('button',{name:'Recalculate fictional example'}).click();
 await host.getByRole('status').filter({hasText:'Calculation completed'}).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__fixture.recalculations),4,'Three rejected higher editions plus one Advanced recalculation');
 assert.ok(await page.evaluate(()=>globalThis.__fixture.disposed)>=2,'Recalculation must dispose linked chart instances');

 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.scrub());
 assert.equal(await host.isHidden(),true);
 assert.equal(await host.locator('*').count(),0);

 await page.evaluate(()=>{globalThis.__fixture.allowed=false});
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.mount({
  host:document.getElementById('player-edition-exercise'),userId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  token:'denied_fixture',alive:()=>true,labId:'LAB-ADV-FICTIONAL'
 }));
 assert.equal(await host.isHidden(),true,'Denied member response must not reveal premium UI');
 assert.equal(await host.locator('*').count(),0);
 allowed=false;recalculations=await page.evaluate(()=>globalThis.__fixture.recalculations);disposed=await page.evaluate(()=>globalThis.__fixture.disposed);
 await context.close();
 console.log(`PASS MOCKED Chromium Advanced member surface: six studies, ${series.length} completed observations, linked accessible charts, mobile layout, recalculation, denial, and identity scrub (requests=${recalculations}, disposed=${disposed}, allowed=${allowed})`);
 console.log('ACCEPTANCE_SCOPE=MOCKED_BROWSER production_member_auth=false production_records_untouched=true');
}finally{await browser.close()}
