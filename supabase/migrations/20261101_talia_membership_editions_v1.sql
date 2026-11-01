-- SMFGU-TALIA-EDITION-001. Owner-only, auditable per-membership Tutor editions; no checkout.
BEGIN;
CREATE OR REPLACE FUNCTION public.gu_owner_assign_talia_edition_v1(
 p_actor uuid,p_code text,p_tier text,p_expected_revision integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_temp AS $$
DECLARE prior jsonb; changed jsonb; current_revision integer;
BEGIN
 IF p_actor IS NULL OR NOT EXISTS(
   SELECT 1 FROM public.profiles p WHERE p.id=p_actor AND p.account_kind='member' AND p.deleted_at IS NULL
 ) OR NOT EXISTS(
   SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=p_actor AND r.role_code='OWNER' AND
     (r.expires_at IS NULL OR r.expires_at>now())
 ) OR EXISTS(
   SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=p_actor AND r.role_code='SHOWCASE_VIEWER' AND
     (r.expires_at IS NULL OR r.expires_at>now())
 ) OR EXISTS(
   SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=p_actor AND lower(f.status) IN ('suspended','restricted')
 ) THEN RAISE EXCEPTION 'Active Owner authority required' USING ERRCODE='42501'; END IF;
 IF p_tier NOT IN ('FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE','PRODUCT_DEPENDENT')
    OR (p_tier='PRODUCT_DEPENDENT' AND p_code<>'ONDEMAND_MONTHLY')
    OR p_expected_revision IS NULL OR p_expected_revision<0
 THEN RAISE EXCEPTION 'Invalid Talia edition selection' USING ERRCODE='22023'; END IF;
 SELECT metadata->'talia_market_tutor_v1' INTO prior FROM public.platform_plans
  WHERE plan_code=p_code FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown membership plan' USING ERRCODE='22023'; END IF;
 current_revision:=coalesce((prior->>'revision')::integer,0);
 IF current_revision<>p_expected_revision THEN
   RAISE EXCEPTION 'Tutor edition changed; reload to avoid overriding newer settings' USING ERRCODE='40001'; END IF;
 changed:=jsonb_build_object('tier',p_tier,'revision',current_revision+1,
  'updated_at',now(),'updated_by',p_actor,'release_state','assigned_not_feature_release');
 UPDATE public.platform_plans SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),
  '{talia_market_tutor_v1}',changed,true),updated_at=now() WHERE plan_code=p_code;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(p_actor,'talia_market_tutor.edition_assigned','membership',p_code,
  jsonb_build_object('previous',coalesce(prior,'null'::jsonb),'current',changed,
   'not_entitlement_grant',true,'no_payment_change',true));
 RETURN changed;
END;$$;
REVOKE ALL ON FUNCTION public.gu_owner_assign_talia_edition_v1(uuid,text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_owner_assign_talia_edition_v1(uuid,text,text,integer) TO service_role;
-- Approved 2026-11-01 membership assignments, preserving all existing settings.
UPDATE public.platform_plans p SET
 metadata=jsonb_set(coalesce(p.metadata,'{}'::jsonb),'{talia_market_tutor_v1}',
  jsonb_build_object('tier',m.edition,'revision',1,
  'source','owner_policy_20261101','release_state','assigned_not_feature_release'),true),
 updated_at=now()
FROM (VALUES
 ('FREE','FOUNDATION'),('PICK_WHAT_YOU_WANT','FOUNDATION'),
 ('FOUNDING_14','FOUNDATION'),('FOUNDING_30','ADVANCED'),
 ('FOUNDING_60','PROFESSIONAL'),('FULL_MONTHLY','PROFESSIONAL'),
 ('LIFETIME','ENTERPRISE'),('ONDEMAND_MONTHLY','PRODUCT_DEPENDENT')
) AS m(plan,edition)
WHERE p.plan_code=m.plan AND NOT(coalesce(p.metadata,'{}'::jsonb)?'talia_market_tutor_v1');
COMMIT;
