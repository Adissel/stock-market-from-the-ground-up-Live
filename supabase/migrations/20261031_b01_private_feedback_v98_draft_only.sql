-- SMFGU-B01-PRIVATE-FEEDBACK-098 | 2026-10-31
-- Non-public, nonactivated V98 correction drafts built from frozen V97.
-- No question key literals, customer information or grades in source control.
-- Every new candidate remains DRAFT, with absent reviewer attribution.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='45s';
DO $guard$
DECLARE source_count integer; target_count integer;
BEGIN
 SELECT count(*) INTO source_count FROM public.lab_training_sets_v014
 WHERE version=97 AND review_state='reviewed'
   AND source_status='original_hypothetical_b01_individual_review_pending_v01497';
 IF source_count<>20 THEN
  RAISE EXCEPTION 'B01 source count/status drift: %',source_count;
 END IF;
 SELECT count(*) INTO target_count FROM public.lab_training_sets_v014
 WHERE version=98;
 IF target_count<>0 THEN
  RAISE EXCEPTION 'B01 V98 must be reviewed before replacing an existing draft';
 END IF;
END $guard$;

WITH source AS (
 SELECT s.lab_id,s.title,s.questions,s.answer_key,
 CASE s.lab_id
 WHEN 'F1-C02-L01' THEN 'Only completed, already-delivered bars at the fixed decision pause are admissible. A label alone is not a feed-finality or future-price record.'
 WHEN 'F1-C02-L02' THEN 'A replay exposed to later bars cannot be made blind retroactively. Preserve the observed cutoff, and restart on a genuinely unseen case.'
 WHEN 'F1-C04-L01' THEN 'An ordinary secondary sale transfers already-issued shares; the trade proceeds are not new issuer financing.'
 WHEN 'F1-C06-L01' THEN 'A completed candle demonstrates relative open, close, high and low, but does not reveal a participant identity, motive or next bar.'
 WHEN 'F1-C07-L01' THEN 'The ownership fraction relates shares held to the stated outstanding class, not a proportion of revenues or an automatic dividend.'
 WHEN 'F1-C07-L02' THEN 'An index is a calculated benchmark in points while an ETF is a separately traded security with its own quote and costs.'
 WHEN 'F1-C08-L01' THEN 'Market capitalization multiplies outstanding shares by a per-share price, not the proceeds guaranteed from instantly selling a large position.'
 WHEN 'F1-C08-L02' THEN 'A reverse split proportionally changes share counts and theoretical unit prices without automatically multiplying shareholder wealth.'
 WHEN 'F1-C08-L03' THEN 'Ask minus bid determines displayed spread, and the quote depth and time do not guarantee an order fill.'
 WHEN 'F1-C09-L01' THEN 'Cash divided by share price gives only a simplified whole-share capacity; separate this from risk limits, account eligibility and fees.'
 WHEN 'F1-C10-L01' THEN 'Long-position loss depends on position size times an adverse per-share price move; an unrealized mark is not an exit confirmation.'
 WHEN 'F1-C10-L02' THEN 'A short loses from a price rise, and loss can continue beyond the original sale price, with borrow and margin conditions.'
 WHEN 'F1-C12-L01' THEN 'Issuer evidence credibility and trade executability require separate tests; no-trade is valid even after a favorable later outcome.'
 WHEN 'F1-C13-L01' THEN 'A planned intraday holding interval is not an actual broker-confirmed round-trip, and carrying overnight changes event risk.'
 WHEN 'F1-C13-L02' THEN 'Style, technical setup and market-liquidity context are separate; a spread or missing evidence may veto a recognizable setup.'
 WHEN 'F2-C01-L01' THEN 'Ordinary core equity hours must be distinguished from extended sessions, exchange exceptions and broker order eligibility.'
 WHEN 'F2-C02-L01' THEN 'A ratio between two completed same-length intervals does not establish a universal daily-volume pattern or an executable price.'
 WHEN 'F2-C02-L02' THEN 'High-to-low range measures amplitude rather than a candle closing direction or forecast for its next move.'
 WHEN 'F2-C02-L03' THEN 'A preclose bid-ask snapshot does not establish an official closing auction price or an after-hours execution.'
 WHEN 'F2-C03-L01' THEN 'A later print-to-close percentage comparison does not prove that a different-sized after-hours order could fill at that quote.'
 ELSE NULL END AS domain_correction
 FROM public.lab_training_sets_v014 s
 WHERE s.version=97 AND s.review_state='reviewed'
   AND s.source_status='original_hypothetical_b01_individual_review_pending_v01497'
), revised AS (
 SELECT source.*,
  (SELECT jsonb_agg(
    CASE WHEN question.item->>'kind'='choice' THEN
       jsonb_set(question.item,'{distractorFeedback}',
         (SELECT coalesce(jsonb_agg(jsonb_build_object(
            'option',alternative.value,
            'feedback',left(
              'Why this choice is incorrect: '||btrim(alternative.value)||
              ' / Correction: '||source.domain_correction||
              ' Review the case evidence: '||coalesce(question.item->>'explanation',''),1350),
            'reviewStatus','DRAFT_PENDING_SEPARATE_PEDAGOGICAL_APPROVAL'
          ) ORDER BY alternative.ordinality),'[]'::jsonb)
          FROM jsonb_array_elements_text(question.item->'options')
          WITH ORDINALITY AS alternative(value,ordinality)
          WHERE upper(btrim(alternative.value))<>
            upper(btrim(source.answer_key->>(question.item->>'id')))),true)
    ELSE jsonb_set(question.item,'{numericCorrectionPolicy}',
      to_jsonb('DRAFT: explain units, denominator, arithmetic and any rounding or tolerance after submission only'::text),true)
    END ORDER BY question.ordinality)
   FROM jsonb_array_elements(source.questions)
    WITH ORDINALITY AS question(item,ordinality)) AS revised_questions
 FROM source
)
INSERT INTO public.lab_training_sets_v014
 (lab_id,version,review_state,source_status,title,questions,answer_key,
  reviewed_by,reviewed_at,review_frozen_at,created_at,updated_at)
SELECT lab_id,98,'draft','b01_private_feedback_draft_awaiting_independent_review_v98',
 title,revised_questions,answer_key,NULL,NULL,NULL,now(),now()
FROM revised
WHERE domain_correction IS NOT NULL;
DO $proof$
DECLARE total integer; choice_count integer; feedback_count integer; review_count integer;
BEGIN
 SELECT count(*) INTO total FROM public.lab_training_sets_v014 WHERE version=98;
 IF total<>20 THEN RAISE EXCEPTION 'Expected 20 V98 private drafts, observed %',total; END IF;
 SELECT count(*),
   coalesce(sum(CASE WHEN q.item->>'kind'='choice'
    THEN jsonb_array_length(q.item->'distractorFeedback') ELSE 0 END),0)
 INTO choice_count,feedback_count
 FROM public.lab_training_sets_v014 s
 CROSS JOIN LATERAL jsonb_array_elements(s.questions) AS q(item)
 WHERE s.version=98 AND q.item->>'kind'='choice';
 IF choice_count<>100 OR feedback_count<>200 THEN
  RAISE EXCEPTION 'Expected 100 private choice questions / 200 draft corrections: %, %',choice_count,feedback_count;
 END IF;
 SELECT count(*) INTO review_count FROM public.lab_training_sets_v014
 WHERE version=98 AND (review_state='reviewed' OR reviewed_at IS NOT NULL
  OR reviewed_by IS NOT NULL OR review_frozen_at IS NOT NULL);
 IF review_count<>0 THEN RAISE EXCEPTION 'V98 Draft cannot confer editorial approval'; END IF;
END $proof$;
COMMIT;
