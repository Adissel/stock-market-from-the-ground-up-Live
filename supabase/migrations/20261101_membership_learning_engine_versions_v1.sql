-- SMFGU-LEARN-ASSIGN-001 · November 1, 2026 · main
-- Nonpayment, nonentitlement engine presentation selection. Existing plans and grades stay authoritative.
-- Review and apply separately after CI. No anonymous/member write grants.
BEGIN;
CREATE OR REPLACE FUNCTION public.gu_owner_assign_learning_engines_v1(
 p_actor uuid,p_code text,p_learning text,p_lab text,p_tutor text,p_expected_revision integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE old_value jsonb; new_value jsonb; current_revision integer;
BEGIN
 IF p_actor IS NULL OR NOT EXISTS(
  SELECT 1 FROM public.profiles p WHERE p.id=p_actor AND p.account_kind='member' AND p.deleted_at IS NULL
 ) OR NOT EXISTS(
  SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=p_actor AND r.role_code='OWNER'
    AND (r.expires_at IS NULL OR r.expires_at>now())
 ) OR EXISTS(
  SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=p_actor AND lower(f.status) IN ('suspended','restricted')
 ) THEN RAISE EXCEPTION 'Active Owner authority required' USING ERRCODE='42501'; END IF;
 IF p_learning NOT IN ('LEARNING_V33_FREEZE_20261101','LEARNING_V33_CURRENT')
 OR p_lab NOT IN ('LAB_V32_FREEZE_20261101','LAB_V32_CURRENT')
 OR p_tutor NOT IN ('TALIA_FREEZE_20261101','TALIA_CURRENT')
 OR p_expected_revision IS NULL OR p_expected_revision<0 THEN
  RAISE EXCEPTION 'Invalid version selection' USING ERRCODE='22023'; END IF;
 SELECT metadata->'learning_engines_v1' INTO old_value
 FROM public.platform_plans WHERE plan_code=p_code FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown membership' USING ERRCODE='22023'; END IF;
 current_revision:=coalesce((old_value->>'revision')::integer,0);
 IF current_revision<>p_expected_revision THEN
  RAISE EXCEPTION 'Version assignment changed; reload before saving' USING ERRCODE='40001'; END IF;
 new_value:=jsonb_build_object('learning',p_learning,'lab',p_lab,'tutor',p_tutor,
   'revision',current_revision+1,'updated_at',now(),'updated_by',p_actor);
 UPDATE public.platform_plans SET
  metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{learning_engines_v1}',new_value,true),
  updated_at=now() WHERE plan_code=p_code;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(p_actor,'learning_engine_versions.updated','membership',p_code,
   jsonb_build_object('previous',coalesce(old_value,'null'::jsonb),'current',new_value));
 RETURN new_value;
END;$$;
REVOKE ALL ON FUNCTION public.gu_owner_assign_learning_engines_v1(uuid,text,text,text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_owner_assign_learning_engines_v1(uuid,text,text,text,text,integer) TO service_role;
-- Explicit owner-designated defaults: Free and Pick What You Want use frozen 2026-11-01 source baseline.
UPDATE public.platform_plans SET
 metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{learning_engines_v1}',
  jsonb_build_object('learning','LEARNING_V33_FREEZE_20261101',
    'lab','LAB_V32_FREEZE_20261101','tutor','TALIA_FREEZE_20261101',
    'revision',1,'source','owner_initial_assignment_20261101'),true),
 updated_at=now()
WHERE plan_code IN ('FREE','PICK_WHAT_YOU_WANT')
 AND NOT (coalesce(metadata,'{}'::jsonb) ? 'learning_engines_v1');
COMMIT;
