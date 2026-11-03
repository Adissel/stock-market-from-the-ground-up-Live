/* SMFGU Knowledge Database: Batch 002, fifty original article inputs + publishing invariants. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const paths=[
 'data/knowledge/batch002-01-foundations-orders.json',
 'data/knowledge/batch002-02-foundations-portfolio.json',
 'data/knowledge/batch002-03-financial-research.json',
 'data/knowledge/batch002-04-quant-methods.json',
 'data/knowledge/batch002-05-quant-validation.json'
];
const all=[];let beginner=0,quant=0;
for(const [index,path] of paths.entries()){
 const file=JSON.parse(read(path));
 assert.equal(file.batch,'B002');
 assert.equal(file.part,index+1);
 assert.equal(file.independent_approval,false,'Owner publication does not equal independent editorial signoff');
 assert.equal(file.documents.length,10,'Exactly ten authored records per part');
 for(const article of file.documents){
  all.push(article);
  assert.match(article.slug,/^knowledge-b002-[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(article.title.length>24);
  assert(article.summary.length>24);
  assert(article.definition.length>40);
  assert(article.procedure.length>40);
  assert(article.exercise.length>40);
  assert(article.solution.length>40);
  assert(article.counterexample.length>40);
  assert(article.application.length>40);
  assert(article.limitations.length>40);
  assert(article.sources.length>=1);
  assert(article.sources.every(s=>/^https:\/\//.test(s.url)&&s.title));
  assert(article.access_plans.includes('FOUNDING_60')&&article.access_plans.includes('LIFETIME'));
  assert(!article.access_plans.includes('FREE'),'New membership articles must not accidentally become Free');
  assert(!article.access_plans.includes('PICK_WHAT_YOU_WANT'),'Add-on entitlement is not implied');
  if(article.learning_level==='beginner'){
   beginner++;
   assert(article.access_plans.includes('FOUNDING_14'));
  }else if(article.learning_level==='institutional_quantitative'){
   quant++;
   assert(!article.access_plans.includes('FOUNDING_14'));
   assert(!article.access_plans.includes('FOUNDING_30'));
  }else throw Error('Unexpected article level: '+article.learning_level);
 }
}
assert.equal(all.length,50,'Batch 002 must contain 50 educational topics');
assert.equal(new Set(all.map(a=>a.slug)).size,50,'No duplicates allowed');
assert.equal(beginner,25);assert.equal(quant,25);
const sql=read('supabase/migrations/20261103_knowledge_article_batch002_authoring_v1.sql');
for(const required of [
 'gu_knowledge_batch002_render_v1','gu_knowledge_batch002_publish_v1',
 'gu_knowledge_mutate_v1','gu_knowledge_complete_article_v2',
 'admin_audit_log','owner directed next batch',
 'authoring_state','review_state','published','is_visible',
 'Independent application','Self-check and answer guide','References and provenance',
 'REVOKE ALL','service_role','batch'
])assert(sql.includes(required),'Missing publishing contract: '+required);
assert(sql.includes("jsonb_array_length(p_docs)>10"),'Enforce bounded auditable batch transaction');
const ui=read('assets/js/knowledge-article-library-v1.js');
assert(ui.includes('while(more&&page<20)'),'Website catalog must paginate beyond the old 145 articles');
assert(ui.includes('/knowledge-article.html?slug='),'New articles must open on their own pages');
console.log('PASS: Batch 002 source audit: 50 distinct articles, 25 beginner / 25 quant, references, tier gates, owner-audited publication contract and paginated reader.');
