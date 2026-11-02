/* Real ECharts Chromium fixture: authorized Admin snapshot presentation only.
 * This does NOT certify backend RBAC or genuine signed-in Owner acceptance.
 */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {chromium} from 'playwright';
const read=path=>readFileSync(path,'utf8');
const vendor='node_modules/echarts/dist/echarts.min.js';
assert(existsSync(vendor),'Pinned Apache ECharts 6.1 must be installed for this test');
const adminHTML=read('admin.html');
assert(adminHTML.includes('crownlight-visual-kit-v1.js?v=1'));
assert(adminHTML.indexOf('crownlight-visual-kit-v1.js')<
 adminHTML.indexOf('crownlight-echarts-admin-v1.js'));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const errors=[];
 for(const width of [390,1200]){
  const page=await browser.newPage({viewport:{width,height:850}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://admin-analytics-fixture.test/admin.html',route=>
   route.fulfill({status:200,contentType:'text/html',body:
    '<!doctype html><html lang="en"><head></head><body>'+
    '<section class="admin-panel active">'+
    '<section id="crownlight-admin-echarts">'+
    '<label>Visualization <select data-admin-echarts-view>'+
    '<option value="bar">Comparison bars</option><option value="pie">Distribution</option></select></label>'+
    '<div data-admin-echarts-chart hidden style="width:100%;height:320px"></div>'+
    '<p data-admin-echarts-status></p></section></section></body></html>'}));
  await page.route('**/assets/vendor/echarts/6.1.0/echarts.min.js',route=>
   route.fulfill({status:200,contentType:'application/javascript',body:readFileSync(vendor)}));
  await page.goto('https://admin-analytics-fixture.test/admin.html');
  await page.evaluate(()=>{window.GroundUpAdminSummarySnapshot={
   users:0,activeEntitlements:3,library:11,orders:2,
   subscriptions:0,catalogProducts:8,publishedContent:5,
   observedAt:'2026-11-01T21:00:00Z',showcase:true
  };});
  for(const p of ['assets/js/crownlight-echarts-loader-v1.js',
   'assets/js/crownlight-visual-kit-v1.js','assets/js/crownlight-echarts-admin-v1.js'])
   await page.addScriptTag({content:read(p)});
  await page.waitForFunction(()=>window.CrownlightAdminAnalytics?.isReady());
  assert.equal(await page.locator('#crownlight-admin-echarts table tbody tr').count(),7);
  const values=await page.evaluate(()=>{
   const c=window.echarts.getInstanceByDom(document.querySelector('[data-admin-echarts-chart]'));
   const o=c.getOption();
   const region=document.querySelector('[data-admin-echarts-chart]');
   return {data:o.series[0].data,mode:o.tooltip[0].renderMode,
    accessibleLabel:region.getAttribute('aria-label'),
    source:document.querySelector('[data-admin-echarts-status]').textContent};
  });
  assert.deepEqual(values.data,[0,3,11,2,0,8,5]);
  assert.equal(values.mode,'richText');
  assert.match(values.accessibleLabel,/Registered profiles: 0/,
   'Real chart element must retain an accurate accessible name');
  assert.match(values.source,/SYNTHETIC SHOWCASE/);
  await page.locator('[data-admin-echarts-group]').selectOption('commerce');
  assert.equal(await page.locator('#crownlight-admin-echarts table tbody tr').count(),3);
  const filtered=await page.evaluate(()=>{
   const c=window.echarts.getInstanceByDom(document.querySelector('[data-admin-echarts-chart]'));
   return c.getOption().series[0].data;
  });
  assert.deepEqual(filtered,[2,0,8]);
  await page.locator('[data-admin-echarts-view]').selectOption('pie');
  const pie=await page.evaluate(()=>{
   const c=window.echarts.getInstanceByDom(document.querySelector('[data-admin-echarts-chart]'));
   return c.getOption().series[0].type;
  });
  assert.equal(pie,'pie','Existing distribution choice stays available');
  await page.evaluate(()=>window.dispatchEvent(new Event('crownlight:member-changed')));
  assert.equal(await page.evaluate(()=>window.CrownlightAdminAnalytics.getStatus().hasSnapshot),false);
  assert.equal(await page.locator('#crownlight-admin-echarts table tbody tr').count(),0);
  await page.close();
 }
 assert.deepEqual(errors,[],'No browser script errors');
 console.log('PASS Admin ECharts 390/1200: source label, exact count table, zero counts, commerce filter, pie choice and session disposal');
}finally{await browser.close()}
