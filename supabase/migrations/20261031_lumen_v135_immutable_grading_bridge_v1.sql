-- Crownlight Lumens: controlled link from actual immutable v135 competency attempt
-- to protected assessment evidence. No rows approved, awards issued or switches enabled.
BEGIN;
CREATE TABLE IF NOT EXISTS public.gu_lumen_assessment_case_release_v1(
 case_code text PRIMARY KEY REFERENCES public.competency_cases_v135(case_code),
 scope_type text NOT NULL CHECK(scope_type IN ('lab','bootcamp')),
 scope_id text NOT NULL CHECK(scope_id ~ '^[A-Za-z0-9_-]{2,100}$'),
 approved_revision text NOT NULL DEFAULT 'lumen-v1.0' CHECK(approved_revision='lumen-v1.0'),
 case_version integer NOT NULL CHECK(case_version>=1),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','retired')),
 human_reviewed_by uuid REFERENCES auth.users(id),
 human_reviewed_at timestamptz,
 review_record text CHECK(review_record IS NULL OR length(review_record)>=12),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(scope_type,scope_id,approved_revision)
 REFERENCES public.gu_lumen_learning_rewards_v1(scope_type,scope_id,approved_revision),
 CHECK(status<>'approved' OR (human_reviewed_by IS NOT NULL AND
 human_reviewed_at IS NOT NULL AND review_record IS NOT NULL))
);
ALTER TABLE public.gu_lumen_assessment_case_release_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_assessment_case_release_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_lumen_assessment_case_release_v1 TO service_role;
CREATE INDEX IF NOT EXISTS gu_lumen_case_release_lookup_v1
 ON public.gu_lumen_assessment_case_release_v1(scope_type,scope_id,status);

CREATE OR REPLACE FUNCTION public.gu_lumen_bridge_immutable_assessment_v1()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE c public.competency_cases_v135%ROWTYPE;
 m public.gu_lumen_assessment_case_release_v1%ROWTYPE;
 v_threshold numeric;v_evidence_id bigint;
BEGIN
 -- Only the existing server-only protected grader is allowed to create attempts.
 IF auth.role() IS DISTINCT FROM 'service_role' THEN
  RETURN NEW;
 END IF;
 IF NEW.final_score IS NULL OR NEW.final_score<80 OR NEW.critical_errors<>0 THEN
  RETURN NEW;
 END IF;
 SELECT * INTO m FROM public.gu_lumen_assessment_case_release_v1
 WHERE case_code=NEW.case_code AND status='approved' AND case_version=NEW.case_version
 AND approved_revision='lumen-v1.0';
 IF NOT FOUND THEN RETURN NEW;END IF;
 SELECT * INTO c FROM public.competency_cases_v135
 WHERE case_code=NEW.case_code AND version=NEW.case_version AND active=true
 AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL;
 IF NOT FOUND OR m.human_reviewed_by IS NULL OR m.human_reviewed_by=NEW.user_id
 OR NOT EXISTS(SELECT 1 FROM public.admin_user_roles r
 WHERE r.user_id=m.human_reviewed_by AND r.role_code IN ('OWNER','ADMIN','MODERATOR')
 AND (r.expires_at IS NULL OR r.expires_at>now()))
 THEN RETURN NEW; END IF;
 SELECT pass_score INTO v_threshold FROM public.competency_definitions
 WHERE competency_code=c.competency_code;
 IF v_threshold IS NULL OR NEW.final_score<v_threshold THEN RETURN NEW; END IF;
 -- Never generate an official award for a silent case-version mismatch or
 -- reclassified scope. Current immutable grading attempt is the source.
 INSERT INTO public.competency_evidence(
 user_id,competency_code,source_type,source_id,dimension,score,
 passed,critical_error,difficulty,weight,metadata)
 VALUES(
 NEW.user_id,c.competency_code,'system_assessment',NEW.id::text,
 'process',NEW.final_score,true,false,'unseen',1,
 jsonb_build_object(
 'grading_mode','protected_independent','grading_state','approved',
 'publication_state','released','human_beta_accepted',true,
 'scope_type',m.scope_type,'scope_id',m.scope_id,
 'approved_revision',m.approved_revision,
 'official_grade_ref','competency_attempts_v135:'||NEW.id::text,
 'editorial_approval_ref',m.review_record,
 'reviewer_user_id',m.human_reviewed_by::text,
 'case_code',NEW.case_code,'case_version',NEW.case_version,
 'source','immutable_server_scored_competency_attempt'
 )) RETURNING id INTO v_evidence_id;
 -- Existing evidence trigger enqueues the verified grade. Never grant Lumens
 -- in the scoring transaction while earning release is disabled.
 RETURN NEW;
END $fn$;
DROP TRIGGER IF EXISTS gu_lumen_link_v135_scored_attempt_v1 ON public.competency_attempts_v135;
CREATE TRIGGER gu_lumen_link_v135_scored_attempt_v1
AFTER INSERT ON public.competency_attempts_v135
FOR EACH ROW EXECUTE FUNCTION public.gu_lumen_bridge_immutable_assessment_v1();
REVOKE ALL ON FUNCTION public.gu_lumen_bridge_immutable_assessment_v1() FROM PUBLIC,anon,authenticated;
COMMIT;
