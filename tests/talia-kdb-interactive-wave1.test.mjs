/* First-party source-linked Talia Knowledge Classroom: deterministic 16 x 3 regression.
 * Uses no member credentials, paid inference, broker feeds, production writes or network requests.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=read('assets/js/talia-kdb-lessons-wave1.js');
const runtime=read('assets/js/talia-kdb-runner-v1.js');
class Node{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attrs={};this.listeners={};this.value='';this.disabled=false;this.hidden=false;this.className='';this.textContent='';}
 append(...nodes){this.children.push(...nodes);return this;}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(name,fn){this.listeners[name]=fn;}
 get lastElementChild(){return this.children.at(-1)||null;}
}
const context=vm.createContext({window:{},document:{createElement:tag=>new Node(tag)}});
vm.runInContext(data,context,{filename:'talia-kdb-lessons-wave1.js'});
vm.runInContext(runtime,context,{filename:'talia-kdb-runner-v1.js'});
const lessons=context.window.CrownlightKdbWave1;
const R=context.window.CrownlightKnowledgeLesson;
const expected={
 'knowledge-b002-bid-ask-spread-and-midpoint':[0.30,8.50,0.12],
 'knowledge-b002-market-order-with-depth':[302,250,236.20],
 'knowledge-b002-buy-and-sell-limit-orders':[1,2,0],
 'knowledge-b002-stop-order-trigger-versus-fill':[1,0,2],
 'knowledge-b002-simple-percent-return':[15,-16,10],
 'knowledge-b002-loss-recovery-asymmetry':[25,200/3,100/9],
 'knowledge-b002-market-cap-versus-share-price':[96,140,180],
 'knowledge-b002-dollar-cost-averaging-quantity':[15,25,8],
 'knowledge-b002-trade-profit-after-costs':[8,-1,-12],
 'research-study-ema':[10.20,24.80,8.60],
 'research-study-vwap':[26/3,10.25,13.4],
 'research-study-atr':[4/3,1.125,.88],
 'research-study-bollinger-bands':[13,12,18],
 'research-study-rsi':[75,40,20],
 'knowledge-b002-balance-sheet-accounting-identity':[180,28,-17],
 'knowledge-b002-fractional-share-exposure':[50,42,50]
};
test('exactly sixteen distinct sourced canonical Knowledge subjects and 48 original cases',()=>{
 assert.equal(Object.keys(lessons).length,16);
 assert.deepEqual(Object.keys(lessons).sort(),Object.keys(expected).sort());
 assert.equal(new Set(Object.values(lessons).flatMap(l=>l.cases.map(c=>c.prompt))).size,48);
 for(const [slug,lesson] of Object.entries(lessons)){
  assert.equal(lesson.slug,slug);
  assert.match(lesson.title,/\S/);
  assert.equal(lesson.cases.length,3);
  assert.equal(lesson.checkedOn,'2026-11-04');
  assert.equal(new URL(lesson.source).protocol,'https:');
  assert.match(new URL(lesson.source).hostname,/(^|\.)investor\.gov$|(^|\.)stockcharts\.com$/);
  for(const k of ['concept','teach','mistake','limit','predict','assess'])assert.ok(lesson[k].length>=35,slug+':'+k);
  assert.match(lesson.status,/REQUIRES_INDEPENDENT/);
 }
});
test('independent numerical and decision baselines for all 48 original activities',()=>{
 for(const [slug,wants] of Object.entries(expected)){
  const lesson=lessons[slug];
  for(let i=0;i<3;i++){
   const c=lesson.cases[i],actual=R.solve(c),want=wants[i];
   assert.ok(Math.abs(actual-want)<1e-8,slug+' case '+i+': '+actual+' vs '+want);
   assert.equal(R.matches(c,String(want)),true,slug+' case '+i+' expected');
   assert.equal(R.matches(c,String(want+2)),false,slug+' case '+i+' invalid');
  }
 }
});
test('nine stages are preserved and unavailable stages cannot be skipped',()=>{
 assert.equal(Array.from(R.stages).join(','),'Start,Learn,Experiment,Predict,Practice,Assess,Review,Transfer,Results');
 const first=lessons['research-study-ema'];
 const host=new Node('section');
 const article={id:'fictional-authorized-article-uuid',slug:first.slug,title:first.title,body_markdown:'# Original teaching content',access_plans:['FOUNDING_14']};
 assert.equal(R.mount({article,element:host}),true);
 assert.equal(host.hidden,false);
 let nav=host.children.find(x=>x.tagName==='nav'),controls=host.children.find(x=>x.className==='tkdb-actions');
 assert.equal(nav.children.length,9);
 assert.equal(nav.children[0].attrs['aria-current'],'step');
 assert.equal(nav.children[8].disabled,true);
 assert.equal(controls.children.at(-1).disabled,false);
 controls.children.at(-1).listeners.click();
 nav=host.children.find(x=>x.tagName==='nav');controls=host.children.find(x=>x.className==='tkdb-actions');
 assert.equal(nav.children[1].attrs['aria-current'],'step');
 controls.children.at(-1).listeners.click();
 nav=host.children.find(x=>x.tagName==='nav');controls=host.children.find(x=>x.className==='tkdb-actions');
 assert.equal(nav.children[2].attrs['aria-current'],'step');
 assert.equal(controls.children.at(-1).disabled,true,'learner must submit the experiment before advancing');
 assert.equal(nav.children[3].disabled,true,'future stage must remain inaccessible');
});
test('unmatched or improperly authorized article shapes never instantiate a lesson',()=>{
 const host=new Node('section');
 assert.equal(R.mount({article:{id:'any',slug:'unknown',title:'Unknown',body_markdown:'x',access_plans:['FREE']},element:host}),false);
 assert.equal(host.hidden,true);
 const first=lessons['research-study-ema'];
 assert.equal(R.mount({article:{slug:first.slug,title:first.title,id:'any'},element:host}),false);
 assert.equal(host.hidden,true);
 assert.equal(R.mount({article:{slug:first.slug,title:'Different title',id:'any',body_markdown:'x',access_plans:['FREE']},element:host}),false);
 assert.equal(host.hidden,true);
});
test('existing gated page wiring and build pipeline expose only post-authorization lessons',()=>{
 const article=read('assets/js/knowledge-article-page-v1.js');
 const html=read('knowledge-article.html');
 const build=read('scripts/build-pages.sh');
 assert.match(html,/id="kal-talia-classroom"[^>]+hidden/);
 assert.ok(html.indexOf('talia-kdb-lessons-wave1.js')<html.indexOf('talia-kdb-runner-v1.js'));
 assert.ok(html.indexOf('talia-kdb-runner-v1.js')<html.indexOf('knowledge-article-page-v1.js'));
 const authorize=article.indexOf("if(!response.ok||!data.ok)");
 const mount=article.indexOf('CrownlightKnowledgeLesson?.mount');
 assert.ok(authorize>=0&&mount>authorize);
 assert.match(article,/classroom.replaceChildren\(\);classroom.hidden=true/);
 assert.match(build,/node --test tests\/talia-kdb-interactive-wave1\.test\.mjs/);
 assert.doesNotMatch(runtime,/localStorage|sessionStorage|service_role|paidInference|fetch\s*\(/i);
});
