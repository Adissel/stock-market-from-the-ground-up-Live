/* All remaining original Knowledge lessons: registry, authorization, nine stages and learning gates.
 * Runs without paid providers, network calls, credentials, real trades or database writes.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const batches=Array.from({length:5},(_,i)=>JSON.parse(read('data/talia-kdb-interactive-batch'+String(i+2).padStart(2,'0')+'-v1.json')));
const items=batches.flatMap(x=>x.lessons);
const rawIndex=read('assets/js/talia-kdb-remaining-index-v1.js');
const runtime=read('assets/js/talia-kdb-remaining-runner-v1.js');
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.listeners={};this.value='';this.disabled=false;this.hidden=false;this.className='';this.textContent='';}
 append(...items){this.children.push(...items);return this;}
 replaceChildren(...items){this.children=[...items];}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){this.listeners[k]=f;}
 get lastElementChild(){return this.children.at(-1)||null;}
}
const window={};
const context=vm.createContext({window,document:{createElement:tag=>new Element(tag)}});
vm.runInContext(rawIndex,context);
vm.runInContext(runtime,context);
const lesson=window.CrownlightKnowledgeRemaining;
function fixture(record,variant=false){
 const prose=variant?[
 ['Learning objective','Arithmetic mean of N completed closes, using a declared source and timeframe.'],
 ['Formula / definition','SMA equals the sum of N completed prices divided by N.'],
 ['Fictional case and independent self-check','Three completed prices 10, 11, 12 produce a three-bar SMA of 11.'],
 ['Explanation','With a new completed 13 replacing 10, the average is (11 + 12 + 13) / 3 = 12.'],
 ['Frequent error','A moving average crossing does not prove a trade will succeed.'],
 ['Limitations','Indicator seed, missing data and unfinished candles create uncertainty.']
 ]:[
 ['Learning objective','Define the observable evidence for '+record.title+' with source-specific inputs and constraints.'],
 ['Definition or calculation framework',record.title+' requires declared completed inputs, source, period, and rules.'],
 ['Observation and research procedure','Record the source timing and independently verify inputs; do not use future evidence.'],
 ['Fictional exercise','For '+record.title+', compare an original 10-unit case with a 12-unit variation. Name the observed values and missing facts.'],
 ['Instructor explanation','Explain the calculation or classification from the original fictional evidence; distinguish it from a verified execution.'],
 ['Common misconception','An appealing chart reading is not proof of a future trade profit.'],
 ['Evidence and limits','These calculations require the declared source, time boundary, assumptions, missing-data handling and appropriate rights.']
 ];
 prose.push(['Independent application','Apply '+record.title+' to an independently declared changed parameter; list all observable evidence and one invalidation.']);
 prose.push(['Self-check and answer guide','Question 1: What evidence is required? Answer: The declared source and valid completed observation.']);
 return {slug:record.slug,title:record.title,learning_level:record.learningLevel,
 id:'11111111-1111-4111-8111-111111111111',access_plans:['FOUNDING_30'],body_markdown:'# '+record.title+'\n\n'+prose.map(x=>'## '+x[0]+'\n\n'+x[1]).join('\n\n')};
}
test('batches 02–06 contain exactly 229 unique canonical Knowledge slugs with individual source metadata',()=>{
 assert.deepEqual(batches.map(x=>x.lessons.length),[50,50,50,50,29]);
 assert.equal(items.length,229);
 assert.equal(new Set(items.map(x=>x.slug)).size,229);
 assert.equal(lesson.registeredCount,229);
 const registry=window.CrownlightTaliaKdbBatches;
 assert.equal(Object.keys(registry).length,229);
 const wave1=read('assets/js/talia-kdb-lessons-wave1.js');
 const match=[...wave1.matchAll(/\bslug:'([a-z0-9-]+)'/g)].map(x=>x[1]);
 assert.equal(new Set(match).size,16);
 for(const x of items){
  assert.ok(!match.includes(x.slug),'duplicate of wave 1 '+x.slug);
  assert.equal(registry[x.slug].title,x.title);
  assert.equal(registry[x.slug].learningLevel,x.learningLevel);
  assert.equal(typeof x.subject,'string');
  assert.equal(x.activityContract.assess,'ungraded_source_check');
  assert.equal(x.memberAccess,'VERIFY_ON_AUTHENTICATED_ARTICLE_READ');
  assert.equal(x.factualReview,'REQUIRES_INDEPENDENT_ITEM_LEVEL_VERIFICATION');
  assert.ok(x.sourceUrlCount>=1,'missing source candidate '+x.slug);
  assert.equal(x.headingEvidence.independentApplication,true);
  assert.equal(x.headingEvidence.selfCheck,true);
  assert.equal(x.headingEvidence.limits,true);
 }
});
test('all 229 records generate a source-specific authorized interactive scenario contract',()=>{
 for(const record of items){
  const article=fixture(record,record.slug==='research-study-sma');
  assert.equal(lesson.canMount(article),true,'source-derived learner should mount '+record.slug);
  const d=lesson.explainData(article);
  for(const name of ['objective','definition','worked','explanation','independent','questions','limit'])
   assert.ok(d[name].length>20,record.slug+':'+name);
 }
});
test('the lesson never mounts from public catalog metadata or mismatched content',()=>{
 const rec=items.find(x=>x.slug==='research-study-sma')||items[0];
 const a=fixture(rec,true);
 const host=new Element('section');
 for(const bad of [
  null,{...a,id:null},{...a,body_markdown:null},{...a,access_plans:null},
  {...a,title:'Incorrect article title'},{...a,learning_level:'different'},{...a,slug:'unregistered-slug'}
 ]){assert.equal(lesson.mount({article:bad,element:host}),false);assert.equal(host.hidden,true);}
 assert.equal(lesson.mount({article:a,element:host}),true);
 assert.equal(host.hidden,false);
});
test('the existing 3x3 nine-stage learning journey requires independent learner response to advance',()=>{
 const a=fixture(items.find(x=>x.slug==='research-study-sma'),true);
 const host=new Element('section');
 assert.equal(lesson.mount({article:a,element:host}),true);
 const nav=host.children.find(x=>x.tagName==='nav'),actions=host.children.find(x=>x.className==='tkdb-actions'),body=host.children.find(x=>x.className==='tkdb-stage-content');
 assert.equal(Array.from(lesson.stages).join(','),'Start,Learn,Experiment,Predict,Practice,Assess,Review,Transfer,Results');
 assert.equal(nav.children.length,9);
 assert.equal(nav.children[8].disabled,true);
 actions.lastElementChild.listeners.click(); // learn
 actions.lastElementChild.listeners.click(); // experiment
 assert.equal(nav.children[2].attrs['aria-current'],'step');
 assert.equal(actions.lastElementChild.disabled,true,'experiment must be submitted');
 const label=body.children.find(x=>x.tagName==='label');
 const textarea=label.children.find(x=>x.tagName==='textarea');
 textarea.value='I used the previous three completed observations, excluded future bars, and documented the new 13 close.';
 const submit=body.children.find(x=>x.tagName==='button');
 submit.listeners.click();
 assert.equal(actions.lastElementChild.disabled,false,'learner may advance after submitting');
 actions.lastElementChild.listeners.click();
 assert.equal(nav.children[3].attrs['aria-current'],'step');
 assert.equal(nav.children[5].disabled,true,'no skipped future Assess stage');
});
test('document and page wiring permit authorized body use only; never save grades or invoke paid inference',()=>{
 const reader=read('assets/js/knowledge-article-page-v1.js');
 const article=read('knowledge-article.html');
 const page=read('talia-classroom.html');
 const database=read('knowledge-database.html');
 const build=read('scripts/build-pages.sh');
 assert.match(article,/id="kal-talia-classroom"[^>]*hidden/);
 assert.match(article,/talia-kdb-remaining-index-v1\.js/);
 assert.match(article,/talia-kdb-remaining-runner-v1\.js/);
 assert.doesNotMatch(page,/talia-kdb-directory|talia-kdb-guided-v1\.css|talia-kdb-directory-v1\.js/,'Classroom must not embed the independent Knowledge Database');
 assert.match(database,/id="gu-article-library-v1"/,'Knowledge articles remain in their own database directory');
 assert.match(article,/href="\/knowledge-database\.html"/,'Knowledge article navigation stays inside the Knowledge Database');
 const check=reader.indexOf('if(!response.ok||!data.ok)');
 const mounted=reader.indexOf('CrownlightKnowledgeRemaining?.mount');
 assert.ok(check>=0&&mounted>check);
 assert.match(build,/node --test tests\/talia-kdb-all-batches-v1\.test\.mjs/);
 assert.doesNotMatch(runtime,/(^|[^a-z])fetch\s*\(|localStorage|sessionStorage|paidInference|service_role|supabase\.from/i);
 assert.doesNotMatch(rawIndex,/body_markdown|privateKey|secretKey|articleBody/);
});
