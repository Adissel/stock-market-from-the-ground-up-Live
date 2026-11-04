-- Crownlight SEC Scanner v1: additive owner-managed tier grants. Not applied to LIVE by this commit.
-- This ledger is separate from existing Catalyst and Watchlist product entitlements.
begin;
create table if not exists public.gu_sec_scanner_tier_grants_v1 (
 user_id uuid primary key references auth.users(id) on delete cascade,
 tier text not null check (tier in ('BASIC','PLUS','ADVANCED')),
 status text not null default 'active' check (status in ('active','revoked')),
 expires_at timestamptz,
 version integer not null default 1 check (version > 0),
 updated_by uuid not null references auth.users(id),
 reason text not null check (length(reason) between 8 and 500),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.gu_sec_scanner_tier_audit_v1 (
 id bigint generated always as identity primary key,
 user_id uuid not null,
 actor_id uuid not null,
 previous_value jsonb,
 next_value jsonb not null,
 expected_version integer not null,
 change_reason text not null,
 changed_at timestamptz not null default now()
);
create index if not exists gu_sec_scanner_tier_audit_target_idx
 on public.gu_sec_scanner_tier_audit_v1(user_id,changed_at desc);
alter table public.gu_sec_scanner_tier_grants_v1 enable row level security;
alter table public.gu_sec_scanner_tier_audit_v1 enable row level security;
revoke all on public.gu_sec_scanner_tier_grants_v1 from public,anon,authenticated;
revoke all on public.gu_sec_scanner_tier_audit_v1 from public,anon,authenticated;
grant select,insert,update,delete on public.gu_sec_scanner_tier_grants_v1 to service_role;
grant select,insert on public.gu_sec_scanner_tier_audit_v1 to service_role;
grant usage,select on sequence public.gu_sec_scanner_tier_audit_v1_id_seq to service_role;

create or replace function public.gu_sec_scanner_set_tier_v1(
 p_actor uuid,
 p_target uuid,
 p_tier text,
 p_status text,
 p_expected_version integer,
 p_expires_at timestamptz,
 p_reason text
) returns jsonb language plpgsql
security definer set search_path = ''
as $body$
declare
 existing public.gu_sec_scanner_tier_grants_v1%rowtype;
 previous jsonb;
 revised jsonb;
 next_version integer;
begin
 if p_actor is null or p_target is null then
  raise exception 'INVALID_ACCOUNT' using errcode='22023';
 end if;
 if not exists(select 1 from public.admin_user_roles
  where user_id=p_actor and role_code='OWNER'
  and (expires_at is null or expires_at>now())) then
  raise exception 'OWNER_REQUIRED' using errcode='42501';
 end if;
 if not exists(select 1 from auth.users where id=p_target) then
  raise exception 'TARGET_ACCOUNT_NOT_FOUND' using errcode='22023';
 end if;
 if p_tier not in ('BASIC','PLUS','ADVANCED')
    or p_status not in ('active','revoked')
    or p_expected_version is null or p_expected_version<0
    or p_reason is null or length(btrim(p_reason)) not between 8 and 500
    or (p_status='active' and p_expires_at is not null and p_expires_at<=now()) then
  raise exception 'INVALID_SEC_TIER_CHANGE' using errcode='22023';
 end if;

 perform pg_advisory_xact_lock(hashtext(p_target::text), 20261103);
 select * into existing from public.gu_sec_scanner_tier_grants_v1
 where user_id=p_target for update;
 if found then
  if p_expected_version<>existing.version then
   raise exception 'STALE_SEC_TIER_REVISION' using errcode='40001';
  end if;
  previous=to_jsonb(existing);
  next_version=existing.version+1;
 else
  if p_expected_version<>0 then
   raise exception 'STALE_SEC_TIER_REVISION' using errcode='40001';
  end if;
  previous=null;
  next_version=1;
 end if;

 insert into public.gu_sec_scanner_tier_grants_v1
   (user_id,tier,status,expires_at,version,updated_by,reason,updated_at)
 values(p_target,p_tier,p_status,p_expires_at,next_version,p_actor,btrim(p_reason),now())
 on conflict(user_id) do update set
  tier=excluded.tier,status=excluded.status,expires_at=excluded.expires_at,
  version=excluded.version,updated_by=excluded.updated_by,
  reason=excluded.reason,updated_at=now();
 select to_jsonb(t) into revised from public.gu_sec_scanner_tier_grants_v1 t
 where t.user_id=p_target;
 insert into public.gu_sec_scanner_tier_audit_v1
  (user_id,actor_id,previous_value,next_value,expected_version,change_reason)
 values(p_target,p_actor,previous,revised,p_expected_version,btrim(p_reason));
 return jsonb_build_object('ok',true,'version',next_version,'tier',p_tier,
  'status',p_status,'expiresAt',p_expires_at);
end
$body$;
revoke all on function public.gu_sec_scanner_set_tier_v1(
 uuid,uuid,text,text,integer,timestamptz,text) from public,anon,authenticated;
grant execute on function public.gu_sec_scanner_set_tier_v1(
 uuid,uuid,text,text,integer,timestamptz,text) to service_role;
commit;
