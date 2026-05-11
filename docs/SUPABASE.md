# Supabase Setup — Phase 3

Supabase is optional. Without it the site runs in Phase 1 mode: the memory form
guides visitors to email the family, and static fallback tributes are shown.
The admin panel shows a setup guide instead of the moderation UI.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** and run the full contents of `supabase/schema.sql`.
   This creates all tables, RLS policies, storage policies, and the photo cleanup trigger.
3. Create a Supabase Auth user for the family admin (Dashboard → Authentication → Users → Invite).
4. Insert that user's UUID into the `admin_users` table:

```sql
insert into public.admin_users (user_id, display_name)
values ('AUTH_USER_UUID_HERE', 'Family Admin');
```

---

## 2. Create storage buckets

Create three buckets in Dashboard → Storage → New bucket:

| Bucket | Access | Max size | Notes |
|--------|--------|----------|-------|
| `portraits` | Private | 10 MB | Family portrait photos |
| `gallery` | Private | 20 MB | Gallery album photos |
| `memories` | Private | 10 MB | Visitor memory author photos |

**Required dashboard action for `memories` bucket:**
After creating it, click Edit → set **Allowed MIME types** to:
```
image/jpeg, image/png, image/webp
```
This enforces file-type validation server-side, independent of the client-side check.

---

## 3. Environment variables

Add these to GitHub Actions repository secrets and to a local `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The GitHub Actions workflow already sets `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`.
Do not add `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable — it must never reach the browser.

---

## 4. Supabase Auth hardening

Do these steps in the Supabase dashboard before going live:

| Setting | Location | Action |
|---------|----------|--------|
| Email enumeration protection | Auth → Settings | Enable "Protect against email enumeration" |
| MFA for admin account | Account → Security | Enable two-factor authentication |
| Rate limiting | Auth → Settings | Review sign-in attempt limits (default: 5 per hour) |

---

## 5. Security model

| Actor | Can do |
|-------|--------|
| Anonymous visitor | Read approved memories, gallery, timeline; submit pending memory + optional photo |
| Admin (authenticated) | Read all content including pending; approve or remove posts; delete photos |
| Database trigger | Auto-deletes Storage photo when post status → `removed` |

Key RLS rules enforced at the database level:
- Visitors can only insert memories with `status = 'pending'` — they cannot self-approve
- Visitors can only read memories where `status = 'approved'`
- Storage photos are only readable when their associated post is approved
- Admin access verified by `is_admin()` which checks `auth.uid()` against `admin_users`

---

## 6. Upgrading an existing project

If you ran an earlier version of the schema, apply the incremental migration:

```bash
supabase/add-memory-photo-support.sql
```

This adds the `photo_path` column to `memory_posts` and the storage policies for
the `memories` bucket.

---

## 7. Moving to a server (Phase 4)

Migrate to Vercel and add Next.js Route Handlers when you need:

- IP-based rate limiting (the current client-side localStorage limit is bypassable)
- Private API keys (OpenAI, email notifications)
- Signed photo upload flows
- Event RSVP with email confirmations
- Scheduled anniversary reminders
