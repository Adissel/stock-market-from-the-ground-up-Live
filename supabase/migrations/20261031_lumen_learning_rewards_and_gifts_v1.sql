-- Crownlight Lumens V1: single existing wallet, protected pending rewards and gifts.
-- No existing credit buckets are modified. Activation is FALSE.
BEGIN;
CREATE TABLE IF NOT EXISTS public.gu_lumen_learning_rewards_v1 (
 scope_type text NOT NULL CHECK(scope_type IN ('lab','bootcamp')),
 scope_id text NOT NULL CHECK(scope_id ~ '^[A-Za-z0-9_-]{2,100}$'),
 approved_revision text NOT NULL CHECK(length(approved_revision) BETWEEN 2 AND 100),
 amount integer NOT NULL CHECK(amount BETWEEN 1 AND 10000),
 published boolean NOT NULL DEFAULT false,
 reviewed_by uuid REFERENCES auth.users(id),
 reviewed_at timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(scope_type,scope_id,approved_revision),
 CHECK (NOT published OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS public.gu_lumen_learning_awards_v1 (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 scope_type text NOT NULL CHECK(scope_type IN ('lab','bootcamp')),
 scope_id text NOT NULL,
 approved_revision text NOT NULL,
 amount integer NOT NULL CHECK(amount BETWEEN 1 AND 10000),
 evidence_key text NOT NULL CHECK(length(evidence_key) BETWEEN 12 AND 200),
 credit_bucket_id uuid UNIQUE REFERENCES public.groundup_question_pass_buckets(id),
 granted_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,scope_type,scope_id,approved_revision),
 FOREIGN KEY(scope_type,scope_id,approved_revision)
 REFERENCES public.gu_lumen_learning_rewards_v1(scope_type,scope_id,approved_revision)
);
CREATE TABLE IF NOT EXISTS public.gu_lumen_peer_gift_optin_v1 (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 discoverable boolean NOT NULL DEFAULT false,
 receiving_enabled boolean NOT NULL DEFAULT false,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.gu_lumen_peer_gift_transfers_v1 (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 sender_id uuid NOT NULL REFERENCES auth.users(id),
 recipient_id uuid NOT NULL REFERENCES auth.users(id),
 amount integer NOT NULL CHECK(amount BETWEEN 10 AND 200),
 request_id uuid NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','denied','reversed')),
 sender_debit_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
 recipient_credit_bucket uuid UNIQUE REFERENCES public.groundup_question_pass_buckets(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz,
 UNIQUE(sender_id,request_id),
 CHECK(sender_id<>recipient_id),
 CHECK((status='completed')=(completed_at IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS public.gu_lumen_completion_release_v1 (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 learning_rewards_enabled boolean NOT NULL DEFAULT false,
 member_gifts_enabled boolean NOT NULL DEFAULT false,
 legal_gifting_clearance boolean NOT NULL DEFAULT false,
 security_gifting_clearance boolean NOT NULL DEFAULT false,
 reviewed_at timestamptz,
 reviewed_by uuid REFERENCES auth.users(id)
);
INSERT INTO public.gu_lumen_completion_release_v1(singleton) VALUES(true) ON CONFLICT DO NOTHING;
ALTER TABLE public.gu_lumen_learning_rewards_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gu_lumen_learning_awards_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gu_lumen_peer_gift_optin_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gu_lumen_peer_gift_transfers_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gu_lumen_completion_release_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_learning_rewards_v1,public.gu_lumen_learning_awards_v1,
 public.gu_lumen_peer_gift_optin_v1,public.gu_lumen_peer_gift_transfers_v1,
 public.gu_lumen_completion_release_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_lumen_learning_rewards_v1,
 public.gu_lumen_learning_awards_v1,public.gu_lumen_peer_gift_optin_v1,
 public.gu_lumen_peer_gift_transfers_v1 TO service_role;
GRANT SELECT,UPDATE ON public.gu_lumen_completion_release_v1 TO service_role;
CREATE INDEX IF NOT EXISTS gu_lumen_awards_owner_idx_v1 ON public.gu_lumen_learning_awards_v1(user_id,granted_at DESC);
CREATE INDEX IF NOT EXISTS gu_lumen_gifts_received_idx_v1 ON public.gu_lumen_peer_gift_transfers_v1(recipient_id,created_at DESC);
COMMIT;
