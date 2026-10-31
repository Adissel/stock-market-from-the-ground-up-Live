BEGIN;
CREATE TABLE IF NOT EXISTS public.crownlight_chart_restrictive_qa_v1(
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 ceiling text NOT NULL CHECK(ceiling IN ('STANDARD','ADVANCED','PROFESSIONAL')),
 expires_at timestamptz NOT NULL,
 revoked_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(expires_at<=timestamptz '2026-11-08 00:00:00+00')
);
ALTER TABLE public.crownlight_chart_restrictive_qa_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crownlight_chart_restrictive_qa_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.crownlight_chart_restrictive_qa_v1 TO service_role;
-- No active ceiling is granted by migration: each tier needs an explicit, audited activation.
COMMIT;