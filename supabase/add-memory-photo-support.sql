alter table public.memory_posts
add column if not exists photo_path text;

-- Run this after creating a private Storage bucket named "memories".
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public uploads memory photos'
  ) then
    create policy "Public uploads memory photos" on storage.objects for insert with check (
      bucket_id = 'memories'
      and auth.role() = 'anon'
      and (storage.foldername(name))[1] = 'memory-authors'
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public reads memory photos'
  ) then
    create policy "Public reads memory photos" on storage.objects for select using (
      bucket_id = 'memories'
      and (storage.foldername(name))[1] = 'memory-authors'
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins manage memory photos'
  ) then
    create policy "Admins manage memory photos" on storage.objects for all using (
      bucket_id = 'memories'
      and public.is_admin()
    ) with check (
      bucket_id = 'memories'
      and public.is_admin()
    );
  end if;
end $$;
