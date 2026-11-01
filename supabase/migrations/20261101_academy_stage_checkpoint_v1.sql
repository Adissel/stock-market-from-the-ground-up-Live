-- SMFGU-ACADEMY-STAGE-001 v1.0 — additive ungraded lesson-stage drafts.
-- Do NOT alter gu_bootcamp_progress_v014144, academy reflection ledgers,
-- site_lab_progress, grading, billing, Sparks, or existing curriculum IDs.
BEGIN;
CREATE TABLE IF NOT EXISTS public.gu_academy_stage_checkpoint_v1(
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 program_code text NOT NULL CHECK(program_code IN
  ('truth5','watchlist7','scanners10','foundations30','charts45',
   'risk60','practicum90','tape10','indicators10','filings7')),
 day_number smallint NOT NULL CHECK(day_number BETWEEN 1 AND 90),
 snapshot jsonb NOT NULL CHECK(
  jsonb_typeof(snapshot)='object' AND
  snapshot->>'mode'='guided' AND
  snapshot->>'version'='1' AND
  jsonb_typeof(snapshot->'stage')='number' AND
  (snapshot->>'stage')::integer BETWEEN 0 AND 8 AND
  octet_length(snapshot::text)<=48000
 ),
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>=1),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,program_code,day_number)
);
ALTER TABLE public.gu_academy_stage_checkpoint_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.gu_academy_stage_checkpoint_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON public.gu_academy_stage_checkpoint_v1 TO service_role;
CREATE OR REPLACE FUNCTION public.gu_academy_stage_checkpoint_save_v1(
 p_user uuid,p_program text,p_day integer,p_snapshot jsonb,p_expected_revision bigint
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_temp AS $fn$
DECLARE v_max integer;v_current bigint;v_revision bigint;
BEGIN
 v_max:=CASE p_program
  WHEN 'truth5' THEN 5 WHEN 'watchlist7' THEN 7 WHEN 'scanners10' THEN 10
  WHEN 'foundations30' THEN 30 WHEN 'charts45' THEN 45 WHEN 'risk60' THEN 60
  WHEN 'practicum90' THEN 90 WHEN 'tape10' THEN 10 WHEN 'indicators10' THEN 10
  WHEN 'filings7' THEN 7 ELSE NULL END;
 IF p_user IS NULL OR v_max IS NULL OR p_day IS NULL OR p_day NOT BETWEEN 1 AND v_max
    OR p_expected_revision IS NULL OR p_expected_revision<0
    OR p_snapshot IS NULL OR jsonb_typeof(p_snapshot)<>'object'
    OR p_snapshot->>'version'<>'1' OR p_snapshot->>'mode'<>'guided'
    OR jsonb_typeof(p_snapshot->'stage') IS DISTINCT FROM 'number'
    OR (p_snapshot->>'stage') !~ '^[0-8]$'
    OR octet_length(p_snapshot::text)>48000
 THEN RAISE EXCEPTION 'Invalid ungraded Academy learning checkpoint';
 END IF;
 -- For the nine Academy routes, require original ACTIVE enrollment.
 -- Foundations30 retains its original authorized /api/bootcamp service:
 -- authentication, membership and release checks are enforced by the Worker.
 IF p_program<>'foundations30' AND NOT EXISTS(
  SELECT 1 FROM public.gu_bootcamp_academy_enrollments_v014168
  WHERE user_id=p_user AND program_code=p_program
    AND program_version='0.14.0.168' AND status='active'
 ) THEN RAISE EXCEPTION 'Active Academy enrollment required'; END IF;
 -- Serialize the absent-row race and all existing-row CAS writes.
 PERFORM pg_advisory_xact_lock(hashtextextended(
  p_user::text||':'||p_program||':'||p_day::text,0));
 SELECT revision INTO v_current
 FROM public.gu_academy_stage_checkpoint_v1
 WHERE user_id=p_user AND program_code=p_program AND day_number=p_day FOR UPDATE;
 IF coalesce(v_current,0)<>p_expected_revision THEN
  RETURN jsonb_build_object('ok',false,'conflict',true);
 END IF;
 INSERT INTO public.gu_academy_stage_checkpoint_v1(
  user_id,program_code,day_number,snapshot,revision
 ) VALUES(p_user,p_program,p_day,p_snapshot,coalesce(v_current,0)+1)
 ON CONFLICT(user_id,program_code,day_number) DO UPDATE SET
  snapshot=excluded.snapshot,revision=excluded.revision,updated_at=now()
 RETURNING revision INTO v_revision;
 RETURN jsonb_build_object('ok',true,'program',p_program,'day',p_day,
  'revision',v_revision,'graded',false,'competencyMasteryAwarded',false);
END $fn$;
REVOKE ALL ON FUNCTION public.gu_academy_stage_checkpoint_save_v1(uuid,text,integer,jsonb,bigint)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_academy_stage_checkpoint_save_v1(uuid,text,integer,jsonb,bigint)
 TO service_role;
COMMENT ON TABLE public.gu_academy_stage_checkpoint_v1 IS
 'Member-isolated ungraded Academy stage drafts; distinct from official Labs and day reflections.';
NOTIFY pgrst,'reload schema';
COMMIT;
