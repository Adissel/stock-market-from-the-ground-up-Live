-- Crownlight Lumens V1 | 2026-11-04 | prospective Founder included-credit rollover.
-- No historical award, balance, subscription, webhook, or user data deleted.
-- Required: 0 existing Founder paid cycles and 0 Founder credit buckets.
-- Approved policy: included credits roll over for 60 days AFTER billing term;
-- purchased and manually issued Lumens remain non-expiring.
DO $guard$
BEGIN
 IF EXISTS(SELECT 1 FROM public.gu_founder_paid_cycles_v014173)
 OR EXISTS(SELECT 1 FROM public.groundup_question_pass_buckets WHERE origin_key LIKE 'FOUNDING600:%')
 THEN RAISE EXCEPTION 'FOUNDER_POLICY_MIGRATION_REQUIRES_PRIOR_CYCLE_REVIEW'; END IF;
 IF (SELECT count(*) FROM public.gu_founder_plans_v014173
 WHERE plan_code IN ('FOUNDING_14','FOUNDING_30','FOUNDING_60'))<>3
 THEN RAISE EXCEPTION 'FOUNDER_THREE_PLAN_CATALOG_NOT_COMPLETE'; END IF;
END $guard$;

ALTER TABLE public.groundup_question_pass_buckets
 DROP CONSTRAINT groundup_qp_expiration_policy;
ALTER TABLE public.groundup_question_pass_buckets
 ADD CONSTRAINT groundup_qp_expiration_policy CHECK (
  (source IN ('purchased','manual') AND expires_at IS NULL)
  OR (source='included' AND
      (expires_at IS NULL OR
       (billing_period_ends_at IS NOT NULL AND
        expires_at=billing_period_ends_at+interval '60 days')))
  OR (source='free_included' AND
      (expires_at IS NULL OR expires_at>issued_at))
 );
-- The included NULL branch remains temporarily compatible with independent
-- product grant flows. Founder paid-cycle issuance below always sets +60d.
-- Close every other included-credit issuer before sitewide V1 signoff.

ALTER TABLE public.gu_founder_plans_v014173
 DROP CONSTRAINT gu_founder_plans_v014173_check;
UPDATE public.gu_founder_plans_v014173
 SET sparks_expiry_after_term_days=60
 WHERE plan_code IN ('FOUNDING_14','FOUNDING_30','FOUNDING_60');
ALTER TABLE public.gu_founder_plans_v014173
 ADD CONSTRAINT gu_founder_plans_v014173_check CHECK (
  (plan_code='FOUNDING_14' AND price_cents=2299 AND term_days=14
   AND purchase_discount_bps=500 AND included_sparks=10 AND sparks_expiry_after_term_days=60)
  OR
  (plan_code='FOUNDING_30' AND price_cents=4999 AND term_days=30
   AND purchase_discount_bps=1000 AND included_sparks=15 AND sparks_expiry_after_term_days=60)
  OR
  (plan_code='FOUNDING_60' AND price_cents=5999 AND term_days=60
   AND purchase_discount_bps=1500 AND included_sparks=20 AND sparks_expiry_after_term_days=60)
 );

DO $replace_function$
DECLARE body text;before1 text:=' p_period_end,NULL);';
 before2 text:=$exp$'sparkExpiry',NULL);$exp$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO body
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname='gu_founder_record_paid_cycle_v014196';
 IF body IS NULL OR position(before1 IN body)=0 OR position(before2 IN body)=0
 THEN RAISE EXCEPTION 'FOUNDER_PAID_CYCLE_SOURCE_HAS_CHANGED'; END IF;
 body:=replace(body,before1,
  ' p_period_end,p_period_end+make_interval(days=>p.sparks_expiry_after_term_days));');
 body:=replace(body,before2,
  $exp$'sparkExpiry',p_period_end+make_interval(days=>p.sparks_expiry_after_term_days));$exp$);
 EXECUTE body;
END $replace_function$;
-- A postmigration read-only audit must confirm all three plan expiry fields=60,
-- the signed invoice issuer returns a real expiration, and no bought credits expire.
