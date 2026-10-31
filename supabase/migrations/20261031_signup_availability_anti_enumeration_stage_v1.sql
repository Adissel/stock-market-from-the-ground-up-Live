-- SMFGU-SEC-PUBLIC-RPC-20261031-002 (staged, DO NOT APPLY before
-- genuine service-key RPC positive/negative validation and cached-client regression).
-- Browser calls to the two legacy availability RPCs get syntax-only results,
-- never the registered/not-registered state. The existing trusted signup API
-- must continue to get the authoritative uniqueness decision using a verified
-- service_role JWT. No user accounts or profiles may be altered in this migration.
--
-- Preflight required:
-- 1. Confirm service-role Data API sets request.jwt.claim.role=service_role.
-- 2. Verify the real trusted signup endpoint still rejects a known-taken
--    username without writing an auth user or profile.
-- 3. Verify anonymous and authenticated callers get the same response for
--    existing and novel *valid-format* candidate identifiers.
-- 4. Verify old cached signup.js remains compatible (syntax validation true).
-- Do not claim anti-abuse or Book Key throttling from this change alone.

create or replace function public.username_is_available(candidate text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select case
    when coalesce(current_setting('request.jwt.claim.role', true),'') = 'service_role'
      then public.normalize_username(candidate) is not null and not exists (
        select 1 from public.profiles p
        where lower(p.username) = lower(public.normalize_username(candidate))
      )
    else public.normalize_username(candidate) is not null
  end;
$$;

create or replace function public.email_is_available(candidate text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select case
    when coalesce(current_setting('request.jwt.claim.role', true),'') = 'service_role'
      then candidate is not null
       and length(trim(candidate)) between 3 and 320
       and position('@' in trim(candidate)) > 1
       and not exists (
         select 1 from auth.users u
         where lower(u.email)=lower(trim(candidate))
       )
    else candidate is not null
       and length(trim(candidate)) between 3 and 320
       and position('@' in trim(candidate)) > 1
  end;
$$;

-- Retain legacy RPC grants for cached browsers; response to untrusted roles
-- is candidate-format only. Do not remove service_role execute privileges.
revoke all on function public.username_is_available(text) from public;
revoke all on function public.email_is_available(text) from public;
grant execute on function public.username_is_available(text) to anon,authenticated,service_role;
grant execute on function public.email_is_available(text) to anon,authenticated,service_role;

-- No writes to auth.users/profiles/book_keys/claims and no blanket EXECUTE revocations.
