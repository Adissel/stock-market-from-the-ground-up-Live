import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const width of [390,768,1280]){
  const ctx=await browser.newContext({viewport:{width,height:860},serviceWorkers:'block'}),page=await ctx.newPage();
  await page.route('**/*.js',route=>route.abort());
  await page.goto('http://127.0.0.1:8769/dashboard.html',{waitUntil:'domcontentloaded'});
  const m=await page.evaluate(()=>{
   const shell=document.querySelector('.gu-member-dashboard-shell'),widgets=document.querySelector('.gu-member-lumen-widgets');
   const nav=document.querySelector('.site-header .nav'),b=document.createElement('button');
   b.id='gu-workspace-toggle';b.hidden=true;b.textContent='Close menu';nav.prepend(b);
   const sec=document.createElement('section');sec.className='gu-member-lumen-widget gu-member-lumen-gifting';
   sec.innerHTML='<form class="gu-lumen-gifting-form"><label>Recipient<input /></label><label>Lumens<input type="number" /></label><button type="button">Verify recipient</button><button type="button" disabled>Review and send</button></form>';widgets.append(sec);
   const bodyWidth=document.documentElement.clientWidth;const bounds=[...sec.querySelectorAll('input,button')].map(x=>x.getBoundingClientRect());
   return {scroll:document.documentElement.scrollWidth,bodyWidth,inside:shell.querySelector('main').contains(widgets),
     count:[...widgets.querySelectorAll('[data-member-lumen-wallet],[data-academy-study-progress],[data-member-lumen-history]')].length,
     col:getComputedStyle(widgets).gridTemplateColumns.split(' ').length,
     formCol:getComputedStyle(sec.querySelector('form')).gridTemplateColumns.split(' ').length,
     hidden:getComputedStyle(b).display==='none',
     fits:bounds.every(v=>v.left>=-2&&v.right<=bodyWidth+2),
     css:[...document.styleSheets].some(x=>x.href?.includes('lumen-dashboard-navigation-fix-v1.css'))};
  });
  assert(m.css&&m.inside&&m.count===3,'Lumen sections must exist inside dashboard');
  assert(m.scroll<=m.bodyWidth+12,'horizontal overflow '+width+'px: '+JSON.stringify(m));
  assert.equal(m.col,width>=1021?2:1);
  assert.equal(m.formCol,width<=600?1:2);
  assert(m.fits,'gifting controls must fit screen '+width);
  if(width>=901)assert(m.hidden,'desktop workspace toggle hidden');
  await ctx.close();console.log('PASS Lumen dashboard layout at '+width+'px');
 }
}finally{await browser.close()}
