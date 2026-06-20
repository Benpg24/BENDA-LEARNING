-- Benda Training — Supabase schema
-- Run ONCE in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent).

-- 1. Profiles — one row per staff member (name + role)
-- NOTE: this project already had a `profiles` table with a required `email`
-- column, so the insert below provides it. (create-if-not-exists is a no-op
-- on the existing table; columns shown here match what's live.)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

-- 2. Progress — one row per staff member; their quiz/scenario progress as JSON
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- 3. Access — logged-in users need table-level grants (the pre-existing tables
--    were missing these), THEN row-level security locks them to their own rows.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.progress to authenticated;

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "read own profile"   on public.profiles;
drop policy if exists "read own progress"   on public.progress;
drop policy if exists "insert own progress" on public.progress;
drop policy if exists "update own progress" on public.progress;

create policy "read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "read own progress"  on public.progress for select using (auth.uid() = user_id);
create policy "insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.progress for update using (auth.uid() = user_id);

-- 4. Auto-create a profile whenever a new user is added (dashboard or otherwise).
--    Name comes from the user's "full_name" metadata, else the email prefix.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Managers — let users whose role is 'manager'/'admin' read ALL staff data
--    (security-definer helper avoids RLS recursion on the profiles table).
create or replace function public.is_manager()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('manager','admin'));
$$;

drop policy if exists "managers read all profiles" on public.profiles;
drop policy if exists "managers read all progress" on public.progress;
create policy "managers read all profiles" on public.profiles for select using (public.is_manager());
create policy "managers read all progress" on public.progress for select using (public.is_manager());
