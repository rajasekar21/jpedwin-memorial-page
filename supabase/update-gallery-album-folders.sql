-- Update gallery storage upload policy for album-based folders.
-- Run this if your Supabase project already used the older family-uploads folder policy.

drop policy if exists "Family members insert gallery storage" on storage.objects;

create policy "Family members insert gallery storage" on storage.objects
  for insert with check (
    bucket_id = 'gallery'
    and public.is_family_member()
    and (storage.foldername(name))[1] in ('memories', 'recent', 'retirement', 'mentor')
  );
