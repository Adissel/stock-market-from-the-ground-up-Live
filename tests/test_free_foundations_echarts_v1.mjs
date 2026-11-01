/* Real offline ECharts acceptance: authenticated evidence event contract,
 * views, exact-table fallback, invalid payload, account-switch disposal.
 */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {chromium} from 'playwright';
const read=p=>readFileSync(p,'utf8');
const vendor='node_modules/echarts/dist/echarts.min.js';
assert(existsSync(vendor),'Pinned Apache ECharts must be available');
const dashboard=read('assets/js/dashboard.js');
const component=read('assets/js/free-foundations-echarts-v1.js');
const html=read('dashboard.html');
assert(html.includes('free-foundations-echarts-v1.js?v=1'));
assert(html.includes('free-foundations-echarts-v1.css?v=1'));
assert(dashboard.includes("document.dispatchEvent(new CustomEvent('smfgu:free-foundations-evidence'"));
assert(dashboard.indexOf("identity.data?.user?.id!==memberId")<
 dashboard.indexOf("document.dispatchEvent(new CustomEvent('smfgu:free-foundations-evidence'"));
assert(!/\bfetch\s*\(|\blocalStorage\b|sessionStorage/.test(component),
 'Presentation must not read or store private data independently');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
try{
 for(const width of [390,1200]){
  const page=await browser.newPage({viewport:{width,height:800}});
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('https://charts-analytics-fixture.test/dashboard.html',
   r=>r.fulfill({status:200,contentType:'text/html',
    body:'<!doctype html><html><body><section id="free-learning-launchpad">'+
     '<p id="free-reflection-progress">Verified member activity</p></section></body></html>'}));
  await page.route('**/assets/vendor/echarts/6.1.0/echarts.min.js',
   r=>r.fulfill({status:200,contentType:'application/javascript',body:readFileSync(vendor)}));
  await page.goto('https://charts-analytics-fixture.test/dashboard.html');
  await page.addStyleTag({content:read('assets/css/free-foundations-echarts-v1.css')});
  await page.addScriptTag({content:read('assets/js/crownlight-echarts-loader-v1.js')});
  await page.addScriptTag({content:read('assets/js/crownlight-visual-kit-v1.js')});
  await page.addScriptTag({content:component});
  // Malformed data must never be passed to charts.
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('smfgu:free-foundations-evidence',{
   detail:{verified:true,days:[{day:1,status:'saved'}]}})));
  assert.equal(await page.locator('#free-foundations-echarts').count(),0);
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('smfgu:free-foundations-evidence',{
   detail:{verified:true,days:[
    {day:1,status:'saved'},{day:2,status:'not_started'},
    {day:3,status:'saved'},{day:4,status:'started'},{day:5,status:'not_started'}]}})));
  await page.waitForFunction(()=>window.CrownlightFreeFoundationAnalytics?.getStatus()?.rendered===true);
  assert.equal(await page.evaluate(()=>window.CrownlightFreeFoundationAnalytics.getStatus().savedDays),2);
  assert.equal(await page.locator('.ffe-table tbody tr').count(),5);
  const data=await page.evaluate(()=>window.echarts.getInstanceByDom(
   document.querySelector('.ffe-chart')).getOption().series[1].data);
  assert.deepEqual(data,[1,0,1,0,0]);
  assert.equal(await page.evaluate(()=>window.echarts.getInstanceByDom(
   document.querySelector('.ffe-chart')).getOption().tooltip[0].renderMode),'richText',
   'Dashboard must use the shared render-only ECharts option factory');
  assert.match(await page.locator('.ffe-note').innerText(),/not saved/);
  await page.locator('#free-foundations-echarts select').selectOption('domains');
  const domains=await page.evaluate(()=>window.echarts.getInstanceByDom(
   document.querySelector('.ffe-chart')).getOption().series[1].data);
  assert.deepEqual(domains,[2,0,0,0]);
  assert.equal(await page.locator('.ffe-table tbody tr').count(),4);
  assert.match(await page.locator('#free-foundations-echarts').innerText(),/not graded assessments/);
  const docWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  assert(docWidth<=width+1,'Chart must not force horizontal viewport overflow');
  await page.evaluate(()=>window.dispatchEvent(new Event('crownlight:member-changed')));
  assert.equal(await page.locator('#free-foundations-echarts').count(),0);
  assert.equal(await page.evaluate(()=>window.CrownlightFreeFoundationAnalytics.getStatus().verified),false);
  await page.close();
 }
 assert.deepEqual(errors,[],'No runtime page exceptions');
 console.log('PASS genuine Apache ECharts at 390/1200: verified five-day data, domain re-group, accessible table, zero score claims, cross-account clearing');
}finally{await browser.close()}
