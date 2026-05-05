# Supabase Phase 3 Setup

## Create project

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Create buckets named `portraits`, `gallery`, and `memories`. Keep `memories` private, images-only, with a 10 MB limit.
4. Add a Supabase Auth user for the family admin.
5. Insert that user's UUID into `admin_users`.

```sql
insert into public.admin_users (user_id, display_name)
values ('AUTH_USER_UUID_HERE', 'Family Admin');
```

For an existing project that already ran the original schema, run `supabase/add-memory-photo-support.sql` after creating the `memories` bucket. It adds the optional author-photo column and Storage policies used by memory submissions.

## Environment variables

Add these to GitHub Actions repository secrets or local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ENABLE_DYNAMIC_MEMORIES=true
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in the browser or GitHub Pages build unless you later move privileged operations to server functions.

## Security model

- Public visitors can read only approved content.
- Public visitors can insert pending memories and guestbook entries.
- Public visitors can optionally upload a memory author photo; the public page only requests signed photo URLs for approved memories.
- Admins can approve, remove, and manage content.
- Input is length-limited and sanitized in the client; RLS enforces server-side access.
- Add CAPTCHA or a Supabase Edge Function if spam becomes a problem.

## Optional server evolution

Move to Vercel when you need:

- Strong IP-based rate limiting
- AI-generated summaries with private OpenAI keys
- Signed upload flows
- Event RSVP email notifications
- Scheduled anniversary reminders
