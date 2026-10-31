-- Protected Lumen reward issuer and noncommercial gift settlement.
-- Both are intentionally disabled by gu_lumen_completion_release_v1 until
-- independently accepted, and callable ONLY by service_role.
BEGIN;
CREATE TABLE IF NOT EXISTS public.gu_lumen_verified_learning_v1 (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 scope_type text NOT NULL CHECK(scope_type IN ('lab','bootcamp')),
 scope_id text NOT NULL,
 approved_revision text NOT NULL,
 source_evidence_id text NOT NULL CHECK(length(source_evidence_id) BETWEEN 12 AND 200),
 evidence_sha256 text NOT NULL CHECK(evidence_sha256 ~ '^[0-9a-f]{64}$'),
 verified_by uuid NOT NULL REFERENCES auth.users(id),
 verified_at timestamptz NOT NULL,
 PRIMARY KEY(user_id,scope_type,scope_id,approved_revision)
);
ALTER TABLE public.gu_lumen_verified_learning_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_verified_learning_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_lumen_verified_learning_v1 TO service_role;

CREATE OR REPLACE FUNCTION public.gu_lumen_learning_issue_v1(
 p_user uuid,p_scope_type text,p_scope_id text,p_revision text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $f$
DECLARE v_approved public.gu_lumen_learning_rewards_v1%ROWTYPE;
 v_evidence public.gu_lumen_verified_learning_v1%ROWTYPE;
 v_award uuid;v_bucket uuid;v_enabled boolean;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501';END IF;
 SELECT learning_rewards_enabled INTO v_enabled FROM public.gu_lumen_completion_release_v1 WHERE singleton=true;
 IF v_enabled IS DISTINCT FROM true THEN RAISE EXCEPTION 'LEARNING_REWARDS_DISABLED' USING ERRCODE='42501';END IF;
 SELECT * INTO v_approved FROM public.gu_lumen_learning_rewards_v1 WHERE scope_type=p_scope_type
 AND scope_id=p_scope_id AND approved_revision=p_revision AND published=true
 AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL;
 IF NOT FOUND THEN RAISE EXCEPTION 'UNREVIEWED_AWARD' USING ERRCODE='42501';END IF;
 SELECT * INTO v_evidence FROM public.gu_lumen_verified_learning_v1
 WHERE user_id=p_user AND scope_type=p_scope_type AND scope_id=p_scope_id AND approved_revision=p_revision
 AND verified_by<>p_user AND verified_at IS NOT NULL;
 IF NOT FOUND THEN RAISE EXCEPTION 'INDEPENDENT_COMPLETION_NOT_VERIFIED' USING ERRCODE='42501';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=p_user
 AND p.account_kind='member' AND p.deleted_at IS NULL)
 OR EXISTS(SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=p_user AND f.status IN ('restricted','suspended'))
 THEN RAISE EXCEPTION 'MEMBER_NOT_ELIGIBLE' USING ERRCODE='42501';END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('lumen-learning:'||p_user::text,0));
 SELECT id INTO v_award FROM public.gu_lumen_learning_awards_v1
 WHERE user_id=p_user AND scope_type=p_scope_type AND scope_id=p_scope_id AND approved_revision=p_revision FOR UPDATE;
 IF FOUND THEN RETURN jsonb_build_object('ok',true,'idempotent',true,'awardId',v_award);END IF;
 INSERT INTO public.gu_lumen_learning_awards_v1
 (user_id,scope_type,scope_id,approved_revision,amount,evidence_key)
 VALUES(p_user,p_scope_type,p_scope_id,p_revision,v_approved.amount,v_evidence.source_evidence_id)
 RETURNING id INTO v_award;
 INSERT INTO public.groundup_question_pass_buckets(user_id,source,origin_key,initial_credits,remaining_credits,expires_at)
 VALUES(p_user,'manual','learning-award:v1:'||v_award::text,v_approved.amount,v_approved.amount,null)
 RETURNING id INTO v_bucket;
 UPDATE public.gu_lumen_learning_awards_v1 SET credit_bucket_id=v_bucket WHERE id=v_award;
 RETURN jsonb_build_object('ok',true,'idempotent',false,'awardId',v_award,'lumens',v_approved.amount);
END $f$;
REVOKE ALL ON FUNCTION public.gu_lumen_learning_issue_v1(uuid,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_learning_issue_v1(uuid,text,text,text) TO service_role;

CREATE OR REPLACE FUNCTION public.gu_lumen_peer_send_v1(
 p_sender uuid,p_handle text,p_amount integer,p_request uuid
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $f$
DECLARE v_recipient uuid; v_existing public.gu_lumen_peer_gift_transfers_v1%ROWTYPE;
 v_id uuid;v_credit uuid;v_left integer;v_take integer;v_total integer;
 v_events jsonb:='[]'::jsonb;v_bucket record;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gu_lumen_completion_release_v1 WHERE singleton=true
 AND member_gifts_enabled=true AND legal_gifting_clearance=true AND security_gifting_clearance=true)
 THEN RAISE EXCEPTION 'GIFTING_NOT_RELEASED' USING ERRCODE='42501';END IF;
 IF p_sender IS NULL OR p_request IS NULL OR p_amount IS NULL OR p_amount NOT BETWEEN 10 AND 200
 OR p_handle IS NULL OR p_handle !~ '^@[A-Za-z][A-Za-z0-9_]{2,23}$'
 THEN RAISE EXCEPTION 'INVALID_GIFT_REQUEST' USING ERRCODE='22023';END IF;
 SELECT p.id INTO v_recipient FROM public.profiles p JOIN public.gu_lumen_peer_gift_optin_v1 o ON o.user_id=p.id
 WHERE lower(p.username)=lower(substring(p_handle from 2)) AND p.account_kind='member' AND p.deleted_at IS NULL
 AND o.discoverable=true AND o.receiving_enabled=true;
 IF v_recipient IS NULL OR v_recipient=p_sender THEN RAISE EXCEPTION 'RECIPIENT_UNAVAILABLE' USING ERRCODE='42501';END IF;
 IF EXISTS(SELECT 1 FROM public.admin_user_flags f WHERE f.user_id IN (p_sender,v_recipient)
 AND f.status IN ('restricted','suspended'))
 OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=p_sender AND account_kind='member' AND deleted_at IS NULL)
 THEN RAISE EXCEPTION 'ACCOUNT_RESTRICTED' USING ERRCODE='42501';END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('lumen-gifts:'||p_sender::text,0));
 SELECT * INTO v_existing FROM public.gu_lumen_peer_gift_transfers_v1
 WHERE sender_id=p_sender AND request_id=p_request FOR UPDATE;
 IF FOUND THEN
 IF v_existing.recipient_id<>v_recipient OR v_existing.amount<>p_amount THEN
 RAISE EXCEPTION 'IDEMPOTENCY_REQUEST_MISMATCH' USING ERRCODE='23505';END IF;
 RETURN jsonb_build_object('ok',v_existing.status='completed','idempotent',true,'status',v_existing.status);
 END IF;
 IF (SELECT count(*) FROM public.gu_lumen_peer_gift_transfers_v1 WHERE sender_id=p_sender
 AND status='completed' AND created_at>=now()-interval '24 hours')>=3
 THEN RAISE EXCEPTION 'DAILY_GIFT_LIMIT' USING ERRCODE='42501';END IF;
 IF (SELECT count(*) FROM public.gu_lumen_peer_gift_transfers_v1 WHERE sender_id=p_sender
 AND status='completed' AND created_at>=now()-interval '30 days')>=20
 THEN RAISE EXCEPTION 'MONTHLY_GIFT_LIMIT' USING ERRCODE='42501';END IF;
 -- Until licensed legal review, only earned, previously granted Lumens are eligible.
 -- Purchased/manual/noncommerical promotional and previously gifted credits cannot circulate.
 SELECT coalesce(sum(remaining_credits),0)::integer INTO v_total
 FROM public.groundup_question_pass_buckets
 WHERE user_id=p_sender AND source='manual'
 AND origin_key LIKE 'learning-award:v1:%' AND expires_at IS NULL AND remaining_credits>0;
 IF v_total<p_amount THEN RAISE EXCEPTION 'INSUFFICIENT_TRANSFERABLE_REWARDS' USING ERRCODE='42501';END IF;
 INSERT INTO public.gu_lumen_peer_gift_transfers_v1(sender_id,recipient_id,amount,request_id,status)
 VALUES(p_sender,v_recipient,p_amount,p_request,'pending') RETURNING id INTO v_id;
 v_left:=p_amount;
 FOR v_bucket IN SELECT id,remaining_credits FROM public.groundup_question_pass_buckets
 WHERE user_id=p_sender AND source='manual' AND origin_key LIKE 'learning-award:v1:%'
 AND expires_at IS NULL AND remaining_credits>0 ORDER BY issued_at,id FOR UPDATE LOOP
 EXIT WHEN v_left=0;
 v_take:=least(v_left,v_bucket.remaining_credits);
 UPDATE public.groundup_question_pass_buckets SET remaining_credits=remaining_credits-v_take WHERE id=v_bucket.id;
 v_events:=v_events||jsonb_build_array(jsonb_build_object('bucketId',v_bucket.id,'debit',v_take));
 v_left:=v_left-v_take;
 END LOOP;
 IF v_left<>0 THEN RAISE EXCEPTION 'CONCURRENT_BALANCE_CHANGED' USING ERRCODE='40001';END IF;
 INSERT INTO public.groundup_question_pass_buckets(user_id,source,origin_key,initial_credits,remaining_credits,expires_at)
 VALUES(v_recipient,'manual','peer-gift:v1:'||v_id::text,p_amount,p_amount,null) RETURNING id INTO v_credit;
 UPDATE public.gu_lumen_peer_gift_transfers_v1 SET status='completed',completed_at=now(),
 sender_debit_evidence=v_events,recipient_credit_bucket=v_credit WHERE id=v_id;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(p_sender,'lumen.noncommercial_member_gift','user',v_recipient::text,
 jsonb_build_object('giftId',v_id,'amount',p_amount,'noncash',true,'wallet','single_existing_lumen_wallet'));
 RETURN jsonb_build_object('ok',true,'idempotent',false,'giftId',v_id,'lumens',p_amount);
END $f$;
REVOKE ALL ON FUNCTION public.gu_lumen_peer_send_v1(uuid,text,integer,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_peer_send_v1(uuid,text,integer,uuid) TO service_role;
COMMIT;
