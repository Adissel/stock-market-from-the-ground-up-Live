-- SMFGU-KDB-SMA-CASE-001 v1.0: transactional one-article copy and calculation-context correction.
-- $10,$11,$12 completed SMA = $11; after newly *completed* fourth close $13, rolling SMA=$12.
-- Strict article version hold. Uses existing Owner-authorized three-step authoring gate and audit history.
DO $kdb_sma$
DECLARE
 v_owner uuid; r public.gu_knowledge_articles_v1%ROWTYPE; v_new text; v_ret jsonb;
 v_old_ex constant text:='Correct new SMA is (11+12+13)/3=$12. The $10 bar has dropped out; an incomplete fourth bar is not part of the prior confirmed average.';
 v_new_ex constant text:='First, the three completed closes $10, $11, and $12 produce a three-bar SMA of ($10+$11+$12)/3=$11. Now suppose a fourth bar later completes at $13. The three most recent completed closes become $11, $12, and $13; the new SMA is ($11+$12+$13)/3=$12. The $10 close drops out only after the $13 close is confirmed. While the fourth bar is still forming, its provisional price must not be treated as the final completed-bar SMA.';
 v_old_prov constant text:='Original educational research draft based on existing Talia teaching material. Not an independently validated trading system or approved member publication.';
 v_new_prov constant text:='Original source-informed educational article adapted from Talia teaching material, published to entitled members by Owner direction. It is not a verified profitable trading system or independently certified financial, numerical, rights, or editorial reference; item-level verification remains pending.';
BEGIN
 SELECT ur.user_id INTO v_owner FROM public.admin_user_roles ur JOIN public.profiles p ON p.id=ur.user_id
 WHERE ur.role_code='OWNER' AND (ur.expires_at IS NULL OR ur.expires_at>now()) AND p.account_kind='member'
 AND p.deleted_at IS NULL AND NOT EXISTS(SELECT 1 FROM public.admin_user_flags f
 WHERE f.user_id=ur.user_id AND f.status IN ('restricted','suspended'))
 ORDER BY ur.user_id LIMIT 1;
 IF v_owner IS NULL THEN RAISE EXCEPTION 'No active Owner'; END IF;
 SELECT * INTO STRICT r FROM public.gu_knowledge_articles_v1
 WHERE slug='research-study-sma' FOR UPDATE;
 IF r.version<>9 OR r.status<>'published' OR r.review_state<>'accepted'
 OR r.authoring_state<>'complete' OR NOT r.is_visible OR r.deleted_at IS NOT NULL
 OR strpos(r.body_markdown,v_old_ex)=0 OR strpos(r.body_markdown,v_old_prov)=0 THEN
  RAISE EXCEPTION 'SMA article/version/body changed; do not overwrite';
 END IF;
 v_new:=replace(replace(r.body_markdown,v_old_ex,v_new_ex),v_old_prov,v_new_prov);
 IF strpos(v_new,v_old_ex)>0 OR strpos(v_new,v_old_prov)>0 THEN RAISE EXCEPTION 'Stale original wording'; END IF;
 v_ret:=public.gu_knowledge_mutate_v1(v_owner,'save',r.id,r.version,to_jsonb(r)||
  jsonb_build_object('body_markdown',v_new,'status','draft','review_state','draft','is_visible',false));
 IF (v_ret->>'version')::integer<>r.version+1 THEN RAISE EXCEPTION 'Draft transition failed'; END IF;
 v_ret:=public.gu_knowledge_complete_article_v2(v_owner,r.id,(v_ret->>'version')::integer,v_new);
 IF (v_ret->>'version')::integer<>r.version+2 OR v_ret->>'authoring_state'<>'complete' THEN
 RAISE EXCEPTION 'Completion failed';END IF;
 v_ret:=public.gu_knowledge_mutate_v1(v_owner,'save',r.id,(v_ret->>'version')::integer,to_jsonb(r)||
  jsonb_build_object('body_markdown',v_new,'status','published','review_state','accepted','is_visible',true));
 IF (v_ret->>'version')::integer<>r.version+3 OR v_ret->>'status'<>'published'
 OR v_ret->>'authoring_state'<>'complete' OR v_ret->>'is_visible'<>'true'
 THEN RAISE EXCEPTION 'Republish failed';END IF;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(v_owner,'knowledge.sma_case_window_clarification_v1','knowledge_article',r.id::text,
 jsonb_build_object('slug',r.slug,'prior_version',r.version,'new_version',(v_ret->>'version')::int,
 'numerical_result_original',11,'numerical_result_roll_forward',12,
 'content_scope','fictional fourth completed close explicitly introduced',
 'owner_directed_publication',true,'independent_editorial_approval',false));
END $kdb_sma$;
