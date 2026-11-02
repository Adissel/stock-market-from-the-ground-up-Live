/* Synthetic responsive-browser acceptance: original Risk60 D11–D22.
 * No real QA sign-in, fees, scores or Supabase writes.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {academyByCode,ACADEMY_VERSION} from '../functions/_lib/bootcamp-academy-v014168.js';
const origin=(process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin),'Local fixture only');
const course=academyByCode.risk60;
assert.equal(course.curriculum.length,60);
for(const index of [10,13,14,17,18,19,20,21]){
 const d=course.curriculum[index];
 assert.equal(d.lesson.formativeQuestions.length,12);
 assert.equal(d.lesson.advancedPracticums.length,1);
}
// Editorial contract for distinct original Day 21–22 guided instruction.
// This suite does not approve protected cases or impersonate a human tester.
const focus=[course.curriculum[20],course.curriculum[21]];
const promptIds=new Set();
for(const [index,day] of focus.entries()){
 const dayNumber=21+index;
 assert.equal(day.day,dayNumber);
 assert.equal(day.lesson.formativeQuestions.length,12);
 assert.equal(day.lesson.advancedPracticums.length,1);
 assert.equal(day.officiallyGraded,false);
 for(const q of day.lesson.formativeQuestions){
  assert(!promptIds.has(q.id),'Duplicate D21–D22 formative question identity');
  promptIds.add(q.id);
  assert(q.prompt.length>25&&q.review.length>55,'Question and calculation feedback must be substantive');
 }
 const a=day.lesson.advancedPracticums[0];
 for(const key of ['scenario','task','worked','pitfall','transfer'])
  assert(a[key].length>65,'Advanced risk practicum incomplete: '+key);
}
assert.equal(promptIds.size,24);
const d21=focus[0].lesson,d22=focus[1].lesson;
assert.match(d21.advancedPracticums[0].worked,/33 minutes/);
assert.match(d21.advancedPracticums[0].worked,/28 minutes/);
assert.match(d22.formativeQuestions[10].prompt,/0\.50%/);
assert.doesNotMatch(d22.formativeQuestions[10].prompt,/\$0\.50%/);
const close=(actual,expected)=>assert(Math.abs(actual-expected)<1e-6,
 'Wrong source teaching arithmetic: '+actual+' expected '+expected);
close((12.72-12)/12*100,6);
close(12.72-12.60,.12);
close((12.72+12.60)/2,12.66);
close((12.72-12.60)/12.66*100,.9478672985781991);
close((18.45-18)/18*100,2.5);
close((18.46-18.38)/((18.46+18.38)/2)*100,.434310532030402);
assert.match(d22.advancedPracticums[0].worked,/NO TRADE/);
const identity=[
 "window.getSupabaseClient=async()=>({auth:{",
 "getUser:async()=>({data:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}}}),",
 "getSession:async()=>({data:{session:{user:{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},access_token:'synthetic'}}}),",
 "onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})",
 "}});"
].join('\n');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1024,1440]){
  const ctx=await browser.newContext({viewport:{width,height:930},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==origin)return route.abort();
   if(url.pathname==='/assets/js/supabase-client.js')return route.fulfill({status:200,contentType:'application/javascript',body:identity});
   if(['/assets/js/site.js','/assets/js/session-manager.js'].includes(url.pathname))
    return route.fulfill({status:200,contentType:'application/javascript',body:'/* synthetic-only */'});
   if(url.pathname==='/api/bootcamp-academy'&&route.request().method()==='GET')
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
     ok:true,version:ACADEMY_VERSION,program:course,curriculum:course.curriculum,
     enrolled:false,progressAvailable:true,progress:[]})});
   return route.continue();
  });
  await page.goto(origin+'/bootcamp-academy.html?program=risk60',{waitUntil:'domcontentloaded'});
  await page.locator('#academy-workspace:not([hidden])').waitFor({timeout:20000});
  for(const index of [10,13,14,17,18,19,20,21]){
   await page.locator('#academy-days .gu-bc-day').nth(index).click();
   const disclosure=page.locator('#academy-legacy-guide');
   await disclosure.waitFor({state:'attached'});
   assert.equal(await disclosure.evaluate(el=>el.open),false,
    'Supplementary advanced instruction must remain collapsed until requested');
   await disclosure.locator(':scope > summary').click();
   const host=page.locator('#academy-guided-host .academy-guided-ten');
   await host.waitFor({state:'visible'});
   assert.match(await host.innerText(),/Suggested active-learning itinerary\s*[—–-]\s*45 minutes\s*\(self-paced\)/,
    'Full-depth original Risk60 days must provide the 45-minute itinerary');
   const sizing=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(sizing<=4,'No horizontal body overflow at '+width+'px, Risk60 D'+(index+1));
  }
  assert.deepEqual(errors,[],'No browser JS error for Risk60 D11/D14/D15/D18/D19/D20/D21/D22');
  await ctx.close();
 }
 console.log('PASS SYNTHETIC Risk60 D11–D22 selected advanced day routes at four viewport widths; D21/D22 have 24 distinct original questions, 2 worked transfers and validated quote/return/spread mathematics. Not real Beta member or graded assessment acceptance.');
}finally{await browser.close()}
