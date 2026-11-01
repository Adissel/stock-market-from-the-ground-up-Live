/* Synthetic browser acceptance for protected A/B/C React+ECharts pages.
 * No real accounts, billing, market feeds or grade records.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {onRequest as middleware} from '../functions/_middleware.js';
const BASE=process.env.PT_BROWSER_BASE||'http://127.0.0.1:8768';
const html=readFileSync('prototype.html','utf8');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function make(role,width=1350){
 const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
 await context.route(/\/prototype\.html(?:\?.*)?$/,async route=>{
  const reply=await middleware({request:new Request(route.request().url()),env:{},next:async()=>{throw Error('Protected document must not be public')}});
  await route.fulfill({status:reply.status,headers:Object.fromEntries(reply.headers),contentType:'text/html',body:await reply.text()});
 });
 await context.route('**/api/prototype-document',route=>route.fulfill({status:role==='OWNER'?200:403,contentType:'text/html',body:role==='OWNER'?html:'Access denied'}));
 await context.route('**/assets/js/supabase-client.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:"window.getSupabaseClient=async()=>({auth:{getSession:async()=>({data:{session:{access_token:'synthetic-token',user:{id:'owner-qa'}}}}),getUser:async()=>({data:{user:{id:'owner-qa'}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}});"}));
 await context.route('**/api/admin?action=context',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,roles:[role],permissions:role==='OWNER'?['control_panel.access']:[]})}));
 await context.route('**/api/prototype-training-cases',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,source:'FICTIONAL_PROTOTYPE',cases:[],gradingEnabled:false})}));
 await context.route('**/api/prototype-classroom-presets',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"layouts":[],"presets":[],"memberships":[],"history":[]}'}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 return{context,page,errors};
}
try{
 const denied=await make('FREE');
 await denied.page.goto(BASE+'/prototype.html?experience=a');
 await denied.page.waitForFunction(()=>document.body.textContent?.includes('access denied')||document.body.textContent?.includes('Access denied'),null,{timeout:14000});
 assert.equal(await denied.page.locator('.cx-app').count(),0,'Non-staff user must not receive React experience source');
 await denied.context.close();
 const a=await make('OWNER');
 await a.page.goto(BASE+'/prototype.html?experience=a');
 await a.page.locator('.cx-app.cx-page-a').waitFor({state:'visible',timeout:30000});
 assert.equal(await a.page.locator('.cx-designs button').count(),6);
 assert.equal(await a.page.locator('.cx-controlstrip select:has(option[value="FULL_ANNUAL"]) option').count(),8);
 await a.page.locator('.cx-designs button:has-text("Green / Black")').click();
 assert.equal(await a.page.locator('.cx-app').evaluate(x=>x.classList.contains('cx-theme-green')),true);
 await a.page.getByLabel('Membership design preview').selectOption('FULL_ANNUAL');
 assert.match(await a.page.locator('.cx-statusline').textContent(),/Full Platform/);
 await a.page.getByLabel('Teaching topic').selectOption('candle');
 await a.page.locator('.cx-candle-svg').waitFor({state:'visible'});
 assert.equal(await a.page.locator('.cx-input-grid input').count(),4);
 await a.page.getByLabel('Teaching topic').selectOption('vwap');
 await a.page.locator('.cx-trade input').first().fill('12');
 await a.page.locator('.cx-numeric').last().waitFor({state:'visible'});
 assert.match(await a.page.locator('.cx-learning').textContent(),/trade-print VWAP/i);
 await a.page.locator('.cx-replay button:has-text("Next +")').click();
 assert.match(await a.page.locator('.cx-statusline').textContent(),/55 completed candles/);
 assert.ok(a.errors.length===0,'No uncaught React errors: '+a.errors.join(' | '));
 await a.context.close();
 const b=await make('OWNER',960);
 await b.page.goto(BASE+'/prototype.html?experience=b');
 await b.page.locator('.cx-app.cx-page-b').waitFor({state:'visible',timeout:30000});
 await b.page.locator('.cx-flagship-tabs button:has-text("Aurora Learning")').click();
 assert.equal(await b.page.locator('.cx-flagship-aurora').isVisible(),true);
 await b.page.locator('.cx-flagship-tabs button:has-text("Green / Black Terminal")').click();
 assert.equal(await b.page.locator('.cx-flagship-green').isVisible(),true);
 assert.ok(b.errors.length===0,'No uncaught flagship errors: '+b.errors.join(' | '));
 await b.context.close();
 const c=await make('OWNER',780);
 await c.page.goto(BASE+'/prototype.html?experience=c');
 await c.page.locator('.cx-app.cx-page-c').waitFor({state:'visible',timeout:30000});
 assert.equal(await c.page.locator('.cx-compare-cols .cx-compare-col').count(),2);
 await c.page.locator('.cx-compare-top select').first().selectOption('FULL_MONTHLY');
 await c.page.locator('.cx-compare-top select').last().selectOption('FOUNDING_60');
 assert.match(await c.page.locator('.cx-matrix').textContent(),/Founding 60-Day/);
 assert.match(await c.page.locator('.cx-comparison').textContent(),/Equal quality/);
 assert.ok(c.errors.length===0,'No uncaught comparison errors: '+c.errors.join(' | '));
 await c.context.close();
 console.log('PASS: protected A/B/C pages, six themes, membership selection, two lessons, replay controls, three flagship layouts and side-by-side plans');
}finally{await browser.close()}
