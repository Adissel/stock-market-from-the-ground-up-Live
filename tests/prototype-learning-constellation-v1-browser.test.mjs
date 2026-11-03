/* Real Chromium fixture for new staff-only Constellation visual experience.
 * The fixture does not grant or simulate real member/staff entitlements. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {join,resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const boot=readFileSync('assets/js/prototype-experiences-boot-v1.js','utf8');
const html=readFileSync('prototype.html','utf8');
assert(boot.includes("page==='map'"),'Protected bootstrap must explicitly support map route');
assert(boot.includes('if(stopped||protectedApp.hidden)return'),'Map must retain existing staff-only pt-app visibility gate');
assert(html.includes('data-route-access="staff"'),'Map must remain inside staff-only prototype document');
assert(html.includes('href="/prototype.html?experience=map"'),'Owner must get a visible route to new design');
const origin=process.cwd();
const server=createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/'){
  res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
  return res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<link rel="stylesheet" href="/assets/css/prototype-learning-constellation-v1.css">'+
   '<main id="pt-experiences-root"></main>'+
   '<script type="module">import {mountLearningConstellation} from "/assets/js/prototype-learning-constellation-v1.js";'+
   'window.__stop=mountLearningConstellation(document.getElementById("pt-experiences-root"));</script>');
 }
 if(!/^\/(?:assets\/(?:js|css)\/prototype-learning-constellation-v1\.(?:js|css)|data\/(?:competency-lab-paths-v01499|tutor-indicator-study-v1|tutor-indicator-expansion-v1)\.json)$/.test(pathname)){
  res.writeHead(404);return res.end('Not found');
 }
 const file=resolve(origin,'.'+pathname);if(!file.startsWith(origin+'/')||!existsSync(file)){
  res.writeHead(404);return res.end('Not found');
 }
 const type=extname(file)==='.js'?'application/javascript':extname(file)==='.css'?'text/css':'application/json';
 res.writeHead(200,{'content-type':type,'cache-control':'no-store'});res.end(readFileSync(file));
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const address='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
mkdirSync('artifacts/learning-constellation',{recursive:true});
const STAGE_NAME=/^(Start|Learn|Experiment|Predict|Practice|Assess|Review|Transfer|Results)$/;
const details=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const jsErrors=[];page.on('pageerror',e=>jsErrors.push(String(e)));
  await page.goto(address,{waitUntil:'networkidle',timeout:30000});
  await page.locator('.lc-point').first().waitFor();
  assert.equal(await page.locator('.lc-point').count(),10,'Initial nine stages plus central engine');
  assert.equal((await page.locator('[data-lc="labs-num"]').innerText()).trim(),'419');
  assert.equal((await page.locator('[data-lc="tutor-num"]').innerText()).trim(),'73');
  assert(await page.locator('h1').innerText().then(s=>s.includes('CONSTELLATION')));
  assert.equal(await page.locator('.lc-tabs button[aria-pressed="true"]').count(),1);
  await page.locator('.lc-point').nth(2).click();
  assert(await page.locator('[data-lc="title"]').innerText().then(s=>STAGE_NAME.test(s)));
  await page.locator('[data-mode="labs"]').click();
  assert.equal(await page.locator('.lc-point').count(),13,'12 mapped competencies plus hub');
  await page.getByRole('button',{name:/VWAP Context/i}).first().click();
  assert((await page.locator('[data-lc="evidence"]').innerText()).includes('DT-')||(await page.locator('[data-lc="evidence"]').innerText()).includes('TAPE-'));
  await page.locator('[data-mode="academy"]').click();
  assert.equal(await page.locator('.lc-point').count(),11,'10 actual Boot Camp paths plus central hub');
  await page.locator('[data-mode="tutor"]').click();
  assert(await page.locator('.lc-point').count()>4,'Actual Talia indicator guides connected');
  assert.equal(await page.locator('[data-lc="flatten"]').getAttribute('aria-pressed'),'false','3D projection is the default');
  const basePoint=await page.locator('.lc-point').nth(1).evaluate(el=>({x:el.style.left,y:el.style.top}));
  await page.locator('[data-lc="orbit-right"]').click();
  const projectedPoint=await page.locator('.lc-point').nth(1).evaluate(el=>({x:el.style.left,y:el.style.top}));
  assert.notDeepEqual(projectedPoint,basePoint,'3D orbit must reproject node coordinates');
  await page.locator('[data-lc="depth"]').fill('28');
  assert.equal(await page.locator('[data-lc="depth"]').inputValue(),'28','Depth setting must update');
  await page.locator('[data-lc="flatten"]').click();
  assert.equal(await page.locator('[data-lc="flatten"]').getAttribute('aria-pressed'),'true','2D fallback must activate');
  assert.equal(await page.locator('.lc-orbit-ring').count(),0,'Flat view must remove 3D orbit guides');
  await page.locator('[data-lc="flatten"]').click();
  assert.equal(await page.locator('.lc-orbit-ring').count(),3,'3D depth guides must return');
  await page.locator('[data-lc="reset"]').click();
  assert.equal(await page.locator('[data-lc="depth"]').inputValue(),'68','Reset restores depth');
  await page.locator('[data-lc="canvas"]').focus();
  const beforeKeyboard=await page.locator('.lc-point').nth(1).evaluate(el=>el.style.left);
  await page.keyboard.press('ArrowRight');
  const afterKeyboard=await page.locator('.lc-point').nth(1).evaluate(el=>el.style.left);
  assert.notEqual(beforeKeyboard,afterKeyboard,'Keyboard navigation must orbit the map');
  const original=await page.locator('[data-lc="scale"]').innerText();
  await page.locator('[data-lc="plus"]').click();
  const changed=await page.locator('[data-lc="scale"]').innerText();
  assert.notEqual(original,changed,'Zoom must update world scale');
  await page.locator('[data-mode="journey"]').click();
  const node=page.locator('.lc-point-journey').first();
  // On a 390px phone the constellation sits below the explorer; mouse.move
  // does not automatically scroll the viewport like locator.click does.
  await node.scrollIntoViewIfNeeded();
  await page.evaluate(()=>{window.__lcPointerTrace=[];const stage=document.querySelector('.lc-canvas');
    ['pointerdown','pointermove','pointerup','pointercancel'].forEach(name=>stage.addEventListener(name,e=>{
      if(window.__lcPointerTrace.length<30)window.__lcPointerTrace.push({name,target:e.target.className?.baseVal||e.target.className,
        x:e.clientX,y:e.clientY,id:e.pointerId,drag:e.target.closest?.('.lc-point')?.dataset.nodeId||null});
    },true));
  });
  const before=await node.evaluate(e=>e.style.left);
  const box=await node.boundingBox();
  assert(box,'Node is visible for interaction');
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width/2+35,box.y+box.height/2+15,{steps:5});
  await page.mouse.up();
  const after=await node.evaluate(e=>e.style.left);
  const trace=await page.evaluate(()=>window.__lcPointerTrace||[]);
  console.log('CONSTELLATION_DRAG '+JSON.stringify({width,before,after,trace}));
  await page.screenshot({path:'artifacts/learning-constellation/drag-diagnostic-'+width+'.png',fullPage:true});
  assert.notEqual(before,after,'Node must be draggable');
  assert.deepEqual(jsErrors,[],'No JavaScript exceptions');
  await page.screenshot({path:'artifacts/learning-constellation/map-'+width+'.png',fullPage:true});
  details.push({width,sourceLabs:419,tutorBriefs:73,academyPaths:10,zoom:true,drag:true,jsErrors:0});
  await page.close();
 }
 console.log('PASS learning constellation 2 genuine Chromium viewport tests '+JSON.stringify(details));
 writeFileSync('artifacts/learning-constellation/acceptance.json',JSON.stringify(details,null,2));
}finally{await browser.close();await new Promise(done=>server.close(done));}