-- Crownlight Lumens LIVE products and member-bound reservation gate.
-- No checkout is enabled by this migration; every offer defaults sale_ready = false.
-- This is separate from the Stripe TEST-only shadow credits pipeline.
CREATE TABLE IF NOT EXISTS public.gu_lumen_live_offers_v1 (
 sku text PRIMARY KEY CHECK (sku ~ '^SPARKS_(25|55|90|125|275)$'),
 quantity integer NOT NULL CHECK (quantity between 1 and 100000),
 amount_cents integer NOT NULL CHECK (amount_cents between 50 and 100000000),
 stripe_product_id text NOT NULL UNIQUE CHECK (stripe_product_id ~ '^prod_[A-Za-z0-9_]+$'),
 stripe_price_id text NOT NULL UNIQUE CHECK (stripe_price_id ~ '^price_[A-Za-z0-9_]+$'),
 sale_ready boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gu_lumen_live_offers_v1 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gu_lumen_live_offers_v1 FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.gu_lumen_live_offers_v1 TO service_role;
INSERT INTO public.gu_lumen_live_offers_v1
(sku,quantity,amount_cents,stripe_product_id,stripe_price_id,sale_ready)
VALUES
('SPARKS_25',25,500,'prod_VZOxFX6Ng4rSM2','price_1UYG9YJL0O4GGVBHyNaAzubj',false),
('SPARKS_55',55,1000,'prod_VZOxSmGEZxZsDE','price_1UYG9jJL0O4GGVBHOVE3R6DS',false),
('SPARKS_90',90,1500,'prod_VZOx5REHUeDlUH','price_1UYG9lJL0O4GGVBHLbc3g2jA',false),
('SPARKS_125',125,2000,'prod_VZOxgH9cyYMocw','price_1UYG9nJL0O4GGVBH0Iln39jk',false),
('SPARKS_275',275,4000,'prod_VZOxtfmT0nBBHF','price_1UYG9pJL0O4GGVBH4apF56t8',false)
ON CONFLICT(sku) DO NOTHING;

CREATE OR REPLACE FUNCTION public.gu_lumen_live_reserve_v1(p_user uuid,p_sku text,p_request uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER
SET search_path TO 'pg_catalog','pg_temp' AS $body$
DECLARE o public.gu_lumen_live_orders_v1%rowtype;
        offer public.gu_lumen_live_offers_v1%rowtype;
BEGIN
 IF current_user <> 'service_role' THEN RAISE EXCEPTION 'SERVICE_ROLE_ONLY' USING errcode='42501'; END IF;
 IF p_user IS NULL OR p_request IS NULL OR p_sku !~ '^SPARKS_(25|55|90|125|275)$'
 THEN RETURN jsonb_build_object('ok',false,'code','INVALID_REQUEST'); END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_user::text,489301));
 IF NOT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=p_user AND p.account_kind='member' AND p.deleted_at IS NULL)
    OR NOT EXISTS(SELECT 1 FROM public.account_private_identity i WHERE i.user_id=p_user AND i.age_eligible=true AND i.date_of_birth IS NOT NULL)
    OR EXISTS(SELECT 1 FROM public.admin_user_flags f WHERE f.user_id=p_user AND lower(f.status) IN('restricted','suspended'))
    OR EXISTS(SELECT 1 FROM public.admin_user_roles r WHERE r.user_id=p_user AND r.role_code='SHOWCASE_VIEWER' AND (r.expires_at IS NULL OR r.expires_at>now()))
 THEN RETURN jsonb_build_object('ok',false,'code','MEMBER_NOT_ELIGIBLE'); END IF;
 IF NOT EXISTS(SELECT 1 FROM public.site_settings s WHERE s.setting_key='commerce.checkout_enabled' AND s.value='true'::jsonb)
    OR NOT EXISTS(SELECT 1 FROM public.site_settings s WHERE s.setting_key='commerce.provider' AND s.value='"STRIPE_MANAGED"'::jsonb)
    OR NOT EXISTS(SELECT 1 FROM public.gu39_sandbox_settings s WHERE s.id=true AND s.enabled=false)
 THEN RETURN jsonb_build_object('ok',false,'code','PAYMENT_MODE_NOT_LIVE'); END IF;
 SELECT * INTO offer FROM public.gu_lumen_live_offers_v1 WHERE sku=p_sku AND sale_ready=true;
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.gu_storefront_items_v014174 s
    WHERE s.sku='addon:'||p_sku AND s.visible=true AND s.sale_ready=true AND s.status='for_sale')
 THEN RETURN jsonb_build_object('ok',false,'code','LUMEN_BUNDLE_NOT_RELEASED'); END IF;
 SELECT * INTO o FROM public.gu_lumen_live_orders_v1 WHERE user_id=p_user AND request_id=p_request FOR UPDATE;
 IF FOUND THEN
   IF o.sku<>p_sku OR o.amount_cents<>offer.amount_cents OR o.stripe_price_id<>offer.stripe_price_id OR o.stripe_product_id<>offer.stripe_product_id
   THEN RETURN jsonb_build_object('ok',false,'code','IDEMPOTENCY_MISMATCH'); END IF;
   RETURN jsonb_build_object('ok',true,'existing',true,'id',o.id,'status',o.status,'session',o.stripe_session_id,
     'priceId',o.stripe_price_id,'productId',o.stripe_product_id,'quantity',o.quantity,'amountCents',o.amount_cents);
 END IF;
 IF (SELECT count(*) FROM public.gu_lumen_live_orders_v1 WHERE user_id=p_user AND status IN('prepared','bound')) >= 3
 THEN RETURN jsonb_build_object('ok',false,'code','PENDING_ORDER_LIMIT'); END IF;
 INSERT INTO public.gu_lumen_live_orders_v1(user_id,request_id,sku,quantity,amount_cents,stripe_product_id,stripe_price_id)
 VALUES(p_user,p_request,p_sku,offer.quantity,offer.amount_cents,offer.stripe_product_id,offer.stripe_price_id)
 RETURNING * INTO o;
 RETURN jsonb_build_object('ok',true,'existing',false,'id',o.id,'status',o.status,
   'priceId',o.stripe_price_id,'productId',o.stripe_product_id,'quantity',o.quantity,'amountCents',o.amount_cents);
END $body$;
REVOKE ALL ON FUNCTION public.gu_lumen_live_reserve_v1(uuid,text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gu_lumen_live_reserve_v1(uuid,text,uuid) TO service_role;
