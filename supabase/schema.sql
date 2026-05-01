create extension if not exists "pgcrypto";

create type public.content_status as enum ('pending', 'approved', 'removed');

create table public.memorial_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  birth_date date,
  remembrance_date date,
  biography text not null default '',
  family_message text not null default '',
  legacy_note text not null default '',
  updated_at timestamptz not null default now()
);

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  album text not null default 'Legacy',
  storage_path text not null,
  alt_text text not null,
  status public.content_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.memory_posts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  relationship text not null check (char_length(relationship) between 2 and 80),
  message text not null check (char_length(message) between 20 and 2000),
  status public.content_status not null default 'pending',
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  message text not null check (char_length(message) between 10 and 1000),
  status public.content_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  event_year text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0,
  status public.content_status not null default 'approved',
  created_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.memorial_profile enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.memory_posts enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.timeline_events enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "Public can read approved profile" on public.memorial_profile for select using (true);
create policy "Admins manage profile" on public.memorial_profile for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads approved photos" on public.gallery_photos for select using (status = 'approved');
create policy "Admins manage photos" on public.gallery_photos for all using (public.is_admin()) with check (public.is_admin());

create policy "Public submits memories" on public.memory_posts for insert with check (status = 'pending');
create policy "Public reads approved memories" on public.memory_posts for select using (status = 'approved');
create policy "Admins manage memories" on public.memory_posts for all using (public.is_admin()) with check (public.is_admin());

create policy "Public submits guestbook" on public.guestbook_entries for insert with check (status = 'pending');
create policy "Public reads approved guestbook" on public.guestbook_entries for select using (status = 'approved');
create policy "Admins manage guestbook" on public.guestbook_entries for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads approved timeline" on public.timeline_events for select using (status = 'approved');
create policy "Admins manage timeline" on public.timeline_events for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins read admins" on public.admin_users for select using (public.is_admin());

insert into public.memorial_profile (full_name, biography, family_message, legacy_note)
values (
  'R. Rajasekar',
  'Replace this with the approved family biography.',
  'Replace this with the family tribute message.',
  'Preserved with love by family and friends.'
);

-- Storage buckets to create in Supabase dashboard:
-- portraits: private, 10 MB limit, images only
-- gallery: private, 20 MB limit, images only
-- memories: private, 10 MB limit, images/documents
