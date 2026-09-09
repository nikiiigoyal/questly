-- ====================================================================
-- QUESTLY: SUPABASE SETUP SCRIPT
-- Run this in the Supabase Dashboard -> SQL Editor -> Click "Run"
-- ====================================================================

-- 1. Create the user_progress table
create table if not exists public.user_progress (
  user_id uuid references auth.users on delete cascade not null primary key,
  xp integer default 0 not null,
  streak integer default 0 not null,
  quests_done text[] default array[]::text[] not null,
  last_active date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) for data protection
alter table public.user_progress enable row level security;

-- 3. Policy: Users can only read their own progress record
create policy "Users can view their own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

-- 4. Policy: Users can insert their own progress record
create policy "Users can insert their own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Users can update their own progress record
create policy "Users can update their own progress"
  on public.user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Helper function to auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_user_progress_updated
  before update on public.user_progress
  for each row execute function public.handle_updated_at();

-- ====================================================================
-- DONE! Your Supabase database is ready to store streaks and progress.
-- ====================================================================
