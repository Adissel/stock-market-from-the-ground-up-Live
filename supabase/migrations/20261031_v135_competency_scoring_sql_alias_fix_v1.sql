-- V1: eliminate SQLSTATE 42702 from v135 immutable competency grading.
-- The procedure declares a PL/pgSQL variable named q and separately aliases
-- jsonb_array_elements(c.questions) as q in scored-dimension SQL expressions.
-- Rename ONLY those SQL aliases after the first foreach dimension loop.
-- Preserve original protected rubric, parameters, rights, review gates and score.
-- No published cases, releases, grades, entitlements, credits or LIVE flags.
BEGIN;
DO $repair$
DECLARE
  v_source text;
  v_prefix text;
  v_suffix text;
  v_marker constant text := ' foreach dim in array array[''knowledge'',''recognition'',''decision'',''process''] loop';
  v_start integer;
BEGIN
  SELECT pg_get_functiondef('public.submit_competency_case_v135(uuid,text,jsonb)'::regprocedure)
    INTO v_source;
  v_start := strpos(v_source,v_marker);
  IF v_start<1
    OR (length(v_source)-length(replace(v_source,v_marker,'')))<>length(v_marker)*2
  THEN RAISE EXCEPTION 'V135_SCORER_BODY_CHANGED: expected two dimension loops';END IF;
  v_prefix := substr(v_source,1,v_start-1);
  v_suffix := substr(v_source,v_start);
  IF (length(v_suffix)-length(replace(v_suffix,'from jsonb_array_elements(c.questions) q','')))
        <>3*length('from jsonb_array_elements(c.questions) q')
  THEN RAISE EXCEPTION 'V135_SCORER_ALIAS_CHANGED: expected three dimension query aliases';END IF;
  v_suffix := regexp_replace(v_suffix,'\mq\M','question_item','g');
  IF strpos(v_suffix,'from jsonb_array_elements(c.questions) q')>0 OR
     strpos(v_suffix,'question_item->>')=0
  THEN RAISE EXCEPTION 'V135_SCORER_REWRITE_INCOMPLETE';END IF;
  EXECUTE v_prefix||v_suffix;
END;
$repair$;
COMMIT;
