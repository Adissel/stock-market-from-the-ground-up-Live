-- Document ID: SMFGU-ACADEMY-THREE-READINESS-001
-- Project: The Stock Market: From the Ground Up / Boot Camp Academy
-- Version: 1.0 | Created: 2026-10-31 | Status: READ-ONLY ACCEPTANCE AUDIT
-- Filename: 20261031_three_bootcamps_release_readiness_read_only.sql
-- GitHub location: supabase/admin/ (main)
-- Google Drive: not created | Google Drive ID: not assigned
-- Purpose: Detect missing, duplicate, unreviewed and structurally invalid protected
--          cases without reading or printing answer keys or member grades.
-- Dependencies: competency_cases_v135, gu_academy_protected_cases_v1,
--               the existing grading RPC and private assessment enrollment.
-- This does NOT perform editorial review, approve cases, write data, impersonate
-- a real member, verify browser access, or activate the release flag.
-- Execution: Supabase SQL editor/approved read-only database connection.
--
-- 1. Inventory and conservative release classification, by program.
with expected(program_code,days) as (
 values ('tape10',10),('indicators10',10),('filings7',7)
), observed as (
 select m.program_code,
  count(*) as mapped,
  count(distinct m.day_number) as mapped_days,
  count(distinct m.case_code) as unique_codes,
  count(distinct(m.day_number,m.variant)) as unique_positions,
  count(*) filter(where m.source_status='approved') as approved_routes,
  count(*) filter(where c.case_code is null) as unlinked,
  count(*) filter(where c.active=true) as active_cases,
  count(*) filter(where c.reviewed_by is not null and c.reviewed_at is not null) as attributed_review
 from public.gu_academy_protected_cases_v1 m
 left join public.competency_cases_v135 c on c.case_code=m.case_code
 group by m.program_code
)
select e.program_code,e.days as required_days,e.days*2 as required_cases,
 coalesce(o.mapped,0) as mapped_cases,
 coalesce(o.mapped_days,0) as covered_days,
 coalesce(o.unlinked,0) as missing_case_records,
 coalesce(o.approved_routes,0) as approved_routes,
 coalesce(o.attributed_review,0) as reviewer_attributed,
 coalesce(o.active_cases,0) as active_cases,
 case when o.mapped=e.days*2 and o.mapped_days=e.days and
  o.unique_codes=e.days*2 and o.unique_positions=e.days*2 and
  o.unlinked=0 then 'INVENTORY COMPLETE' else 'INVENTORY INCOMPLETE' end as inventory,
 case when o.mapped=e.days*2 and o.mapped_days=e.days and
  o.unique_codes=e.days*2 and o.unique_positions=e.days*2 and o.unlinked=0 and
  o.approved_routes=e.days*2 and o.attributed_review=e.days*2 and
  o.active_cases=e.days*2 then 'EDITORIAL DATABASE GATE MET'
 else 'NOT APPROVED FOR RELEASE' end as editorial_database_gate
from expected e left join observed o using(program_code)
order by e.program_code;

-- 2. Structural/answer-reference integrity only. Never expose answer_key values.
with questions as (
 select m.program_code,m.case_code,q.value as question,c.answer_key,
  q.value->>'id' as question_id
 from public.gu_academy_protected_cases_v1 m
 join public.competency_cases_v135 c on c.case_code=m.case_code
 cross join lateral jsonb_array_elements(c.questions) q
), metrics as (
 select program_code,case_code,question_id,
  question->>'prompt' as prompt,
  question->>'dimension' as dimension,
  jsonb_array_length(question->'options') as options_count,
  (select count(distinct o->>'code') from jsonb_array_elements(question->'options') o) as unique_codes,
  (select count(distinct lower(trim(o->>'label'))) from jsonb_array_elements(question->'options') o) as unique_labels,
  (select count(*) from jsonb_array_elements(question->'options') o
   where o->>'code'=answer_key->>question_id) as matching_correct_option
 from questions
)
select program_code,count(distinct case_code) as case_count,count(*) as questions,
 count(distinct prompt) as unique_question_prompts,
 count(*) filter(where matching_correct_option<>1) as invalid_answer_references,
 count(*) filter(where unique_codes<>options_count or unique_labels<>options_count) as duplicated_within_question,
 count(*) filter(where dimension not in('knowledge','recognition','decision','process')) as invalid_dimensions
from metrics group by program_code order by program_code;

-- 3. Security boundary checks. This is a privilege audit, not an authenticated
--    member/browser acceptance test.
select c.relname as table_name,c.relrowsecurity as rls_enabled,
 has_table_privilege('anon',c.oid,'SELECT') as anon_can_select,
 has_table_privilege('authenticated',c.oid,'SELECT') as browser_role_can_select,
 has_table_privilege('authenticated',c.oid,'INSERT') as browser_role_can_insert
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in (
 'competency_cases_v135','competency_attempts_v135',
 'gu_academy_protected_cases_v1','gu_bootcamp_academy_progress_v014168',
 'gu_bootcamp_academy_enrollments_v014168'
) order by c.relname;

-- Reviewers must inspect each private question/answer, its numeric correctness,
-- originality, cutoff and distractors outside this report. This audit alone can
-- NEVER satisfy the editorial sign-off or genuine authenticated QA gate.
