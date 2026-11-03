import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const registry=JSON.parse(read('docs/research/master/master-source-registry-v1.json'));
const cross=JSON.parse(read('data/knowledge/batch003-master-sources-crosswalk-v1.json'));
const paths=[
'data/knowledge/batch003-01-foundations-technical.json',
'data/knowledge/batch003-02-market-structure-fundamentals.json',
'data/knowledge/batch003-03-fundamentals-derivatives-macro.json',
'data/knowledge/batch003-04-macro-quant-data.json',
'data/knowledge/batch003-05-market-data-engineering.json'
];
const src=new Map(registry.sources.map(x=>[x.id,x]));
assert.equal(registry.sources.length,73);
assert.equal(src.size,73);
assert.equal(cross.article_count,50);
assert.equal(cross.master_sources_count,73);
assert.equal(cross.coverage_count,73);
assert.equal(cross.topics.length,50);
assert.equal(cross.source_crosswalk.length,73);
assert.equal(cross.editorial_state,'owner_directed_publication_without_independent_approval');
const all=[];
for(const [i,path] of paths.entries()){
 const g=JSON.parse(read(path));
 assert.equal(g.batch,'B003');assert.equal(g.part,i+1);
 assert.equal(g.independent_approval,false);
 assert.equal(g.documents.length,10);
 for(const d of g.documents){
  all.push(d);
  assert.match(d.slug,/^knowledge-b003-[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(d.title.length>=25);
  assert(d.summary.length>=30);
  for(const key of ['definition','procedure','exercise','solution','counterexample','limitations','application'])
   assert(d[key]?.length>=35,'Missing original teaching: '+d.slug+' / '+key);
  assert(['beginner','intermediate','advanced','professional','institutional_quantitative'].includes(d.learning_level));
  assert(!d.access_plans.includes('FREE'));
  assert(!d.access_plans.includes('PICK_WHAT_YOU_WANT'));
  assert(d.access_plans.includes('FOUNDING_60')&&d.access_plans.includes('LIFETIME'));
  if(['beginner','intermediate'].includes(d.learning_level))
   assert(d.access_plans.includes('FOUNDING_14'));
  else if(d.learning_level==='advanced')
   assert(d.access_plans.includes('FOUNDING_30')&&!d.access_plans.includes('FOUNDING_14'));
  else assert(!d.access_plans.includes('FOUNDING_14')&&!d.access_plans.includes('FOUNDING_30'));
  const topic=cross.topics.find(t=>t.slug===d.slug);
  assert(topic,'Topic must be crosswalked: '+d.slug);
  assert.equal(topic.title,d.title);
  assert.equal(topic.learning_level,d.learning_level);
  assert.deepEqual(topic.source_ids,d.source_ids);
  assert(d.tags.includes(topic.category));
  assert(d.source_ids.length>=1);
  assert.equal(d.source_ids.length,d.sources.length);
  for(let n=0;n<d.source_ids.length;n++){
   const s=src.get(d.source_ids[n]);
   assert(s,'Master source not found: '+d.source_ids[n]);
   assert.equal(s.category,topic.category);
   assert.equal(s.name,d.sources[n].title);
   assert.equal(s.url,d.sources[n].url);
   assert(/^https:\/\//.test(s.url));
  }
 }
}
assert.equal(all.length,50);
assert.equal(new Set(all.map(d=>d.slug)).size,50);
assert.equal(new Set(all.map(d=>d.title)).size,50);
assert.equal(new Set(all.flatMap(d=>d.source_ids)).size,73);
assert.equal(new Set(all.flatMap(d=>d.tags).filter(x=>registry.tiers.some(y=>y.key===x))).size,9);
for(const x of cross.source_crosswalk) {
 assert(src.has(x.source_id));
 assert(x.used_by.length>=1);
 assert(x.used_by.every(slug=>all.some(d=>d.slug===slug&&d.source_ids.includes(x.source_id))));
}
const sql=read('supabase/migrations/20261103_knowledge_batch003_full_registry_v1.sql');
for(const token of ['gu_knowledge_batch003_render_v1','gu_knowledge_batch003_publish_v1',
 'gu_knowledge_mutate_v1','gu_knowledge_complete_article_v2','source_ids','knowledge-b003-',
 'admin_audit_log','REVOKE ALL','service_role','Independent application','Self-check and answer guide',
 'References and provenance'])assert(sql.includes(token),'Publication contract missing '+token);
assert(sql.includes('jsonb_array_length(p_docs)>10'));
const ui=read('assets/js/knowledge-article-library-v1.js');
assert(ui.includes('while(more&&page<20)'));
assert(ui.includes('/knowledge-article.html?slug='));
assert(!ui.includes('body_markdown'));
console.log('PASS: Batch 003 50 authored articles, 73 of 73 master source refs, nine research domains, gated access and source-audited publication.');
