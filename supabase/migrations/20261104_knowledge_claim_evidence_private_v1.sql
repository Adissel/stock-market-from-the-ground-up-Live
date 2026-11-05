-- Knowledge Database V1 source-to-claim validation ledger; never disclose to unauthenticated clients.
-- Reviewed claims require independent authorized reviewer and version-match; seeding claims remains candidate.
CREATE TABLE IF NOT EXISTS public.gu_knowledge_claim_evidence_v1(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.gu_knowledge_articles_v1(id) ON DELETE RESTRICT,
  article_version integer NOT NULL CHECK(article_version>=1),
  claim_key text NOT NULL CHECK(length(claim_key) BETWEEN 3 AND 90),
  claim_text text NOT NULL CHECK(length(claim_text) BETWEEN 25 AND 1500),
  claim_type text NOT NULL CHECK(claim_type IN ('numeric','regulatory','methodology','derivatives','microstructure','rights','risk','definition')),
  source_url text NOT NULL CHECK(source_url ~ '^https://[^[:space:]]{3,200}$'),
  source_title text NOT NULL DEFAULT '',
  source_section text NOT NULL DEFAULT '',
  source_accessed_on date,
  source_coverage text NOT NULL DEFAULT 'candidate' CHECK(source_coverage IN ('candidate','page_checked','claim_supported','claim_contradicted')),
  rights_status text NOT NULL DEFAULT 'not_cleared' CHECK(rights_status IN ('not_cleared','reference_only','independent_license_verified','restricted')),
  verification_state text NOT NULL DEFAULT 'candidate' CHECK(verification_state IN ('candidate','in_review','supported','contradicted')),
  proposed_competency text,
  competency_link_status text NOT NULL DEFAULT 'provisional_not_approved',
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes text NOT NULL DEFAULT '',
  reviewed_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  revision integer NOT NULL DEFAULT 1 CHECK(revision>0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(article_id,claim_key),
  CONSTRAINT gu_knowledge_claim_review_guard_v1 CHECK (
    verification_state NOT IN ('supported','contradicted')
    OR (reviewer_id IS NOT NULL AND reviewed_at IS NOT NULL AND
        source_accessed_on IS NOT NULL AND length(source_section)>=12 AND
        length(review_notes)>=80 AND source_coverage IN ('claim_supported','claim_contradicted'))
  )
);
CREATE INDEX IF NOT EXISTS gu_knowledge_claim_evidence_article_v1_idx
ON public.gu_knowledge_claim_evidence_v1(article_id,article_version);
CREATE INDEX IF NOT EXISTS gu_knowledge_claim_evidence_state_v1_idx
ON public.gu_knowledge_claim_evidence_v1(verification_state,rights_status);
CREATE TABLE IF NOT EXISTS public.gu_knowledge_claim_evidence_events_v1(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.gu_knowledge_claim_evidence_v1(id) ON DELETE RESTRICT,
  claim_revision integer NOT NULL,
  action text NOT NULL,
  snapshot jsonb NOT NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gu_knowledge_claim_evidence_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gu_knowledge_claim_evidence_events_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_knowledge_claim_evidence_v1 FROM PUBLIC,anon,authenticated;
REVOKE ALL ON public.gu_knowledge_claim_evidence_events_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.gu_knowledge_claim_evidence_v1 TO service_role;
GRANT SELECT,INSERT ON public.gu_knowledge_claim_evidence_events_v1 TO service_role;
-- Enforce review recency without mutating or deleting historical evidence.
CREATE OR REPLACE VIEW public.gu_knowledge_claim_evidence_freshness_v1
WITH (security_invoker=true) AS
SELECT c.id,c.article_id,a.slug,c.claim_key,c.article_version,a.version AS live_article_version,
 c.article_version=a.version AS current_article_version,c.verification_state,c.source_url,
 c.source_coverage,c.rights_status,c.reviewed_at,c.reviewer_id
FROM public.gu_knowledge_claim_evidence_v1 c
JOIN public.gu_knowledge_articles_v1 a ON a.id=c.article_id;
REVOKE ALL ON public.gu_knowledge_claim_evidence_freshness_v1 FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.gu_knowledge_claim_evidence_freshness_v1 TO service_role;
COMMENT ON TABLE public.gu_knowledge_claim_evidence_v1 IS
 'Private claim/source/reference/rights review evidence, not an automatic certification of owner-published educational articles.';
