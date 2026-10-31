-- Gift dispute/reversal mechanism. Does not activate peer gifting.
-- Reversals are conditional on the recipient gift bucket remaining unspent.
-- A spent bucket is routed to noncash manual review; never create negative balances.
BEGIN;
ALTER TABLE public.gu_lumen_peer_gift_transfers_v1
 ADD COLUMN IF NOT EXISTS reversed_at timestamptz,
 ADD COLUMN IF NOT EXISTS reversed_by uuid REFERENCES auth.users(id),
 ADD COLUMN IF NOT EXISTS reversal_reason text;
CREATE TABLE IF NOT EXISTS public.gu_lumen_peer_gift_disputes_v1(
 transfer_id uuid PRIMARY KEY REFERENCES public.gu_lumen_peer_gift_transfers_v1(id),
 opened_by uuid NOT NULL REFERENCES auth.users(id),
 reason text NOT NULL CHECK(reason IN ('recipient_spent','fraud_review','member_error','other')),
 status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','resolved','rejected')),
 opened_at timestamptz NOT NULL DEFAULT now(),
 resolved_at timestamptz,
 outcome text
);
ALTER TABLE public.gu_lumen_peer_gift_disputes_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_peer_gift_disputes_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_lumen_peer_gift_disputes_v1 TO service_role;

CREATE OR REPLACE FUNCTION public.gu_lumen_peer_reverse_v1(
 p_transfer uuid,p_reviewer uuid,p_reason text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $b$
DECLARE v_tx public.gu_lumen_peer_gift_transfers_v1%ROWTYPE;
 v_bucket public.groundup_question_pass_buckets%ROWTYPE;
 v_entry jsonb;v_restore_id uuid;v_restore_amount integer;v_sum integer:=0;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN
 RAISE EXCEPTION 'SERVICE_ONLY' USING ERRCODE='42501';END IF;
 IF p_transfer IS NULL OR p_reviewer IS NULL OR p_reason NOT IN ('fraud_review','member_error','staff_correction')
 THEN RAISE EXCEPTION 'INVALID_REVIEW_REQUEST' USING ERRCODE='22023';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.admin_user_roles
 WHERE user_id=p_reviewer AND role_code IN ('OWNER','ADMIN')
 AND (expires_at IS NULL OR expires_at>now()))
 THEN RAISE EXCEPTION 'AUTHORIZED_REVIEWER_REQUIRED' USING ERRCODE='42501';END IF;
 SELECT * INTO v_tx FROM public.gu_lumen_peer_gift_transfers_v1 WHERE id=p_transfer FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'TRANSFER_NOT_FOUND' USING ERRCODE='22023';END IF;
 IF p_reviewer IN (v_tx.sender_id,v_tx.recipient_id) THEN
 RAISE EXCEPTION 'CONFLICTED_REVIEWER' USING ERRCODE='42501';END IF;
 IF v_tx.status='reversed' THEN
 RETURN jsonb_build_object('ok',true,'idempotent',true,'status','reversed');END IF;
 IF v_tx.status<>'completed' OR v_tx.recipient_credit_bucket IS NULL
 THEN RAISE EXCEPTION 'TRANSFER_NOT_SETTLED' USING ERRCODE='42501'; END IF;
 -- Same sender-level lock as live send, and row-lock the recipient's specific
 -- non-expiring gift credit to serialize redemptions.
 PERFORM pg_advisory_xact_lock(hashtextextended('lumen-gifts:'||v_tx.sender_id::text,0));
 SELECT * INTO v_bucket FROM public.groundup_question_pass_buckets
 WHERE id=v_tx.recipient_credit_bucket AND user_id=v_tx.recipient_id
 AND origin_key='peer-gift:v1:'||v_tx.id::text FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'GIFT_CREDIT_NOT_FOUND' USING ERRCODE='42501';END IF;
 IF v_bucket.remaining_credits<>v_tx.amount THEN
 INSERT INTO public.gu_lumen_peer_gift_disputes_v1(transfer_id,opened_by,reason)
 VALUES(v_tx.id,p_reviewer,'recipient_spent')
 ON CONFLICT (transfer_id) DO NOTHING;
 RETURN jsonb_build_object('ok',false,'status','manual_review_required',
  'reason','recipient_credit_not_fully_available','transferId',v_tx.id);
 END IF;
 IF jsonb_typeof(v_tx.sender_debit_evidence)<>'array' THEN
 RAISE EXCEPTION 'DEBIT_PROVENANCE_MISSING' USING ERRCODE='42501';END IF;
 -- Prevent duplicate reversal even under repeated service requests.
 UPDATE public.groundup_question_pass_buckets SET remaining_credits=0
 WHERE id=v_bucket.id AND remaining_credits=v_tx.amount;
 FOR v_entry IN SELECT value FROM jsonb_array_elements(v_tx.sender_debit_evidence) LOOP
  BEGIN v_restore_id:=(v_entry->>'bucketId')::uuid;
   v_restore_amount:=(v_entry->>'debit')::integer;
  EXCEPTION WHEN OTHERS THEN RAISE EXCEPTION 'BAD_ORIGINAL_DEBIT' USING ERRCODE='42501';END;
  IF v_restore_id IS NULL OR v_restore_amount<=0 OR v_restore_amount>v_tx.amount
  THEN RAISE EXCEPTION 'BAD_DEBIT_AMOUNT' USING ERRCODE='42501';END IF;
  UPDATE public.groundup_question_pass_buckets SET remaining_credits=remaining_credits+v_restore_amount
  WHERE id=v_restore_id AND user_id=v_tx.sender_id
   AND origin_key LIKE 'learning-award:v1:%'
   AND remaining_credits+v_restore_amount<=initial_credits;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORIGINAL_EARNED_CREDIT_MISSING' USING ERRCODE='42501';END IF;
  v_sum:=v_sum+v_restore_amount;
 END LOOP;
 IF v_sum<>v_tx.amount THEN RAISE EXCEPTION 'DEBIT_RECONCILIATION_FAILED' USING ERRCODE='42501';END IF;
 UPDATE public.gu_lumen_peer_gift_transfers_v1
 SET status='reversed',completed_at=null,reversed_at=now(),reversed_by=p_reviewer,reversal_reason=p_reason
 WHERE id=v_tx.id;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(p_reviewer,'lumen.peer_gift_reverse','user',v_tx.sender_id::text,
 jsonb_build_object('transferId',v_tx.id,'amount',v_tx.amount,'reason',p_reason,
 'recipient',v_tx.recipient_id,'sameWallet',true));
 RETURN jsonb_build_object('ok',true,'idempotent',false,'status','reversed','lumens',v_tx.amount);
END $b$;
REVOKE ALL ON FUNCTION public.gu_lumen_peer_reverse_v1(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_peer_reverse_v1(uuid,uuid,text) TO service_role;
COMMIT;