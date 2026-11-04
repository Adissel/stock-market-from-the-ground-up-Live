/* Staff-auth gate simulation only — real Chromium rendering with original fixture cases.
 * No login, member account, third-party data or paid service is contacted. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {resolve} from 'node:path';

const source=resolve('assets/js/prototype-60-fictional-method-workbench-v1.js');
const styles=resolve('assets/css/prototype-60-fictional-method-workbench-v1.css');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,900,1280]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',x=>errors.push(x.message));
  await page.setContent('<!doctype html><html lang="en"><body><main id="pt-app" hidden><details id="pt-methods60"><summary>Staff study</summary><div id="pt-methods60-body"></div></details></main></body></html>');
  await page.addStyleTag({path:styles});
  await page.addScriptTag({path:source});
  await page.evaluate(()=>document.getElementById('pt-methods60').open=true);
  await page.waitForTimeout(40);
  assert.equal(await page.locator('#pt-methods60-body button').count(),0,'Must not mount before staff authorization');
  await page.evaluate(()=>document.getElementById('pt-app').hidden=false);
  await page.locator('#pt60-case').waitFor({timeout:10000});
  const host=page.locator('#pt-methods60-body');
  assert.equal(await host.locator('select option').count(),60);
  assert.equal(await host.locator('table tbody tr').count(),1);
  assert.match(await host.getByRole('status').innerText(),/1 of 6 simulated completed minute bars/);
  await host.getByRole('button',{name:'Next completed bar'}).click();
  assert.equal(await host.locator('table tbody tr').count(),2);
  await host.getByRole('button',{name:'Show method explanation'}).click();
  assert.match(await host.locator('.pt60-evidence').innerText(),/Completed O\/H\/L\/C bar geometry/);
  assert.equal(await host.locator('.pt60-evidence dl dd').count(),5);
  await host.locator('#pt60-case').selectOption('ORIGINAL-BAR_VWAP_PROXY-01');
  await host.getByRole('button',{name:'Show method explanation'}).click();
  assert.match(await host.locator('.pt60-evidence').innerText(),/NOT an exact transaction-print VWAP/);
  await host.locator('#pt60-case').selectOption('ORIGINAL-THREE_MINUTE-02');
  assert.equal(await host.locator('table tbody tr').count(),3);
  await host.getByRole('button',{name:'Previous completed bar'}).click();
  assert.equal(await host.locator('table tbody tr').count(),2);
  await host.getByRole('button',{name:'Show method explanation'}).click();
  assert.match(await host.locator('.pt60-evidence').innerText(),/Three completed one-minute bars are required/);
  await host.getByRole('button',{name:'Reset case'}).click();
  assert.equal(await host.locator('table tbody tr').count(),3);
  await host.getByRole('button',{name:'Next completed bar'}).click();
  await host.getByRole('button',{name:'Show method explanation'}).click();
  assert.match(await host.locator('.pt60-evidence').innerText(),/partialBarsHeld/);
  await host.locator('#pt60-case').selectOption('ORIGINAL-RISK-10');
  await host.getByRole('button',{name:'Show method explanation'}).click();
  assert.match(await host.locator('.pt60-evidence').innerText(),/wholeShares/);
  await host.getByRole('button',{name:'Hide method explanation'}).click();
  assert.equal(await host.locator('.pt60-evidence').isHidden(),true);
  const focused=host.getByRole('button',{name:'Next completed bar'});
  await focused.focus();
  assert.equal(await focused.evaluate(e=>document.activeElement===e),true);
  assert.equal(await host.evaluate(e=>e.getBoundingClientRect().width<=window.innerWidth),true,'Workbench must not overflow mobile width');
  await page.evaluate(()=>document.getElementById('pt-app').hidden=true);
  await page.waitForFunction(()=>document.querySelectorAll('#pt-methods60-body button').length===0);
  assert.deepEqual(errors,[]);
  console.log('PASS fictional 60-case staff gate, responsive and keyboard interaction: '+width);
  await context.close();
 }
}finally{await browser.close()}
