/* Real desktop/mobile Chromium rendering for the PUBLIC homepage-only
   Constellation. No authenticated member, payment or protected route is used. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const index=readFileSync('index.html','utf8');
assert.match(index,/home-constellation-compact-v3\.css\?v=20261105-compact3/);
const root=process.cwd();
const fixture=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/assets/css/prototype-learning-constellation-v1.css">
<link rel="stylesheet" href="/assets/css/home-academy-wide-chart-galaxy-v1.css">
<link rel="stylesheet" href="/assets/css/home-constellation-compact-v3.css?v=20261105-compact3">
</head><body>
<footer class="footer" id="website-footer"><p>Real website footer remains after all main content.</p></footer>
<main><section id="learning-constellation" class="gu-home-galaxy-section" aria-label="Learning Constellation">
<div id="pt-experiences-root" class="gu-home-galaxy-host"></div></section></main>
<script defer src="/assets/js/home-learning-constellation-v1.js?v=20261105-compact3"></script>
</body></html>`;
const server=createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(name==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});return res.end(fixture)}
 if(!/^\/(?:assets\/(?:js\/(?:home-learning-constellation-v1|prototype-learning-constellation-v1|prototype-constellation-galaxy-v2)\.js|css\/(?:prototype-learning-constellation-v1|home-academy-wide-chart-galaxy-v1|home-constellation-compact-v3)\.css)|data\/(?:competency-lab-paths-v01499|tutor-indicator-study-v1|tutor-indicator-expansion-v1)\.json)$/.test(name)){res.writeHead(404);return res.end('Not found')}
 const file=resolve(root,'.'+name);
 if(!file.startsWith(root+'/')||!existsSync(file)){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'content-type':extname(file)==='.js'?'application/javascript':extname(file)==='.css'?'text/css':'application/json','cache-control':'no-store'});
 res.end(readFileSync(file));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
mkdirSync('artifacts/learning-constellation',{recursive:true});
const results=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'networkidle',timeout:30000});
  await page.locator('.lc-app[data-gu-constellation-home-compact="v3"]').waitFor({timeout:20000});
  const data=await page.evaluate(()=>{
   const q=s=>document.querySelector(s),style=s=>getComputedStyle(q(s));
   const box=s=>q(s).getBoundingClientRect();
   const map='#learning-constellation #pt-experiences-root';
   const footer=q('#website-footer'),main=q('main');
   return {
    headerHeight:Math.round(box(map+' .lc-head').height),
    metricHeight:Math.round(box(map+' .lc-metrics>div').height),
    tabHeight:Math.round(box(map+' .lc-tabs button').height),
    mapHeaderHeight:Math.round(box(map+' .lc-map-head').height),
    mapTitleFont:parseFloat(style(map+' .lc-map-head strong').fontSize),
    toolbarButtonHeight:Math.round(box(map+' .lc-map-tools button').height),
    canvasMinHeight:parseFloat(style(map+' .lc-canvas').minHeight),
    footerAfterMain:Boolean(main.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING),
    embeddedFooterCount:document.querySelectorAll(map+' footer.footer,'+map+' .gu-legal-footer-grid').length,
    modeCount:document.querySelectorAll(map+' .lc-tabs button').length,
    zoomBefore:q('[data-lc="scale"]').textContent.trim(),
   };
  });
  assert.equal(data.modeCount,4,'Four educational modes must remain available');
  assert(data.mapTitleFont<=13,'Map title must be demonstrably smaller');
  assert(data.metricHeight<=65,'Metric cards must no longer be oversized');
  assert(data.tabHeight<=51,'Mode tabs must be compact');
  assert(data.toolbarButtonHeight<=(width>700?35:43),'Toolbar controls must shrink while retaining touch targets');
  assert(data.canvasMinHeight<=350,'Canvas vertical minimum must be reduced');
  assert(data.footerAfterMain,'Canonical footer must be below the Learning Constellation');
  assert.equal(data.embeddedFooterCount,0,'No website footer may appear inside the map');
  await page.locator('[data-lc="plus"]').click();
  const zoomAfter=(await page.locator('[data-lc="scale"]').innerText()).trim();
  assert.notEqual(zoomAfter,data.zoomBefore,'Zoom control must remain functional');
  await page.locator('[data-mode="tutor"]').click();
  assert.match(await page.locator('[data-lc="map-title"]').innerText(),/73 teaching guides/);
  assert.deepEqual(errors,[],'Browser must have no unhandled JavaScript errors');
  await page.screenshot({path:'artifacts/learning-constellation/home-compact-v2-'+width+'.png',fullPage:true});
  results.push({width,...data,zoomAfter,errorCount:0});
  await page.close();
 }
 console.log('PASS PUBLIC HOME CONSTELLATION COMPACT V2 '+JSON.stringify(results));
}finally{
 await browser.close();
 await new Promise(r=>server.close(r));
}
