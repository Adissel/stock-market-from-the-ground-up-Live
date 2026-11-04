-- SMFGU-LUMENS-V1-SQL-OAT-20261104 | Version 1.0 | 2026-11-04
-- Project: THE STOCK MARKET: FROM THE GROUND UP / Crownlight Lumens
-- File type: PostgreSQL read-only QA. Existing project only.
-- Purpose: Produce real production evidence WITHOUT publishing rewards,
-- modifying wallets, approving grades, charging cards or releasing gifts.
-- Operator must independently inspect results; this is NOT legal or human academic signoff.
BEGIN READ ONLY;
SELECT
  (SELECT count(*) FROM public.gu_lumen_learning_rewards_v1) AS draft_reward_definitions,
  (SELECT count(*) FROM public.gu_lumen_learning_rewards_v1 WHERE scope_type='lab') AS lab_rewards,
  (SELECT count(*) FROM public.gu_lumen_learning_rewards_v1 WHERE scope_type='bootcamp') AS bootcamp_rewards,
  (SELECT count(DISTINCT (scope_type,scope_id)) FROM public.gu_lumen_learning_rewards_v1) AS unique_reward_scopes,
  (SELECT count(*) FROM public.gu_lumen_learning_rewards_v1 WHERE published=true) AS published_rewards,
  (SELECT count(*) FROM public.gu_lumen_assessment_case_release_v1 WHERE status='approved' AND human_reviewed_by IS NOT NULL AND human_reviewed_at IS NOT NULL AND length(trim(review_record))>0) AS reviewed_approved_cases,
  (SELECT count(*) FROM public.gu_lumen_learning_awards_v1) AS issued_learning_awards,
  (SELECT count(*) FROM public.gu_lumen_peer_gift_transfers_v1) AS peer_gifts,
  (SELECT count(*) FROM public.gu_lumen_live_orders_v1) AS live_lumen_orders,
  (SELECT sum(amount) FROM public.gu_lumen_learning_rewards_v1) AS planned_total_lumens;
SELECT learning_rewards_enabled,member_gifts_enabled,legal_gifting_clearance,
  security_gifting_clearance,reviewed_at
FROM public.gu_lumen_completion_release_v1 WHERE singleton=true;
SELECT active_cents,mixed_checkout_enabled,value_activation_state
FROM public.gu_lumen_value_settings_v1 WHERE singleton=true;
SELECT source,count(*) AS buckets,sum(initial_credits) AS issued,sum(remaining_credits) AS remaining,
 count(*) FILTER (WHERE remaining_credits<0 OR remaining_credits>initial_credits) AS invalid_bucket_bounds,
 count(*) FILTER (WHERE source IN ('purchased','manual_purchased') AND expires_at IS NOT NULL) AS purchased_expiration_exceptions
FROM public.groundup_question_pass_buckets GROUP BY source ORDER BY source;
SELECT p.proname,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_run,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS member_can_run,
 has_function_privilege('service_role',p.oid,'EXECUTE') AS service_can_run
FROM pg_proc p JOIN pg_namespace ns ON ns.oid=p.pronamespace
WHERE ns.nspname='public' AND p.proname IN (
 'gu_lumen_learning_issue_v1','gu_lumen_issue_from_protected_assessment_v1',
 'gu_lumen_peer_send_v1','gu_lumen_member_wallet_integrity_v1'
) ORDER BY p.proname;
ROLLBACK;
-- PASS for safe V1 staging requires 429/419/10/429 scoped catalog,
-- zero published or issued awards without independent case approvals, blocked gifts,
-- service-only privileged RPCs and no illegally expired purchased credit buckets.
-- Full release still requires authenticated browser and independently reviewed grades.
