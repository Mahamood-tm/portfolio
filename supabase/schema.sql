-- Run this in YOUR personal Supabase project: SQL Editor -> New query -> Run

create table if not exists public.interests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) <= 200),
  company     text not null check (char_length(company) between 1 and 150),
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists interests_created_at_idx on public.interests (created_at desc);

-- Lock the table down. No public policies are created, so the anon key
-- cannot read or write. Only the Express backend (service role key) can.
alter table public.interests enable row level security;
