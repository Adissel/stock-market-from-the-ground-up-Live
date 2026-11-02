/* Googlebot-class mobile rendering acceptance: genuine Chromium and live homepage.
 * No credentials, no payments, no production mutations.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.SMFUGU_TEST_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev/';
const diagnostic=process.env.MOBILE_HEADER_DIAG_ONLY==='1';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
mkdirSync('artifacts/mobile-header',{recursive:true});
const findings=[];
try{
 for(const width of [390,600,768,1280]){
  const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
  const networkErrors=[];
  page.on('requestfailed',req=>{if(networkErrors.length<12)networkErrors.push(req.url()+': '+req.failure()?.errorText)});
  const response=await page.goto(origin,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(2300);
  const state=await page.evaluate(()=>{
   const visible=e=>{if(!(e instanceof HTMLElement))return false;const css=getComputedStyle(e),r=e.getBoundingClientRect();return css.display!=='none'&&css.visibility!=='hidden'&&Number(css.opacity)>0&&r.width>1&&r.height>1};
   const nav=document.querySelector('header.site-header .nav,header .wrap.nav,header nav');
   const header=document.querySelector('.site-header,header');
   const buttons=[...document.querySelectorAll('header button,header [role="button"]')].filter(visible).map(e=>{
    const r=e.getBoundingClientRect();return{id:e.id,className:String(e.className),label:e.getAttribute('aria-label'),text:(e.innerText||e.textContent||'').trim().slice(0,90),outer:e.outerHTML.slice(0,560),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};
   });
   const rect=header?.getBoundingClientRect();
   const main=document.querySelector('main h1');
   const heading=main?.getBoundingClientRect();
   const menuButtons=buttons.filter(b=>/(^|\\s)menu(\\s|$)/i.test(b.text)||/open site navigation|menu/i.test(b.label||'')&& !/v11-nav-button/.test(b.className));
   return{width:innerWidth,headerHeight:rect?.height||0,headlineY:heading?.y||null,mainHeading:(main?.textContent||'').trim().slice(0,200),menuButtons,buttons,canonicalMenuCount:document.querySelectorAll('#v1341-mobile-menu').length, horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2};
  });
  findings.push({width,status:response.status(),...state,networkErrors});
  console.log('MOBILE_HEADER_DIAG '+JSON.stringify(findings.at(-1)));
  await page.screenshot({path:'artifacts/mobile-header/home-'+width+'.png',fullPage:false});
  if(!diagnostic){
   assert.equal(response.status(),200,'Public homepage must serve 200');
   assert(state.mainHeading.length>12,'Educational heading must remain visible in document');
   assert.equal(state.horizontalOverflow,false,'No horizontal viewport overflow');
   if(width<=900){
    assert.equal(state.canonicalMenuCount,1,'One canonical mobile menu DOM node');
    assert.equal(state.menuButtons.length,1,'Exactly one visible functional mobile Menu control');
    assert(state.headerHeight<250,'Mobile header must not swallow educational content');
    const btn=page.locator('#v1341-mobile-menu');
    await btn.focus();
    assert.equal(await btn.getAttribute('aria-expanded'),'false');
    await page.keyboard.press('Enter');
    await page.locator('.v1341-mobile-panel').waitFor({state:'visible',timeout:8000});
    assert.equal(await btn.getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    await page.locator('.v1341-mobile-drawer').waitFor({state:'hidden',timeout:8000});
    assert.equal(await btn.getAttribute('aria-expanded'),'false');
    await btn.click();
    await page.locator('.v1341-mobile-panel').waitFor({state:'visible',timeout:8000});
    await page.locator('.v1341-mobile-close').click();
    await page.locator('.v1341-mobile-drawer').waitFor({state:'hidden',timeout:8000});
   }else assert.equal(state.menuButtons.length,0,'Desktop should not show mobile menu');
  }
  await page.close();
 }
 writeFileSync('artifacts/mobile-header/diagnostic.json',JSON.stringify(findings,null,2));
 console.log('PASS real mobile header Chromium '+findings.length+' viewports '+(diagnostic?'diagnostic only':'full keyboard and visible-menu acceptance'));
}finally{await browser.close();}
