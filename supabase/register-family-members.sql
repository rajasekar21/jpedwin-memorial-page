-- Register family members for gallery photo uploads
-- ─────────────────────────────────────────────────────────────────────────────
-- BEFORE running this SQL, invite each person via:
--   Supabase Dashboard → Authentication → Users → Invite user
-- Enter their email and send the invitation.
-- Once they accept and their account appears in the Users list,
-- copy each person's UUID from the "UID" column and paste it below.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.family_members (user_id, display_name) values
  -- Replace the UUID below with Sweetline Priya's actual Auth UID
  ('00000000-0000-0000-0000-000000000001', 'Sweetline Priya'),
  -- Replace the UUID below with Angeline Gunavathy's actual Auth UID
  ('00000000-0000-0000-0000-000000000002', 'Angeline Gunavathy')
on conflict (user_id) do update set display_name = excluded.display_name;
