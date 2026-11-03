import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const forward=readFileSync('supabase/admin/20261103_RC09_LEVEL2_CANDIDATE_RECONCILIATION.sql','utf8');
const rollback=readFileSync('supabase/rollbacks/20261103_RC09_LEVEL2_CANDIDATE_RECONCILIATION_ROLLBACK.sql','utf8');
const original=readFileSync('supabase/migrations/v0.14.0.105_REVIEWED_KNOWLEDGE_EVIDENCE_OWNER_REVIEW_REQUIRED.sql','utf8');
const competency=readFileSync('supabase/migrations/v0.13.4_SKILLS_ADMIN_SHOWCASE.sql','utf8');
assert(original.includes("('TAPE-C09-L02','TAPE_READING','topic_keyword_suggestion_ungraded')"));
assert(original.includes("('TAPE-C09-L01','TAPE_READING','topic_keyword_suggestion_ungraded')"));
assert(original.includes("('TAPE-C09-L03','TAPE_READING','topic_keyword_suggestion_ungraded')"));
assert(competency.includes("'LEVEL2_READING'"),'Official 30th code must already exist');
assert(forward.startsWith('-- Project:'), 'Document-control header required');
assert.match(forward,/BEGIN;[\s\S]*DO \$rc09\$[\s\S]*END \$rc09\$;[\s\S]*COMMIT;/);
assert.match(rollback,/BEGIN;[\s\S]*DO \$rc09rollback\$[\s\S]*END \$rc09rollback\$;[\s\S]*COMMIT;/);
for(const sql of [forward,rollback]){
 assert.equal((sql.match(/UPDATE public\.gu_lab_competency_knowledge_map_v014105/g)||[]).length,1,'Exactly one scoped UPDATE');
 assert((sql.match(/WHERE lab_id='TAPE-C09-L02'/g)||[]).length>=2,'All source and update clauses must remain scoped to exact target Lab');
 assert(/UPDATE public\.gu_lab_competency_knowledge_map_v014105[\s\S]*?WHERE lab_id='TAPE-C09-L02'/.test(sql),'Mutation must remain restricted to exact target Lab');
 assert(!/\b(?:DROP|TRUNCATE|ALTER|CREATE|GRANT|REVOKE|DELETE|INSERT)\s/i.test(sql),'Never alter schema or invent access, accounts, rows or grading');
 assert(!/SET\s+(?:review_state|rubric_version|reviewed_by|reviewed_at)\s*=/i.test(sql),'Protected approval fields must not be changed');
 assert(sql.includes("lab_training_attempts_v014")&&sql.includes("competency_evidence"),'Abort when real learning evidence exists');
 assert(sql.includes("review_state='candidate'")&&sql.includes('rubric_version=0'),'Retain explicit unreviewed status');
}
assert(forward.includes("competency_code='LEVEL2_READING'"));
assert(rollback.includes("competency_code='TAPE_READING'"));
assert(forward.includes("count(distinct competency_code)"));
assert(forward.includes("<>419")&&forward.includes("<>30"));
console.log('PASS RC09 single ungraded Level II candidate reconciliation: exact one-row CAS, canonical 30/419 guards, no grading, no account mutations, safe rollback.');
