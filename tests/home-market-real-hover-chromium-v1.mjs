/* Real offline Chromium coverage of the exact React/ECharts homepage code.
 * Local fictional chart fixture only: no member credentials, charges, or network data.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const js=(await build({entryPoints:['src/experience/HomeMarketTerminal.tsx'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',define:{'process.env.NODE_ENV':'"production"'}})).outputFiles[0].text;
const echarts=readFileSync('node_modules/echarts/dist/echarts.min.js','utf8');
const css=readFileSync('assets/css/home-market-terminal-v1.css','utf8');
const html='<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><script src="/echarts.js"></script></head><body style="background:#0b1222;margin:0"><main><div class="sm-v5-chart"></div></main><script src="/home.js"></script></body></html>';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:960,height:720}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://crownlight-home-fixture.test/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path==='/')return route.fulfill({status:200,contentType:'text/html',body:html});
  if(path==='/echarts.js')return route.fulfill({status:200,contentType:'application/javascript',body:echarts});
  if(path==='/home.js')return route.fulfill({status:200,contentType:'application/javascript',body:js});
  if(path==='/styles.css')return route.fulfill({status:200,contentType:'text/css',body:css});
  if(path==='/assets/js/crownlight-echarts-loader-v1.js')return route.fulfill({status:200,contentType:'application/javascript',body:'window.CrownlightECharts={load:async()=>window.echarts};'});
  return route.fulfill({status:404,body:'fixture resource not found'});
 });
 await page.goto('https://crownlight-home-fixture.test/',{waitUntil:'domcontentloaded'});
 const plot=page.locator('.cl-react-plot');
 await plot.waitFor({state:'visible',timeout:12000});
 await page.waitForFunction(()=>document.querySelector('.cl-react-plot canvas')!==null,{timeout:12000});
 assert.equal(errors.length,0,'No React or ECharts page errors');
 const rect=await plot.boundingBox();assert(rect,'Real chart is sized');
 let tooltip=false;
 for(const portion of [.5,.6,.4,.7]){
  await page.mouse.move(rect.x+rect.width*portion,rect.y+rect.height*.42);
  try{await page.locator('.cl-market-tooltip').waitFor({state:'visible',timeout:1400});tooltip=true;break}catch{}
 }
 assert(tooltip,'Real mouse hover must show candle inspection tooltip');
 const value=await page.locator('.cl-market-tooltip').innerText();
 for(const text of ['Open','High','Low','Close','Volume','Fictional'])assert(value.includes(text),text+' is visible on hover');
 assert(!/\d+\.\d{3,}/.test(value),'Tooltip must not expose unrounded values');
 await plot.focus();await page.keyboard.press('Home');
 await page.waitForFunction(()=>document.querySelector('.cl-react-bottom [role="status"]')?.textContent?.includes('Fictional B01'));
 await page.keyboard.press('ArrowRight');
 assert((await page.locator('.cl-react-bottom [role="status"]').innerText()).includes('Fictional B02'));
 await page.setViewportSize({width:390,height:800});
 const selects=page.locator('.cl-react-toolbar select');
 assert.equal(await selects.count(),3);
 for(let i=0;i<3;i++){const b=await selects.nth(i).boundingBox();assert(b&&b.x>=0&&b.x+b.width<=392,'Mobile control remains inside viewport');}
 assert.equal(errors.length,0,'No unexpected runtime errors');
 console.log('PASS real Chromium: mouse hover, rounded OHLCV, keyboard candle inspection, mobile chart control bounds');
}finally{await browser.close()}
