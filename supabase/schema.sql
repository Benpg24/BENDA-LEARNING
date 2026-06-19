-- Benda Training — Supabase schema
-- Run ONCE in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent).

-- 1. Profiles — one row per staff member (name + role)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
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

-- 3. Row Level Security — each person can only see/edit their OWN data
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
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Restrict sign-up to the company email domain (hard backstop; the app
--    also checks this for a friendly message). Change the domain if needed.
create or replace function public.enforce_email_domain()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) not like '%@bendamoto.com.au' then
    raise exception 'Only @bendamoto.com.au email addresses can sign up.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_email_domain_trigger on auth.users;
create trigger enforce_email_domain_trigger
  before insert on auth.users
  for each row execute function public.enforce_email_domain();
