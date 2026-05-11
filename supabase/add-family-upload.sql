-- Phase 4: Family member gallery upload workflow
-- Run this in the Supabase SQL Editor after the base schema.sql has been applied.

-- 1. Family members table --------------------------------------------------------
create table if not exists public.family_members (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at   timestamptz not null default now()
);

alter table public.family_members enable row level security;

create policy "Family members read own entry" on public.family_members
  for select using (user_id = auth.uid() or public.is_admin());

create policy "Admins manage family members" on public.family_members
  for all using (public.is_admin()) with check (public.is_admin());

-- 2. Helper function ------------------------------------------------------------
create or replace function public.is_family_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.family_members where user_id = auth.uid())
      or public.is_admin();
$$;

-- 3. Add uploaded_by to gallery_photos ------------------------------------------
alter table public.gallery_photos
  add column if not exists uploaded_by uuid references auth.users(id);

-- 4. RLS policies for gallery_photos -------------------------------------------
-- Family members can submit photos (pending only, must own the row)
create policy "Family members upload gallery photos" on public.gallery_photos
  for insert with check (
    public.is_family_member()
    and status = 'pending'
    and uploaded_by = auth.uid()
  );

-- Family members can see their own submissions (any status)
create policy "Family members read own gallery uploads" on public.gallery_photos
  for select using (
    uploaded_by = auth.uid()
    and public.is_family_member()
  );

-- 5. Storage policies for the gallery bucket ------------------------------------
-- Family members may upload to gallery/family-uploads/<filename>
create policy "Family members insert gallery storage" on storage.objects
  for insert with check (
    bucket_id = 'gallery'
    and public.is_family_member()
    and (storage.foldername(name))[1] = 'family-uploads'
  );

-- Family members may read their own uploaded files
create policy "Family members read own gallery storage" on storage.objects
  for select using (
    bucket_id = 'gallery'
    and public.is_family_member()
    and exists (
      select 1 from public.gallery_photos
      where storage_path = name
        and uploaded_by = auth.uid()
    )
  );

-- 6. Allow public to read approved gallery photos from storage ------------------
create policy "Public reads approved gallery storage" on storage.objects
  for select using (
    bucket_id = 'gallery'
    and exists (
      select 1 from public.gallery_photos
      where storage_path = name and status = 'approved'
    )
  );

-- 7. Register a family member (run once per invited user) -----------------------
-- insert into public.family_members (user_id, display_name)
-- values ('AUTH_USER_UUID_HERE', 'Family Member Name');
