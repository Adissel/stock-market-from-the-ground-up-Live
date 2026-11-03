/* Mock Chromium Academy Learning / Enterprise gated navigator. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.setContent('<!doctype html><html lang="en"><body><main><section id="academy-enterprise-research" hidden></section><section id="academy-official-assessment" hidden></section></main></body></html>');
 await page.addStyleTag({path:'assets/css/academy-enterprise-journey-v1.css'});
 await page.addScriptTag({path:'assets/js/academy-enterprise-journey-v1.js'});
 await page.evaluate(()=>{
  const s={permitted:true,sessionId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',calls:[],delayed:false};
  globalThis.__test=s;
  globalThis.__client={auth:{getSession:async()=>({data:{session:{
   user:{id:s.sessionId},access_token:'mock-session'}
  }})}};
  globalThis.fetch=async(uri,opts)=>{
   s.calls.push({path:uri,method:opts.method,auth:opts.headers?.authorization});
   if(!s.permitted)return new Response(JSON.stringify({ok:false}),{status:403});
   if(s.delayed)await new Promise(resolve=>setTimeout(resolve,50));
   return new Response(JSON.stringify({ok:true,journey:{edition:'ENTERPRISE',
    family:'learning',readOnly:true,graded:false,boundary:'Separate course and book rights.',
    stages:Array.from({length:7},(_,i)=>({number:i+1,phase:'Original phase '+i,
     day:i+1,dayTitle:'Study example '+i,programTitle:'Course '+i,
     officialGrade:false,trainingLocked:i===1,
     trainingHref:i===1?null:'bootcamp-academy.html?program=charts45&day='+(i+1),
     optionalPublishedLabs:i===0?[{labId:'F1-C02-L01',matchingBookEntitlementStillRequired:true}]:[]
    }))
   }}),{status:200,headers:{'content-type':'application/json'}});
  };
 });
 const host=page.locator('#academy-enterprise-research');
 const mount=()=>page.evaluate(()=>globalThis.CrownlightAcademyEnterpriseResearchV1.mount({
  host:document.getElementById('academy-enterprise-research'),
  client:globalThis.__client,userId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  alive:()=>globalThis.__test.sessionId==='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
 }));
 await mount();
 await host.getByRole('heading',{name:'Enterprise research pathway — seven stages'}).waitFor();
 assert.equal(await host.locator('li').count(),7);
 assert.equal(await host.getByText(/Training route locked/).count(),1);
 assert.equal(await host.getByText(/matching book entitlement required/i).count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
 await host.locator('a').first().focus();
 assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'A');
 await page.evaluate(()=>globalThis.CrownlightAcademyEnterpriseResearchV1.scrub());
 assert.equal(await host.isHidden(),true);assert.equal(await host.locator('*').count(),0);
 await page.evaluate(()=>{globalThis.__test.permitted=false});
 await mount();assert.equal(await host.isHidden(),true);
 await page.evaluate(()=>{document.getElementById('academy-official-assessment').hidden=false;globalThis.__test.permitted=true});
 await mount();assert.equal(await host.isHidden(),true,'Protected Assessment must hide optional premium teaching');
 await page.evaluate(()=>{document.getElementById('academy-official-assessment').hidden=true});
 await page.evaluate(()=>{globalThis.__test.permitted=true;globalThis.__test.sessionId='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'});
 await mount();assert.equal(await host.isHidden(),true);
 await page.evaluate(()=>{globalThis.__test.sessionId='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'});
 await mount();
 await host.getByRole('heading',{name:'Enterprise research pathway — seven stages'}).waitFor();
 await page.evaluate(()=>{globalThis.__test.delayed=true});
 const ongoing=mount();
 await page.evaluate(()=>globalThis.CrownlightAcademyEnterpriseResearchV1.scrub());
 await ongoing;assert.equal(await host.isHidden(),true);
 assert.equal(await host.locator('*').count(),0);
 assert.equal(await page.evaluate(()=>globalThis.__test.calls.every(x=>
  x.method==='GET'&&x.auth==='Bearer mock-session')),true);
 console.log('PASS MOCKED Academy Enterprise Learning navigator: 7 stages, separately locked links, keyboard/mobile, denial, identity-scrub, stale response safety');
 console.log('NOT_REAL_MEMBER_ACCEPTANCE=true');
 await context.close();
}finally{await browser.close()}
