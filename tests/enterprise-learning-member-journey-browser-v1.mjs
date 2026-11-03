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
  const s={permitted:true,sessionId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',calls:[],delayed:false,bookmark:null};
  globalThis.__test=s;
  globalThis.__client={auth:{getSession:async()=>({data:{session:{
   user:{id:s.sessionId},access_token:'mock-session'}
  }})}};
  globalThis.fetch=async(uri,opts)=>{
   s.calls.push({path:uri,method:opts.method,auth:opts.headers?.authorization});
   if(!s.permitted)return new Response(JSON.stringify({ok:false}),{status:403});
   if(s.delayed)await new Promise(resolve=>setTimeout(resolve,50));
   if(uri.startsWith('/api/learning-lab-edition-workspace')){
    if(opts.method==='GET')return new Response(JSON.stringify({
     ok:true,found:s.bookmark!==null,workspace:s.bookmark
    }),{status:200,headers:{'content-type':'application/json'}});
    const incoming=JSON.parse(opts.body);
    if(incoming.family!=='learning'||incoming.edition!=='ENTERPRISE'||
       incoming.activity!=='enterprise_academy_bookmark'||
       incoming.caseKey!=='ACADEMY_ENTERPRISE_PATH_V1')
     throw Error('Unexpected private bookmark request');
    if(incoming.expectedRevision!==(s.bookmark?.revision||0))
     return new Response(JSON.stringify({ok:false,error:'Stale bookmark.'}),{status:409});
    s.bookmark={revision:incoming.expectedRevision+1,
     summary:{schema:'smfgu.learning.enterprise-path-bookmark.v1',
      researchActivity:'enterprise_academy_bookmark',
      stageNumber:incoming.payload.stageNumber,officialGrade:false,
      independentCompletionRecorded:false}};
    return new Response(JSON.stringify({ok:true,workspace:{revision:s.bookmark.revision}}),
     {status:200,headers:{'content-type':'application/json'}});
   }
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
 const chooser=host.locator('#academy-enterprise-bookmark-stage');
 await host.getByText(/No saved research bookmark/).waitFor();
 await chooser.selectOption('4');
 await host.getByRole('button',{name:'Save private study bookmark'}).click();
 await host.getByText(/Saved private stage 4/).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__test.bookmark.summary.stageNumber),4);
 await chooser.selectOption('1');
 await host.getByRole('button',{name:'Restore private study bookmark'}).click();
 await host.getByText(/Restored stage 4/).waitFor();
 assert.equal(await chooser.inputValue(),'4');
 // A second device updates the same revision. This tab MUST not overwrite it.
 await page.evaluate(()=>{globalThis.__test.bookmark.revision+=1});
 await chooser.selectOption('5');
 await host.getByRole('button',{name:'Save private study bookmark'}).click();
 await host.getByText(/changed in another session/).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__test.bookmark.summary.stageNumber),4);
 await host.getByRole('button',{name:'Restore private study bookmark'}).click();
 await host.getByText(/Restored stage 4/).waitFor();
 await chooser.selectOption('5');
 await host.getByRole('button',{name:'Save private study bookmark'}).click();
 await host.getByText(/Saved private stage 5/).waitFor();
 assert.equal(await page.evaluate(()=>globalThis.__test.bookmark.summary.stageNumber),5);
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
  ['GET','POST'].includes(x.method)&&x.auth==='Bearer mock-session')),true);
 assert.equal(await page.evaluate(()=>globalThis.__test.calls.some(x=>
  x.method==='POST'&&x.path==='/api/learning-lab-edition-workspace')),true);
 console.log('PASS MOCKED Academy Enterprise Learning navigator and private stage bookmarks: seven canonical stages, authenticated save/restore, stale CAS, keyboard/mobile, revocation, identity scrub');
 console.log('NOT_REAL_MEMBER_ACCEPTANCE=true');
 await context.close();
}finally{await browser.close()}
