-- Superseded by 20261031_public_identity_availability_rpc_lockdown_v1.sql.
-- This older source proposal must NEVER restore anonymous enumeration access.
-- Keep this file idempotent and restrictive if future migration automation
-- scans every file under supabase/migrations.
-- Database source functions are intentionally preserved unchanged, since
-- service_role remains the trusted signup uniqueness enforcement path.
REVOKE EXECUTE ON FUNCTION public.username_is_available(text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_is_available(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.username_is_available(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_is_available(text) TO service_role;
-- No public identifier lookup or Book Key operation regranted.
