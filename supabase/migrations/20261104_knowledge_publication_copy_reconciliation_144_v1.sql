-- SMFGU-KDB-P0-144 / 2026-11-04. Transactional publication-copy reconciliation.
-- Owner-authorized public copy correction. NOT independent financial, legal, rights, or source certification.
-- Source: live 144-row, exact-slug/version preflight. Existing Gu Knowledge mutate RPC writes revisions and audit records.
-- Idempotency: refuses any changed source set, preventing a second or stale execution.
DO $kdb_reconcile$
DECLARE
 v_owner uuid;
 v_digest text; v_count integer; v_done integer := 0;
 v_old1 constant text := 'Original source-informed research draft from the existing';
 v_new1 constant text := 'Original source-informed educational article adapted from the existing';
 v_old2 constant text := 'This is NOT a public article or a verified profitable trading strategy.';
 v_new2 constant text := 'Published to entitled members by Owner direction; this is not a verified profitable trading strategy or independently certified research.';
 v_old3 constant text := 'No third-party copyrighted text, screenshots, trading signals, or protected historical data are redistributed.';
 v_new3 constant text := 'No third-party content or licensed market-data redistribution rights are asserted; external URLs are research references, not reuse authorization.';
 v_old4 constant text := 'Editorial, source, numerical, rights, and member-experience acceptance are required before publication.';
 v_new4 constant text := 'Independent editorial, source-claim, numerical, rights, and member-experience verification has not been established; publication does not constitute that certification.';
 v_new_body text; v_result jsonb; rec record;
BEGIN
 SELECT r.user_id INTO v_owner
 FROM public.admin_user_roles r JOIN public.profiles p ON p.id=r.user_id
 WHERE r.role_code='OWNER' AND (r.expires_at IS NULL OR r.expires_at>now())
 AND p.account_kind='member' AND p.deleted_at IS NULL
 AND NOT EXISTS(SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=r.user_id AND f.status IN ('restricted','suspended'))
 AND NOT EXISTS(SELECT 1 FROM public.admin_user_roles x WHERE x.user_id=r.user_id AND x.role_code='SHOWCASE_VIEWER' AND (x.expires_at IS NULL OR x.expires_at>now()))
 ORDER BY r.user_id LIMIT 1;
 IF v_owner IS NULL THEN RAISE EXCEPTION 'No eligible Owner; stop without edits'; END IF;
 SELECT count(*),md5(string_agg(slug||':'||version,',' order by slug))
 INTO v_count,v_digest
 FROM public.gu_knowledge_articles_v1
 WHERE status='published' AND is_visible AND deleted_at IS NULL
 AND body_markdown LIKE '%This is NOT a public article%';
 IF v_count<>144 OR v_digest<>'889a66c6202824e06a537d898d80eaec' THEN
   RAISE EXCEPTION 'P0 144-row/versions preflight changed: count %, signature %',v_count,v_digest;
 END IF;
 FOR rec IN
 SELECT a.* FROM public.gu_knowledge_articles_v1 a
 WHERE a.status='published' AND a.is_visible AND a.deleted_at IS NULL
 AND a.body_markdown LIKE '%This is NOT a public article%'
 ORDER BY a.slug FOR UPDATE OF a
 LOOP
   IF strpos(rec.body_markdown,v_old1)=0 OR strpos(rec.body_markdown,v_old2)=0
      OR strpos(rec.body_markdown,v_old3)=0 OR strpos(rec.body_markdown,v_old4)=0
      OR rec.review_state<>'accepted' OR rec.authoring_state<>'complete' THEN
      RAISE EXCEPTION 'Unexpected body/status for slug %',rec.slug;
   END IF;
   v_new_body:=replace(replace(replace(replace(rec.body_markdown,
       v_old1,v_new1),v_old2,v_new2),v_old3,v_new3),v_old4,v_new4);
   IF v_new_body=rec.body_markdown OR strpos(v_new_body,v_old2)>0 OR strpos(v_new_body,v_old4)>0 THEN
      RAISE EXCEPTION 'Uncorrected statement for %',rec.slug;
   END IF;
   v_result:=public.gu_knowledge_mutate_v1(v_owner,'save',rec.id,rec.version,
       to_jsonb(rec)||jsonb_build_object('body_markdown',v_new_body));
   IF (v_result->>'version')::integer<>rec.version+1 OR (v_result->>'slug')<>rec.slug
      OR (v_result->>'status')<>'published' OR (v_result->>'review_state')<>'accepted'
      OR (v_result->>'is_visible')::boolean IS DISTINCT FROM true
      OR (v_result->>'body_markdown')<>v_new_body THEN
      RAISE EXCEPTION 'Owner editorial RPC failed consistency check for %',rec.slug;
   END IF;
   v_done:=v_done+1;
 END LOOP;
 IF v_done<>144 THEN RAISE EXCEPTION 'Unexpected completed article count %',v_done; END IF;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(v_owner,'knowledge.p0_publication_copy_reconciled_v1','knowledge_batch','SMFGU-KDB-P0-144-20261104',
   jsonb_build_object('article_count',v_done,'source_issue',106,'source_digest','889a66c6202824e06a537d898d80eaec',
   'changed_fields','article_body_provenance_paragraph_only','per_article_versioned_rpc',true,
   'access_plans_unchanged',true,'independent_editorial_approval',false,'independent_rights_clearance',false,
   'remaining_gate','item-level financial and source review'));
END $kdb_reconcile$;
