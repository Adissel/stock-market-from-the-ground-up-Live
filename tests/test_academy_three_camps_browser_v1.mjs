/* Isolated authenticated UI fixture for NEW Boot Camps.
 * All accounts and market examples synthetic. No real Supabase, Stripe, or grading writes. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {academyByCode,ACADEMY_VERSION} from '../functions/_lib/bootcamp-academy-v014168.js';
const origin=(process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))throw Error('Local fixture only');
const codes=['tape10','indicators10','filings7'];
const token='fixture-token',uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const identityScript=`window.getSupabaseClient=async()=>({auth:{
 getUser:async()=>({data:{user:{id:'${uid}'}}}),
 getSession:async()=>({data:{session:{user:{id:'${uid}'},access_token:'${token}'}}}),
 onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
 }});`;
new Function(identityScript); // Fail immediately if the synthetic identity fixture is malformed.
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1440]){
  for(const code of codes){
   const context=await browser.newContext({viewport:{width,height:950},serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let enrolled=false;
   await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin)return route.abort();
    if(url.pathname==='/assets/js/supabase-client.js')return route.fulfill({
     status:200,contentType:'application/javascript',body:identityScript});
    if(['/assets/js/site.js','/assets/js/session-manager.js'].includes(url.pathname))
     return route.fulfill({status:200,contentType:'application/javascript',body:'/* synthetic identity only */'});
    if(url.pathname==='/api/bootcamp-academy'){
     if(route.request().method()==='GET')return route.fulfill({status:200,
      contentType:'application/json',body:JSON.stringify({ok:true,version:ACADEMY_VERSION,
       program:academyByCode[code],curriculum:academyByCode[code].curriculum,
       progressAvailable:true,enrolled,progress:[]})});
     const input=route.request().postDataJSON();
     assert.equal(input.program,code);assert.equal(input.version,ACADEMY_VERSION);
     if(input.action==='enroll'){
      enrolled=true;
      return route.fulfill({status:200,contentType:'application/json',
       body:JSON.stringify({ok:true,enrolled:true,program:code})});
     }
     return route.fulfill({status:400,contentType:'application/json',
      body:JSON.stringify({ok:false,error:'Write not authorized in UI fixture'})});
    }
    if(url.pathname==='/api/academy-protected-assessment-v1')
     return route.fulfill({status:200,contentType:'application/json',
      body:JSON.stringify({ok:true,program:code,day:Number(url.searchParams.get('day')),
       officialAssessment:false,reason:'assessment_not_reviewed',priorSubmissions:0})});
    return route.continue();
   });
   const response=await page.goto(origin+'/bootcamp-academy.html?program='+code,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response.status(),200);
   await page.locator('#academy-workspace:not([hidden])').waitFor({timeout:20000});
   await page.locator('.academy-guided-ten').waitFor({timeout:15000});
   assert.equal(await page.locator('#academy-days .gu-bc-day').count(),academyByCode[code].days);
   assert.match(await page.locator('#academy-course-title').innerText(),new RegExp(code==='tape10'?'Tape':code==='indicators10'?'VWAP':'SEC Filings'));
   await page.locator('.academy-evidence-event').first().waitFor({timeout:12000});
   const expectHead=code==='tape10'?'Quote, depth and execution':code==='indicators10'?'Indicator calculation':'SEC filing and issuer-source';
   assert((await page.locator('.academy-evidence-head').innerText()).includes(expectHead),'Subject-specific evidence: '+code);
   assert.equal(await page.locator('#academy-official-assessment').isHidden(),true,'No enrollment means no protected assessment');
   await page.locator('#academy-enroll').click();
   await page.locator('#academy-official-assessment:not([hidden])').waitFor({timeout:12000});
   await page.waitForFunction(()=>document.querySelector('.academy-assessment-status')?.textContent.includes('pending editorial'));
   assert.equal(await page.locator('.academy-assessment-question').count(),0,'Unreviewed keys never displayed');
   assert((await page.locator('.academy-active-itinerary summary').innerText()).includes('45 minutes'),
    'Reference days must present an honest 45-minute active-work itinerary');
   if(width===390){
    // Exercise the real ten-stage formative UI with the individual reference
    // content, not only static string/source assertions. Fixture login remains fake.
    const lesson=academyByCode[code].curriculum[0].lesson;
    for(let st=0;st<6;st++){
     const expected={2:lesson.method,4:lesson.predict,5:lesson.replay}[st];
     if(expected){
      const label=page.locator('.academy-guided-choice').filter({hasText:expected});
      assert.equal(await label.count(),1,'Authored guided answer available at stage '+st);
      await label.locator('input').check();
     }
     if(st===2){
      const caseBox=page.locator('.academy-advanced-practicum');
      assert.equal(await caseBox.count(),1,'A fully worked advanced case is available at calculation stage');
      await page.locator('.academy-guided-controls button').nth(1).click();
      assert.match(await page.locator('.academy-guided-controls + p[role="status"]').innerText(),/Complete the advanced case reasoning/);
      await caseBox.locator('textarea').fill('I will compute from the given prices and volume units, check the timestamp and risk, and state what is not proven.');
      await caseBox.locator('button').click();
      assert.match(await caseBox.locator('p[role="status"]').innerText(),/Worked analysis:.*Common mistake:/);
     }
     await page.locator('.academy-guided-controls button').nth(1).click();
    }
    assert.equal(await page.locator('.academy-formative-question').count(),12,
     'Twelve original formative questions render for '+code);
    await page.locator('.academy-guided-controls button').nth(1).click();
    assert.match(await page.locator('.academy-guided-controls + p[role="status"]').innerText(),/twelve day-specific formative questions/);
    for(let n=0;n<12;n++){
     const item=page.locator('.academy-formative-question').nth(n);
     await item.locator('summary').click();
     await item.locator('textarea').fill('I will calculate the observed quantities with appropriate units, verify source and timestamps, and preserve the no-trade option.');
     await item.locator('button').click();
     assert.match(await item.locator('p[role="status"]').innerText(),/Teaching feedback:/);
    }
    assert.match(await page.locator('.academy-formative-progress').innerText(),/12 of 12/);
    await page.locator('.academy-guided-choice').filter({hasText:lesson.transfer}).locator('input').check();
    await page.locator('.academy-guided-controls button').nth(1).click();
    await page.locator('.academy-guided-controls button').nth(1).click();
    const second=page.locator('.academy-advanced-practicum');
    assert.equal(await second.count(),1,'Independent advanced transfer case at stage eight');
    await second.locator('textarea').fill('The second advanced case requires independent source evaluation and a fresh calculation, then a conservative no-trade decision.');
    await second.locator('button').click();
    assert.match(await second.locator('p[role="status"]').innerText(),/Worked analysis:/);
    await page.locator('.academy-guided-choice').filter({hasText:lesson.transfer}).locator('input').check();
    await page.locator('.academy-guided-controls button').nth(1).click();
    assert.match(await page.locator('.academy-guided-content h4').innerText(),/Results/);
   }
   // Keyboard-first checks visit EVERY authored day, not only the first/final route.
   // They remain isolated fixtures; this is not genuine authenticated acceptance.
   for(let index=0;index<academyByCode[code].days;index++){
    const dayButton=page.locator('#academy-days .gu-bc-day').nth(index);
    await dayButton.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(n=>document.getElementById('academy-day-title')?.textContent===n,
     academyByCode[code].curriculum[index].title,{timeout:10000});
    assert.equal(await page.locator('#academy-days .gu-bc-day').nth(index).getAttribute('aria-current'),
     'step','Focused study day exposes its current state: '+code+' '+(index+1));
    assert((await page.locator('.academy-evidence-head').innerText()).includes(expectHead),
     'Each day must keep its subject-specific evidence: '+code+' '+(index+1));
   }
   assert.equal(await page.locator('.academy-assessment-status').getAttribute('role'),'status',
    'Protected assessment status must be announced accessibly');
   const geometry=await page.evaluate(()=>{
    const el=document.querySelector('.academy-guided-ten'),b=el.getBoundingClientRect();
    return {x:b.x,right:b.right,screen:window.innerWidth,overflow:document.documentElement.scrollWidth};
   });
   assert(geometry.x>=-2&&geometry.right<=width+3&&geometry.overflow<=width+5,
    'Full-width learning must not overflow at '+width+': '+JSON.stringify(geometry));
   assert.deepEqual(errors,[],'New course should have no browser script errors '+code);
   console.log('PASS new Academy '+code+' '+width+'px, every day keyboard-navigation, aria-current, subject-evidence, assessment editorial gate');
   await context.close();
  }
 }
}finally{await browser.close()}
