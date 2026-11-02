-- Crownlight Academy — protected assessment privacy-safe integrity preflight
-- Document ID: SMFGU-ACADEMY-PRIVATE-INTEGRITY-20261102
-- Version 1.0 | Status: READ-ONLY ADMIN QA; does NOT approve, publish, or grade cases
-- Project: The Stock Market: From the Ground Up
-- Run only in the existing authorized Supabase SQL Editor; no keys/prompts are returned.
-- Dependencies: competency_cases_v135; gu_academy_protected_cases_v1;
-- competency_attempts_v135; competency_evidence; protected grading RPC.
-- Google Drive location/document ID: not created / not assigned.
-- Future QA must independently check answer correctness; this query checks syntax and state only.

WITH cases AS (
 SELECT m.program_code,m.day_number,m.variant,m.source_status,c.case_code,
        c.questions,c.answer_key,c.active,c.reviewed_by,c.reviewed_at
 FROM public.gu_academy_protected_cases_v1 m
 JOIN public.competency_cases_v135 c USING(case_code)
 WHERE m.program_code IN ('tape10','indicators10','filings7')
),
questions AS (
 SELECT c.*, q.value AS item
 FROM cases c CROSS JOIN LATERAL jsonb_array_elements(c.questions) q
),
options AS (
 SELECT q.*, o.value AS choice
 FROM questions q CROSS JOIN LATERAL jsonb_array_elements(q.item->'options') o
),
state AS (
 SELECT
  (SELECT count(*) FROM cases) AS protected_cases,
  (SELECT count(*) FROM cases WHERE NOT active AND reviewed_by IS NULL AND reviewed_at IS NULL) AS cases_on_hold,
  (SELECT count(*) FROM questions) AS questions,
  (SELECT count(*) FROM questions WHERE length(trim(coalesce(item->>'rubric',''))) BETWEEN 25 AND 1600
       AND length(item->>'prompt') BETWEEN 8 AND 1800
       AND item->>'dimension' IN ('knowledge','recognition','decision','process')) AS valid_question_structure,
  (SELECT count(*) FROM questions
    WHERE (SELECT count(*) FROM jsonb_array_elements(item->'options') o
           WHERE o->>'code'=answer_key->>(item->>'id'))=1) AS unique_resolved_answer_keys,
  (SELECT count(*) FROM options) AS options,
  (SELECT count(*) FROM options WHERE length(trim(coalesce(choice->>'corrective_feedback',''))) BETWEEN 25 AND 1000
       AND length(choice->>'label') BETWEEN 1 AND 700) AS complete_feedback_fields,
  (SELECT count(*) FROM options WHERE
       (choice->>'code'=answer_key->>(item->>'id')
         AND coalesce(choice->>'corrective_feedback','') ~* '^Correct[:.]')
       OR
       (choice->>'code'<>answer_key->>(item->>'id')
         AND coalesce(choice->>'corrective_feedback','') ~* '^Incorrect[:.]')) AS key_feedback_label_alignment,
  (SELECT count(*) FROM questions WHERE item ? 'source_url') AS item_research_reference_fields,
  (SELECT count(*) FROM cases WHERE source_status='approved') AS approved_route_mappings,
  (SELECT count(*) FROM public.competency_attempts_v135 WHERE case_code LIKE 'BC3_%') AS graded_attempt_count,
  (SELECT count(*) FROM public.competency_evidence WHERE metadata->>'caseCode' LIKE 'BC3_%') AS graded_evidence_count,
  (SELECT count(*) FROM (
    SELECT program_code,day_number, count(*) AS cnt,count(DISTINCT variant) AS variants
    FROM cases GROUP BY program_code,day_number
    HAVING count(*)<>2 OR count(DISTINCT variant)<>2
   ) invalid_mappings) AS day_variant_violations,
  (SELECT count(*) FROM (
    SELECT program_code,day_number,variant, count(*) AS cnt
    FROM cases GROUP BY program_code,day_number,variant HAVING count(*)>1
   ) duplicate_routes) AS duplicate_route_violations,
  (SELECT has_function_privilege('anon','public.submit_competency_case_v135(uuid,text,jsonb)','EXECUTE')) AS anon_grading_rpc_executable,
  (SELECT has_function_privilege('authenticated','public.submit_competency_case_v135(uuid,text,jsonb)','EXECUTE')) AS member_grading_rpc_executable,
  (SELECT relrowsecurity FROM pg_class WHERE oid='public.competency_cases_v135'::regclass) AS private_cases_rls,
  (SELECT relrowsecurity FROM pg_class WHERE oid='public.gu_academy_protected_cases_v1'::regclass) AS routing_rls
)
SELECT *,
 (protected_cases=54 AND cases_on_hold=54 AND questions=216 AND valid_question_structure=216
  AND unique_resolved_answer_keys=216 AND options=648 AND complete_feedback_fields=648
  AND key_feedback_label_alignment=648 AND approved_route_mappings=0
  AND graded_attempt_count=0 AND graded_evidence_count=0
  AND day_variant_violations=0 AND duplicate_route_violations=0
  AND NOT anon_grading_rpc_executable AND NOT member_grading_rpc_executable
  AND private_cases_rls AND routing_rls
 ) AS private_draft_integrity_hold_pass,
 'STRUCTURAL ONLY: independent semantic/source review and authenticated Beta tests remain REQUIRED' AS scope
FROM state;

-- Footer: Crown & Lantern Press. Never copy assessment item text, options, or keys into the repository.
