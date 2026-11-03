/* MOCKED Chromium Enterprise member UI source acceptance. Actual Cloudflare
 * access rules are covered by independent API tests. NOT signed-in QA.
 */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],
 ...(existsSync(chrome)?{executablePath:chrome}:{})});
try{
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const page=await ctx.newPage();
 await page.setContent('<!doctype html><html lang="en"><body><main><div id="player-edition-exercise" hidden></div></main></body></html>');
 await page.evaluate(()=>{
  const st={allowed:true,navigation:true,attempts:[],savedGrades:0};
  globalThis.__journeyFixture=st;
  globalThis.fetch=async(raw,init={})=>{
   const u=new URL(String(raw),'https://local.test'),method=init.method||'GET';
   st.attempts.push({path:u.pathname,method,auth:init.headers?.authorization});
   const ok=(value,status=200)=>new Response(JSON.stringify(value),{status,
    headers:{'content-type':'application/json'}});
   if(!st.allowed)return ok({ok:false},403);
   if(u.pathname==='/api/learning-lab-edition-exercise'){
    const body=JSON.parse(init.body);
    if(body.edition!=='ENTERPRISE')return ok({ok:false},403);
    return ok({ok:true,edition:'ENTERPRISE',result:{edition:'ENTERPRISE',
     training:{count:12},embargo:{count:2},evaluation:{count:7},
     methodComparisons:[{method:'Training-only mean',parameter:3,descriptiveResult:101.4}],
     limitation:'Original fictional research; not independent validation.'}});
   }
   if(u.pathname==='/api/learning-lab-enterprise-journey'){
    if(!st.navigation)return ok({ok:false},403);
    const stages=Array.from({length:7},(_,i)=>({number:i+1,
     phase:'Original research step '+(i+1),programTitle:'Canonical Academy '+(i+1),
     day:i+1,dayTitle:'Authorized source lesson '+(i+1),
     trainingHref:i===0?'bootcamp.html':i%2===0?
      'bootcamp-academy.html?program=charts45&day='+String(i+1):null,
     optionalPublishedLabs:i===1?[{labId:'F1-C02-L01',
      matchingBookEntitlementStillRequired:true}]:[]}));
    return ok({ok:true,journey:{edition:'ENTERPRISE',stages,
     boundary:'Training links and optional book Labs require independent rights.'}});
   }
   if(u.pathname==='/api/learning-lab-enterprise-case-workbench'){
    const body=JSON.parse(init.body);
    if(!Array.isArray(body.cases)||body.cases.length!==2||
       body.cases.some(c=>c.evidence.provenance!=='fictional'))
     return ok({ok:false},400);
    return ok({ok:true,result:{schema:'smfgu.enterprise.fictional-case-comparison.v1',
     edition:'ENTERPRISE',graded:false,holdoutValuesReturned:false,
     cases:body.cases.map(c=>({caseId:c.caseId,trainingCount:12,
      embargoCount:2,heldOutEvaluationCount:7,trainingMean:103.125,
      trainingOnlyIndicators:{EMA:103.25,VWAP:103.5}}))}});
   }
   throw Error('Unexpected mock route '+u.pathname);
  };
 });
 await page.addStyleTag({path:'assets/css/learning-lab-edition-panel-v1.css'});
 await page.addScriptTag({path:'assets/js/learning-lab-edition-panel-v1.js'});
 const host=page.locator('#player-edition-exercise');
 const mount=()=>page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.mount({
  host:document.getElementById('player-edition-exercise'),
  userId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  labId:'F1-C02-L01',token:'offline_test_enterprise',
  alive:()=>true,mode:'guided'
 }));
 await mount();
 await host.getByRole('heading',{name:'Enterprise research validation'}).waitFor();
 const journey=host.getByRole('region',{name:'Enterprise cross-course research stages'});
 await journey.getByRole('heading',{name:'Seven governed cross-course research stages'}).waitFor();
 assert.equal(await journey.locator('li').count(),7);
 assert.equal(await journey.locator('a').count(),5,'Three training links, one book link plus?');
 assert.equal(await journey.getByText(/separate book entitlement required/).count(),1);
 const compare=host.getByRole('button',{name:'Compare two original fictional cases'});
 await compare.click();
 const comparison=host.getByRole('table',{name:'Training-only original fictional case comparisons'});
 await comparison.waitFor();
 assert.equal(await comparison.locator('tbody tr').count(),2);
 assert.match(await host.getByRole('status').filter({hasText:'Comparison complete'}).textContent(),/No held-out outcome/);
 const sent=await page.evaluate(()=>globalThis.__journeyFixture.attempts.filter(
  x=>x.path==='/api/learning-lab-enterprise-case-workbench'));
 assert.equal(sent.length,1);assert.equal(sent[0].method,'POST');

 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
 const links=await journey.locator('a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
 assert(links.every(h=>h?.startsWith('bootcamp')||h?.startsWith('labs.html?open=')));
 await journey.locator('a').first().focus();
 assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'A');
 await page.evaluate(()=>globalThis.CrownlightEditionExercisePanelV1.scrub());
 assert.equal(await host.isHidden(),true);
 assert.equal(await host.locator('*').count(),0);
 await page.evaluate(()=>{globalThis.__journeyFixture.allowed=false});
 await mount();
 assert.equal(await host.isHidden(),true,'Denied Enterprise edition cannot reveal navigator');
 await page.evaluate(()=>{globalThis.__journeyFixture.allowed=true;globalThis.__journeyFixture.navigation=false});
 await mount();await host.getByRole('heading',{name:'Enterprise research validation'}).waitFor();
 assert.equal(await journey.locator('li').count(),0,'Denied independent journey must not render path');
 assert.equal(await page.evaluate(()=>globalThis.__journeyFixture.attempts.every(x=>x.method==='GET'||x.method==='POST')),true);
 await ctx.close();
 console.log('PASS MOCKED Chromium Enterprise journey source: seven stages, separate locked Academy and book rights, keyboard access, mobile, denied grant, identity scrub');
 console.log('ACCEPTANCE_SCOPE=MOCKED_BROWSER genuine_authenticated_members=false no_member_or_grade_writes=true');
}finally{await browser.close()}
