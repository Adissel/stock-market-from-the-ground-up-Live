-- 2026-10-31 Crownlight Lumens V1 owner-delegated draft schedule.
-- Product-owner values are approved for TEST/reference only. No public earning until
-- assessment reviewers, formal grading, and issuance gates are independently accepted.
-- Existing single wallet retained. No member financial mutation.
BEGIN;
INSERT INTO public.gu_lumen_learning_rewards_v1
 (scope_type,scope_id,approved_revision,amount,published,reviewed_by,reviewed_at)
SELECT 'lab',lab_id,'lumen-v1.0',2,false,null,null
FROM public.platform_labs
WHERE active=true AND registry_visible=true AND lab_id ~ '^[A-Za-z0-9_-]{2,100}$'
ON CONFLICT (scope_type,scope_id,approved_revision) DO NOTHING;

INSERT INTO public.gu_lumen_learning_rewards_v1
 (scope_type,scope_id,approved_revision,amount,published,reviewed_by,reviewed_at)
VALUES
 ('bootcamp','truth5','lumen-v1.0',15,false,null,null),
 ('bootcamp','watchlist7','lumen-v1.0',25,false,null,null),
 ('bootcamp','scanners10','lumen-v1.0',35,false,null,null),
 ('bootcamp','foundations30','lumen-v1.0',70,false,null,null),
 ('bootcamp','charts45','lumen-v1.0',95,false,null,null),
 ('bootcamp','risk60','lumen-v1.0',130,false,null,null),
 ('bootcamp','practicum90','lumen-v1.0',180,false,null,null),
 ('bootcamp','tape10','lumen-v1.0',35,false,null,null),
 ('bootcamp','indicators10','lumen-v1.0',35,false,null,null),
 ('bootcamp','filings7','lumen-v1.0',25,false,null,null)
ON CONFLICT (scope_type,scope_id,approved_revision) DO NOTHING;

DO $$
DECLARE v_labs integer;v_camps integer;v_release boolean;
BEGIN
 SELECT count(*) INTO v_labs FROM public.gu_lumen_learning_rewards_v1
 WHERE scope_type='lab' AND approved_revision='lumen-v1.0' AND amount=2 AND published=false;
 SELECT count(*) INTO v_camps FROM public.gu_lumen_learning_rewards_v1
 WHERE scope_type='bootcamp' AND approved_revision='lumen-v1.0' AND published=false;
 SELECT learning_rewards_enabled INTO v_release FROM public.gu_lumen_completion_release_v1 WHERE singleton=true;
 IF v_labs<>419 OR v_camps<>10 OR v_release IS DISTINCT FROM false THEN
 RAISE EXCEPTION 'Release holds/catalog count mismatch: lab %, camps %, release %',v_labs,v_camps,v_release;
 END IF;
END $$;
COMMIT;