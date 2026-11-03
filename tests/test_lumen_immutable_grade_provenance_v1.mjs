// Source regression: the protected reward issuer must verify genuine immutable
// grading provenance, not merely self-asserted grading metadata.
// This test does NOT activate member earning or issue real credits.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(
 'supabase/migrations/20261102_lumen_immutable_grade_issuer_provenance_hardening_v1.sql','utf8');
for(const term of [
 'IMMUTABLE_GRADE_NOT_FOUND','GRADE_LINKAGE_MISMATCH',
 'INDEPENDENT_CASE_NOT_RELEASED','RELEASE_REVIEW_MAPPING_MISMATCH',
 'APPROVED_GRADE_THRESHOLD_NOT_MET',
 'FROM public.competency_attempts_v135',
 'FROM public.competency_cases_v135',
 'FROM public.gu_lumen_assessment_case_release_v1',
 'human_reviewed_at IS NOT NULL',
 'approved_revision=p_revision',
 "status='approved'",
 "e.metadata->>'official_grade_ref'",
 "e.metadata->>'editorial_approval_ref'",
 'e.source_id','a.id::text','e.score',
 'v_pass','final_score>=80','critical_errors=0',
 "auth.role() IS DISTINCT FROM 'service_role'",
 'LEARNING_REWARDS_DISABLED',
 'INDEPENDENT_REVIEWER_REQUIRED',
 'UNPUBLISHED_REWARD',
 'gu_lumen_learning_issue_v1',
]) assert(source.includes(term),'Missing provenance or award-release guard: '+term);
assert.match(source,/REVOKE ALL ON FUNCTION public.gu_lumen_issue_from_protected_assessment_v1\(bigint,text,text,text\)/);
assert.match(source,/GRANT EXECUTE ON FUNCTION public.gu_lumen_issue_from_protected_assessment_v1\(bigint,text,text,text\) TO service_role/);
assert.doesNotMatch(source,/UPDATE\s+public\.gu_lumen_completion_release_v1\s+SET\s+learning_rewards_enabled\s*=\s*true/i);
assert.doesNotMatch(source,/INSERT\s+INTO\s+public\.gu_lumen_assessment_case_release_v1/i);
console.log('PASS: issuer provenance requires actual immutable attempt, exact approved case revision and reviewer mapping before protected credit; global switches unchanged.');
