/* Eight member page layouts, exercised as browser-only, no-auth/no-payment fixtures. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const code=readFileSync('assets/js/member-learning-layouts-v1.js','utf8');
const css=readFileSync('assets/css/member-learning-layouts-v1.css','utf8');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const academyFixture=()=>'<html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body class="gu-bc-learning academy-classroom-active">'+
 '<section id="academy-program-list"><h2>Choose a Boot Camp</h2><div id="academy-programs"></div></section>'+
 '<section id="academy-workspace"><div class="academy-course-head"><h2 id="academy-course-title">Already authorized course</h2></div>'+
 '<div class="academy-study-grid"><aside class="gu-bc-index"><nav id="academy-days"></nav></aside><article class="gu-bc-lesson academy-classroom-lesson">'+
 '<header class="academy-classroom-session-head">Lesson</header><section id="academy-engine">Existing Talia engine</section>'+
 '<section id="academy-official-assessment" hidden>Protected assessment remains hidden</section>'+
 '<details class="academy-classroom-briefing"><summary>Briefing</summary><p id="academy-objective">Existing objective</p></details>'+
 '<section><h4>Related lessons</h4><div id="academy-related">Original authorized related Labs</div></section>'+
 '<section class="gu-bc-reflection"><textarea id="academy-reflection" aria-label="Private reflection"></textarea></section>'+
 '<nav class="gu-bc-pager">Next day</nav></article></div></section></body></html>';
try{
 const matrix={free5:'foundations',truth5:'foundations',charts45:'indicator',indicators10:'indicator',
  practicum90:'replay',tape10:'tape',scanners10:'scanner',watchlist7:'scanner',risk60:'risk',filings7:'filings'};
 for(const [program,expected] of Object.entries(matrix)){
  const ctx=await browser.newContext({viewport:{width:1200,height:900},serviceWorkers:'block'});
  await ctx.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:academyFixture()}));
  const page=await ctx.newPage();
  await page.goto('http://127.0.0.1:8768/bootcamp-academy.html?program='+program);
  await page.addScriptTag({content:code});
  await page.waitForFunction(()=>document.body.dataset.clLiveLayout!==undefined);
  assert.equal(await page.locator('body').getAttribute('data-cl-live-layout'),expected,program+' expected layout');
  assert.match(await page.locator('.cl-live-learning-head').textContent(),/ORIGINAL INSTRUCTION/);
  assert.equal(await page.locator('#academy-engine').textContent(),'Existing Talia engine','Do not replace Tutor');
  assert.equal(await page.locator('#academy-official-assessment').isVisible(),false,'Protected assessment must remain hidden');
  assert.equal(await page.locator('#academy-related').textContent(),'Original authorized related Labs','Related learning unchanged');
  assert.equal(await page.locator('.cl-live-learning-catalog-item').count(),8,'Mission Control lists eight routes');
  if(program==='risk60')assert.equal(await page.locator('.academy-classroom-lesson').evaluate(el=>getComputedStyle(el).display),'grid');
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:840},serviceWorkers:'block'});
 const fixture='<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head>'+
 '<body class="gu-lab-member"><section id="lab-player-content"><section id="player-workspace"><div class="gu-ws">'+
 '<section id="gu-v32-teaching-slot">Original Lab engine</section><div class="gu-ws-disclosures">Source disclosures</div>'+
 '<details id="gu-ws-member-workbench" hidden><summary>Decision</summary></details></div></section>'+
 '<section id="player-results"></section></section></body></html>';
 await ctx.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
 const page=await ctx.newPage();await page.goto('http://127.0.0.1:8768/lab-player.html');
 await page.addScriptTag({content:code});
 await page.evaluate(()=>window.CrownlightMemberLayoutsV1.activateLab({id:'DT-C01-L01',concept:'VWAP reclaim',studies:'VWAP'}));
 assert.equal(await page.locator('body').getAttribute('data-cl-live-layout'),'indicator');
 assert.equal(await page.locator('#gu-v32-teaching-slot').textContent(),'Original Lab engine');
 assert.equal(await page.locator('#gu-ws-member-workbench').isVisible(),false);
 const width=await page.locator('.cl-live-learning-head').evaluate(el=>el.getBoundingClientRect().width);
 assert.ok(width>0&&width<=390,'Mobile layout must not overflow viewport');
 await page.evaluate(()=>window.CrownlightMemberLayoutsV1.resetLab());
 assert.equal(await page.locator('.cl-live-learning-head').count(),0,'Account reset clears layout');
 await ctx.close();
 console.log('PASS ten Academy course layouts, eight catalog routes, existing engines, privacy and responsive Lab layout');
}finally{await browser.close()}
