import assert from 'node:assert/strict';
import {chromium} from 'playwright';

// Browser-level component regression using simulated QA inputs only.
// No account, network, production state, grades, or credits are touched.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:900,height:800},reducedMotion:'reduce'});
 await page.goto('about:blank');
 await page.addScriptTag({path:'assets/js/academy-guided-v1.js'});
 const mounted=await page.evaluate(()=>{
  const host=document.createElement('main');host.id='mastery-qa';document.body.append(host);
  const day={programCode:'risk60',day:2,title:'Simulated risk sizing',
   objective:'Calculate risk and compare evidence',
   observe:'Completed hypothetical reference prices',
   practice:'Find whole-share capacity',limitation:'Actual loss can exceed planned risk',
   lesson:{transfer:'New simulated evidence: $24.00 entry, $23.50 stop and $35 planned risk, not the original $20.00 case. State the no-trade condition.'}};
  return !!window.GroundUpAcademyGuidedV1.mount(host,{day,programCode:'risk60'});
 });
 assert(mounted,'Shared Boot Camp engine not mounted');
 const host=page.locator('#mastery-qa');
 const next=host.locator('.academy-guided-controls button').nth(1);
 const stage=async n=>assert.match(await host.locator('.academy-guided-content h4').innerText(),new RegExp('^'+(n+1)+'\\.'));
 const choose=async right=>{
  const labels=host.locator('.academy-guided-content .academy-guided-choice');
  const options=await labels.allTextContents();
  const pos=options.findIndex(v=>right?!/Assume a chart|Ignore timestamps/i.test(v):/Assume a chart/i.test(v));
  assert(pos>=0,'Missing '+(right?'correct':'wrong')+' answer');
  await labels.nth(pos).locator('input').check();
 };
 await stage(0);await next.click();await stage(1);await next.click();await stage(2);
 const numbers=host.locator('.academy-guided-numeric input[type=number]');
 assert.equal(await numbers.count(),2);
 const labels=await numbers.evaluateAll(inputs=>inputs.map(input=>String(input.getAttribute('aria-label')||input.labels?.[0]?.textContent||'').trim()));
 assert(labels.every(name=>name.length>5),'Numeric input needs an accessible name');
 await numbers.nth(0).fill('9');await numbers.nth(1).fill('9');
 await next.click();await stage(2);
 assert.match(await host.locator('.academy-guided-feedback').innerText(),/Not yet/i);
 await host.locator('.academy-guided-controls button').nth(2).click();
 assert.match(await host.locator('.academy-guided-feedback').innerText(),/Talia explains/);
 await numbers.nth(0).fill('0.4');await numbers.nth(1).fill('100');
 await next.click();await stage(3);
 const slider=host.locator('.academy-guided-method-lab input[type=range]');
 assert.equal(await slider.count(),1);
 const initial=await host.locator('.academy-guided-method-lab output').innerText();
 await slider.evaluate(e=>{e.value='80';e.dispatchEvent(new Event('input',{bubbles:true}))});
 assert.notEqual(await host.locator('.academy-guided-method-lab output').innerText(),initial);
 const keyboardBefore=await host.locator('.academy-guided-method-lab output').innerText();
 await slider.focus();await page.keyboard.press('ArrowRight');
 assert.notEqual(await host.locator('.academy-guided-method-lab output').innerText(),keyboardBefore,
  'Range control must respond to keyboard arrows');
 await next.click();await stage(4);await choose(true);await next.click();
 await stage(5);await choose(true);await next.click();
 await stage(6);await choose(false);await next.click();await stage(6);
 assert.match(await host.locator('.academy-guided-feedback').innerText(),/Not yet/i);
 await choose(true);await next.click();await stage(7);await next.click();await stage(8);
 assert.match(await host.locator('.academy-guided-content').innerText(),/New simulated evidence.*\$24\.00/s);
 await choose(true);await next.click();await stage(9);
 const report=await host.locator('.academy-guided-evidence-report').innerText();
 assert.match(report,/teaching assistance\s*1/i);
 assert.match(report,/Corrected after feedback\s*2/i);
 assert.match(report,/Decision-making[\s\S]*corrective retry/i);
 assert.match(report,/Process and transfer[\s\S]*first unassisted method check/i);
 assert.match(report,/No member grades are written/);
 assert.equal(await host.locator('textarea[required]').count(),0);
 assert(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),
  'Browser reduced-motion preference was not honored');
 await page.setViewportSize({width:390,height:844});
 const sizes=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
 assert(sizes.document<=sizes.viewport+12,'Ungraded classroom has mobile horizontal overflow: '+JSON.stringify(sizes));
 console.log('PASS component browser: wrong numerical answer, Talia teaching, free retry, changed risk slider, independent first selections, wrong assessment, correction and unfamiliar transfer; ungraded local-only; accessible numeric labels, keyboard risk slider and 390px mobile smoke.');
}finally{await browser.close()}
