-- Draft-only SEC Filings candidate correction. Never publishes a case or reveals answer keys.
-- SEC authority: https://www.sec.gov/about/webmaster-frequently-asked-questions
-- SEC EDGAR accession prefix can belong to a third-party filing agent.
BEGIN;
DO $qa$
DECLARE c public.competency_cases_v135%ROWTYPE;
        question jsonb; options_before jsonb; options_after jsonb;
        before_key text; n integer; matching integer;
BEGIN
 SELECT * INTO STRICT c FROM public.competency_cases_v135
 WHERE case_code='BC3_FILINGS7_D01_V1' FOR UPDATE;
 IF c.active OR c.reviewed_by IS NOT NULL OR c.reviewed_at IS NOT NULL OR c.version<>1
 OR EXISTS(SELECT 1 FROM public.competency_attempts_v135 WHERE case_code=c.case_code)
 OR EXISTS(SELECT 1 FROM public.gu_lumen_assessment_case_release_v1 WHERE case_code=c.case_code)
 THEN RAISE EXCEPTION 'CASE_NOT_SAFE_TO_REVISE';END IF;
 IF jsonb_array_length(c.questions)<>4 OR c.questions->0->>'id'<>'Q1'
 THEN RAISE EXCEPTION 'CANDIDATE_SCHEMA_DRIFT';END IF;
 question:=c.questions->0;options_before:=question->'options';
 SELECT count(*) INTO matching FROM jsonb_array_elements(options_before) o
 WHERE o->>'corrective_feedback' LIKE 'Correct.%';
 IF matching<>1 THEN RAISE EXCEPTION 'AMBIGUOUS_FEEDBACK_STRUCTURE';END IF;
 SELECT jsonb_agg(
   CASE WHEN o->>'corrective_feedback' LIKE 'Correct.%'
   THEN jsonb_set(o,'{corrective_feedback}',
     to_jsonb('Correct. Independently verify the legal issuer CIK in the filing metadata, and use the accession number to identify the particular submission. Its first ten digits may instead be the CIK of a third-party submitting agent. Keep form type, reporting period and EDGAR acceptance time distinct.'::text))
   ELSE o END ORDER BY ord)
 INTO options_after FROM jsonb_array_elements(options_before) WITH ORDINALITY AS i(o,ord);
 question:=jsonb_set(question,'{options}',options_after);
 question:=jsonb_set(question,'{rubric}',to_jsonb(
 'Verify issuer identity independently of any accession prefix: an accession may carry the submitting agent CIK rather than the issuer CIK. Pair the verified issuer identity with the accession and form identifying a submission. Differentiate fiscal period end from EDGAR acceptance and later retrieval.'::text));
 before_key:=md5(c.answer_key::text);
 UPDATE public.competency_cases_v135
 SET questions=jsonb_set(questions,'{0}',question),version=version+1,updated_at=now()
 WHERE case_code=c.case_code AND version=1 AND NOT active AND reviewed_by IS NULL
 RETURNING 1 INTO n;
 IF n<>1 OR (SELECT md5(answer_key::text) FROM public.competency_cases_v135
 WHERE case_code=c.case_code)<>before_key
 THEN RAISE EXCEPTION 'KEY_OR_VERSION_INVARIANT_FAILED';END IF;
 IF (SELECT reviewed_by IS NOT NULL OR active FROM public.competency_cases_v135
 WHERE case_code=c.case_code) THEN RAISE EXCEPTION 'DRAFT_PRIVILEGE_ESCALATION'; END IF;
END $qa$;
COMMIT;
