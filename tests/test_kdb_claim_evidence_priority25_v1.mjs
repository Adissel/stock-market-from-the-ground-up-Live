import assert from'node:assert/strict';import{readFileSync}from'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const j=JSON.parse(read('data/knowledge/kdb-claim-evidence-priority25-v1.json'));
assert.equal(j.total,25);assert.equal(j.entries.length,25);
assert.equal(new Set(j.entries.map(x=>x.slug)).size,25);
assert.equal(new Set(j.entries.map(x=>x.claim_key)).size,25);
for(const x of j.entries){assert(x.claim_text.length>=25);assert.match(x.source_url,/^https:\/\//);assert(x.article_version>=1);assert.equal(x.verification_state,'candidate');assert.equal(x.rights_status,'not_cleared');assert.equal(x.reviewer_id,null);assert.equal(x.independent_review,'NOT_ESTABLISHED');}
const ddl=read('supabase/migrations/20261104_knowledge_claim_evidence_private_v1.sql');const seed=read('supabase/data/knowledge_claim_evidence_priority25_seed_v1.sql');
for(const term of ['ENABLE ROW LEVEL SECURITY','REVOKE ALL','service_role','security_invoker=true','gu_knowledge_claim_evidence_events_v1','article_version','source_accessed_on','reviewer_id','rights_status','claim_text'])assert(ddl.includes(term),term);
assert(seed.includes('candidate_not_verified')&&seed.includes('rights_clearance')&&seed.includes('v_count<>25'));
console.log('PASS: 25 article-versioned claim/source candidates, no false approvals; protected private evidence ledger.');
