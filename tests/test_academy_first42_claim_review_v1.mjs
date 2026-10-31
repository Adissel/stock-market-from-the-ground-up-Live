/* Canonical Academy first-42 claim evidence / assessment gate.
 * Records selected scope only. Never turns a primary source link into
 * editorial approval or publishes protected case data.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
function csv(text){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(field);field='';}
  else if((c==='\n'||c==='\r')&&!quoted){
   if(c==='\r'&&text[i+1]==='\n')i++;
   if(field.length||row.length){row.push(field);rows.push(row);row=[];field='';}
  }else field+=c;
 }
 if(quoted)throw Error('Unclosed CSV quote');
 if(field.length||row.length){row.push(field);rows.push(row);}
 const keys=rows.shift();
 return rows.map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]])));
}
const read=p=>readFileSync(p,'utf8');
const p='docs/research/stockstotrade/';
const claims=csv(read(p+'ACADEMY_FIRST42_NARROW_CLAIM_EVIDENCE_2026-10-31.csv'));
const designs=csv(read(p+'ACADEMY_FIRST22_PROTECTED_ASSESSMENT_REVIEW_SPEC_2026-10-31.csv'));
const qa=csv(read(p+'252_instruction_source_field_QA_v2.csv'));
const master=csv(read(p+'MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv'));
assert.equal(qa.length,252);
assert.equal(master.length,671);
assert.equal(claims.length,42);
assert.equal(designs.length,22);
assert.equal(new Set(claims.map(c=>c.day_key)).size,42);
const contextOnly={
 'watchlist7:3':'GENERAL_SEC_RESEARCH_CONTEXT_ONLY_EVENT_SOURCE_REQUIRED',
 'scanners10:7':'GENERAL_SEC_RESEARCH_CONTEXT_ONLY_EVENT_SOURCE_REQUIRED',
 'foundations30:9':'TECHNICAL_BACKGROUND_ONLY_LEVEL_RULE_REVIEW_REQUIRED',
 'foundations30:14':'TECHNICAL_BACKGROUND_ONLY_FEED_FINALITY_REVIEW_REQUIRED'
};
for(const [day,status] of Object.entries(contextOnly)){
 const row=claims.find(x=>x.day_key===day);
 assert(row&&row.narrow_review_result===status,'Do not present topical source as exact factual case proof: '+day);
 assert(row.remaining_source_gap.length>100,'Source limitation must be documented: '+day);
 assert.equal(row.editorial_decision,'NOT_ACCEPTED');
}
assert.equal(claims.filter(x=>/CONTEXT_ONLY|TECHNICAL_BACKGROUND_ONLY/.test(x.narrow_review_result)).length,4,
 'Every previously identified source-to-claim mismatch must remain unapproved');

const narrowRechecked=new Set(["truth5:2","truth5:3","truth5:4","watchlist7:2","watchlist7:5","scanners10:4","scanners10:5","scanners10:6","foundations30:1","foundations30:10","foundations30:17","foundations30:20"]);
assert.equal(narrowRechecked.size,12);
const byQA=new Map(qa.map(d=>[d.program_code+':'+d.program_day,d]));
const byMaster=new Map(master.filter(d=>d.unit_type==='academy_or_free').map(d=>[d.unit_id,d]));
const classes={'PUBLIC_REGULATOR_OR_EXCHANGE':29,'INDEPENDENT_TECHNICAL_REFERENCE':7,'AUTHOR_DEFINED_METHOD_OR_ARITHMETIC':6};
const counts={};
for(const c of claims){
 const d=byQA.get(c.day_key),m=byMaster.get(c.day_key);
 assert(d&&m,'Not a canonical Academy or Free day '+c.day_key);
 assert.equal(d.title,c.canonical_title);
 assert.equal(d.editorial_status,'NOT_ACCEPTED');
 assert.equal(m.editorial_decision,'NOT_APPROVED');
 assert.equal(m.claim_source_verified_for_unit,'NOT_VERIFIED',
   'Selected narrow claims must not masquerade as whole-unit source acceptance');
 assert.equal(m.assessment_verified_for_unit,'NOT_VERIFIED');
 assert.equal(c.editorial_decision,'NOT_ACCEPTED');
 assert.equal(c.protected_assessment_gate,'PRIVATE_CASE_AND_INDEPENDENT_RUBRIC_NOT_SIGNED');
 counts[c.authority_class]=(counts[c.authority_class]||0)+1;
 if(c.authority_class==='PUBLIC_REGULATOR_OR_EXCHANGE'){
  assert.equal(d.verified_external_claims,
   narrowRechecked.has(c.day_key)?'NARROW_SOURCE_RECHECKED_WITH_LIMITS_20261031':'SELECTED_PRIMARY_CLAIM_ONLY',
   'Canonical 252 selected-source reconciliation must not claim day acceptance: '+c.day_key);
  assert(/^https:\/\/(www\.)?(?:sec\.gov|investor\.gov|nyse\.com|syndication\.finra\.org)\//.test(c.authority_url),
    'Non-authoritative source attributed as primary '+c.day_key);
 }else if(c.authority_class==='INDEPENDENT_TECHNICAL_REFERENCE'){
  assert(d.verified_external_claims==='SELECTED_TECHNICAL_CLAIM_ONLY');
  assert(c.authority_url.includes('chartschool.stockcharts.com'));
 }else{
  assert(d.verified_external_claims==='INTERNAL_METHOD_NOT_EXTERNALLY_SOURCED');
  assert.equal(c.authority_url,'');
 }
 assert.equal(d.independent_case_review,'NOT_REVIEWED');
 assert.equal(d.protected_assessment_review,'NOT_REVIEWED');
 if(c.day_key.startsWith('foundations30:'))
  assert(Number(c.day_key.split(':')[1])<=20);
}
assert.equal(qa.filter(x=>x.verified_external_claims==='NARROW_SOURCE_RECHECKED_WITH_LIMITS_20261031').length,12);
assert(qa.every(x=>x.editorial_status==='NOT_ACCEPTED'));
assert(master.every(x=>x.editorial_decision==='NOT_APPROVED'));
assert.deepEqual(counts,classes);
for(const b of designs){
 assert(claims.some(c=>c.day_key===b.day_key));
 assert(!b.day_key.startsWith('foundations30:'));
 assert.equal(b.assessment_dimensions,'knowledge|recognition|decision|process');
 assert.equal(b.state,'ASSESSMENT_SPEC_ONLY_NOT_PRIVATE_CASE');
 assert.equal(b.editorial_decision,'NOT_ACCEPTED');
}
assert(!/answer_key|rubric_secret|grading_private_answer/i.test(read(p+'ACADEMY_FIRST22_PROTECTED_ASSESSMENT_REVIEW_SPEC_2026-10-31.csv')));
const f=read('functions/_lib/academy-foundations-batch02-v1.js');
assert(f.includes('const dayCheckpoints=Object.freeze(['));
console.log('PASS: 42 selected claim evidence records, 22 private assessment design gates, authoritative 252 and 671 register status preservation; no grading or editorial approval');
