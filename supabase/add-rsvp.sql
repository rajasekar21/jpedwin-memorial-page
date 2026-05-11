-- RSVP attendance table for remembrance events
-- Run this in the Supabase SQL editor after schema.sql

create table if not exists rsvp_attendance (
  id          uuid primary key default gen_random_uuid(),
  event_title text             not null,
  name        text             not null check (char_length(trim(name)) >= 2),
  email       text,
  guest_count integer          not null default 1 check (guest_count between 1 and 20),
  message     text,
  created_at  timestamptz      not null default now()
);

-- Row-level security
alter table rsvp_attendance enable row level security;

-- Anyone (anonymous visitor) can submit an RSVP
create policy "Public RSVP insert"
  on rsvp_attendance for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admin users can read all RSVPs
create policy "Admin reads RSVPs"
  on rsvp_attendance for select
  to authenticated
  using (
    exists (
      select 1 from admin_users where user_id = auth.uid()
    )
  );
