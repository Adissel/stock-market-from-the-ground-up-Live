import {ungradedResponseReview} from './tutor-response-scaffold-v014102.js';
import {coachFoundationReflection} from './talia-foundation-reflection-coach-v1.js';
import {foundationWorkedMath} from './tutor-foundation-worked-math-v1.js';
import {foundationQuantTeaching} from './talia-foundation-quant-v1.js';
import {foundationRiskTeaching} from './talia-foundation-risk-quant-v1.js';
import {researchMathTeaching} from './talia-research-math-v1.js';
import {indicatorWorkedTeaching} from './talia-indicator-worked-v1.js';
/* v0.14.0.100 — zero-cost source-grounded tutor upgrade.
 * Reuses the 30 original public competency study guides already published
 * for the member Skills page. NO private book manuscript, rubric, market bar,
 * journal note, vendor account, AI model, or second curriculum database.
 */
const excluded=new Set(['what','how','should','about','could','with','from','when','does','the','and','this','that','mean','teach','tell','please','market','stock','stockmarket','training','lesson','help']);
const words=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(x=>x.length>2&&!excluded.has(x)))];
function chooseGuides(index,q){
 if(!Array.isArray(index?.guides)||index.guides.length!==30)return [];
 const query=words(q);
 if(!query.length)return [];
 const genericDecision=new Set(['why','enter','entry','exit','exiting','hold','holding','wait','decision','trade','trading','setup','setups','when','what','look','for','stop','loss','pattern']);
 const distinctive=query.filter(w=>!genericDecision.has(w));
 const decisionIntent=/\b(?:enter|entry|exit|exiting|hold|holding|when to|would you|why|setup|setups|trade or skip|no trade|what to look for|stand aside|take profit|stop loss|invalidation|earnings|guidance|balance sheet|cash flow|long.term|portfolio|rebalanc|sector|regime|breadth|confluenc|conflicting|signals|order flow|tape|level ii|order book|options|option premium|theta|vega|assignment|implied volatility|diversif|fundamentals)\b/i.test(String(q||''));
 // An exact, complete Foundation lesson name must outrank broad risk
 // keywords. Limit this precedence to authored ungraded public topics.
 const named=String(q||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
   .replace(/^(?:explain|teach|describe|review|define)\s+/,'');
 const exact=Array.isArray(index.foundationExplanations)
   ?index.foundationExplanations.find(g=>g.foundationTopic===true
      &&String(g.title||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()===named)
   :null;
 if(exact)return [exact];
 const candidates=[...index.guides,...(Array.isArray(index.supplementalGuides)?index.supplementalGuides:[]),
  ...(Array.isArray(index.researchGuides)?index.researchGuides:[]),
  ...(Array.isArray(index.foundationExplanations)?index.foundationExplanations:[]),
  ...(decisionIntent&&Array.isArray(index.decisionGuides)?index.decisionGuides:[]),
  ...(Array.isArray(index.masterStudyGuides)?index.masterStudyGuides:[])];
 return candidates.map(g=>{
  const title=String(g.title||'').toLowerCase(),code=String(g.code||'').toLowerCase().replaceAll('_',' ');
  const concept=String(g.concept||'').toLowerCase();
  let score=query.reduce((v,w)=>v+(title.includes(w)?8:0)+(code.includes(w)?6:0)+(concept.includes(w)?2:0),0);
  // Prefer a specific authored supplemental topic over a broad parent guide
  // when the learner explicitly asks by its full exact title.
  if(g.foundationTopic===true&&String(q||'').toLowerCase().includes(title))score+=100;
  if(g.decisionPlaybook===true){
   // A question about a failed breakout should not be captured by a generic
   // entry/hold/exit guide or by the unrelated breakout continuation playbook.
   const topic=new Set(words(g.title+' '+g.code.replaceAll('_',' ')).filter(w=>!genericDecision.has(w)));
   score+=distinctive.filter(w=>topic.has(w)).length*18;
   if(g.code==='DECISION_FRAMEWORK'&&distinctive.length>0)score-=30;
  }
  if(g.masterStudy===true){
   // Named study terms must outrank unrelated descriptions mentioning trend,
   // volume or a generic setup. Do not reward partial substring acronyms.
   const qText=String(q||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
   const titleText=String(g.title||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
   if(titleText.length>=4&&qText.includes(titleText))score+=100;
   const terms=words(g.title+' '+String(g.code||'').replace(/^STUDY_(?:WATCH_|STRATEGY_)?/,'').replaceAll('_',' '))
    .filter(w=>!genericDecision.has(w));
   const present=new Set(query);
   score+=new Set(terms.filter(w=>present.has(w))).size*14;
   const suffix=String(g.code||'').replace(/^STUDY_(?:WATCH_|STRATEGY_)?/,'');
   if(/^[A-Z0-9]{3,6}$/.test(suffix)&&present.has(suffix.toLowerCase()))score+=100;
  }
  return {g,score};
 }).filter(x=>x.score>=5).sort((a,b)=>b.score-a.score||a.g.code.localeCompare(b.g.code)).slice(0,2).map(x=>x.g);
}
// Module-scoped cache is per Cloudflare isolate AND per ASSETS binding. It holds
// only publicly published curriculum, never member-specific/private records.
const publicGuideCache=new WeakMap();
async function loadPublicGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return null;
 const cached=publicGuideCache.get(env.ASSETS);
 if(cached&&cached.expires>Date.now())return cached.value;
 const url=new URL('/data/competency-study-guides-v01499.json',request.url);
 const result=await env.ASSETS.fetch(new Request(url,{method:'GET'}));
 if(!result.ok)throw Error('Published guide asset unavailable');
 const data=await result.json();
 if(!Array.isArray(data?.guides)||data.guides.length!==30)throw Error('Invalid original guide count');
 publicGuideCache.set(env.ASSETS,{value:data,expires:Date.now()+300000});
 return data;
}
const researchCache=new WeakMap();
async function loadResearchGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const saved=researchCache.get(env.ASSETS);
 if(saved&&saved.expires>Date.now())return saved.guides;
 const r=await env.ASSETS.fetch(new Request(new URL('/data/tutor-research-guides-v1.json',request.url),{method:'GET'}));
 if(!r.ok)throw Error('Supplemental public teaching asset unavailable');
 const payload=await r.json(),guides=payload?.guides;
 if(payload?.kind!=='original_public_tutor_supplemental_research_guides'||!Array.isArray(guides)||guides.length<32||guides.length>200)
  throw Error('Invalid research guide catalogue');
 const ids=new Set();
 for(const g of guides){
  if(!/^[A-Z][A-Z0-9_]{3,72}$/.test(String(g?.code||''))||ids.has(g.code)||
     g.researchGuide!==true||g.supplemental!==true||g.officialCompetency!==false||
     !String(g.archiveBasis||'').includes('STT')||
     (typeof g.title!=='string'||g.title.length<8)||
     ['concept','procedure','limit','invalidation','commonError','selfCheck','reviewExplanation']
       .some(k=>typeof g[k]!=='string'||g[k].length<40))
   throw Error('Invalid original research lesson');
  ids.add(g.code);
 }
 researchCache.set(env.ASSETS,{guides,expires:Date.now()+300000});
 return guides;
}
// Optional independent source-informed video intake: never changes official competencies.
const videoResearchCache=new WeakMap();
async function loadVideoResearchGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const cached=videoResearchCache.get(env.ASSETS);
 if(cached&&cached.expires>Date.now())return cached.guides;
 const result=await env.ASSETS.fetch(new Request(new URL('/data/tutor-video-transcript-research-v1.json',request.url),{method:'GET'}));
 if(!result.ok)throw Error('Optional video research asset unavailable');
 const data=await result.json(),guides=data?.guides;
 if(data?.kind!=='original_public_tutor_video_transcript_research'||data?.count!==14||!Array.isArray(guides)||guides.length!==14)throw Error('Invalid optional video research catalog');
 const ids=new Set();
 for(const g of guides){
  if(!/^VIDEO_[A-Z0-9_]{4,72}$/.test(String(g?.code||''))||ids.has(g.code)||
   g.researchGuide!==true||g.supplemental!==true||g.officialCompetency!==false||
   !String(g.archiveBasis||'').includes('STT')||!Array.isArray(g.sourceRefs)||g.sourceRefs.length<1||
   !['title','concept','procedure','limit','invalidation','commonError','selfCheck','reviewExplanation']
      .every(k=>typeof g[k]==='string'&&g[k].length>=40))throw Error('Invalid optional video research lesson');
  ids.add(g.code);
 }
 videoResearchCache.set(env.ASSETS,{guides,expires:Date.now()+300000});
 return guides;
}
const decisionCache=new WeakMap();
const DECISION_CITATION=/^https:\/\/(?:www\.)?(?:cmegroup\.com|fidelity\.com|schwab\.com|investor\.gov|sec\.gov|chartschool\.stockcharts\.com|help\.stockcharts\.com)\//i;
async function loadDecisionGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const cached=decisionCache.get(env.ASSETS);
 if(cached&&cached.expires>Date.now())return cached.guides;
 const r=await env.ASSETS.fetch(new Request(new URL('/data/tutor-decision-playbooks-v1.json',request.url),{method:'GET'}));
 if(!r.ok)throw Error('Optional public trade-decision teaching asset unavailable');
 const data=await r.json(),guides=data?.guides;
 if(data?.kind!=='original_public_tutor_decision_playbooks'||!Array.isArray(guides)||guides.length!==18)
  throw Error('Invalid original Tutor decision playbook count');
 const ids=new Set();
 for(const g of guides){
  if(!/^[A-Z][A-Z0-9_]{3,72}$/.test(String(g?.code||''))||ids.has(g.code)||
     g.decisionPlaybook!==true||g.researchGuide!==true||
     g.officialCompetency!==false||g.supplemental!==true||
     !Array.isArray(g.sourceUrls)||g.sourceUrls.length<1||g.sourceUrls.length>4||
     !g.sourceUrls.every(url=>typeof url==='string'&&DECISION_CITATION.test(url))||
     ['title','concept','watchFor','entryEvidence','holdEvidence','exitEvidence','noTrade',
      'fictionalCase','procedure','limit','invalidation','commonError','selfCheck','reviewExplanation']
      .some(k=>typeof g[k]!=='string'||g[k].length<35)||
     !g.fictionalCase.startsWith('FICTIONAL:'))
   throw Error('Invalid decision guide record');
  ids.add(g.code);
 }
 decisionCache.set(env.ASSETS,{guides,expires:Date.now()+300000});
 return guides;
}
const advancedCache=new WeakMap();
const ADVANCED_REFERENCE=/^https:\/\/(?:www\.)?(?:investor\.gov|optionseducation\.org|schwab\.com)\//i;
async function loadAdvancedDecisionGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const hit=advancedCache.get(env.ASSETS);
 if(hit&&hit.expires>Date.now())return hit.guides;
 const r=await env.ASSETS.fetch(new Request(new URL('/data/tutor-advanced-decision-guides-v1.json',request.url),{method:'GET'}));
 if(!r.ok)throw Error('Optional advanced public decision asset unavailable');
 const data=await r.json(),guides=data?.guides;
 if(data?.kind!=='original_public_tutor_advanced_decision_guides'||!Array.isArray(guides)||guides.length!==13)
  throw Error('Invalid advanced Tutor decision catalog');
 const ids=new Set();
 for(const g of guides){
  if(!/^[A-Z][A-Z0-9_]{3,72}$/.test(String(g?.code||''))||ids.has(g.code)||
    g.advancedDecisionGuide!==true||g.decisionPlaybook!==true||g.researchGuide!==true||
    g.supplemental!==true||g.officialCompetency!==false||
    !Array.isArray(g.sourceUrls)||!g.sourceUrls.length||g.sourceUrls.length>4||
    !g.sourceUrls.every(u=>typeof u==='string'&&ADVANCED_REFERENCE.test(u))||
    ['title','horizon','concept','watchFor','entryEvidence','holdEvidence','exitEvidence',
     'noTrade','fictionalCase','procedure','limit','invalidation','commonError','selfCheck','reviewExplanation']
      .some(k=>typeof g[k]!=='string'||g[k].length<25)||
    !g.fictionalCase.startsWith('FICTIONAL:'))
   throw Error('Invalid advanced decision lesson');
  ids.add(g.code);
 }
 advancedCache.set(env.ASSETS,{guides,expires:Date.now()+300000});
 return guides;
}
const masterStudyCache=new WeakMap();
const MASTER_STUDY_SOURCES=/^https:\/\/(?:www\.)?(?:chartschool\.stockcharts\.com|toslc\.thinkorswim\.com|www\.cmegroup\.com|www\.investor\.gov|www\.cboe\.com)\//i;
const MASTER_GROUPS=Object.freeze([
 {file:'tutor-indicator-study-v1.json',group:'indicators',count:61},
 {file:'tutor-indicator-expansion-v1.json',group:'indicators_extension',count:12},
 {file:'tutor-watchlist-study-v1.json',group:'watchlists',count:22},
 {file:'tutor-strategy-study-v1.json',group:'strategies',count:50}
]);
async function loadMasterStudyGuides(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const last=masterStudyCache.get(env.ASSETS);
 if(last&&last.expires>Date.now())return last.guides;
 const groups=await Promise.all(MASTER_GROUPS.map(async spec=>{
  try{
   const r=await env.ASSETS.fetch(new Request(new URL('/data/'+spec.file,request.url),{method:'GET'}));
   if(!r.ok)return [];
   const data=await r.json(),guides=data?.guides;
   if(data?.kind!=='original_public_tutor_master_study'||data?.group!==spec.group||
      data?.count!==spec.count||!Array.isArray(guides)||guides.length!==spec.count)
    return [];
   const codes=new Set();
   for(const g of guides){
    if(!/^STUDY_[A-Z0-9_]{3,75}$/.test(String(g?.code||''))||codes.has(g.code)||
       g.masterStudy!==true||g.supplemental!==true||g.officialCompetency!==false||
       g.researchGuide!==true||!['indicator','watchlist','strategy'].includes(g.kind)||
       !Array.isArray(g.sourceUrls)||!g.sourceUrls.length||g.sourceUrls.length>5||
       !g.sourceUrls.every(u=>typeof u==='string'&&MASTER_STUDY_SOURCES.test(u))||
       (typeof g.title!=='string'||g.title.trim().length<4)||
       (typeof g.formula!=='string'||g.formula.trim().length<8)||
       ['concept','whyUse','howToUse','procedure','limit','limits',
        'invalidation','commonError','selfCheck','reviewExplanation','fictionalPrompt']
          .some(k=>typeof g[k]!=='string'||g[k].trim().length<18))
     return [];
    codes.add(g.code);
   }
   return guides;
  }catch{return []}
 }));
 const guides=groups.flat();
 const unique=new Set(guides.map(x=>x.code));
 if(unique.size!==guides.length)return [];
 masterStudyCache.set(env.ASSETS,{expires:Date.now()+300000,guides});
 return guides;
}
const foundationTopicCache=new WeakMap();
const FOUNDATION_TOPIC_SOURCE=url=>{
 try{
  const parsed=new URL(url);
  return parsed.protocol==='https:'&&!parsed.username&&!parsed.password&&!parsed.port&&
   ['www.investor.gov','investor.gov','www.sec.gov','sec.gov','chartschool.stockcharts.com','www.finra.org','finra.org','syndication.finra.org','pages.stern.nyu.edu','www.optionseducation.org','optionseducation.org','www.bls.gov','bls.gov','fred.stlouisfed.org','www.nyse.com','www.quantconnect.com','quantconnect.com'].includes(parsed.hostname);
 }catch{return false}
};
async function loadFoundationTopicExplanations(env,request){
 if(typeof env.ASSETS?.fetch!=='function')return [];
 const cached=foundationTopicCache.get(env.ASSETS);
 if(cached&&cached.expires>Date.now())return cached.guides;
 const files=['talia-foundation-explanations-batch01-v1.json','talia-foundation-explanations-batch02-v1.json','talia-foundation-explanations-batch03-v1.json','talia-foundation-explanations-batch04-v1.json','talia-foundation-explanations-batch05-v1.json','talia-foundation-explanations-batch06-v1.json','talia-foundation-explanations-batch07-v1.json','talia-foundation-explanations-batch08-v1.json','talia-foundation-explanations-batch09-v1.json','talia-foundation-explanations-batch10-v1.json','talia-foundation-explanations-batch11-v1.json','talia-foundation-explanations-batch12-v1.json','talia-foundation-explanations-batch13-v1.json','talia-foundation-explanations-batch14-v1.json','talia-foundation-explanations-batch15-v1.json','talia-foundation-explanations-batch16-v1.json'];
 const batches=await Promise.all(files.map(async file=>{
  try{
   const response=await env.ASSETS.fetch(new Request(new URL('/data/'+file,request.url),{method:'GET'}));
   if(!response.ok)return [];
   const data=await response.json(),rows=data?.guides;
   if(data?.kind!=='talia_foundation_supplemental_explanations_v1'||
      data.count!==20||data.goal!==600||data.existingOfficialCompetenciesPreserved!==30||
      !Array.isArray(rows)||rows.length!==20)return [];
   const seen=new Set();
   for(const g of rows){
    if(!/^TALIA_TOPIC_[A-Z0-9_]{5,96}$/.test(g?.code||'')||seen.has(g.code)||
       g.foundationTopic!==true||g.supplemental!==true||g.officialCompetency!==false||
       g.independentEditorialApproved!==false||
       g.status!=='original_source_authored_ungraded_pending_independent_editorial_review'||
       !Array.isArray(g.sourceUrls)||g.sourceUrls.length!==1||
       !FOUNDATION_TOPIC_SOURCE(g.sourceUrls[0])||
       (typeof g.title!=='string'||g.title.length<12)||
       ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion']
         .some(k=>typeof g[k]!=='string'||g[k].length<28))return [];
    seen.add(g.code);
   }
   return rows;
  }catch{return []}
 }));
 // Batch 01 is the established optional Foundation teaching baseline. A broken
 // Batch 02 must never disable its 20 subjects or the 30 official competencies.
 if(!batches[0].length)return [];
 const codes=new Set(batches[0].map(x=>x.code));
 const titles=new Set(batches[0].map(x=>x.title.toLowerCase()));
 const next=batches[1].length===20&&batches[1].every(g=>!codes.has(g.code)&&!titles.has(g.title.toLowerCase()))?batches[1]:[];
 const usedCodes=new Set([...batches[0],...next].map(g=>g.code));
 const usedTitles=new Set([...batches[0],...next].map(g=>g.title.toLowerCase()));
 const third=batches[2].length===20&&batches[2].every(g=>!usedCodes.has(g.code)&&!usedTitles.has(g.title.toLowerCase()))?batches[2]:[];
 const previous=[...batches[0],...next,...third];
 const priorCodes=new Set(previous.map(g=>g.code));
 const priorTitles=new Set(previous.map(g=>g.title.toLowerCase()));
 const fourth=batches[3].length===20&&batches[3].every(g=>!priorCodes.has(g.code)&&!priorTitles.has(g.title.toLowerCase()))?batches[3]:[];
 const priorFourth=[...previous,...fourth];
 const seenFifthIds=new Set(priorFourth.map(g=>g.code));
 const seenFifthTitles=new Set(priorFourth.map(g=>g.title.toLowerCase()));
 const fifth=batches[4].length===20&&batches[4].every(g=>!seenFifthIds.has(g.code)&&!seenFifthTitles.has(g.title.toLowerCase()))?batches[4]:[];
 // Optional source-only sixth/seventh batches never suppress earlier approved
 // curriculum if a new asset is absent, malformed, or duplicates a prior topic.
 const guides=[...priorFourth,...fifth];
 for(const extra of batches.slice(5)){
  if(extra.length!==20)continue;
  const takenIds=new Set(guides.map(g=>g.code));
  const takenTitles=new Set(guides.map(g=>g.title.toLowerCase()));
  if(extra.some(g=>takenIds.has(g.code)||takenTitles.has(g.title.toLowerCase())))continue;
  guides.push(...extra);
 }
 foundationTopicCache.set(env.ASSETS,{guides,expires:Date.now()+300000});
 return guides;
}
async function originalGuides(env,request,question){
 try{
  const published=await loadPublicGuides(env,request);
  let researchGuides=[],decisionGuides=[],masterStudyGuides=[],foundationExplanations=[];
  try{researchGuides=await loadResearchGuides(env,request)}catch{/* Original approved guides remain available. */}
  try{researchGuides.push(...await loadVideoResearchGuides(env,request))}catch{/* Supplemental video studies are optional; original sources remain available. */}
  try{masterStudyGuides=await loadMasterStudyGuides(env,request)}catch{/* New study is optional and never blocks the 30 core guides. */}
  try{foundationExplanations=await loadFoundationTopicExplanations(env,request)}catch{/* Supplementary topics never block canonical competencies. */}
  if(/\b(?:enter|entry|exit|exiting|hold|holding|when to|would you|why|setup|setups|trade or skip|no trade|what to look for|stand aside|take profit|stop loss|invalidation|earnings|guidance|balance sheet|cash flow|long.term|portfolio|rebalanc|sector|regime|breadth|confluenc|conflicting|signals|order flow|tape|level ii|order book|options|option premium|theta|vega|assignment|implied volatility|diversif|fundamentals)\b/i.test(String(question||''))){
   try{decisionGuides=await loadDecisionGuides(env,request)}catch{/* Never disable original lessons for an optional curriculum asset. */}
   try{decisionGuides.push(...await loadAdvancedDecisionGuides(env,request))}catch{/* Baseline 18 playbooks and canonical lessons remain available. */}
  }
  return chooseGuides({...published,researchGuides,decisionGuides,masterStudyGuides,foundationExplanations},question);
 }catch{return []}
}
function formatDecisionGuide(g,mode,reflection){
 const lines=[
  'Supplementary ungraded trade-decision coaching — '+g.title,
  ...(g.horizon?['Governing time horizon: '+g.horizon]:[]),
  'Setup thesis: '+g.concept,
  'What to look for: '+g.watchFor,
  'WHY consider entry (only if the evidence is observed): '+g.entryEvidence,
  'WHY a hold might remain justified (only for a verified open position): '+g.holdEvidence,
  'WHY reassess or exit: '+g.exitEvidence,
  'WAIT or NO TRADE: '+g.noTrade,
  'Original fictional practice: '+g.fictionalCase,
  'What can invalidate the reasoning: '+g.invalidation,
  'Execution and evidence limitation: '+g.limit,
  'Common mistake: '+g.commonError,
  'Supporting educational references (not verified strategy-performance evidence): '+g.sourceUrls.join(' '),
  'Ungraded explanation check: '+g.selfCheck
 ];
 if(mode==='review')lines.push('Your reflection can be revised; this review cannot issue a grade or mastery credit. '+ungradedResponseReview(reflection));
 if(mode==='question')lines.push('Answer the evidence/invalidation check without consulting a future candle.');
 return lines.join('\n\n');
}
function formatMasterStudyGuide(g,mode,reflection,question=''){
 const out=[
  'Original ungraded stock-market study — '+g.title,
  'Learning family: '+g.family+' ('+g.kind+')',
  'WHAT it does: '+g.concept,
  'HOW it works or is defined: '+g.formula,
  'WHY it helps a learner: '+g.whyUse,
  'HOW to use it in research: '+g.howToUse,
  'Step-by-step process: '+g.procedure,
  'Limits and uncertainty: '+g.limit,
  'Failure or invalidation: '+g.invalidation,
  'Common mistake: '+g.commonError
 ];
 if(g.kind==='strategy')out.push(
  'Entry evidence: '+g.entryEvidence,
  'Conditional HOLD reasoning: '+g.holdEvidence,
  'Possible EXIT reasoning: '+g.exitEvidence,
  'WAIT / NO TRADE: '+g.noTrade
 );
 const worked=mode==='explain'?indicatorWorkedTeaching(g.code,question):null;
 if(worked)out.push('Verified fictional calculation exercise: '+worked);
 out.push('Original fictional teaching prompt: '+g.fictionalPrompt);
 out.push('Reference documentation (does not prove a strategy edge or current broker settings): '+g.sourceUrls.join(' '));
 out.push('Ungraded understanding check: '+g.selfCheck);
 if(mode==='review')out.push('Your reflection is ungraded; it does not earn mastery: '+ungradedResponseReview(reflection));
 if(mode==='question')out.push('Answer from evidence visible at the pause, not from later prices.');
 return out.join('\n\n');
}
const MISCONCEPTION_INTENT=/\b(?:common mistakes?|misconceptions?|correct my misunderstanding|what did i misunderstand|why (?:is|was|are) (?:that|this|my answer) wrong|explain the common mistake)\b/i;
function sourceOnlyMisconception(g){
 const name=String(g.title||'this topic');
 const error=String(g.commonError||'Treating a single observation as a guaranteed outcome.');
 const concept=String(g.concept||'The source observation is conditional.');
 const procedure=String(g.procedure||g.howToUse||'State the current observation and its inputs.');
 const limit=String(g.limit||g.limits||'A documented observation cannot guarantee the next price.');
 const transfer=String(g.transferQuestion||g.selfCheck||'Explain a new hypothetical case without looking ahead.');
 return [
  'Original, ungraded misconception coaching — '+name,
  'A common mistake to examine (not a claim about what you personally believed): '+error,
  'More accurate explanation: '+concept,
  'How to check the evidence: '+procedure,
  'What remains unknown: '+limit,
  'Fresh independent transfer prompt: '+transfer,
  'This explanation is not graded and does not reveal a protected assessment answer.'
 ].join('\n\n');
}
function formatFoundationTopic(g,mode,reflection,question){
 const computed=mode==='explain'?(foundationQuantTeaching(g.code,question)||foundationRiskTeaching(g.code,question)||researchMathTeaching(g.code,question)):null;
 const topic='Original ungraded Foundation explanation — '+g.title;
 const base=[topic,'First principle: '+g.concept,'How to verify or calculate: '+g.procedure,
  'Limits and uncertainty: '+g.limit,'What would invalidate this interpretation: '+g.invalidation,
  'Common mistake: '+g.commonError,
  'Original educational reference (not a live data or strategy-performance claim): '+g.sourceUrls.join(' ')];
 // A deeper request must be instructional, not the same response with more labels.
 // Reuse the same authorized source and fictional teaching case; never infer
 // a private member misconception, future replay observation, or a grade.
 if(mode==='explain'&&/\b(?:more depth|go deeper|step.by.step|walk me through|explain further)\b/i.test(String(question||''))){
  return [
   'Talia Foundation — source-only deeper teaching: '+g.title,
   '1. Define the principle in plain language: '+g.concept,
   '2. Identify the observable inputs, timestamps and calculation method: '+g.procedure,
   '3. Walk through original invented data (not live or licensed prices): '+g.workedCase,
   ...(computed?['4. Recompute the independently authored mathematics, with its units: '+computed]:[]),
   '5. Check the most likely reasoning mistake (not a claim about your past responses): '+g.commonError,
   '6. Decide when the conclusion is invalid: '+g.invalidation,
   '7. State what the evidence cannot prove: '+g.limit,
   '8. Try a genuinely different ungraded scenario before looking at this worked case again: '+g.transferQuestion,
   'Self-review without awarding mastery: '+g.reviewExplanation,
   'Original research reference, not reproduction authorization: '+g.sourceUrls.join(' '),
   'No live trading instruction, private answer key, future observation, paid model call or assessment score.'
  ].join('\n\n');
 }
 if(mode==='question')return [...base,'Independent ungraded self-check: '+g.selfCheck,
  'Do not use a future observation or an official assessment answer.'].join('\n\n');
 if(mode==='review')return [...base,'Ungraded review criterion: '+g.reviewExplanation,
  coachFoundationReflection(g,reflection),
  ungradedResponseReview(reflection),
  'No rubric was scored and no mastery credit was awarded.'].filter(Boolean).join('\n\n');
 return [...base,'Original fictional worked explanation: '+g.workedCase,
   ...(computed?['Original independent calculation and units: '+computed]:[]),
   'Independent transfer question: '+g.transferQuestion,
   'Self-check: '+g.selfCheck,
   'This explanation does not predict a trade outcome or grant a protected assessment result.'].join('\n\n');
}
function researchCurrentnessForTopic(g){
 if(g?.code==='TALIA_TOPIC_CASH_DIVIDEND_VS_BUYBACK')return 'Source correction: The SEC 2023 share-repurchase disclosure modernization rule was vacated effective December 19, 2023; the archived speech is not current disclosure law. See https://www.sec.gov/rules-regulations/2024/03/s7-21-21.';
 if(g?.code==='TALIA_TOPIC_FISCAL_YEAR_END_VS_KNOWN_DATE')return 'Replay timing warning: EDGAR acceptance is not the precise first public availability instant; the SEC notes publication can lag. See https://www.sec.gov/about/webmaster-frequently-asked-questions.';
 return '';
}
function answerFromGuide(g,mode,answer,question=''){
 const note=researchCurrentnessForTopic(g);
 if(mode==='explain'&&MISCONCEPTION_INTENT.test(String(question||'')))return sourceOnlyMisconception(g)+(note?'\n\n'+note:'');
 if(g.foundationTopic===true)return formatFoundationTopic(g,mode,answer,question)+(note?'\n\n'+note:'');
 // Reuse published canonical guide IDs; practice/review remain independently answered.
 const worked=mode==='explain'&&g?.officialCompetency!==false?foundationWorkedMath(g.code,question):null;
 // Requested source-only deeper teaching cannot introduce an AI charge.
 const deep=/\b(?:more depth|go deeper|step.by.step|walk me through|explain further)\b/i.test(String(question||''));
 if(deep&&!g.masterStudy&&!g.decisionPlaybook){
  const sections=[
   'Source-only deeper teaching — '+g.title,
   '1. First principle: '+g.concept,
   '2. Observe and define inputs: '+g.procedure,
   '3. Interpret cautiously: '+g.limit,
   '4. Define invalidation before looking ahead: '+g.invalidation,
   '5. Common live-trading error: '+g.commonError,
   '6. Original ungraded check: '+g.selfCheck,
   'Review criterion (not an official score): '+g.reviewExplanation,
   'Research status: original source-informed instruction, not independently validated trade performance or historical price data.'
  ];
  if(mode==='review')sections.push('Your reflection remains ungraded: '+ungradedResponseReview(answer));
  if(worked)sections.push(worked);
  return sections.join('\n\n');
 }

 if(g.masterStudy===true)return formatMasterStudyGuide(g,mode,answer,question);
 if(g.decisionPlaybook===true)return formatDecisionGuide(g,mode,answer);
 const links=(g.researchGuide===true&&Array.isArray(g.sourceUrls)?g.sourceUrls:[])
  .filter(u=>typeof u==='string'&&/^https:\/\/(www\.investor\.gov|www\.sec\.gov|www\.finra\.org|toslc\.thinkorswim\.com)\//.test(u)).slice(0,2);
 const evidence=g.researchGuide===true?'\n\nResearch note: This is an original educational explanation informed by owner-provided STT source studies, not a verified market event or profitable-strategy claim.'+
  (links.length?'\nAdditional public regulatory/platform reference (not evidence of historical performance): '+links.join(' '):''):'';
 const main=(g.supplemental===true?'Supplementary ungraded topic (not an official competency) — ':'')+g.title+': '+g.concept+'\n\nWhat to do: '+g.procedure+'\n\nWhat this does not establish: '+g.limit+'\n\nInvalidation: '+g.invalidation+evidence;
 if(mode==='question')return main+'\n\nUngraded self-check: '+g.selfCheck;
 if(mode==='review')return main+'\n\nUse this review criterion: '+g.reviewExplanation+' no rubric was graded or scored.\n\n'+ungradedResponseReview(answer);
 return main+'\n\nCommon error to avoid: '+g.commonError+(worked?'\n\n'+worked:'')+'\n\nPractice: '+g.selfCheck;
}
export {chooseGuides,originalGuides,answerFromGuide};
