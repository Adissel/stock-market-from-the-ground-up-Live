import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Protect the unreviewed SEC Filings candidate after the draft-only issuer/agent
// clarification. This is source-contract QA, not independent reviewer approval.
const sql=readFileSync('supabase/migrations/20261102_filings7_d01_issuer_cik_draft_correction_v1.sql','utf8');
assert.match(sql,/BC3_FILINGS7_D01_V1/);
assert.match(sql,/third-party submitting agent/);
assert.match(sql,/c\.reviewed_by IS NOT NULL/);
assert.match(sql,/c\.active/);
assert.match(sql,/c\.version<>1/);
assert.match(sql,/competency_attempts_v135/);
assert.match(sql,/gu_lumen_assessment_case_release_v1/);
assert.match(sql,/jsonb_array_length\(c\.questions\)<>4/);
assert.match(sql,/c\.questions->0->>'id'<>'Q1'/);
assert.match(sql,/md5\(c\.answer_key::text\)/);
assert.match(sql,/version=version\+1/);
assert.match(sql,/reviewed_by IS NULL/);
assert.doesNotMatch(sql,/SET\s+answer_key\s*=/i);
assert.doesNotMatch(sql,/SET\s+active\s*=\s*true/i);
assert.doesNotMatch(sql,/SET\s+reviewed_by\s*=/i);
assert.doesNotMatch(sql,/UPDATE\s+public\.gu_lumen_completion_release_v1/i);
assert.doesNotMatch(sql,/UPDATE\s+public\.gu_lumen_learning_rewards_v1/i);
console.log('PASS: SEC Filings draft-only issuer-vs-agent correction preserves protected grading, key, publication and reward hold.');
