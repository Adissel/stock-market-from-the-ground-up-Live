import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const s=readFileSync(new URL('../supabase/migrations/20261104_kdb_sma_independent_case_clarification_v1.sql',import.meta.url),'utf8');
for(const term of ['research-study-sma','r.version<>9','($10+$11+$12)/3=$11','($11+$12+$13)/3=$12','newly','gu_knowledge_complete_article_v2','gu_knowledge_mutate_v1','source','is_visible', 'independent_editorial_approval'])assert(s.toLowerCase().includes(term.toLowerCase()),term);
assert.equal((s.match(/public.gu_knowledge_mutate_v1/g)||[]).length,2);assert.equal((s.match(/public.gu_knowledge_complete_article_v2/g)||[]).length,1);
console.log('PASS SMA original and roll-forward cases plus three-step authoring and disclosure preservation');