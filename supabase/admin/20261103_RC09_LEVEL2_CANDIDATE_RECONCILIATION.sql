-- Project: THE STOCK MARKET: FROM THE GROUND UP
-- Document ID: SMFGU-RC09-LEVEL2-CANDIDATE-001 | v1.0 | 2026-11-03 UTC
-- Type: reversible one-row candidate suggestion correction, not private grading acceptance.
-- GitHub: supabase/admin/20261103_RC09_LEVEL2_CANDIDATE_RECONCILIATION.sql; Drive: not created; dependency: v0.14.0.105 mapping and 30 canonical skills.
-- Purpose: give the existing Read Level II display lesson its most direct PRIMARY skill,
-- preserving the other 418 candidate mappings and ALL locked rubric/reviewer/mastery gates.
-- New file: Yes. Preflight requires the exact previous suggestion and no existing attempts/evidence.
BEGIN;
DO $rc09$
DECLARE changed integer;
BEGIN
 IF (SELECT count(*) FROM public.platform_labs)<>419
  OR (SELECT count(*) FROM public.gu_lab_competency_knowledge_map_v014105)<>419
  OR (SELECT count(*) FROM public.competency_definitions WHERE active)<>30 THEN
   RAISE EXCEPTION 'RC09 canonical 419/419/30 inventory changed; stop and reconcile before update';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM public.platform_labs
   WHERE lab_id='TAPE-C09-L02' AND book_code='READING_THE_TAPE'
   AND title ILIKE '%Level II%' AND active AND registry_visible) THEN
   RAISE EXCEPTION 'RC09 original Level II Lab title/book/status changed';
 END IF;
 IF EXISTS (SELECT 1 FROM public.lab_training_attempts_v014 WHERE lab_id='TAPE-C09-L02')
    OR EXISTS (SELECT 1 FROM public.competency_evidence WHERE competency_code='LEVEL2_READING') THEN
   RAISE EXCEPTION 'RC09 member or assessment evidence present; require separate reviewed migration';
 END IF;
 IF EXISTS (SELECT 1 FROM public.gu_lab_competency_knowledge_map_v014105
   WHERE lab_id='TAPE-C09-L02' AND competency_code='LEVEL2_READING'
   AND mapping_method='level2_topic_reconciliation_candidate_ungraded'
   AND review_state='candidate' AND rubric_version=0
   AND reviewed_by IS NULL AND reviewed_at IS NULL) THEN
   RETURN; -- already applied idempotently
 END IF;
 UPDATE public.gu_lab_competency_knowledge_map_v014105
 SET competency_code='LEVEL2_READING',
     mapping_method='level2_topic_reconciliation_candidate_ungraded',
     updated_at=now()
 WHERE lab_id='TAPE-C09-L02'
   AND competency_code='TAPE_READING'
   AND mapping_method='topic_keyword_suggestion_ungraded'
   AND review_state='candidate' AND rubric_version=0
   AND reviewed_by IS NULL AND reviewed_at IS NULL;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'RC09 expected one unreviewed TAPE-C09-L02 candidate, found %',changed; END IF;
 IF (SELECT count(distinct competency_code) FROM public.gu_lab_competency_knowledge_map_v014105)<>30
   OR (SELECT count(*) FROM public.gu_lab_competency_knowledge_map_v014105 WHERE review_state<>'candidate')<>0
   OR (SELECT count(*) FROM public.gu_lab_competency_knowledge_map_v014105)<>419 THEN
   RAISE EXCEPTION 'RC09 coverage or review safeguards failed: rollback transaction';
 END IF;
END $rc09$;
COMMIT;
-- No official grade, mastery, rubric approval, member progress, charge or entitlement change.
