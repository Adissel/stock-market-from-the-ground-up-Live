-- SMFGU: align Founding 14-Day with Free/Pick frozen Basic source.
-- No paid charges, price changes, author grades, or access grants.
BEGIN;
UPDATE public.platform_plans
SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{learning_engines_v1}',
 jsonb_build_object('learning','LEARNING_V33_FREEZE_20261101',
  'lab','LAB_V32_FREEZE_20261101',
  'tutor','TALIA_FREEZE_20261101','revision',1,
  'source','owner_policy_founder14_basic_alignment_20261101'),true),
 updated_at=now()
WHERE plan_code='FOUNDING_14'
 AND NOT(coalesce(metadata,'{}'::jsonb)?'learning_engines_v1');
COMMIT;
