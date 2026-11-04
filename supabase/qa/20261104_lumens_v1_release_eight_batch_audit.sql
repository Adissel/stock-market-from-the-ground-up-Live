-- Lumens V1 eight-batch evidence audit; read only and reversible.
BEGIN TRANSACTION READ ONLY;
SELECT (SELECT count(*) FROM public.gu_lumen_learning_rewards_v1) AS staged_reward_definitions,
 (SELECT count(*) FROM public.gu_lumen_assessment_case_release_v1 WHERE status='approved' AND human_reviewed_by IS NOT NULL AND human_reviewed_at IS NOT NULL) AS independent_mappings,
 (SELECT count(*) FROM public.gu_lumen_learning_awards_v1) AS issued_awards,
 (SELECT count(*) FROM public.gu_lumen_peer_gift_transfers_v1) AS gifts,
 (SELECT count(*) FROM public.gu_lumen_live_orders_v1) AS live_orders;
SELECT learning_rewards_enabled,member_gifts_enabled,legal_gifting_clearance,security_gifting_clearance
 FROM public.gu_lumen_completion_release_v1 WHERE singleton=true;
SELECT active_cents,mixed_checkout_enabled,value_activation_state FROM public.gu_lumen_value_settings_v1 WHERE singleton=true;
SELECT plan_code,price_cents,term_days,sparks_expiry_after_term_days FROM public.gu_founder_plans_v014173 ORDER BY term_days;
SELECT (SELECT count(*) FROM public.gu_founder_paid_cycles_v014173 WHERE reversed_at IS NULL) AS paid_cycles,
 (SELECT count(*) FROM public.gu_founder_members_v014173 WHERE revoked_at IS NULL) AS members;
SELECT source,count(*) AS buckets,sum(remaining_credits) AS available,count(*) FILTER(WHERE remaining_credits<0 OR remaining_credits>initial_credits) AS invalid_bounds
 FROM public.groundup_question_pass_buckets GROUP BY source;
ROLLBACK;
-- Passing static evidence is not academic, paid, accessible, or production approval.
