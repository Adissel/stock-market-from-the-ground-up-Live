-- Project: THE STOCK MARKET: FROM THE GROUND UP
-- Document ID: SMFGU-RC09-LEVEL2-CANDIDATE-001-RB | v1.0 | 2026-11-03 UTC
-- Type: controlled rollback; Google Drive: not created.
-- Purpose: restore original unreviewed suggestion ONLY when no graded/knowledge evidence exists.
BEGIN;
DO $rc09rollback$
DECLARE changed integer;
BEGIN
 IF EXISTS (SELECT 1 FROM public.lab_training_attempts_v014 WHERE lab_id='TAPE-C09-L02')
   OR EXISTS (SELECT 1 FROM public.competency_evidence WHERE competency_code='LEVEL2_READING') THEN
   RAISE EXCEPTION 'RC09 rollback stopped: related learning evidence exists';
 END IF;
 IF EXISTS (SELECT 1 FROM public.gu_lab_competency_knowledge_map_v014105
    WHERE lab_id='TAPE-C09-L02' AND competency_code='TAPE_READING'
    AND mapping_method='topic_keyword_suggestion_ungraded' AND review_state='candidate'
    AND rubric_version=0 AND reviewed_by IS NULL AND reviewed_at IS NULL) THEN
   RETURN; -- already restored
 END IF;
 UPDATE public.gu_lab_competency_knowledge_map_v014105
 SET competency_code='TAPE_READING',
     mapping_method='topic_keyword_suggestion_ungraded',
     updated_at=now()
 WHERE lab_id='TAPE-C09-L02' AND competency_code='LEVEL2_READING'
   AND mapping_method='level2_topic_reconciliation_candidate_ungraded'
   AND review_state='candidate' AND rubric_version=0
   AND reviewed_by IS NULL AND reviewed_at IS NULL;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'RC09 rollback requires exact unreviewed row, found %',changed; END IF;
END $rc09rollback$;
COMMIT;
