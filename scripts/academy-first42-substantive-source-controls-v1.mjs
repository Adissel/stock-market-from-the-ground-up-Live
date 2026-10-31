/* SMFGU-ACADEMY-42-SUBSTANTIVE-CONTROLS-001
 * Audits EVERY generated lesson statement plus ALL authored numericChecks.
 * This is an AI-assisted editorial/preflight control, NOT a source validation,
 * a licensed factual audit, an independent human editorial approval, or a
 * master acceptance register. Secret protected questions are NEVER imported.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const csv=text=>{
 let arr=[],row=[],val='',quote=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quote&&text[i+1]==='"'){val+='"';i++}else quote=!quote}
  else if(c===','&&!quote){row.push(val);val=''}
  else if((c==='\r'||c==='\n')&&!quote){
   if(c==='\r'&&text[i+1]==='\n')i++;
   if(row.length||val){row.push(val);arr.push(row);row=[];val=''}
  }else val+=c;
 }
 if(quote)throw Error('Invalid CSV quoting');
 if(row.length||val){row.push(val);arr.push(row)}
 const header=arr.shift();
 return arr.map(fields=>Object.fromEntries(header.map((h,i)=>[h,fields[i]??''])));
};
const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const srcBase='docs/research/stockstotrade/';
const source=csv(readFileSync('artifacts/bootcamp-first42-claim-inventory.csv','utf8'));
const dayClaims=csv(readFileSync(srcBase+'ACADEMY_FIRST42_NARROW_CLAIM_EVIDENCE_2026-10-31.csv','utf8'));
const dayAuthority=new Map(dayClaims.map(x=>[x.day_key,x]));
const dayList=new Map();
for(const [code,limit] of [['truth5',5],['watchlist7',7],['scanners10',10],['foundations30',20]]){
 const course=academyPrograms.find(x=>x.code===code);
 assert(course,'Missing canonical source '+code);
 for(const day of course.curriculum.slice(0,limit)){
  assert(day.lesson,'Missing original teaching '+code+'/'+day.day);
  dayList.set(code+':'+day.day,day);
 }
}
assert.equal(dayList.size,42);
assert.equal(dayAuthority.size,42);
assert(source.length>=940,'Original source statement inventory unexpectedly shortened');
const sourceIntegrity={
 'www.sec.gov':'SEC_PRIMARY',
 'www.investor.gov':'SEC_INVESTOR_EDUCATION',
 'www.nyse.com':'NYSE_EXCHANGE',
 'syndication.finra.org':'FINRA_PRIMARY',
 'chartschool.stockcharts.com':'SECONDARY_TECHNICAL_MATERIAL'
};
const verdicts={
 HINDSIGHT_REPLAY:'Prove the exact last visible FINAL and delivered bar, timestamp convention, replay pause and that no later bars or outcomes were used.',
 ORDER_EXECUTION:'Order type, bid/ask and last trade are not actual executable depth or a fill guarantee; verify venue and broker-specific order conditions.',
 RATIO_SCOPE:'Identify numerator and denominator, units, adjustment method, venue universe and aligned clock; reject mismatched relative-volume or short-sale-volume inferences.',
 SHORT_VOLUME_SCOPE:'Short-sale volume and short interest differ; compare venue universe and dates before deriving percentages and never infer forced covering from volume.',
 CORPORATE_EVIDENCE:'Use issuer document/accession and public availability time; differentiate issuer proceeds, secondary transfers and third-party promotion.',
 CURRENT_RULE:'Confirm primary legal/regulatory text, current effective date, scope and brokerage exceptions at the time of teaching.',
 DATA_LICENSE:'Establish real vs fictional data, provider license, adjustment status and whether OHLC is an ex-post reconstruction.',
 PRICE_FORECAST:'Check categorical language against uncertainty and NO TRADE veto; a later rise is not proof of earlier decision validity.',
 AUTHOR_NUMERICAL:'Recompute formula with independent numeric fixtures, quote precision and label any hypothetical fill as not evidenced.',
 LEARNING_ALIGNMENT:'Reconcile the instruction with the canonical skill objective; require diagnostic correction and an unseen transfer case.'
};
const defRisk=t=>{
 const rules=[
 ['HINDSIGHT_REPLAY',/future|replay|before.*pause|later.*bar|timestamp|already.*known|lookahead|time.zone|finali[sz]|completed bar|outcome/i],
 ['SHORT_VOLUME_SCOPE',/short.sale volume|short interest|borrow|covering|squeeze/i],
 ['ORDER_EXECUTION',/spread|bid|ask|quote|market.order|limit.order|stop.order|fill|execution|slippage|liquidity|depth/i],
 ['RATIO_SCOPE',/percent|ratio|denominator|rvol|relative volume|float|turnover|market cap|volume|shares outstanding/i],
 ['CORPORATE_EVIDENCE',/filing|EDGAR|issuer|press release|catalyst|social|news|sponsor|promotion|offering|company/i],
 ['CURRENT_RULE',/FINRA|SEC rule|Reg SHO|T\+1|settlement|market hours|core trading session|202[4-9]/i],
 ['DATA_LICENSE',/historical|provider|data feed|licensed|market data|source rights|bar label/i],
 ['PRICE_FORECAST',/guarantee|predict|will rise|always|forever|inevitable|assured|certain return|trade eligible/i]
 ];
 const keys=rules.filter(([k,re])=>re.test(t)).map(x=>x[0]);
 if(keys.length===0)keys.push('LEARNING_ALIGNMENT');
 if(keys.length>4)keys.length=4;
 return keys;
};
const compute=(x)=>{
 const inputs=x.inputs??[];assert(inputs.every(Number.isFinite));
 const [a,b]=inputs;
 const binary=x.operation==='ratio'||x.operation==='ratioPercent';
 if(binary)assert(b!==0,'Zero denominator in '+x.operation);
 let value;
 switch(x.operation){
 case 'sum':value=inputs.reduce((n,y)=>n+y,0);break;
 case 'subtract':value=a-b;break;
 case 'multiply':value=a*b;break;
 case 'average':value=inputs.reduce((n,y)=>n+y,0)/inputs.length;break;
 case 'ratio':value=a/b;break;
 case 'ratioPercent':value=a/b*100;break;
 default:throw Error('Unreviewed numeric operator '+x.operation);
 }
 const tolerance=Math.max(Number(x.tolerance||1e-6),1e-8);
 assert(Number.isFinite(value)&&Math.abs(value-x.expected)<=tolerance,
  'Incorrect fictional math: '+x.operation+' got '+value+' expected '+x.expected);
 return value;
};
const mathByDay=new Map();
for(const [id,day] of dayList){
 const numeric=day.lesson.numericChecks||[];
 let done=0;
 for(const item of numeric){compute(item);done++}
 mathByDay.set(id,done);
}
const rowSeen=new Set(),totals=new Map(),flags={};
const items=source.map((x,i)=>{
 const id=x.day_key,lesson=dayList.get(id),control=dayAuthority.get(id);
 assert(lesson&&control,'Missing original source or control row '+id);
 const t=x.claim_or_instruction.trim();
 const h=createHash('sha256').update(id+'|'+x.source_field+'|'+x.sentence_order+'|'+t).digest('hex').slice(0,16);
 const key=id+':'+x.source_field+':'+x.sentence_order;
 assert(!rowSeen.has(key),'Repeated claim location '+key);rowSeen.add(key);
 const risk=defRisk(t);
 for(const k of risk)flags[k]=(flags[k]||0)+1;
 const sourceFamily=control.authority_url||'';
 const host=sourceFamily.split('/')[2]||'';
 if(host)assert(sourceIntegrity[host],'Unknown trusted-source family '+host);
 const evidenceType=x.source_field.startsWith('sourceReported')?'SECONDARY_PUBLISHER_STATEMENT_REQUIRES_ORIGINAL_REVIEW':
  x.source_field==='workedExample'||/FICTIONAL|SYNTHETIC/.test(t)?'FICTIONAL_INTERNAL_CASE_NOT_HISTORICAL':
  ['sourceProcedure','reviewPrompts','transfer','investigation','selfCheck'].includes(x.source_field)?
  'INSTRUCTIONAL_PEDAGOGY_NEEDS_HUMAN_REVIEW':
  'MATERIAL_CLAIM_NEEDS_INDEPENDENT_PROOF';
 const sourceStatus=sourceFamily?
  'DAY_FAMILY_LINK_ONLY_NOT_SENTENCE_PROOF':'NO_EXTERNAL_SENTENCE_SOURCE_ASSIGNED';
 const raw=(totals.get(id)||{count:0,high:0,publisher:0});
 raw.count++;
 if(risk.includes('CURRENT_RULE')||risk.includes('SHORT_VOLUME_SCOPE')||risk.includes('DATA_LICENSE'))raw.high++;
 if(x.source_field.startsWith('sourceReported'))raw.publisher++;
 totals.set(id,raw);
 return {
  reviewerRecord:'SMFGU-AI-PREFLIGHT-C42-'+String(i+1).padStart(4,'0'),
  stableClaimHash:h,day_key:id,canonical_title:x.canonical_title,
  field:x.source_field,order:x.sentence_order,claim_text:t,
  claim_evidence_type:evidenceType,risk_codes:risk.join('|'),
  substantive_check_instructions:risk.map(y=>verdicts[y]).join(' '),
  day_family_source:sourceFamily,source_authority_type:sourceIntegrity[host]||'NONE',
  source_validation:'NOT_VERIFIED_AT_SENTENCE_LEVEL',
  independent_editorial_reviewer:'UNASSIGNED',
  independent_decision:'NOT_ACCEPTED',
  authoring_review:'AI_ASSISTED_PRELIMINARY_RISK_AND_NUMERIC_CONTROL_ONLY',
  linked_numeric_fixtures_recomputed:mathByDay.get(id)||0,
  source_commit:x.source_commit
 };
});
assert.equal(items.length,source.length);
assert.equal(totals.size,42);
assert(items.every(x=>x.independent_decision==='NOT_ACCEPTED'&&
 x.source_validation==='NOT_VERIFIED_AT_SENTENCE_LEVEL'));
mkdirSync('artifacts',{recursive:true});
const headers=Object.keys(items[0]);
writeFileSync('artifacts/academy-first42-claim-substantive-control-audit.csv',
 [headers.map(esc).join(','),...items.map(x=>headers.map(h=>esc(x[h])).join(','))].join('\n')+'\n');
const dayHeaders=['day_key','statement_controls','high_priority_items','publisher_cases','numeric_fixtures_recomputed','independent_editorial_status','protected_grading_status'];
writeFileSync('artifacts/academy-first42-source-control-day-register.csv',
 [dayHeaders.map(esc).join(','),...[...totals].map(([id,t])=>[id,t.count,t.high,t.publisher,mathByDay.get(id),'NOT_ACCEPTED','NOT_APPROVED'].map(esc).join(','))].join('\n')+'\n');
const sum=[...mathByDay.values()].reduce((x,y)=>x+y,0);
writeFileSync('artifacts/academy-first42-source-controls-result.json',JSON.stringify({
 id:'SMFGU-ACADEMY-42-SUBSTANTIVE-CONTROLS-001',source_commit:process.env.GITHUB_SHA||'LOCAL',
 claimLocations:items.length,canonicalDays:totals.size,mathRecomputations:sum,
 riskFlags:flags,independentHumanApprovals:0,officialAssessmentApprovals:0,
 note:'Full private graded-question content is not in this artifact; reviewed sources are day-family references, not 940 individual certifications.'
},null,2)+'\n');
console.log('PASS source-current substantive preflight: '+items.length+
 ' individual claim locations; '+sum+' independent arithmetic controls; all 42 day registers remain NOT_ACCEPTED; risk flags '+JSON.stringify(flags));
