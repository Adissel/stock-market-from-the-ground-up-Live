-- Crownlight V1 protected assessment -> durable fail-closed award outbox.
-- No real customer earning is enabled by this migration.
BEGIN;
CREATE TABLE IF NOT EXISTS public.gu_lumen_reviewed_grade_outbox_v1(
 evidence_id bigint PRIMARY KEY REFERENCES public.competency_evidence(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES auth.users(id),
 scope_type text NOT NULL CHECK(scope_type IN ('lab','bootcamp')),
 scope_id text NOT NULL CHECK(scope_id ~ '^[A-Za-z0-9_-]{2,100}$'),
 approved_revision text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','blocked','issued')),
 award_id uuid REFERENCES public.gu_lumen_learning_awards_v1(id),
 blocked_sqlstate text,
 updated_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK((status='issued')=(award_id IS NOT NULL))
);
ALTER TABLE public.gu_lumen_reviewed_grade_outbox_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_reviewed_grade_outbox_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_lumen_reviewed_grade_outbox_v1 TO service_role;
CREATE INDEX IF NOT EXISTS gu_lumen_grade_outbox_pending_v1 ON public.gu_lumen_reviewed_grade_outbox_v1(status,created_at);
CREATE OR REPLACE FUNCTION public.gu_lumen_queue_reviewed_grade_v1() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $body$
DECLARE v_scope text;v_id text;v_revision text;
BEGIN
 -- This trigger never issues credits, and routine formative progress is excluded.
 IF NEW.source_type IS DISTINCT FROM 'system_assessment' OR NEW.passed IS DISTINCT FROM true
  OR NEW.critical_error IS DISTINCT FROM false OR NEW.score<80
  OR NEW.metadata->>'grading_mode' IS DISTINCT FROM 'protected_independent'
  OR NEW.metadata->>'grading_state' IS DISTINCT FROM 'approved'
  OR NEW.metadata->>'publication_state' IS DISTINCT FROM 'released'
  OR NEW.metadata->>'human_beta_accepted' IS DISTINCT FROM 'true'
 THEN RETURN NEW;END IF;
 v_scope:=NEW.metadata->>'scope_type';
 v_id:=NEW.metadata->>'scope_id';
 v_revision:=NEW.metadata->>'approved_revision';
 IF v_scope NOT IN ('lab','bootcamp') OR v_id IS NULL OR v_id !~ '^[A-Za-z0-9_-]{2,100}$'
  OR v_revision IS DISTINCT FROM 'lumen-v1.0'
 THEN RETURN NEW;END IF;
 INSERT INTO public.gu_lumen_reviewed_grade_outbox_v1
 (evidence_id,user_id,scope_type,scope_id,approved_revision,status)
 VALUES(NEW.id,NEW.user_id,v_scope,v_id,v_revision,'pending')
 ON CONFLICT(evidence_id) DO UPDATE
 SET user_id=excluded.user_id,scope_type=excluded.scope_type,
 scope_id=excluded.scope_id,approved_revision=excluded.approved_revision,
 status='pending',blocked_sqlstate=null,updated_at=now()
 WHERE public.gu_lumen_reviewed_grade_outbox_v1.status<>'issued';
 RETURN NEW;
END $body$;
DROP TRIGGER IF EXISTS gu_lumen_reviewed_grade_enqueue_v1 ON public.competency_evidence;
CREATE TRIGGER gu_lumen_reviewed_grade_enqueue_v1
AFTER INSERT OR UPDATE OF score,passed,critical_error,metadata,source_type
ON public.competency_evidence FOR EACH ROW
EXECUTE FUNCTION public.gu_lumen_queue_reviewed_grade_v1();
REVOKE ALL ON FUNCTION public.gu_lumen_queue_reviewed_grade_v1() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.gu_lumen_process_reviewed_grade_outbox_v1(p_max integer DEFAULT 20)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $body$
DECLARE candidate record;v_result jsonb;v_issued integer:=0;v_blocked integer:=0;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role'
 THEN RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501';END IF;
 IF p_max IS NULL OR p_max<1 OR p_max>50
 THEN RAISE EXCEPTION 'INVALID_BATCH_LIMIT' USING ERRCODE='22023';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gu_lumen_completion_release_v1
 WHERE singleton=true AND learning_rewards_enabled=true)
 THEN RETURN jsonb_build_object('ok',true,'enabled',false,'issued',0,'blocked',0);END IF;
 FOR candidate IN SELECT evidence_id,scope_type,scope_id,approved_revision
 FROM public.gu_lumen_reviewed_grade_outbox_v1 WHERE status='pending'
 ORDER BY created_at,evidence_id LIMIT p_max FOR UPDATE SKIP LOCKED LOOP
  BEGIN
   v_result:=public.gu_lumen_issue_from_protected_assessment_v1(
    candidate.evidence_id,candidate.scope_type,candidate.scope_id,candidate.approved_revision);
   UPDATE public.gu_lumen_reviewed_grade_outbox_v1
   SET status='issued',award_id=(v_result->>'awardId')::uuid,
    blocked_sqlstate=null,updated_at=now()
   WHERE evidence_id=candidate.evidence_id;
   v_issued:=v_issued+1;
  EXCEPTION WHEN OTHERS THEN
   -- Never treat an unverified grade as an award and do not block the grading pipeline.
   UPDATE public.gu_lumen_reviewed_grade_outbox_v1
   SET status='blocked',blocked_sqlstate=SQLSTATE,updated_at=now()
   WHERE evidence_id=candidate.evidence_id;
   v_blocked:=v_blocked+1;
  END;
 END LOOP;
 RETURN jsonb_build_object('ok',true,'enabled',true,'issued',v_issued,'blocked',v_blocked);
END $body$;
REVOKE ALL ON FUNCTION public.gu_lumen_process_reviewed_grade_outbox_v1(integer)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_process_reviewed_grade_outbox_v1(integer) TO service_role;
COMMIT;