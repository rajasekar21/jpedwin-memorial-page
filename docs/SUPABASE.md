# Supabase Setup Guide

Supabase is optional. Without it the site runs in Phase 1 mode: the memory form
guides visitors to email the family, and static fallback content is shown.
The admin panel shows a setup guide instead of the moderation UI.

---

## Quick-start checklist

Run these in order in the Supabase SQL editor:

- [ ] `supabase/schema.sql` — core tables, RLS, storage policies, triggers
- [ ] `supabase/add-family-upload.sql` — family_members table + gallery upload RLS
- [ ] `supabase/add-rsvp.sql` — RSVP attendance table + RLS
- [ ] `supabase/register-family-members.sql` — register Sweetline Priya & Angeline Gunavathy (after inviting them)

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** and run the full contents of `supabase/schema.sql`.
   This creates all tables, RLS policies, storage policies, and the photo cleanup trigger.
3. Then run `supabase/add-family-upload.sql` to create the `family_members` table and gallery upload policies.
4. Then run `supabase/add-rsvp.sql` to create the `rsvp_attendance` table for event RSVPs.

---

## 2. Create storage buckets

Create three buckets in Dashboard → Storage → New bucket:

| Bucket | Access | Max size | Notes |
|--------|--------|----------|-------|
| `portraits` | Private | 10 MB | Family portrait photos |
| `gallery` | Private | 20 MB | Gallery album photos (family uploads) |
| `memories` | Private | 10 MB | Visitor memory author photos |

**Required dashboard action for `memories` bucket:**
After creating it, click Edit → set **Allowed MIME types** to:
```
image/jpeg, image/png, image/webp
```
This enforces file-type validation server-side, independent of the client-side check.

---

## 3. Environment variables

Add these to GitHub Actions repository secrets (Settings → Secrets → Actions) and to a local `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CONTACT_EMAIL=sweetlinepriya.edwin@gmail.com
```

The anon key is safe to expose in the browser — all access is controlled by Row Level Security.
**Never** set `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable.

After adding secrets, push any small change to `main` to trigger a new GitHub Actions build.
The environment variables are baked in at build time — a new build is required after adding secrets.

---

## 4. Register the admin account

1. In Supabase Dashboard → **Authentication → Users**, click **Invite user** and enter the admin email.
2. Accept the invitation from the email received.
3. Copy the admin's **UID** from the Users list.
4. Run in the SQL editor:

```sql
insert into public.admin_users (user_id, display_name)
values ('ADMIN_UUID_HERE', 'Family Admin');
```

The admin can then sign in at `https://www.edwinchelliah.com/admin`.

> **Tip:** If you sign in at `/admin` and see "Access denied", the page will show
> the exact SQL insert statement pre-filled with your UID — just copy and run it.

---

## 5. Register family members (gallery upload)

Family members can upload photos at `/upload` after being registered.

**Steps:**

1. In Supabase Dashboard → **Authentication → Users**, click **Invite user**.
2. Enter Sweetline Priya's email and send the invitation. Repeat for Angeline Gunavathy.
3. Each person receives an email — once they accept, their row appears in the Users list.
4. Copy each person's **UID** from the Users list.
5. Open `supabase/register-family-members.sql`, replace the two placeholder UUIDs with the real ones.
6. Run the updated SQL in **SQL Editor**.

They can then sign in at `https://www.edwinchelliah.com/upload`.

To add more family members in future:

```sql
insert into public.family_members (user_id, display_name)
values ('THEIR_AUTH_UUID', 'Their Name');
```

---

## 6. RSVP attendance

Visitors can RSVP for in-person remembrance events from the Events section on the homepage.
RSVPs are stored in the `rsvp_attendance` table and visible in the admin panel under the **RSVP** tab.

The RSVP form captures:
- Name (required)
- Email (optional, for confirmation)
- Number of guests (1–10)
- Message (optional)

**Schema file:** `supabase/add-rsvp.sql`

---

## 7. Supabase Auth hardening

Do these steps in the Supabase dashboard before going live:

| Setting | Location | Action |
|---------|----------|--------|
| Email enumeration protection | Auth → Settings | Enable "Protect against email enumeration" |
| MFA for admin account | Account → Security | Enable two-factor authentication |
| Rate limiting | Auth → Settings | Review sign-in attempt limits (default: 5 per hour) |

---

## 8. Security model

| Actor | Can do |
|-------|--------|
| Anonymous visitor | Read approved memories, gallery, timeline; submit pending memory + optional photo; RSVP for events |
| Family member (authenticated) | Upload photos to gallery bucket (pending review) |
| Admin (authenticated + in admin_users) | Read all content including pending; approve or remove posts; delete photos; view all RSVPs |
| Database trigger | Auto-deletes Storage photo when post status → `removed` |

Key RLS rules enforced at the database level:
- Visitors can only insert memories with `status = 'pending'` — they cannot self-approve
- Visitors can only read memories where `status = 'approved'`
- Storage photos are only readable when their associated post is approved
- Admin access verified by `is_admin()` which checks `auth.uid()` against `admin_users`
- Family members can only read/upload to their own gallery submissions
- RSVPs are publicly insertable; only admins can read the full list

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Admin page shows "Admin setup pending" | Supabase env vars not in build | Add secrets to GitHub Actions, push a new commit to trigger rebuild |
| Admin page shows "Database setup incomplete" | `admin_users` table not created | Run `supabase/schema.sql` in SQL editor |
| Admin page shows "Access denied" | User not in `admin_users` table | Run the INSERT shown on screen, or manually insert the UUID |
| Upload page shows database error | `family_members` table not created | Run `supabase/add-family-upload.sql` in SQL editor |
| Upload page shows "not authorised" | User not in `family_members` table | Run `supabase/register-family-members.sql` with correct UUIDs |
| RSVP form not saving | `rsvp_attendance` table not created | Run `supabase/add-rsvp.sql` in SQL editor |
| Memory form shows Phase 1 message | Supabase not configured | Expected; submissions go to family email |

---

## 10. Upgrading an existing project

Apply incremental SQL migrations in order:

```
supabase/schema.sql                  ← run first (core schema)
supabase/add-family-upload.sql       ← family members + gallery upload
supabase/add-rsvp.sql                ← RSVP attendance table
supabase/register-family-members.sql ← after inviting family members
```
