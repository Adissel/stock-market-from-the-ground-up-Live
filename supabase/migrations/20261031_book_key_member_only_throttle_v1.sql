-- SMFGU-SEC-BOOKKEY-THROTTLE-20261031-001.
-- Migration staged for explicit controlled rollout AFTER the signup client no
-- longer calls prepare_book_key_claim. Does not alter book entitlement days,
-- existing keys, wallet, billing, member records or previously redeemed keys.
-- New policy: book codes are redeemed in authenticated Settings after email
-- verification, not anonymously as a pre-signup candidate oracle.
create table if not exists public.book_key_member_attempts_v1 (
 user_id uuid primary key references auth.users(id) on delete cascade,
 window_started_at timestamptz not null default now(),
 attempts integer not null default 0 check (attempts between 0 and 20),
 last_attempt_at timestamptz not null default now()
);
alter table public.book_key_member_attempts_v1 enable row level security;
revoke all on public.book_key_member_attempts_v1 from public,anon,authenticated;
grant select,insert,update,delete on public.book_key_member_attempts_v1 to service_role;

create or replace function public.redeem_book_key(candidate text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $body$
declare
  actor uuid := auth.uid();
  normalized text;
  key_row public.book_keys%rowtype;
  counted integer;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;
  -- The unique key serializes concurrent attempts per Auth user. The WHERE
  -- clause rejects attempt number six in the current 60-minute window.
  insert into public.book_key_member_attempts_v1
   (user_id,window_started_at,attempts,last_attempt_at)
  values(actor,now(),1,now())
  on conflict(user_id)
  do update set
    attempts = case
      when public.book_key_member_attempts_v1.window_started_at <= now()-interval '60 minutes'
      then 1 else public.book_key_member_attempts_v1.attempts+1 end,
    window_started_at = case
      when public.book_key_member_attempts_v1.window_started_at <= now()-interval '60 minutes'
      then now() else public.book_key_member_attempts_v1.window_started_at end,
    last_attempt_at=now()
  where public.book_key_member_attempts_v1.attempts < 5
    or public.book_key_member_attempts_v1.window_started_at <= now()-interval '60 minutes'
  returning attempts into counted;
  if counted is null then
    return jsonb_build_object('status','rate_limited','retry_after_minutes',60);
  end if;

  normalized := upper(regexp_replace(trim(coalesce(candidate,'')), '\s+', '', 'g'));
  if length(normalized)<8 or length(normalized)>80 then
    return jsonb_build_object('status','invalid');
  end if;
  select * into key_row from public.book_keys
   where code_hash=encode(digest(normalized,'sha256'),'hex')
     and is_active=true and book_code is not null
     and (expires_at is null or expires_at>now())
     and (max_redemptions is null or redemption_count < max_redemptions)
   limit 1;
  if key_row.id is null then
    return jsonb_build_object('status','invalid');
  end if;
  return public.apply_book_key_for_user(actor,key_row.id);
end;
$body$;
revoke all on function public.redeem_book_key(text) from public,anon;
grant execute on function public.redeem_book_key(text) to authenticated,service_role;

-- Remove the public pre-registration candidate oracle only after the deployed
-- signup interface has switched to post-verification Settings redemption.
revoke all on function public.prepare_book_key_claim(text) from public,anon,authenticated;
grant execute on function public.prepare_book_key_claim(text) to service_role;

-- Required postflight: anon EXECUTE=false prepare_book_key_claim; authenticated
-- EXECUTE=true redeem_book_key; no anonymous table data access; exactly
-- five attempts per hour per real auth.uid under independent dedicated QA user;
-- genuine member Settings redemption and existing claim activation both tested.
-- Rollback: restore original redeem_book_key definition and original public
-- EXECUTE grants only with Owner-approved rollback after abuse evaluation.
