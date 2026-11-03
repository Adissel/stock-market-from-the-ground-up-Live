-- SMFGU Knowledge Database: Batch 002 source-informed original educational authoring pipeline.
-- Records are original illustrative lessons; reference URLs are fact-check leads, not licensed source text.
-- All publication is attributed to explicit Owner direction and logged as such; independent review NOT asserted.
CREATE OR REPLACE FUNCTION public.gu_knowledge_batch003_render_v1(d jsonb)
RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $body$
DECLARE
 v_title text; v_level text; v_source text; v_body text;
BEGIN
 IF jsonb_typeof(d)<>'object' THEN
   RAISE EXCEPTION 'Article input must be an object' USING ERRCODE='22023';
 END IF;
 IF EXISTS (
  SELECT 1 FROM unnest(ARRAY['slug','title','summary','subject',
   'definition','procedure','exercise','solution','counterexample','limitations','application']) field
  WHERE length(trim(coalesce(d->>field,'')))<24
 ) THEN RAISE EXCEPTION 'Missing or unusually short article-specific input' USING ERRCODE='23514'; END IF;
 IF jsonb_typeof(d->'sources')<>'array' OR jsonb_array_length(d->'sources')<1
 THEN RAISE EXCEPTION 'Article needs a recorded reference' USING ERRCODE='23514'; END IF;
 v_title:=d->>'title';v_level:=d->>'learning_level';
 SELECT string_agg('- '||coalesce(s->>'title','Reference')||' — '||(s->>'url'),E'\n')
 INTO v_source FROM jsonb_array_elements(d->'sources') s;
 v_body :=
 '# '||v_title||E'\n\n'||
 '## Scope and learning outcomes'||E'\n\n'||
 (d->>'summary')||E'\n\n'||
 'At the end of this article, the learner should be able to define the subject, reconstruct the example without looking ahead, distinguish documented observations from untested assumptions, and explain what would make the interpretation invalid. This is a completed first-party educational lesson; approval to publish is the Owner’s direction and does not imply an independent accuracy, licensing, legal or regulatory certification.'||E'\n\n'||
 '## Definition and observable evidence'||E'\n\n'||
 (d->>'definition')||E'\n\n'||
 'Record the exact instrument or dataset, date and time, unit of measure, observation period, source, and data vintage. In historical exercises, only information that existed by the chosen cutoff can be used. An omitted value means unknown, not zero. A derived number must name its calculation convention; a judgment must name the evidence supporting it. Never replace a missing observation with an imagined result.'||E'\n\n'||
 '## Reproducible research procedure'||E'\n\n'||
 (d->>'procedure')||E'\n\n'||
 'Use this verification sequence on a fresh, fictional dataset:'||E'\n'||
 '1. Identify the object of study and record the source, date, timezone, units, observation cutoff and relevant account or research restrictions.'||E'\n'||
 '2. Define each required field and the precise calculation or comparison rule before viewing any result. Declare rounding, denominator, time window, and handling of missing data.'||E'\n'||
 '3. Collect only eligible, completed observations. Recompute the intermediate values independently and keep the original input snapshot.'||E'\n'||
 '4. Write a factual interpretation and a plausible counterexample. Mark any unsupported inference as unverified.'||E'\n'||
 '5. Document a reproducible conclusion: what the available evidence demonstrates, what it does not demonstrate, and which further source would be needed.'||E'\n\n'||
 '## Fictional worked example'||E'\n\n'||
 (d->>'exercise')||E'\n\n'||
 'These are invented classroom figures, not market quotes, performance records, executable broker orders, or historical prices. Use only the assumptions explicitly provided here. If the example includes a numerical result, retain both its units and denominator when checking it.'||E'\n\n'||
 '## Instructor explanation'||E'\n\n'||
 (d->>'solution')||E'\n\n'||
 'The correct inference is limited to the stated calculation and factual scenario. Do not generalize a single illustration into a reliable expected return, a suitable portfolio choice, or a verified trading strategy. A different input, missing observation, changed session or new data vintage may produce a different result without making the arithmetic inconsistent.'||E'\n\n'||
 '## Common mistake and counterexample'||E'\n\n'||
 (d->>'counterexample')||E'\n\n'||
 'A related error is to use a compelling headline or later outcome to fill in what was not observable at the decision time. Reject that shortcut. A sound instructional answer explains not only when the example works, but also when it fails, becomes undefined, or needs additional evidence.'||E'\n\n'||
 '## Evidence and limits'||E'\n\n'||
 (d->>'limitations')||E'\n\n'||
 'The source references below support independent research and comparison of definitions. They have not been copied into this article and do not establish redistribution rights. Source pages, regulations, broker terms and vendor implementation details can change. Before using any result in an actual decision, independently verify current terms, source data quality, liquidity, costs, risk exposure, and any jurisdiction-specific requirements. Nothing here represents personalized investment advice.'||E'\n\n'||
 '## Independent application'||E'\n\n'||
 (d->>'application')||E'\n\n'||
 'Write down the answer before checking the worked explanation. Include all input values and their units, one alternative interpretation, one invalidating observation, and a sentence distinguishing a fact from an assumption. If you cannot retrieve the required evidence, explicitly choose NOT VERIFIED instead of fabricating a result.'||E'\n\n'||
 '## Self-check and answer guide'||E'\n\n'||
 '- **What is the subject?** State the definition in your own words and identify the required observation or dataset.'||E'\n'||
 '- **How is the result established?** Reproduce the method and intermediate arithmetic or classification from the fictional example, using the same units and cutoff.'||E'\n'||
 '- **What would make it wrong?** Explain the specific counterexample and invalidation condition above, not a generic warning.'||E'\n'||
 '- **What does it not establish?** It cannot, on its own, guarantee the direction of future prices, a trading profit, current data rights or a broker execution price.'||E'\n\n'||
 '## References and provenance'||E'\n\n'||
 v_source||E'\n\n'||
 'Provenance: original Crownlight educational synthesis prepared for THE STOCK MARKET: FROM THE GROUND UP. Source links are orientation and fact-check references; no third-party article, image, chart, trade print or data feed is republished here. Fictional numbers and research classifications are original teaching illustrations. Owner-directed publication does not represent independent editorial or professional certification.'||E'\n';
 IF length(v_body)<3000 OR length(v_body)>100000 THEN
  RAISE EXCEPTION 'Article body size outside complete-authoring gates for %: %',d->>'slug',length(v_body)
  USING ERRCODE='23514';
 END IF;
 RETURN v_body;
END $body$;

CREATE OR REPLACE FUNCTION public.gu_knowledge_batch003_publish_v1(p_actor uuid,p_docs jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $publish$
DECLARE
 d jsonb; v_body text; v_article jsonb; v_row public.gu_knowledge_articles_v1%rowtype;
 v_id uuid; v_done integer:=0; v_unique integer; v_slug text;
BEGIN
 IF p_actor IS NULL OR NOT EXISTS (
  SELECT 1 FROM public.admin_user_roles r JOIN public.profiles p ON p.id=r.user_id
  WHERE r.user_id=p_actor AND r.role_code='OWNER'
    AND (r.expires_at IS NULL OR r.expires_at>now())
    AND p.account_kind='member' AND p.deleted_at IS NULL
 ) OR EXISTS (
  SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=p_actor AND f.status IN ('restricted','suspended')
 ) OR EXISTS (
  SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=p_actor AND r.role_code='SHOWCASE_VIEWER'
    AND (r.expires_at IS NULL OR r.expires_at>now())
 ) THEN RAISE EXCEPTION 'Active Owner account required' USING ERRCODE='42501'; END IF;
 IF jsonb_typeof(p_docs)<>'array' OR jsonb_array_length(p_docs)<1 OR jsonb_array_length(p_docs)>10
 THEN RAISE EXCEPTION 'Batch must contain 1-10 articles' USING ERRCODE='22023'; END IF;

 -- Validate whole batch before inserting any article; SQL transaction rolls back on any failure.
 SELECT count(DISTINCT x->>'slug') INTO v_unique FROM jsonb_array_elements(p_docs) x;
 IF v_unique<>jsonb_array_length(p_docs) THEN
  RAISE EXCEPTION 'Duplicate article slug in batch' USING ERRCODE='23505'; END IF;
 FOR d IN SELECT value FROM jsonb_array_elements(p_docs) LOOP
  v_slug:=coalesce(d->>'slug','');
  IF v_slug !~ '^knowledge-b003-[a-z0-9]+(-[a-z0-9]+)*$' OR length(v_slug)>100
    OR EXISTS(SELECT 1 FROM public.gu_knowledge_articles_v1 WHERE slug=v_slug)
  THEN RAISE EXCEPTION 'Duplicate/invalid or already published slug: %',v_slug USING ERRCODE='23505'; END IF;
  IF d->>'learning_level' NOT IN ('beginner','intermediate','advanced','professional','institutional_quantitative')
     OR jsonb_typeof(d->'access_plans')<>'array'
     OR (d->'access_plans') @> '["FREE"]'::jsonb
     OR (d->'access_plans') @> '["PICK_WHAT_YOU_WANT"]'::jsonb
     OR jsonb_array_length(d->'access_plans')<3
  THEN RAISE EXCEPTION 'Unsupported level or unapproved membership grant: %',v_slug USING ERRCODE='22023'; END IF;
  v_body:=public.gu_knowledge_batch003_render_v1(d);
 END LOOP;

 FOR d IN SELECT value FROM jsonb_array_elements(p_docs) LOOP
  v_body:=public.gu_knowledge_batch003_render_v1(d);
  v_article:=public.gu_knowledge_mutate_v1(p_actor,'save',null,null,
   d||jsonb_build_object('body_markdown',v_body,'status','draft','review_state','draft',
                        'is_visible',false,'sort_order',110));
  v_id:=(v_article->>'id')::uuid;
  SELECT * INTO v_row FROM public.gu_knowledge_articles_v1 WHERE id=v_id;
  PERFORM public.gu_knowledge_complete_article_v2(p_actor,v_id,v_row.version,v_body);
  SELECT * INTO v_row FROM public.gu_knowledge_articles_v1 WHERE id=v_id;
  IF v_row.authoring_state<>'complete' THEN RAISE EXCEPTION 'Article not complete: %',v_row.slug; END IF;
  v_article:=public.gu_knowledge_mutate_v1(p_actor,'save',v_id,v_row.version,
   to_jsonb(v_row)||jsonb_build_object('status','published','review_state','accepted','is_visible',true));
  v_done:=v_done+1;
 END LOOP;
 INSERT INTO public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 VALUES(p_actor,'knowledge.batch003.owner_directed_publish','knowledge_article_batch','B003-20261103',
 jsonb_build_object('count',v_done,'basis','owner-directed batch 003, original completed articles with full master-source crosswalk',
 'independent_editorial_review',false,'membership_access','existing plans only',
 'originality','original first-party teaching, fictional examples, external URL pointers'));
 RETURN jsonb_build_object('created_and_published',v_done,'batch','B003-20261103');
END $publish$;
REVOKE ALL ON FUNCTION public.gu_knowledge_batch003_render_v1(jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.gu_knowledge_batch003_publish_v1(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gu_knowledge_batch003_render_v1(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.gu_knowledge_batch003_publish_v1(uuid,jsonb) TO service_role;
