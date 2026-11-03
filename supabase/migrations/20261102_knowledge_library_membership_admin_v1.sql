-- SMFGU Knowledge Library V1. New isolated store; 38 existing Free reference articles unchanged.
-- All article bodies are served via authorized Cloudflare Functions, never directly from exposed tables.
create table if not exists public.gu_knowledge_articles_v1 (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug)<=120),
  title text not null check (length(title) between 8 and 180),
  summary text not null default '' check (length(summary)<=700),
  subject text not null check (length(subject) between 2 and 100),
  learning_level text not null check (learning_level in ('beginner','intermediate','advanced','professional','institutional_quantitative')),
  access_plans text[] not null default array['FREE']::text[] check (
    cardinality(access_plans) between 1 and 11 and
    access_plans <@ array['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','FULL_ANNUAL','LIFETIME','ONDEMAND_MONTHLY','PICK_WHAT_YOU_WANT']::text[]),
  tags text[] not null default '{}'::text[] check (cardinality(tags)<=20),
  body_markdown text not null default '' check (length(body_markdown)<=100000),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources)='array'),
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  review_state text not null default 'draft' check (review_state in ('draft','in_review','accepted')),
  is_visible boolean not null default false,
  sort_order integer not null default 100 check (sort_order between 0 and 999999),
  version integer not null default 1 check (version>=1),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz,
  constraint knowledge_publication_gate check (
    (status<>'published' or (review_state='accepted' and length(body_markdown)>=400 and jsonb_array_length(sources)>=1)) and
    (is_visible=false or (status='published' and deleted_at is null))
  )
);
create index if not exists gu_knowledge_public_idx on public.gu_knowledge_articles_v1
 (status,is_visible,learning_level,subject,sort_order);
create index if not exists gu_knowledge_tags_idx on public.gu_knowledge_articles_v1 using gin(tags);
create index if not exists gu_knowledge_access_idx on public.gu_knowledge_articles_v1 using gin(access_plans);

create table if not exists public.gu_knowledge_article_revisions_v1 (
 id bigint generated always as identity primary key,
 article_id uuid not null references public.gu_knowledge_articles_v1(id) on delete cascade,
 article_version integer not null,
 action text not null check (action in ('save','archive','restore')),
 snapshot jsonb not null,
 edited_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 unique(article_id,article_version)
);
create index if not exists gu_knowledge_revisions_idx on public.gu_knowledge_article_revisions_v1(article_id,article_version desc);

alter table public.gu_knowledge_articles_v1 enable row level security;
alter table public.gu_knowledge_article_revisions_v1 enable row level security;
revoke all on public.gu_knowledge_articles_v1 from public, anon, authenticated;
revoke all on public.gu_knowledge_article_revisions_v1 from public, anon, authenticated;
revoke all on public.gu_knowledge_article_revisions_v1_id_seq from public, anon, authenticated;
grant all on public.gu_knowledge_articles_v1 to service_role;
grant all on public.gu_knowledge_article_revisions_v1 to service_role;
grant usage,select on sequence public.gu_knowledge_article_revisions_v1_id_seq to service_role;

create or replace function public.gu_knowledge_mutate_v1(
 p_actor uuid,p_action text,p_id uuid,p_expected_version integer,p_payload jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
 v_article public.gu_knowledge_articles_v1%rowtype;
 v_slug text; v_title text; v_summary text; v_subject text; v_level text;
 v_body text; v_status text; v_review text; v_visible boolean; v_sort integer;
 v_access text[]; v_tags text[]; v_sources jsonb;
begin
 if p_actor is null or not exists (
   select 1 from public.profiles p
   where p.id=p_actor and p.account_kind='member' and p.deleted_at is null
 ) or exists (
   select 1 from public.admin_user_flags f
   where f.user_id=p_actor and f.status in ('restricted','suspended')
 ) or exists (
   select 1 from public.admin_user_roles r where r.user_id=p_actor
   and r.role_code='SHOWCASE_VIEWER' and (r.expires_at is null or r.expires_at>now())
 ) or not exists (
   select 1 from public.admin_user_roles r
   where r.user_id=p_actor and (r.expires_at is null or r.expires_at>now())
   and (r.role_code='OWNER' or exists (
     select 1 from public.admin_role_permissions rp
     where rp.role_code=r.role_code and rp.permission_code='content.manage'
   ))
 ) then raise exception 'Unauthorized content administrator' using errcode='42501'; end if;

 if p_action not in ('save','archive','restore') then
   raise exception 'Unsupported action' using errcode='22023';
 end if;
 if p_action='save' then
   if jsonb_typeof(p_payload)<>'object' then raise exception 'Invalid article document' using errcode='22023'; end if;
   v_slug=lower(trim(p_payload->>'slug'));
   v_title=trim(p_payload->>'title');
   v_summary=trim(coalesce(p_payload->>'summary',''));
   v_subject=trim(p_payload->>'subject');
   v_level=p_payload->>'learning_level';
   v_body=coalesce(p_payload->>'body_markdown','');
   v_status=coalesce(p_payload->>'status','draft');
   v_review=coalesce(p_payload->>'review_state','draft');
   v_visible=coalesce((p_payload->>'is_visible')::boolean,false);
   v_sort=coalesce((p_payload->>'sort_order')::integer,100);
   if jsonb_typeof(p_payload->'access_plans')<>'array'
      or jsonb_typeof(p_payload->'tags')<>'array'
      or jsonb_typeof(p_payload->'sources')<>'array' then
     raise exception 'Access plans, tags and sources must be arrays' using errcode='22023';
   end if;
   v_access=array(select jsonb_array_elements_text(p_payload->'access_plans'));
   v_tags=array(select jsonb_array_elements_text(p_payload->'tags'));
   v_sources=p_payload->'sources';
   if jsonb_array_length(v_sources)>25 or exists (
     select 1 from jsonb_array_elements(v_sources) s
     where jsonb_typeof(s)<>'object'
        or coalesce(s->>'url','') !~ '^https://[^[:space:]]{3,500}$'
   ) then raise exception 'Source references must use HTTPS URLs' using errcode='22023'; end if;
   if exists (select 1 from unnest(v_tags) x where length(x)>50 or x='') then
     raise exception 'Invalid article tag' using errcode='22023';
   end if;
   if p_id is null then
     insert into public.gu_knowledge_articles_v1
     (slug,title,summary,subject,learning_level,access_plans,tags,body_markdown,sources,status,review_state,
      is_visible,sort_order,created_by,updated_by,published_at)
     values(v_slug,v_title,v_summary,v_subject,v_level,v_access,v_tags,v_body,v_sources,
       v_status,v_review,v_visible,v_sort,p_actor,p_actor,
       case when v_status='published' then now() else null end)
     returning * into v_article;
   else
     select * into v_article from public.gu_knowledge_articles_v1 where id=p_id for update;
     if not found then raise exception 'Article not found' using errcode='P0002'; end if;
     if v_article.version<>p_expected_version then
       raise exception 'Article was changed by another editor; reload before saving' using errcode='40001';
     end if;
     if v_article.deleted_at is not null then
       raise exception 'Restore archived article before editing' using errcode='22023';
     end if;
     update public.gu_knowledge_articles_v1
       set slug=v_slug,title=v_title,summary=v_summary,subject=v_subject,
       learning_level=v_level,access_plans=v_access,tags=v_tags,body_markdown=v_body,sources=v_sources,
       status=v_status,review_state=v_review,is_visible=v_visible,sort_order=v_sort,updated_by=p_actor,
       updated_at=now(),published_at=case when v_status='published' then coalesce(published_at,now()) else published_at end,
       version=version+1
     where id=p_id returning * into v_article;
   end if;
 else
   if p_id is null then raise exception 'Article ID required' using errcode='22023'; end if;
   select * into v_article from public.gu_knowledge_articles_v1 where id=p_id for update;
   if not found then raise exception 'Article not found' using errcode='P0002'; end if;
   if v_article.version<>p_expected_version then
     raise exception 'Article was changed by another editor; reload before saving' using errcode='40001';
   end if;
   if p_action='archive' then
     update public.gu_knowledge_articles_v1
     set status='archived',is_visible=false,deleted_at=now(),
      version=version+1,updated_by=p_actor,updated_at=now()
     where id=p_id returning * into v_article;
   else
     update public.gu_knowledge_articles_v1
     set status='draft',review_state='draft',is_visible=false,deleted_at=null,
      version=version+1,updated_by=p_actor,updated_at=now()
     where id=p_id returning * into v_article;
   end if;
 end if;
 insert into public.gu_knowledge_article_revisions_v1
  (article_id,article_version,action,snapshot,edited_by)
 values(v_article.id,v_article.version,p_action,to_jsonb(v_article),p_actor);
 insert into public.admin_audit_log(actor_user_id,action,target_type,target_id,details)
 values(p_actor,'knowledge.'||p_action,'knowledge_article',v_article.id::text,
  jsonb_build_object('version',v_article.version,'status',v_article.status,
   'visible',v_article.is_visible,'learning_level',v_article.learning_level,
   'access_plans',v_article.access_plans));
 return to_jsonb(v_article);
end $$;
revoke all on function public.gu_knowledge_mutate_v1(uuid,text,uuid,integer,jsonb) from public,anon,authenticated;
grant execute on function public.gu_knowledge_mutate_v1(uuid,text,uuid,integer,jsonb) to service_role;
comment on table public.gu_knowledge_articles_v1 is
'Private membership-controlled original research articles. No direct browser Data API access.';
