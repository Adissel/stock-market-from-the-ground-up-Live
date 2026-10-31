-- Single-wallet Lumen integrity snapshot. Read-only, server-side, service_role only.
-- Do not derive balances from truncated member-facing activity history.
BEGIN;
CREATE OR REPLACE FUNCTION public.gu_lumen_member_wallet_integrity_v1(p_user uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $b$
DECLARE v_summary jsonb;v_reconciliation jsonb;v_reward_bad integer;v_gift_bad integer;
 v_count_rewards integer;v_count_gifts integer;v_disputes integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN
 RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501';END IF;
 IF p_user IS NULL OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=p_user AND account_kind='member' AND deleted_at IS NULL)
 THEN RAISE EXCEPTION 'INELIGIBLE_MEMBER' USING ERRCODE='42501';END IF;
 SELECT public.groundup_question_pass_summary(p_user) INTO v_summary;
 SELECT jsonb_build_object(
 'included',coalesce(sum(remaining_credits) FILTER(WHERE source IN ('included','free_included')),0)::int,
 'purchased',coalesce(sum(remaining_credits) FILTER(WHERE source='purchased'),0)::int,
 'manual',coalesce(sum(remaining_credits) FILTER(WHERE source='manual'),0)::int)
 INTO v_reconciliation
 FROM public.groundup_question_pass_buckets
 WHERE user_id=p_user AND remaining_credits>0 AND (expires_at IS NULL OR expires_at>now());
 SELECT count(*) INTO v_reward_bad FROM public.gu_lumen_learning_awards_v1 a
 LEFT JOIN public.groundup_question_pass_buckets b ON b.id=a.credit_bucket_id
 WHERE a.user_id=p_user AND (a.credit_bucket_id IS NULL OR b.id IS NULL
 OR b.user_id<>p_user OR b.initial_credits<>a.amount
 OR b.origin_key IS DISTINCT FROM 'learning-award:v1:'||a.id::text);
 SELECT count(*) INTO v_gift_bad FROM public.gu_lumen_peer_gift_transfers_v1 g
 LEFT JOIN public.groundup_question_pass_buckets b ON b.id=g.recipient_credit_bucket
 WHERE (g.sender_id=p_user OR g.recipient_id=p_user) AND g.status IN ('completed','reversed')
 AND (g.recipient_credit_bucket IS NULL OR b.id IS NULL OR b.user_id<>g.recipient_id
 OR b.initial_credits<>g.amount OR b.origin_key IS DISTINCT FROM 'peer-gift:v1:'||g.id::text
 OR (g.status='reversed' AND b.remaining_credits<>0));
 SELECT count(*) INTO v_count_rewards FROM public.gu_lumen_learning_awards_v1 WHERE user_id=p_user;
 SELECT count(*) INTO v_count_gifts FROM public.gu_lumen_peer_gift_transfers_v1
 WHERE sender_id=p_user OR recipient_id=p_user;
 SELECT count(*) INTO v_disputes FROM public.gu_lumen_peer_gift_disputes_v1 d
 JOIN public.gu_lumen_peer_gift_transfers_v1 g ON g.id=d.transfer_id
 WHERE (g.sender_id=p_user OR g.recipient_id=p_user) AND d.status='open';
 RETURN jsonb_build_object('ok',true,'currency','Crownlight Lumens',
 'wallet',v_summary,'bucketBreakdown',v_reconciliation,
 'balanced',v_summary->>'included'=v_reconciliation->>'included'
 AND v_summary->>'purchased'=v_reconciliation->>'purchased'
 AND v_summary->>'manual'=v_reconciliation->>'manual'
 AND v_reward_bad=0 AND v_gift_bad=0,
 'invalidAwardCredits',v_reward_bad,'invalidGiftCredits',v_gift_bad,
 'awardCount',v_count_rewards,'giftCount',v_count_gifts,
 'openDisputes',v_disputes,'statementScope','current_balance_not_truncated_history');
END $b$;
REVOKE ALL ON FUNCTION public.gu_lumen_member_wallet_integrity_v1(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_member_wallet_integrity_v1(uuid) TO service_role;
COMMIT;