-- SMFGU-SEC-TRIGGER-20261031-001, main-only, narrowly scoped privilege hardening.
-- Previous live state: SECURITY DEFINER trigger returned trigger; PUBLIC held EXECUTE.
-- The layout and audit tables are RLS+service-only; preserve service trigger writes.
-- No grants on public signup functions, Book Key RPCs, training or member data change.
BEGIN;
DO $guard$
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_trigger t
   JOIN pg_class c ON c.oid=t.tgrelid
   JOIN pg_namespace n ON n.oid=c.relnamespace
   JOIN pg_proc p ON p.oid=t.tgfoid
   WHERE n.nspname='public' AND c.relname='gu_site_card_layout_v1'
     AND t.tgname='gu_site_card_layout_audit_v1' AND t.tgenabled IN ('O','A')
     AND p.proname='gu_site_card_layout_audit_trigger_v1'
     AND NOT t.tgisinternal
 ) THEN RAISE EXCEPTION 'Expected live card layout audit trigger not found or disabled'; END IF;
 IF NOT EXISTS (
   SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
   WHERE n.nspname='public' AND p.proname='gu_site_card_layout_audit_trigger_v1'
     AND p.pronargs=0 AND p.prorettype='trigger'::regtype
     AND p.prosecdef IS TRUE
 ) THEN RAISE EXCEPTION 'Expected SECURITY DEFINER trigger function signature changed'; END IF;
END $guard$;
REVOKE ALL ON FUNCTION public.gu_site_card_layout_audit_trigger_v1()
 FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gu_site_card_layout_audit_trigger_v1()
 TO service_role;
DO $post$
DECLARE oid oid;
BEGIN
 SELECT p.oid INTO oid FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
  WHERE n.nspname='public' AND p.proname='gu_site_card_layout_audit_trigger_v1'
    AND p.pronargs=0;
 IF oid IS NULL OR has_function_privilege('anon',oid,'EXECUTE') OR
   has_function_privilege('authenticated',oid,'EXECUTE') OR
   NOT has_function_privilege('service_role',oid,'EXECUTE')
 THEN RAISE EXCEPTION 'Layout audit trigger privilege postflight failed'; END IF;
END $post$;
COMMIT;
-- Rollback only if required by an explicit Owner-approved exception:
-- GRANT EXECUTE ON FUNCTION public.gu_site_card_layout_audit_trigger_v1() TO PUBLIC;
-- Regranting PUBLIC is NOT recommended; investigate dependent calls first.
