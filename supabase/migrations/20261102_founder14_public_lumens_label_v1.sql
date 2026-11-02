-- SMFGU: member-facing currency terminology only (2026-11-02).
-- The owner-approved Crownlight Lumens label replaces legacy "Sparks" in
-- Founding 14-Day plan description. No pricing, discounts, credit balances,
-- entitlements, checkout states, member data or other plans are changed.
-- Idempotent; the corresponding narrowly-scoped live copy correction was
-- independently verified in Supabase on 2026-11-02.
UPDATE public.platform_plans
SET description = replace(description,'Crownlight Sparks','Crownlight Lumens')
WHERE plan_code = 'FOUNDING_14'
  AND public_visible IS TRUE
  AND description LIKE '%Crownlight Sparks%';
