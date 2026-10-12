create table if not exists public.trust_centers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_name text not null,
  slug text not null unique,
  logo_url text,
  gdpr_enabled boolean not null default false,
  ccpa_enabled boolean not null default false,
  soc2_status text not null default 'in_progress'
    check (soc2_status in ('not_started', 'in_progress', 'compliant')),
  system_status text not null default 'operational'
    check (system_status in ('operational', 'degraded')),
  description text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists trust_centers_user_id_key on public.trust_centers (user_id);

alter table public.trust_centers enable row level security;

drop policy if exists "Trust centers are publicly readable" on public.trust_centers;
create policy "Trust centers are publicly readable"
  on public.trust_centers for select
  using (true);

drop policy if exists "Owners can create trust centers" on public.trust_centers;
create policy "Owners can create trust centers"
  on public.trust_centers for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update trust centers" on public.trust_centers;
create policy "Owners can update trust centers"
  on public.trust_centers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.trust_centers to anon, authenticated;
grant insert, update on public.trust_centers to authenticated;
