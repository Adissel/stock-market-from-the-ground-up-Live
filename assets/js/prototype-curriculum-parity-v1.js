/* Crownlight Prototype curriculum parity V1.
 * Authenticated staff-only UI mounted inside the protected Prototype Center.
 * Public catalog metadata only: no private grade keys, member records, real
 * orders, entitlement writes, historical bar predictions or chart feed.
 */
(()=>{'use strict';
const host=document.getElementById('pt-curriculum-parity');
const app=document.getElementById('pt-app');
if(!host||!app)return;
const out=document.getElementById('pt-parity-body');
const status=document.getElementById('pt-parity-status');
let snapshot=null,loading=false,epoch=0,tab='labs',selected='',visibleLimit=30,familyFilter='ALL';
const h=(tag,text,className)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=String(text);if(className)x.className=className;return x};
const appendLine=(root,label,value)=>{const p=h('p');p.append(h('strong',label+' '),document.createTextNode(String(value||'Not published in public metadata')));root.append(p)};
const allowed=new Set(['labs','academy','guides','computed']);
const tabTitles={labs:'Canonical Labs',academy:'Boot Camps',guides:'Indicator study guides',computed:'Calculated chart studies'};
const stages='Start · Learn · Calculate · Experiment · Predict · Replay / Practice · Assess · Review & Retry · Transfer Challenge · Results';
const abortMessage='Reference catalog unavailable. No member or protected grading data was loaded.';
const fetchJson=async url=>{
 const response=await fetch(url,{method:'GET',cache:'no-store',credentials:'omit',headers:{accept:'application/json'}});
 if(!response.ok)throw Error('Reference source returned HTTP '+response.status);
 return response.json();
};
async function catalog(){
 const [labs,skills,indicators,guided,indicatorExtension,guidedExtension,academy,bridges,academyEvidence,freeEvidence]=await Promise.all([
  fetchJson('/data/competency-lab-paths-v01499.json'),
  fetchJson('/data/competency-study-guides-v01499.json'),
  fetchJson('/data/tutor-indicator-study-v1.json'),
  fetchJson('/data/tutor-guided-practice-v1.json'),
  fetchJson('/data/tutor-indicator-expansion-v1.json'),
  fetchJson('/data/tutor-guided-practice-expansion-v1.json'),
  fetchJson('/api/bootcamp-academy?action=catalog'),
  fetchJson('/data/lab-teaching-bridges-v014168.json'),
  fetchJson('/data/academy-specific-source-instruction-v1.json'),
  fetchJson('/data/free-foundations-evidence-v1.json')
 ]);
 const computed=window.CrownlightPrototypeIndicators?.specs;
 const allIndicatorGuides=[...(indicators?.guides||[]),...(indicatorExtension?.guides||[])];
 const allGuidedModules=[...(guided?.modules||[]),...(guidedExtension?.modules||[])];
 if(labs?.totalCanonicalLabs!==419||Object.keys(labs.byLab||{}).length!==419||
   skills?.guides?.length!==30||indicators?.guides?.length!==61||
   indicators.count!==61||guided?.indicatorCount!==61||
   guided?.numericIndicatorCount!==53||guided?.interpretationOnlyIndicatorCount!==8||
   !Array.isArray(guided.modules)||guided.modules.length!==134||
   indicatorExtension?.count!==12||indicatorExtension.guides?.length!==12||
   guidedExtension?.indicatorCount!==12||guidedExtension.modules?.length!==12||
   allIndicatorGuides.length!==73||allGuidedModules.length!==146||
   bridges?.version!=='0.14.0.168'||
   bridges.canonicalLabCount!==419||bridges.officialCompetencyCount!==30||
   bridges.independentGradesIncluded!==false||bridges.historicalBarDataIncluded!==false||
   Object.keys(bridges.entries||{}).length!==419||
   Object.keys(labs.byLab).some(id=>bridges.entries[id]?.labId!==id)||
   academyEvidence?.canonicalUnitCount!==3||academyEvidence.records?.length!==3||
   freeEvidence?.records?.length!==5||academyEvidence.records.some(row=>
     !['watchlist7','scanners10'].includes(row.programCode)||row.fictional!==true||
     !Number.isInteger(row.day)||!row.objective||!row.worked||!row.transfer)||
   freeEvidence.records.some(row=>!Number.isInteger(row.day)||row.day<1||row.day>5||
     !row.objective||!row.worked||!row.transfer)||
   academy?.ok!==true||!Array.isArray(academy.programs)||
   academy.programs.length<7||academy.programs.length>10||
   academy.programs.some(p=>p.code==='free5')||
   !Array.isArray(computed)||computed.length!==16){
   throw Error('Canonical learning registry or calculated-study count mismatch');
 }
 if(new Set(Object.keys(labs.byLab)).size!==419||
    new Set(indicators.guides.map(g=>g.code)).size!==61||
    new Set(allIndicatorGuides.map(g=>g.code)).size!==73||
    new Set(allGuidedModules.map(m=>m.id)).size!==146||
    new Set(academy.programs.map(p=>p.code)).size!==academy.programs.length){
   throw Error('Duplicate learning catalogue identifiers');
 }
 const indicatorModules=allGuidedModules.filter(m=>m.kind==='indicator');
 const indicatorByCode=new Map(indicatorModules.map(m=>[m.guideCode,m]));
 if(indicatorModules.length!==73||indicatorByCode.size!==73||
   indicatorModules.filter(m=>m.metric!=='study-concept').length!==53||
   indicatorModules.filter(m=>m.metric==='study-concept').length!==20||
   allIndicatorGuides.some(g=>!indicatorByCode.has(g.code)||
     !g.title||!indicatorByCode.get(g.code)?.title))
   throw Error('Guided indicator module and reference catalog mismatch');
 const guideByCode=new Map(skills.guides.map(g=>[g.code,g]));
 const academyCases=code=>academyEvidence.records.filter(row=>row.programCode===code).map(row=>({...row,kind:'advanced_source_evidence'}));
 const freeCases=freeEvidence.records.map(row=>({...row,kind:'free_foundations_evidence'}));
 const academyRows=academy.programs.map(p=>({
   key:p.code,title:p.name||p.title||p.code,summary:String(p.days)+' study days',
   body:[['Program code',p.code],['Learning days',p.days],
     ['Description',p.description||p.summary||'Program catalog metadata only'],
     ['Published route',p.route||'/bootcamp-academy.html?program='+encodeURIComponent(p.code)]],
   examples:academyCases(p.code)
 }));
 // Free Foundations has a separate verified public evidence register and its
 // own server entitlement. Do not fabricate it inside the Academy catalog API.
 academyRows.unshift({
   key:'free5',title:'Free Foundations — five introductory lessons',
   summary:'5 source-documented ungraded lessons · actual Free enrollment remains protected',
   body:[['Program code','free5'],['Learning days',5],
     ['Evidence status',freeEvidence.status||'Public source register; official grading not inferred'],
     ['Member route','/bootcamp-academy.html?program=free5']],
   examples:freeCases
 });
 return {
  labs:Object.entries(labs.byLab).map(([id,row])=>({
   key:id,title:row.title||id,summary:row.bookCode||'Ungraded teaching bridge',
   body:[['Source ID',id],['Collection',row.bookCode],['Mapped competencies',(row.relatedCompetencies||[]).map(code=>guideByCode.get(code)?.title||code).join(', ')||'Not mapped'],
    ['Evidence level',row.method||'Provisional ungraded mapping']],
   guide:(row.relatedCompetencies||[]).map(code=>guideByCode.get(code)).filter(Boolean).slice(0,2),
   bridge:bridges.entries[id]
  })),
  academy:academyRows,
  guides:allIndicatorGuides.map(g=>({
   key:g.code,title:g.title||g.code,summary:g.family||'Authored research brief',
   body:[['Concept',g.concept],['Formula',g.formula],['Why examine it',g.whyUse],
    ['How to use the study',g.howToUse],['Learning procedure',g.procedure],
    ['Common live-trading mistake',g.commonError],['Invalidation / evidence limits',g.invalidation],
    ['Limitations',g.limit||g.limits],['Ungraded self-check',g.selfCheck],
    ['Ungraded review explanation',g.reviewExplanation],
    ['Talia Guided Practice module',indicatorByCode.get(g.code).id],
    ['Talia Guided Practice status',indicatorByCode.get(g.code).metric==='study-concept'?'Interpretation-only scenario; no numerical indicator output':'Calculated synthetic demonstration ('+indicatorByCode.get(g.code).metric+'); not a live chart study'],
    ['Status','Original source-informed, ungraded guidance; a Talia numeric demonstration does not imply a Chart Studio overlay'],
    ['Calculation acceptance','Settings, inputs, units, warm-up and session rules require independent verification before enabling a computed Chart Studio study.']],
   references:g.sourceUrls
  })),
  computed:computed.map(x=>({
   key:x.id,title:x.label||x.id,summary:x.family||'Calculated OHLCV study',
   body:[['Chart placement',x.placement||'Calculated study'],['Source','Shared CrownlightIndicatorMath and fictional completed bars'],['Limitation',x.id==='VWAP'?'OHLCV HLC3 volume-weighted proxy — NOT transaction VWAP':'Study is illustrative, not a trading signal or verified forecast']]
  }))
 };
}
function render(){
 if(!snapshot||app.hidden||!host.open)return;
 out.replaceChildren();
 const intro=h('p','Read-only inspection of CURRENT public learning metadata. This is not a member login, teaching transcript, grade or entitlement.','pt-parity-note');
 out.append(intro);
 const totals=h('p','419 canonical Lab pathways · '+(snapshot.academy.length-1)+' currently listed Academy paths + Free Foundations · 30 competency guides · 73 indicator teaching guides (61 original + 12 extended) · 146 guided-practice modules · 53 Talia synthetic calculations · 20 interpretation-only Talia studies · 16 computed Chart Studio studies','pt-parity-totals');
 out.append(totals);
 const controls=h('div',undefined,'pt-parity-controls');
 const nav=h('div',undefined,'pt-parity-tabs');nav.setAttribute('role','group');nav.setAttribute('aria-label','Source catalog type');
 for(const category of allowed){const b=h('button',tabTitles[category]);b.type='button';b.dataset.parityTab=category;b.setAttribute('aria-pressed',String(tab===category));b.addEventListener('click',()=>{tab=category;selected='';visibleLimit=30;familyFilter='ALL';host.dataset.query='';render()});nav.append(b)}
 const label=h('label','Filter actual source titles and codes');
 const search=h('input');search.type='search';search.id='pt-parity-search';search.autocomplete='off';search.placeholder='Search within '+tabTitles[tab].toLowerCase();
 const prior=host.dataset.query||'';search.value=prior;label.append(search);controls.append(nav,label);
 if(tab==='guides'){
  const familyLabel=h('label','Indicator family');const familySelect=h('select');
  familySelect.id='pt-parity-family';familySelect.setAttribute('aria-label','Filter indicator family');
  const families=['ALL',...new Set(snapshot.guides.map(item=>item.summary))].sort((a,b)=>a==='ALL'?-1:b==='ALL'?1:a.localeCompare(b));
  for(const name of families){const option=h('option',name==='ALL'?'All indicator families':name);option.value=name;familySelect.append(option)}
  familySelect.value=familyFilter;familySelect.addEventListener('change',()=>{familyFilter=familySelect.value;selected='';visibleLimit=30;update()});
  familyLabel.append(familySelect);controls.append(familyLabel);
 }
 out.append(controls);
 const body=h('div',undefined,'pt-parity-layout');
 const list=h('div',undefined,'pt-parity-list');list.setAttribute('role','group');list.setAttribute('aria-label',tabTitles[tab]);
 const inspector=h('section',undefined,'pt-parity-inspector');inspector.setAttribute('aria-label','Verified public source teaching detail');
 body.append(list,inspector);out.append(body);
 const inspect=item=>{
  selected=item.key;inspector.replaceChildren(h('h3',item.title),h('p',item.summary,'pt-parity-muted'));
  for(const [name,value] of item.body)appendLine(inspector,name+':',value);
  if(tab==='labs'){
   inspector.append(h('h4','How the shared Lab engine teaches this subject'));
   inspector.append(h('p',stages));
   const facets=[['understand','Understand this Lab'],['recognize','Recognize the evidence'],['apply','Apply the concept'],['mistake','Common live-trading mistake'],['limits','Limitations and uncertainty']];
   for(const [key,label] of facets){
    const parts=item.bridge?.tabs?.[key];
    // Editorial batches may have one concise original paragraph instead of
    // the older three-paragraph generic template. Never hide source material,
    // invent missing paragraphs, or call the shorter draft fully approved.
    const actual=Array.isArray(parts)?parts.filter(p=>typeof p==='string'&&p.trim()):[];
    const section=h('details');section.open=key==='understand';
    section.append(h('summary',label));
    for(const paragraph of actual)section.append(h('p',paragraph));
    if(actual.length<3)section.append(h('p',
      'Editorial depth review pending: '+actual.length+' of 3 prior structure paragraphs. Source subject-specificity and independent examples require individual acceptance.',
      'pt-parity-note'));
    inspector.append(section);
   }
   for(const guide of item.guide||[]){
    const section=h('section');section.append(h('h4',guide.title),h('p',guide.concept));
    appendLine(section,'Worked procedure:',guide.procedure);
    appendLine(section,'Common mistake:',guide.commonError);
    appendLine(section,'Limitation:',guide.limit);
    inspector.append(section);
   }
   inspector.append(h('p','These public competency summaries are provisional. Independent official assessment, historical data provenance and protected answer keys are NOT loaded.','pt-parity-note'));
  }
  if(tab==='academy'){
   inspector.append(h('h4','Actual documented instructional-day examples'));
   const cases=item.examples||[];
   if(cases.length===0){
    inspector.append(h('p','No individually source-documented instructional-day example is available in these two published evidence registers. Course presence and day count do not establish independent advanced-depth review.','pt-parity-note'));
   }
   for(const lesson of cases){
    const section=h('details');section.className='pt-parity-lesson';
    const summary=h('summary','Day '+lesson.day+' · '+lesson.title);section.append(summary);
    for(const [label,value] of [
      ['Learning objective',lesson.objective],
      ['Source-supported claim',lesson.claim],
      ['Worked fictional example',lesson.worked],
      ['Calculation or research procedure',lesson.calculation],
      ['Common misconception / counterexample',lesson.counterexample],
      ['Independent transfer task',lesson.transfer],
      ['Limitation',lesson.limit]
    ])appendLine(section,label+':',value);
    appendLine(section,'Editorial/evidence classification:',lesson.reviewStatus||lesson.claimStatus||'Published source-evidence record; no official grade');
    section.append(h('p','FICTIONAL / UNGRADED · no completion, reward or member progress is recorded.','pt-parity-note'));
    inspector.append(section);
   }
   inspector.append(h('p','Actual enrollment, study progress, entitlement and protected course assessments remain owned by the live Academy service. Source-linked examples are not individual official editorial approvals.','pt-parity-note'));
  }
  if(tab==='guides'){
   inspector.append(h('p','A research brief does not imply a supported computed overlay, a graded Lab, or independently verified trade-print data. The self-check and review are ungraded.','pt-parity-note'));
   const safeSources=(item.references||[]).filter(x=>typeof x==='string'&&/^https:\/\//i.test(x));
   if(safeSources.length){
    inspector.append(h('h4','Original public study references — verify current definitions'));
    const sources=h('ul',undefined,'pt-parity-sources');
    for(const url of safeSources){
     const row=h('li'),link=h('a',url);
     link.href=url;link.target='_blank';link.rel='noopener noreferrer';
     row.append(link);sources.append(row);
    }
    inspector.append(sources);
   }
  }
  for(const button of list.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.key===item.key));
 };
 const update=()=>{
  const term=search.value.trim().toLocaleLowerCase();host.dataset.query=search.value;
  const rows=snapshot[tab].filter(x=>(familyFilter==='ALL'||tab!=='guides'||x.summary===familyFilter)&&
    (x.key+' '+x.title+' '+x.summary).toLocaleLowerCase().includes(term));
  const showing=Math.min(visibleLimit,rows.length);
  const count=h('p',rows.length+' matching '+tabTitles[tab].toLowerCase()+'. Showing '+showing+' of '+rows.length+'.','pt-parity-muted');
  count.setAttribute('role','status');count.setAttribute('aria-live','polite');
  list.replaceChildren(count);
  for(const item of rows.slice(0,visibleLimit)){
   const button=h('button',item.title+' · '+item.key);button.type='button';button.dataset.key=item.key;
   button.setAttribute('aria-pressed',String(selected===item.key));
   button.addEventListener('click',()=>inspect(item));list.append(button);
  }
  if(showing<rows.length){
   const nextCount=Math.min(30,rows.length-showing);
   const more=h('button','Show next '+nextCount+' records','pt-parity-load-more');
   more.type='button';more.setAttribute('aria-label','Show next '+nextCount+' of '+rows.length+' '+tabTitles[tab].toLowerCase());
   more.addEventListener('click',()=>{
    const firstNewIndex=showing;
    visibleLimit+=30;update();
    const nextButton=list.querySelectorAll('button[data-key]')[firstNewIndex];
    if(nextButton)nextButton.focus();
   });
   list.append(more);
  }
  const current=rows.find(x=>x.key===selected)||rows[0];
  if(current)inspect(current);else inspector.replaceChildren(h('p','No public source matches this filter.'));
 };
 search.addEventListener('input',()=>{selected='';visibleLimit=30;update()});
 update();
}
async function load(){
 if(!host.open||app.hidden||loading)return;
 if(snapshot){render();return}
 loading=true;const attempt=++epoch;status.textContent='Loading public Lab, Academy and indicator registries…';
 try{const data=await catalog();if(attempt!==epoch||app.hidden||!host.open)return;snapshot=data;status.textContent='Source catalogs verified; no private member or grade data accessed.';render()}
 catch(e){if(attempt!==epoch||app.hidden)return;status.textContent=abortMessage+' '+String(e?.message||'');out.replaceChildren()}
 finally{loading=false}
}
host.addEventListener('toggle',()=>{if(host.open)void load();else{epoch++;loading=false;}});
const guard=new MutationObserver(()=>{if(app.hidden){epoch++;loading=false;snapshot=null;selected='';out.replaceChildren();status.textContent='Sign in as authorized staff to inspect current public learning sources.';}else if(host.open)void load()});
guard.observe(app,{attributes:true,attributeFilter:['hidden']});
})();
