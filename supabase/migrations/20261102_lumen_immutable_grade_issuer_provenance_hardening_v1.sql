-- Defense in depth: prevent metadata-only claims from becoming Crownlight Lumens.
-- Existing V1 learning earning and V2 gifting release switches remain unchanged.
-- Exact immutable case-scored attempt, active reviewed rubric, scope/version mapping,
-- qualified independent reviewer and score threshold are all required by issuer.
BEGIN;
CREATE OR REPLACE FUNCTION public.gu_lumen_issue_from_protected_assessment_v1(
 p_evidence_id bigint,p_scope_type text,p_scope_id text,p_revision text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $body$
DECLARE e public.competency_evidence%ROWTYPE;
 a public.competency_attempts_v135%ROWTYPE;
 c public.competency_cases_v135%ROWTYPE;
 m public.gu_lumen_assessment_case_release_v1%ROWTYPE;
 v_pass numeric;v_review uuid;v_result jsonb;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role'
 THEN RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.gu_lumen_completion_release_v1
 WHERE singleton=true AND learning_rewards_enabled=true)
 THEN RAISE EXCEPTION 'LEARNING_REWARDS_DISABLED' USING ERRCODE='42501';END IF;
 IF p_scope_type NOT IN ('lab','bootcamp') OR p_scope_id !~ '^[A-Za-z0-9_-]{2,100}$'
 OR p_revision IS DISTINCT FROM 'lumen-v1.0'
 THEN RAISE EXCEPTION 'SCOPE_NOT_APPROVED' USING ERRCODE='42501';END IF;
 SELECT * INTO e FROM public.competency_evidence WHERE id=p_evidence_id;
 IF NOT FOUND OR e.source_type IS DISTINCT FROM 'system_assessment'
 OR e.passed IS DISTINCT FROM true OR e.critical_error IS DISTINCT FROM false
 OR e.score IS NULL OR e.score<80 OR e.user_id IS NULL
 OR e.metadata->>'grading_mode' IS DISTINCT FROM 'protected_independent'
 OR e.metadata->>'grading_state' IS DISTINCT FROM 'approved'
 OR e.metadata->>'publication_state' IS DISTINCT FROM 'released'
 OR e.metadata->>'scope_type' IS DISTINCT FROM p_scope_type
 OR e.metadata->>'scope_id' IS DISTINCT FROM p_scope_id
 OR e.metadata->>'approved_revision' IS DISTINCT FROM p_revision
 OR e.metadata->>'human_beta_accepted' IS DISTINCT FROM 'true'
 OR length(coalesce(e.metadata->>'official_grade_ref',''))<12
 OR length(coalesce(e.metadata->>'editorial_approval_ref',''))<12
 THEN RAISE EXCEPTION 'PROTECTED_ASSESSMENT_NOT_VERIFIED' USING ERRCODE='42501'; END IF;

 -- A metadata-only claim is never sufficient. Match the immutable graded attempt,
 -- active exactly reviewed case, exact version and approved release map.
 SELECT * INTO a FROM public.competency_attempts_v135
 WHERE id::text=e.source_id AND user_id=e.user_id
 AND final_score=e.score AND final_score>=80 AND critical_errors=0;
 IF NOT FOUND THEN RAISE EXCEPTION 'IMMUTABLE_GRADE_NOT_FOUND' USING ERRCODE='42501';END IF;
 IF e.metadata->>'official_grade_ref' IS DISTINCT FROM
   'competency_attempts_v135:'||a.id::text
 OR e.metadata->>'source' IS DISTINCT FROM 'immutable_server_scored_competency_attempt'
 OR e.metadata->>'case_code' IS DISTINCT FROM a.case_code
 OR e.metadata->>'case_version' IS DISTINCT FROM a.case_version::text
 THEN RAISE EXCEPTION 'GRADE_LINKAGE_MISMATCH' USING ERRCODE='42501';END IF;
 SELECT * INTO c FROM public.competency_cases_v135
 WHERE case_code=a.case_code AND version=a.case_version
 AND competency_code=e.competency_code AND active=true
 AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL;
 IF NOT FOUND THEN RAISE EXCEPTION 'INDEPENDENT_CASE_NOT_RELEASED' USING ERRCODE='42501';END IF;
 SELECT * INTO m FROM public.gu_lumen_assessment_case_release_v1
 WHERE case_code=a.case_code AND case_version=a.case_version
 AND status='approved' AND scope_type=p_scope_type AND scope_id=p_scope_id
 AND approved_revision=p_revision
 AND human_reviewed_by IS NOT NULL AND human_reviewed_at IS NOT NULL
 AND review_record IS NOT NULL;
 IF NOT FOUND OR e.metadata->>'editorial_approval_ref' IS DISTINCT FROM m.review_record
 OR e.metadata->>'reviewer_user_id' IS DISTINCT FROM m.human_reviewed_by::text
 OR m.human_reviewed_by=e.user_id
 THEN RAISE EXCEPTION 'RELEASE_REVIEW_MAPPING_MISMATCH' USING ERRCODE='42501';END IF;
 SELECT pass_score INTO v_pass FROM public.competency_definitions
 WHERE competency_code=c.competency_code;
 IF v_pass IS NULL OR a.final_score<v_pass
 THEN RAISE EXCEPTION 'APPROVED_GRADE_THRESHOLD_NOT_MET' USING ERRCODE='42501';END IF;
 BEGIN v_review := (e.metadata->>'reviewer_user_id')::uuid;
 EXCEPTION WHEN invalid_text_representation THEN
 RAISE EXCEPTION 'INVALID_REVIEWER' USING ERRCODE='42501';
 END;
 IF v_review IS NULL OR v_review=e.user_id OR NOT EXISTS(
 SELECT 1 FROM public.admin_user_roles r
 WHERE r.user_id=v_review AND r.role_code IN ('OWNER','ADMIN','MODERATOR')
 AND (r.expires_at IS NULL OR r.expires_at>now()))
 THEN RAISE EXCEPTION 'INDEPENDENT_REVIEWER_REQUIRED' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gu_lumen_learning_rewards_v1 v
  WHERE v.scope_type=p_scope_type AND v.scope_id=p_scope_id
  AND v.approved_revision=p_revision AND v.published=true
  AND v.reviewed_by IS NOT NULL AND v.reviewed_at IS NOT NULL)
 THEN RAISE EXCEPTION 'UNPUBLISHED_REWARD' USING ERRCODE='42501'; END IF;
 INSERT INTO public.gu_lumen_verified_learning_v1
 (user_id,scope_type,scope_id,approved_revision,source_evidence_id,
 evidence_sha256,verified_by,verified_at)
 VALUES(e.user_id,p_scope_type,p_scope_id,p_revision,
   'competency_evidence:'||e.id::text,
   encode(extensions.digest(
    e.id::text||':'||e.user_id::text||':'||e.source_id||':'||e.score::text||':'||
    e.assessed_at::text||':'||e.metadata::text,'sha256'),'hex'),
   v_review,now())
 ON CONFLICT(user_id,scope_type,scope_id,approved_revision) DO NOTHING;
 v_result:=public.gu_lumen_learning_issue_v1(e.user_id,p_scope_type,p_scope_id,p_revision);
 RETURN v_result||jsonb_build_object('assessedEvidenceId',e.id);
END
$body$;
REVOKE ALL ON FUNCTION public.gu_lumen_issue_from_protected_assessment_v1(bigint,text,text,text)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_issue_from_protected_assessment_v1(bigint,text,text,text) TO service_role;
COMMIT;
