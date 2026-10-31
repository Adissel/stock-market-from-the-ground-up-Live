-- SMFGU-DB-TALIA-FREE-026 v1.0 | 2026-10-31
-- Free Market Tutor is a source-based guided teaching benefit. No billing,
-- model configuration, other tool, member record, or grading change.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $preflight$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('public.user_has_tool_access(uuid,text)'::regprocedure) INTO STRICT definition;
 IF position('Catalog visibility and checkout are *not* entitlements' IN definition)=0
 OR position('up.current_period_end IS NULL OR up.current_period_end>now()' IN definition)=0
 OR position('Owner-approved Free source-based Tutor' IN definition)>0
 THEN RAISE EXCEPTION 'MARKET_TUTOR_ACCESS_FUNCTION_DRIFT'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.platform_tools t
                WHERE t.tool_code='MARKET_TUTOR' AND t.active AND t.status IN ('live','beta'))
 OR NOT EXISTS (SELECT 1 FROM public.platform_plans p
                WHERE p.plan_code='FREE' AND p.active)
 OR NOT EXISTS (SELECT 1 FROM public.gu_product_access_config_v1 c
                WHERE c.product_code='MARKET_TUTOR' AND c.free_access)
 THEN RAISE EXCEPTION 'MARKET_TUTOR_FREE_POLICY_PRECONDITION_FAILED'; END IF;
END $preflight$;
CREATE OR REPLACE FUNCTION public.user_has_tool_access(target_user uuid, target_tool text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
 IF target_user IS NULL OR target_tool IS NULL OR length(target_tool)>80 THEN RETURN false; END IF;
 IF NOT EXISTS(
  SELECT 1 FROM public.profiles p WHERE p.id=target_user
  AND p.account_kind='member' AND p.deleted_at IS NULL) THEN RETURN false; END IF;
 IF EXISTS(
  SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=target_user
  AND lower(f.status) IN ('suspended','restricted')) THEN RETURN false; END IF;
 IF EXISTS(
  SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=target_user
  AND r.role_code='SHOWCASE_VIEWER'
  AND (r.expires_at IS NULL OR r.expires_at>now())) THEN RETURN false; END IF;

 -- Owner test authority is separate from ordinary paid-plan access. Keep it
 -- limited to known tools, not an arbitrary client-supplied entitlement code.
 IF EXISTS (SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=target_user
   AND r.role_code='OWNER' AND (r.expires_at IS NULL OR r.expires_at>now()))
 THEN RETURN EXISTS(SELECT 1 FROM public.platform_tools t WHERE t.tool_code=target_tool); END IF;

 -- Catalog visibility and checkout are *not* entitlements. Only released
 -- live/beta tools may be used in currently delivered membership features.
 IF NOT EXISTS (SELECT 1 FROM public.platform_tools t WHERE t.tool_code=target_tool
   AND t.active=true AND t.status IN ('live','beta')) THEN RETURN false; END IF;

 -- Owner-approved Free source-based Tutor. Honor the existing exact
 -- product-level free_access flag for this released tool; do not require a
 -- paid/Free plan grant because the Free plan is often implicit.
 -- Verified profile, restricted/deleted/SHOWCASE and released-tool gates above
 -- remain mandatory. This does not authorize model calls or spending.
 IF target_tool='MARKET_TUTOR'
  AND EXISTS (
   SELECT 1 FROM public.gu_product_access_config_v1 c
   WHERE c.product_code='MARKET_TUTOR' AND c.free_access IS TRUE
  )
  AND EXISTS (
   SELECT 1 FROM public.platform_plans p
   WHERE p.plan_code='FREE' AND p.active IS TRUE
  )
 THEN RETURN true; END IF;

 -- Owner/admin-issued plan grants are preserved, including audited no-expiry
 -- QA grants. Inactive plans and future/expired terms never confer access.
 IF EXISTS (
  SELECT 1 FROM public.user_plan_grants g
  JOIN public.platform_plans p ON p.plan_code=g.plan_code
  WHERE g.user_id=target_user AND p.active=true
   AND g.status IN ('active','trialing')
   AND g.starts_at IS NOT NULL AND g.starts_at<=now()
   AND (g.ends_at IS NULL OR g.ends_at>now())
   AND (p.includes_all_tools=true
     OR EXISTS(SELECT 1 FROM public.plan_tool_access m
       WHERE m.plan_code=g.plan_code AND m.tool_code=target_tool))
 ) THEN RETURN true; END IF;

 -- Provider-managed subscriptions must retain an actual paid term;
 -- null/current-period-less active recurring rows cannot grant forever.
 IF EXISTS (
  SELECT 1 FROM public.site_subscriptions s
  JOIN public.platform_plans p ON p.plan_code=s.plan_code
  WHERE s.user_id=target_user AND p.active=true
   AND s.status IN ('active','trialing')
   AND ((p.billing_interval='lifetime' AND s.current_period_end IS NULL)
     OR (s.current_period_end IS NOT NULL AND s.current_period_end>now()))
   AND (p.includes_all_tools=true
     OR EXISTS(SELECT 1 FROM public.plan_tool_access m
       WHERE m.plan_code=s.plan_code AND m.tool_code=target_tool))
 ) THEN RETURN true; END IF;

 -- This legacy full-learning record is an explicit administrative grant,
 -- not a customer invoice. Preserve active grants but enforce effective dates.
 IF EXISTS (
  SELECT 1 FROM public.entitlements e WHERE e.user_id=target_user
  AND e.product_key='full_learning_access' AND e.status IN ('active','trialing')
  AND (e.starts_at IS NULL OR e.starts_at<=now())
  AND (e.ends_at IS NULL OR e.ends_at>now())
 ) THEN RETURN true; END IF;

 IF EXISTS (
  SELECT 1 FROM public.user_tool_passes up
  WHERE up.user_id=target_user AND up.tool_code=target_tool
  AND up.status IN ('active','trialing')
  AND (up.starts_at IS NULL OR up.starts_at<=now())
  AND (up.ends_at IS NULL OR up.ends_at>now())
  AND (up.current_period_end IS NULL OR up.current_period_end>now())
  AND (up.provider IS NULL OR up.ends_at IS NOT NULL OR up.current_period_end IS NOT NULL)
 ) THEN RETURN true; END IF;
 RETURN false;
END;
$function$

COMMIT;
