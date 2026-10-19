-- Portfolio CMS: PostgreSQL / Supabase. Run in the Supabase SQL Editor.
-- All writes require an explicitly provisioned admin; draft data is never public.
begin;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.site_drafts (
  id smallint primary key check (id=1),
  content jsonb not null check (jsonb_typeof(content)='object'),
  revision bigint not null default 0,
  published_revision bigint not null default -1,
  updated_at timestamptz not null default now()
);
create table if not exists public.site_publications (
  id smallint primary key check (id=1),
  content jsonb not null check (jsonb_typeof(content)='object'),
  updated_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
alter table public.site_drafts enable row level security;
alter table public.site_publications enable row level security;
revoke all on public.admin_users, public.site_drafts, public.site_publications from anon, authenticated;
grant select on public.admin_users, public.site_drafts to authenticated;
grant select on public.site_publications to anon, authenticated;

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.admin_users where user_id=(select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

drop policy if exists "admin membership" on public.admin_users;
create policy "admin membership" on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "admin reads draft" on public.site_drafts;
create policy "admin reads draft" on public.site_drafts for select to authenticated using ((select public.is_portfolio_admin()));
drop policy if exists "public reads publication" on public.site_publications;
create policy "public reads publication" on public.site_publications for select to anon,authenticated using (true);

create or replace function public.save_portfolio_draft(p_content jsonb,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare current_revision bigint;
begin
  if not public.is_portfolio_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  if jsonb_typeof(p_content) <> 'object' or octet_length(p_content::text)>1000000 then
    raise exception 'Invalid content' using errcode='22023';
  end if;
  select revision into current_revision from public.site_drafts where id=1 for update;
  if not found then raise exception 'Run seed migration first'; end if;
  if current_revision <> p_expected_revision then raise exception 'Revision conflict' using errcode='40001'; end if;
  update public.site_drafts set content=p_content,revision=current_revision+1,updated_at=now() where id=1;
  return jsonb_build_object('revision',current_revision+1,'updated_at',now());
end;
$$;
create or replace function public.publish_portfolio(p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare draft public.site_drafts%rowtype; safe_content jsonb;
begin
  if not public.is_portfolio_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  select * into draft from public.site_drafts where id=1 for update;
  if not found then raise exception 'Run seed migration first'; end if;
  if draft.revision <> p_expected_revision then raise exception 'Revision conflict' using errcode='40001'; end if;
  -- Exclude draft projects and internal editorial notes from the published snapshot.
  safe_content=jsonb_set(draft.content,'{projects}',coalesce(
    (select jsonb_agg(item - 'note' || '{"note":""}'::jsonb order by ordinal)
     from jsonb_array_elements(draft.content->'projects') with ordinality as entries(item,ordinal)
     where item->>'status'='published'),'[]'::jsonb));
  insert into public.site_publications(id,content,updated_at) values(1,safe_content,now())
  on conflict(id) do update set content=excluded.content,updated_at=excluded.updated_at;
  update public.site_drafts set published_revision=revision where id=1;
  return jsonb_build_object('revision',draft.revision,'published_at',now());
end;
$$;
revoke all on function public.save_portfolio_draft(jsonb,bigint) from public,anon;
revoke all on function public.publish_portfolio(bigint) from public,anon;
grant execute on function public.save_portfolio_draft(jsonb,bigint) to authenticated;
grant execute on function public.publish_portfolio(bigint) to authenticated;

-- Public media only. A draft's text stays private, but uploaded media URLs are public.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portfolio-media','portfolio-media',true,3145728,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "portfolio admin upload" on storage.objects;
create policy "portfolio admin upload" on storage.objects for insert to authenticated with check (
  bucket_id='portfolio-media' and (select public.is_portfolio_admin())
  and (storage.foldername(name))[1]=(select auth.uid())::text
);
drop policy if exists "portfolio admin manage read" on storage.objects;
create policy "portfolio admin manage read" on storage.objects for select to authenticated using (
  bucket_id='portfolio-media' and (select public.is_portfolio_admin())
);
drop policy if exists "portfolio admin delete own" on storage.objects;
create policy "portfolio admin delete own" on storage.objects for delete to authenticated using (
  bucket_id='portfolio-media' and (select public.is_portfolio_admin())
  and (storage.foldername(name))[1]=(select auth.uid())::text
);
commit;
