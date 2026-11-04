/* Genuine Chromium rendering of the current Home markup and published-layout
 * CSS, with only auth and presentation readiness simulated. No LIVE account
 * credentials, Supabase changes or external network calls.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.SITEWIDE_TEST_BASE||'http://127.0.0.1:8765';
const html=readFileSync('index.html','utf8')
 .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,tag=>
  tag.includes('home-stable-first-paint-v1.js')?tag:'');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1620,height:920}});
const visibility=()=>page.evaluate(()=>{
 const header=document.querySelector('.site-header');
 const main=document.querySelector('main.gu-premium-home');
 return {header:getComputedStyle(header).visibility,
  main:getComputedStyle(main).visibility,
  pending:document.documentElement.classList.contains('cl-home-initializing'),
  mode:document.body.dataset.clWorkspace||''};
});
try{
 await page.route('**/index.html',route=>route.fulfill({status:200,contentType:'text/html',body:html}));
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded'});
 let v=await visibility();
 assert.equal(v.pending,true,'Initial CSS guard must exist before first content paint');
 assert.equal(v.header,'hidden','Wrong anonymous header must not flash');
 assert.equal(v.main,'hidden','Wrong Classic chart position must not flash');
 assert.equal(await page.locator('#cl-home-initial-loading').evaluate(el=>getComputedStyle(el).display),'flex');

 await page.evaluate(()=>document.body.dataset.clWorkspace='continuous');
 await page.waitForTimeout(100);
 v=await visibility();
 assert.equal(v.pending,true,'Published style is insufficient until account navigation also settles');

 await page.evaluate(()=>{
  const nav=document.querySelector('.site-header .navlinks');
  nav.innerHTML='<a href="/dashboard.html">Dashboard</a>';
  nav.dataset.v11Owned='1';
 });
 await page.waitForFunction(()=>!document.documentElement.classList.contains('cl-home-initializing'),null,{timeout:2500});
 v=await visibility();
 assert.equal(v.header,'visible');assert.equal(v.main,'visible');
 assert.equal(v.mode,'continuous');
 assert.equal(await page.locator('#cl-home-initial-loading').evaluate(el=>getComputedStyle(el).display),'none');
 const cols=await page.locator('.gu-home-stage-grid').evaluate(el=>{
  const [left,right]=getComputedStyle(el).gridTemplateColumns.split(' ').map(parseFloat);
  return {left,right};
 });
 assert(cols.left>cols.right*1.8,'Published Continuous Desk must retain its saved asymmetric chart layout');
 console.log('PASS Chromium: Home never flashes public/Classic markup before settled Owner navigation and published Continuous Desk');

 await page.reload({waitUntil:'domcontentloaded'});
 v=await visibility();
 assert.equal(v.pending,true);
 await page.evaluate(()=>{
  document.body.dataset.clWorkspace='classic';
  const nav=document.querySelector('.site-header .navlinks');
  nav.dataset.v11Owned='1';
 });
 await page.waitForFunction(()=>!document.documentElement.classList.contains('cl-home-initializing'),null,{timeout:2500});
 v=await visibility();
 assert.equal(v.main,'visible');assert.equal(v.mode,'classic');
 console.log('PASS Chromium: public Original presentation also releases correctly after readiness');
}finally{await browser.close()}
