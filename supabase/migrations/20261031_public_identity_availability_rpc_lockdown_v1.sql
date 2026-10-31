-- SMFGU-SEC-ENUM-20261031-001 v1.0
-- Gate 22: remove direct public account-existence RPCs after signup.js
-- stopped calling them. The same-origin /api/account?action=signup
-- uses a service-role request for authoritative username validation.
-- No Auth signup, verification, Book Key, or member entitlement changes.

DO $preflight$
BEGIN
  IF to_regprocedure('public.username_is_available(text)') IS NULL
     OR to_regprocedure('public.email_is_available(text)') IS NULL THEN
    RAISE EXCEPTION 'Required identity availability functions are missing; no permissions changed';
  END IF;
  IF NOT has_function_privilege('service_role','public.username_is_available(text)','EXECUTE')
     OR NOT has_function_privilege('service_role','public.email_is_available(text)','EXECUTE') THEN
    RAISE EXCEPTION 'Service-role account registration dependency is not callable; no permissions changed';
  END IF;
END
$preflight$;

REVOKE EXECUTE ON FUNCTION public.username_is_available(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_is_available(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.username_is_available(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_is_available(text) TO service_role;

DO $postflight$
BEGIN
  IF has_function_privilege('anon','public.username_is_available(text)','EXECUTE')
     OR has_function_privilege('authenticated','public.username_is_available(text)','EXECUTE')
     OR has_function_privilege('anon','public.email_is_available(text)','EXECUTE')
     OR has_function_privilege('authenticated','public.email_is_available(text)','EXECUTE')
     OR NOT has_function_privilege('service_role','public.username_is_available(text)','EXECUTE')
     OR NOT has_function_privilege('service_role','public.email_is_available(text)','EXECUTE') THEN
    RAISE EXCEPTION 'Account availability RPC ACL postflight failed, rolling back';
  END IF;
END
$postflight$;
