-- v1.0: correct an ambiguous 'id' lookup in the protected v135 grader.
-- The function DECLAREs a local variable named id, so 'WHERE id=p_user'
-- raises SQLSTATE 42702 before the draft/publication check.
-- Surgical forward-only replacement; preserves original scoring, grants,
-- SECURITY DEFINER, function owner, and explicit service-role-only EXECUTE.
-- Does not publish cases, create grades or awards, or enable release gates.
BEGIN;
DO $repair$
DECLARE v_source text;
        v_needle constant text := 'where id=p_user';
BEGIN
  SELECT pg_get_functiondef(p.oid) INTO v_source
    FROM pg_proc p
    WHERE p.oid='public.submit_competency_case_v135(uuid,text,jsonb)'::regprocedure;
  IF v_source IS NULL OR
     length(v_source)-length(replace(v_source,v_needle,'')) <> length(v_needle) THEN
    RAISE EXCEPTION 'v135 grader source changed: expected exactly one ambiguous profile id predicate';
  END IF;
  IF strpos(v_source, 'from public.profiles where id=p_user') = 0 THEN
    RAISE EXCEPTION 'v135 grader profile query contract changed';
  END IF;
  EXECUTE replace(v_source,'from public.profiles where id=p_user',
                   'from public.profiles AS member_profile where member_profile.id=p_user');
END;
$repair$;
COMMIT;
