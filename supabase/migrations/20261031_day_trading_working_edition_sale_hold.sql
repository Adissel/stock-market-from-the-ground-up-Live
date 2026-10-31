-- SMFGU-QA-LAUNCH-GAPS-20261031-001, Day Trading working-edition sale safety hold.
-- Preserve all existing EPUB downloads, customer entitlements and other book SKUs.
-- Owner-controlled reason: v3.11 WORKING edition / in_development conflicts with
-- storefront for_sale and no publication-accepted edition register row exists.
-- New checkout ONLY is paused; future release requires an accepted edition/hash.
BEGIN;
DO $hold$
DECLARE changed integer;
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM public.catalog_products
   WHERE product_code='DAY_TRADING_BOOK_1'
     AND publication_status='in_development'
     AND edition_label ILIKE '%working%'
     AND sales_status='published'
     AND website_checkout_enabled IS TRUE
 ) THEN RAISE EXCEPTION 'DAY_TRADING_PRECONDITION_CHANGED'; END IF;
 IF EXISTS (SELECT 1 FROM public.book_editions_v135
             WHERE product_code='DAY_TRADING_BOOK_1' AND active=true
               AND publication_status='published')
 THEN RAISE EXCEPTION 'PUBLISHED_DAY_TRADING_EDITION_EXISTS_REVIEW_REQUIRED'; END IF;
 IF EXISTS (SELECT 1 FROM public.gu_book_live_intents_v1
             WHERE product_code='DAY_TRADING_BOOK_1'
               AND status NOT IN ('failed','expired','refunded'))
 THEN RAISE EXCEPTION 'DAY_TRADING_LIVE_ORDER_EXISTS_REVIEW_REQUIRED'; END IF;
 UPDATE public.catalog_products
 SET website_checkout_enabled=false,sales_status='coming_soon',updated_at=now()
 WHERE product_code='DAY_TRADING_BOOK_1' AND website_checkout_enabled=true;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'DAY_TRADING_CATALOG_CHANGE_COUNT_MISMATCH';END IF;
 UPDATE public.gu_digital_books_v01430
 SET sales_enabled=false,updated_at=now()
 WHERE product_code='DAY_TRADING_BOOK_1' AND sales_enabled=true;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'DAY_TRADING_DIGITAL_CHANGE_COUNT_MISMATCH';END IF;
 UPDATE public.gu_storefront_items_v014174
 SET sale_ready=false,status='coming_soon',updated_at=now()
 WHERE sku='book:DAY_TRADING_BOOK_1'
   AND status='for_sale' AND sale_ready=true;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'DAY_TRADING_STORE_CHANGE_COUNT_MISMATCH';END IF;
END $hold$;
COMMIT;
-- Readback: booked downloads_enabled remains true for existing authorized readers.
SELECT c.product_code,c.publication_status,c.edition_label,
 c.sales_status,c.website_checkout_enabled,d.sales_enabled,d.downloads_enabled,
 s.status as storefront_status,s.visible,s.sale_ready
FROM public.catalog_products c
JOIN public.gu_digital_books_v01430 d USING(product_code)
JOIN public.gu_storefront_items_v014174 s ON s.sku='book:'||c.product_code
WHERE c.product_code='DAY_TRADING_BOOK_1';
