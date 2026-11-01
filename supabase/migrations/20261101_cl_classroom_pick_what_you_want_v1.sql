-- SMFGU-PROTOTYPE-PICK-REGISTRY-001 | November 1, 2026
-- Noncommercial prototype draft registry only. Preserve existing records.
-- Apply after 20261101_cl_classroom_design_registry_v1.sql, after SQL preflight.
-- Do not rerun the prior classroom registry migration to add this plan.
-- No membership grant, catalog sale, live charge, grade, wallet, or published design.
BEGIN;
INSERT INTO public.cl_classroom_membership_codes
  (plan_code,display_name,default_preset_code,active)
VALUES ('PICK_WHAT_YOU_WANT','Pick What You Want','foundation-focus',true)
ON CONFLICT (plan_code) DO NOTHING;

INSERT INTO public.cl_classroom_layouts
  (plan_code,channel,version,preset_code,config)
SELECT m.plan_code,'draft',1,p.preset_code,p.config
FROM public.cl_classroom_membership_codes AS m
JOIN public.cl_classroom_presets AS p
  ON p.preset_code=m.default_preset_code
WHERE m.plan_code='PICK_WHAT_YOU_WANT'
  AND m.active=true
ON CONFLICT (plan_code,channel) DO NOTHING;
COMMIT;

-- POSTFLIGHT: SELECT plan_code,display_name,default_preset_code FROM
-- public.cl_classroom_membership_codes WHERE plan_code='PICK_WHAT_YOU_WANT';
-- SELECT plan_code,channel,version,preset_code FROM public.cl_classroom_layouts
-- WHERE plan_code='PICK_WHAT_YOU_WANT';
-- Expected: one membership identity and one draft (never published).
