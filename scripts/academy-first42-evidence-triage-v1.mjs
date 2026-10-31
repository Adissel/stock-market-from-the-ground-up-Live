/* SMFGU-ACADEMY-940-TRIAGE-001
 * First-pass, per-sentence audit dispositions. These are NOT independent
 * editorial decisions and NEVER grant verified source/grade status.
 * Run after academy-first42-claim-inventory-v1.mjs.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
function csv(s){
 const rows=[];let cols=[],field='',q=false;
 for(let i=0;i<s.length;i++){
  const c=s[i];
  if(c==='"'){if(q&&s[i+1]==='"'){field+='"';i++}else q=!q;}
  else if(c===','&&!q){cols.push(field);field='';}
  else if((c==='\n'||c==='\r')&&!q){
   if(c==='\r'&&s[i+1]==='\n')i++;
   if(cols.length||field){cols.push(field);rows.push(cols);cols=[];field='';}
  }else field+=c;
 }
 if(q)throw Error('Unclosed CSV quote');
 if(cols.length||field){cols.push(field);rows.push(cols)}
 const names=rows.shift();return rows.map(a=>Object.fromEntries(names.map((n,i)=>[n,a[i]])));
}
const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const base='docs/research/stockstotrade/';
const rs=csv(readFileSync('artifacts/bootcamp-first42-claim-inventory.csv','utf8'));
const scope=csv(readFileSync(base+'ACADEMY_FIRST42_NARROW_CLAIM_EVIDENCE_2026-10-31.csv','utf8'));
const sourceByDay=new Map(scope.map(r=>[r.day_key,r]));
assert.equal(sourceByDay.size,42);
assert(rs.length>=940,'Generated source inventory unexpectedly incomplete');
const legalReg=/(FINRA|SEC\b|Regulation SHO|margin (?:rule|requirement)|settlement|T\+1|broker (?:must|required)|(?:short.sale|short sale) (?:locate|restriction)|Rule 201)/i;
const feedRights=/(historical (?:bars|price|data|quote|tape)|licensed|market.data|data feed|provider|timestamp convention|quote depth|NBBO|adjusted price)/i;
const calculation=/(\d[\d,]*(?:\.\d+)?\s*(?:%|×|\*|÷|\/|=|−|\+)|\$\d|percent|ratio|spread|denominator|\b(?:sum|subtract|multiply|volume)\b)/i;
const provenance=/(issuer|filing|source|reported|verif|publication|accession|social|headline|release|event|evidence|research)/i;
const safeProcedure=new Set(['sourceProcedure','reviewPrompts','transfer','investigation','selfCheck']);
const counts={};const dayTotals=new Map();
const output=rs.map((r,i)=>{
 assert(sourceByDay.has(r.day_key),'Unregistered study day '+r.day_key);
 const s=String(r.claim_or_instruction),f=r.source_field;
 let category,priority,check;
 if(f.startsWith('sourceReported')){
  category='PUBLISHER_CONTENT_SECONDARY_SOURCE';priority='HIGH';
  check='Verify the original publisher statement and assess any primary-source or rights gap; do not equate source presence with truth.';
 }else if(legalReg.test(s)){
  category='REGULATORY_OR_CURRENT_RULE';priority='HIGH';
  check='Compare wording against authoritative effective-dated rule/SEC/FINRA page and scope of member brokerage; editorial sign-off required.';
 }else if(f==='workedExample'||calculation.test(s)){
  category='FICTIONAL_MATH_OR_MARKET_CASE';priority='HIGH';
  check='Recompute all values, units and denominators; verify synthetic declaration, temporal cutoff and non-execution caveat.';
 }else if(feedRights.test(s)){
  category='DATA_PROVENANCE_AND_EXECUTION';priority='HIGH';
  check='Confirm observation clock, session, venue, source rights, adjustment convention and no-lookahead boundary as applicable.';
 }else if(safeProcedure.has(f)){
  category='INSTRUCTIONAL_PROMPT_OR_METHOD';priority='MEDIUM';
  check='Independently review objective alignment, new-case transfer, clear no-trade path and hidden-answer separation.';
 }else if(provenance.test(s)){
  category='SOURCE_EVIDENCE_ASSERTION';priority='MEDIUM';
  check='Check original issuer/SEC/NYSE evidence as of claim cutoff; cited family reference may only partially support this sentence.';
 }else{
  category='GENERAL_TEACHING_OR_CONCEPT';priority='MEDIUM';
  check='Check factual accuracy, clarity, realistic counterexamples and limitations; independent review required.';
 }
 const known=sourceByDay.get(r.day_key);
 const isPrimary=known.authority_class==='PUBLIC_REGULATOR_OR_EXCHANGE';
 const source=category==='REGULATORY_OR_CURRENT_RULE'||category==='SOURCE_EVIDENCE_ASSERTION'?
  (known.authority_url||''):category==='PUBLISHER_CONTENT_SECONDARY_SOURCE'?'':known.authority_url||'';
 const sourceScope=source?'DAY_FAMILY_REFERENCE_ONLY_NOT_SENTENCE_VERIFIED':'NO_SENTENCE_SPECIFIC_SOURCE_ASSIGNED';
 counts[category]=(counts[category]||0)+1;
 dayTotals.set(r.day_key,(dayTotals.get(r.day_key)||0)+1);
 return {...r,audit_id:'C42-'+String(i+1).padStart(4,'0'),topic_category:category,
  review_priority:priority,candidate_source_url:source,source_scope:sourceScope,
  reviewer_instruction:check,preliminary_decision:'REQUIRES_INDEPENDENT_SENTENCE_REVIEW',
  protected_grading:'NOT_APPROVED',editorial_decision:'NOT_ACCEPTED'};
});
assert.equal(output.length,rs.length);
assert.equal(dayTotals.size,42);
assert(output.every(r=>r.editorial_decision==='NOT_ACCEPTED'&&r.protected_grading==='NOT_APPROVED'));
const headers=['audit_id','day_key','canonical_title','source_field','sentence_order','claim_or_instruction',
 'claim_class','source_commit','topic_category','review_priority','candidate_source_url',
 'source_scope','reviewer_instruction','preliminary_decision','protected_grading','editorial_decision'];
const rows=[headers.map(quote).join(','),...output.map(r=>headers.map(h=>quote(r[h])).join(','))];
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/academy-first42-940-sentence-review-dispositions.csv',rows.join('\n')+'\n');
const countRows=['day_key,items,owner_review_status,independent_editorial_status,protected_grade_status',
 ...[...dayTotals].map(([day,n])=>[day,n,'TRIAGED_NOT_SOURCE_CERTIFIED','NOT_ACCEPTED','NOT_APPROVED'].map(quote).join(','))];
writeFileSync('artifacts/academy-first42-42-day-editorial-queue.csv',countRows.join('\n')+'\n');
writeFileSync('artifacts/academy-first42-940-disposition-manifest.json',
 JSON.stringify({documentId:'SMFGU-ACADEMY-940-TRIAGE-001',days:dayTotals.size,items:output.length,
  counts,reviewAuthority:'AI_PRELIMINARY_CLASSIFICATION_ONLY',independentEditorialApprovals:0,
  protectedAssessmentApprovals:0,sourceVerifiedWholeLessons:0},null,2)+'\n');
console.log('PASS first-42 per-sentence triage: '+output.length+' distinct review entries; '+JSON.stringify(counts)+'; 0 premature approvals.');
