-- Three new Boot Camps: independent, read-only editorial inventory.
-- Run in the connected project with appropriate private reviewer privileges.
-- NEVER export live assessment question text, option labels, or keys to the UI.
-- No INSERT, UPDATE, DELETE, DDL, role grants or reviewer approvals.
-- Document ID SMFGU-ACADEMY-THREE-EDITORIAL-002, v1.0, October 31, 2026.

-- 1. Per-program unpublished assessment and feedback gaps.
with question_rows as (
  select m.program_code,m.day_number,m.variant,c.case_code,c.active,c.reviewed_by,c.reviewed_at,
   m.source_status,c.answer_key,q.question
  from public.gu_academy_protected_cases_v1 m
  join public.competency_cases_v135 c on c.case_code=m.case_code
  cross join lateral jsonb_array_elements(c.questions) q(question)
), opts as (
 select program_code,case_code,question->>'id' question_id,
  opt.item->>'label' label,opt.item
 from question_rows
 cross join lateral jsonb_array_elements(question->'options') opt(item)
)
select q.program_code,count(distinct q.day_number) study_days,
 count(distinct q.case_code) draft_cases,count(*) actual_questions,
 count(*) filter (where q.source_status='approved' and q.active
  and q.reviewed_by is not null and q.reviewed_at is not null) reviewed_question_records,
 count(*) filter(where q.question ? 'feedback' or q.question ? 'rubric') questions_with_scoped_feedback,
 (select count(*) from opts o where o.program_code=q.program_code) all_options,
 (select count(*) from opts o where o.program_code=q.program_code
  and (o.item?'feedback' or o.item?'corrective_feedback')) options_with_corrective_feedback,
 (select count(distinct label) from opts o where o.program_code=q.program_code) distinct_option_labels
from question_rows q group by q.program_code order by q.program_code;

-- 2. Every individual draft: strictly status and schema metadata, NO answer key.
with x as (
 select m.program_code,m.day_number,m.variant,c.case_code,m.source_status,c.active,
  c.reviewed_by is not null and c.reviewed_at is not null as reviewer_attributed,
  jsonb_array_length(c.questions) questions,
  (select count(*) from jsonb_array_elements(c.questions) j(q) where j.q?'rubric' or j.q?'feedback') with_rubric,
  (select count(*) from jsonb_array_elements(c.questions) j(q)
    cross join lateral jsonb_array_elements(j.q->'options') z(o)
    where z.o?'feedback' or z.o?'corrective_feedback') with_option_feedback,
  (select count(distinct j.q->>'dimension') from jsonb_array_elements(c.questions) j(q)) dimensions
 from public.gu_academy_protected_cases_v1 m
 join public.competency_cases_v135 c on c.case_code=m.case_code
)
select program_code,day_number,variant,case_code,source_status,active,reviewer_attributed,
 questions,with_rubric,with_option_feedback,dimensions,
 case when source_status='approved' and active and reviewer_attributed and
  questions>=4 and dimensions=4 and with_rubric=questions and with_option_feedback>=questions*3
 then 'schema_review_check_only_NOT_editorial_approval'
 else 'HOLD_editorial_provenance_rubric_and_option_feedback' end as automated_status
from x order by program_code,day_number,variant;

-- 3. Reviewer-visible first-submission adoption statistics without private member IDs.
select m.program_code,count(distinct e.user_id) distinct_real_submitters,
 count(*) first_attempt_records
from public.competency_attempts_v135 e join public.gu_academy_protected_cases_v1 m
 on m.case_code=e.case_code
group by m.program_code order by m.program_code;
