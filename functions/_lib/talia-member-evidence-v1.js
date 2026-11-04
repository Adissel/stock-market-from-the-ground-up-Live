/* Talia premium runtime v1: pure, source-grounded member evidence reduction.
 * Every row must first be loaded server-side under a freshly authenticated
 * member UUID. No client-provided grade, tier, chart cursor or progress.
 * Teaching suggestions NEVER award assessments, unlock content, issue orders,
 * evaluate trade profitability or expose another learner's records.
 */
const TIER=['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'];
export const TALIA_MEMBER_TIER_ORDER=Object.freeze(TIER);
export const TARGET_BY_PLAN=Object.freeze({
 FREE:'FOUNDATION',FOUNDING_14:'FOUNDATION',PICK_WHAT_YOU_WANT:'FOUNDATION',
 FOUNDING_30:'ADVANCED',FOUNDING_60:'PROFESSIONAL',FULL_MONTHLY:'PROFESSIONAL',
 LIFETIME:'ENTERPRISE'
});
const safe=(s,max=200)=>String(s??'').replace(/[\u0000-\u001f\u007f<>]/g,' ').trim().slice(0,max);
const int=x=>Number.isSafeInteger(x)&&x>=0;
const num=x=>{const n=Number(x);return x===null||x===undefined||x===''||!Number.isFinite(n)?null:n};
const statusSet=new Set(['Not Yet Assessed','Conceptual Evidence Only','Needs Work','Developing','Proficient','Mastered']);
export const tierIndex=t=>TIER.indexOf(t);
export function betaTier({planCode,configured,requested,allowlisted,enabled,allTiers}={}){
 const target=TARGET_BY_PLAN[planCode]||'FOUNDATION';
 const registered=TIER.includes(configured)?configured:target;
 // An Owner's target edition alone is not an operational entitlement.
 if(!allowlisted||!enabled)return {target:registered,effective:'FOUNDATION',beta:false};
 const maximum=allTiers?'ENTERPRISE':registered;
 if(!TIER.includes(requested))return {target:registered,effective:maximum,beta:true};
 return {target:registered,effective:tierIndex(requested)<=tierIndex(maximum)?requested:'FOUNDATION',
  beta:true,requestDenied:tierIndex(requested)>tierIndex(maximum)};
}
const distinct=rows=>Array.isArray(rows)?rows.filter(x=>x&&typeof x==='object'):[];
export function authenticLearningEvidence({skills=[],labs=[],academy=[] ,topicCode=''}={}){
 const canonical=distinct(skills).filter(s=>/^[A-Z][A-Z0-9_]{2,49}$/.test(s.code||'')&&statusSet.has(s.status));
 const topic=safe(topicCode,49).toUpperCase();
 const selected=canonical.find(s=>s.code===topic)||null;
 const observed=canonical.filter(s=>Number.isSafeInteger(s.completeAssessments)&&s.completeAssessments>0&&
  Number.isSafeInteger(s.independentAssessments)&&s.independentAssessments>0);
 const deficits=observed.filter(s=>['Needs Work','Developing','Conceptual Evidence Only'].includes(s.status))
  .sort((a,b)=>(Number(b.criticalErrors)||0)-(Number(a.criticalErrors)||0)||String(a.code).localeCompare(String(b.code)));
 const pending=canonical.filter(s=>!observed.includes(s));
 const focus=selected||deficits[0]||pending[0]||observed[0]||null;
 const records=distinct(labs).filter(x=>typeof x.lab_id==='string'&&typeof x.status==='string').slice(0,80);
 const days=distinct(academy).filter(x=>typeof x.program_code==='string'&&int(x.day_number)).slice(0,150);
 const assessment=focus&&observed.includes(focus)?'independently_assessed':'not_independently_assessed';
 const learningNeed=assessment==='independently_assessed'&&['Needs Work','Developing'].includes(focus.status)
  ?'Previous verified assessment suggests additional practice; it does not prove a specific misconception.'
  :assessment==='independently_assessed'
  ?'Existing independently reviewed evidence is available; select a new transfer case without assuming predictive ability.'
  :'There is insufficient independent competency evidence to diagnose a skill gap. Begin with an ungraded concept check.';
 const topicName=focus?safe(focus.name,110):'Foundational market observations';
 const reviewPrompt='Explain '+topicName+' from first principles. Ask me for an original fictional attempt, check the evidence I supply, and explain one limitation without assigning a grade.';
 return Object.freeze({
  scope:'OWN_AUTHENTICATED_PROGRESS_ONLY',
  a01:{capability:'Verified prerequisite and topic inventory',evidenceStatus:assessment,
   topic:focus?{code:focus.code,name:topicName,recordedStatus:assessment==='independently_assessed'?focus.status:'Not independently assessed'}:null,
   independentAssessedCompetencies:observed.length,unverifiedCompetencies:pending.length,
   interpretation:learningNeed},
  a02:{capability:'Evidence-bounded correction pathway',evidenceStatus:assessment,
   specificMisconceptionDiagnosed:false,
   criticalErrorEvidencePresent:assessment==='independently_assessed'&&Number(focus.criticalErrors)>0,
   explanation:learningNeed,
   coachingPrompt:reviewPrompt,
   notice:'No private assessment answers, learner psychology, grading rubric or model inference is accessed.'},
  a03:{capability:'Member-specific next lesson',evidenceStatus:focus?'recorded_scope':'no_topic_record',
   topic:focus?{code:focus.code,name:topicName}:null,
   suggestedAction:assessment==='independently_assessed'?safe(focus.nextStep||'Review a distinct unseen practice case.',240):
    'Build an independently reviewed baseline. Existing reflections are participation only.',
   learnerLabRecords:records.length,learnerAcademyDayRecords:days.length,
   labRecent:records.slice(0,4).map(x=>({labId:safe(x.lab_id,80),status:safe(x.status,48)})),
   academyRecent:days.slice(0,4).map(x=>({program:safe(x.program_code,48),day:x.day_number,status:safe(x.status,48)})),
   lessonPrompt:reviewPrompt},
  limitations:['Only server-owned learner progress is used','Unassessed is not a diagnosed deficiency','Private rubric and numerical grades are never returned']
 });
}
export function authenticReplayEvidence({session,bars,dataset}={}){
 if(!session||!dataset||!Array.isArray(bars)||!bars.length)throw Error('No verified member-owned replay evidence.');
 if(!int(session.current_index)||typeof session.dataset_code!=='string'||session.dataset_code!==dataset.dataset_code)
  throw Error('Replay context mismatch.');
 const view=[];
 let previousIndex=-1,previousTime=-Infinity;
 for(const row of bars){
  const index=Number(row?.bar_index),at=Date.parse(row?.bar_at);
  const open=num(row?.open),high=num(row?.high),low=num(row?.low),close=num(row?.close),vol=num(row?.volume);
  if(!int(index)||index>session.current_index||index<=previousIndex||!Number.isFinite(at)||at<=previousTime||
    ![open,high,low,close,vol].every(Number.isFinite)||low<=0||
    high<Math.max(open,close)||low>Math.min(open,close)||vol<0)
    throw Error('Replay evidence failed completed-bar validation.');
  previousIndex=index;previousTime=at;
  view.push({index,open,high,low,close,volume:vol,timestamp:new Date(at).toISOString()});
 }
 if(view.at(-1).index!==session.current_index)throw Error('Current private replay candle unavailable.');
 const current=view.at(-1),prev=view.length>1?view.at(-2):null;
 const change=prev?Number((current.close-prev.close).toFixed(6)):null;
 const locked=session.decision_locked===true;
 const choice=locked&&['BUY','SELL','WATCH','WAIT','NO_TRADE','NO TRADE','HOLD'].includes(session.decision)
  ?session.decision.replaceAll('_',' '):null;
 return Object.freeze({
  scope:'OWNER_SCOPED_SERVER_REPLAY_PREFIX',classification:'ORIGINAL_FICTIONAL',
  p01:{capability:'Chart context at the verified replay cursor',dataset:dataset.dataset_code,
   visibleThrough:session.current_index,visibleBarCount:view.length,
   bars:view.slice(-40),lastCandle:current,
   priceRange:Number((current.high-current.low).toFixed(6)),
   note:'Only the server-revealed sequence is used. Timestamp labels are bar start labels, not verified transaction time.'},
  p02:{capability:'Chronological replay and no-lookahead coaching',futureBarsReturned:0,
   serverCursor:session.current_index,visibleThrough:session.current_index,
   allowedObservations:view.length,deniedFutureObservation:true,
   coachingPrompt:'Using only the '+view.length+' revealed fictional candles, separate what was visible from what remains unknown. Never assume the next candle.'},
  p03:{capability:'Decision-point evidence debrief',lockedDecision:locked,decision:choice,
   priceChangeFromPriorClose:change,
   debrief:!locked?'Record and lock an independent fictional decision before evaluating it.':
    'Compare the recorded decision against only observations available through the current replay cursor. A close change is not execution evidence.',
   nextPrompt:'What evidence was known, what would invalidate the premise, and when would WAIT or NO TRADE be reasonable?',
   notAnActualFill:true,notOfficialGrade:true},
  limitations:['Original fictional observations only','No next-bar lookup or price-path inference','No realized P&L, order execution or retrospective answer key']
 });
}
export function authenticEnterpriseEvidence({enrollments=[],progress=[],labs=[],guides=[]}={}){
 const allowed=distinct(enrollments).filter(x=>x.status==='active'&&typeof x.program_code==='string').map(x=>x.program_code);
 const active=new Set(allowed);
 const rows=distinct(progress).filter(x=>active.has(x.program_code)&&int(x.day_number));
 const groups=new Map();
 for(const r of rows){
  const key=safe(r.program_code,48);
  const v=groups.get(key)||{course:key,recordedDays:0,reflectedDays:0,inProgressDays:0};
  v.recordedDays++;
  if(['reflected','completed'].includes(r.status))v.reflectedDays++;
  else v.inProgressDays++;
  groups.set(key,v);
 }
 const courses=[...groups.values()].sort((a,b)=>a.course.localeCompare(b.course));
 const labsOwned=distinct(labs).filter(r=>typeof r.lab_id==='string'&&typeof r.status==='string');
 const refs=distinct(guides).filter(g=>g&&typeof g.title==='string'&&typeof g.concept==='string');
 const take=refs.slice(0,2).map(g=>({topic:safe(g.title,100),
  description:safe(g.concept,260),formula:safe(g.formula,190),
  limitation:safe(g.limit||g.limits,230),
  citationLinks:(Array.isArray(g.sourceUrls)?g.sourceUrls:[]).filter(url=>typeof url==='string'&&
    /^https:\/\/(?:www\.investor\.gov|www\.sec\.gov|chartschool\.stockcharts\.com|toslc\.thinkorswim\.com)\//.test(url)).slice(0,2)}));
 return Object.freeze({
  scope:'OWN_ACTIVE_COURSE_AND_LAB_RECORDS_ONLY',
  e01:{capability:'Cross-course study synthesis',activeEnrolledCourses:active.size,
   courses,crossCourseEvidenceAvailable:courses.length>=2,
   studyPrompt:courses.length>=2?'Compare the learning methods from '+courses.slice(0,2).map(x=>x.course).join(' and ')+'. State one shared principle and one limitation using your own fictional observations.':
    'Two courses with recorded progress are needed for verified cross-course comparisons. No progress is inferred from enrollment alone.',
   officialCompetencyAwarded:false},
  e02:{capability:'Original cited research comparison',sourceClass:'original_source_informed_teaching_briefs',
   comparisons:take,pointInTimePublicationVerified:false,
   notice:'References support further research; linked webpages are not licensed downloads or verified as-of historical evidence.'},
  e03:{capability:'Member-authorized educational activity report',enrolledCourses:active.size,
   recordedCourseDays:rows.length,reflectedDays:rows.filter(r=>['reflected','completed'].includes(r.status)).length,
   recordedLabEntries:labsOwned.length,
   recordsAreGrades:false,includesMemberIdentifiers:false, includesRawReflections:false,
   suggestion:'Review completed study records, identify an unanswered question and request new independent fictional transfer practice.'},
  limitations:['Own member records only','No protected assessment or raw reflection','No external rights or official proficiency inferred']
 });
}
