# Deployment Guide

## Architecture

The site is a static Next.js 16 export (`output: 'export'`) hosted on GitHub Pages with a custom GoDaddy domain.
All content is pre-rendered to HTML at build time. Supabase is called directly from the browser using
the public anon key and Row Level Security — no server is needed.

If a server-side layer is ever required (IP-based rate limiting, private API keys, email notifications),
migrate to Vercel and add Next.js Route Handlers.

---

## Site routes

| Route | File generated | Purpose |
|-------|---------------|---------|
| `/` | `out/index.html` | Public memorial homepage |
| `/admin/` | `out/admin/index.html` | Family admin panel (noindex) |
| `/upload/` | `out/upload/index.html` | Family photo upload (noindex) |
| `/qr/` | `out/qr/index.html` | Printable QR card for programmes |
| `/sitemap.xml` | `out/sitemap.xml` | Search engine sitemap |
| `/robots.txt` | `out/robots.txt` | Crawler rules |

---

## Folder structure

```
.github/workflows/deploy.yml        GitHub Actions CI/CD
docs/                               Guides: editing, DNS, Supabase, roadmap
public/                             Static assets served as-is
  images/                           Portrait, gallery, OG image, PWA icons
  _headers                          CDN security headers (Netlify / Cloudflare)
  CNAME                             Custom domain
  favicon.svg
  manifest.json
src/app/                            Next.js routes (/, /admin, /upload, /qr, robots, sitemap)
src/components/                     UI components
src/data/memorial-content/          Bilingual content (en.ts / ta.ts)
src/lib/                            site.ts, supabase.ts, validation.ts, structured-data.ts
supabase/                           SQL migration files
next.config.js                      Static export config
tailwind.config.ts                  Colour palette
```

---

## GitHub Pages setup

1. Push to `https://github.com/rajasekar21/jpedwin-memorial-page` (the canonical repo).
2. In GitHub → Settings → Pages, set **Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually from the Actions tab.
4. The site publishes at `https://www.edwinchelliah.com` (custom domain via CNAME).

The workflow file is `.github/workflows/deploy.yml` and runs on every push to `main`.

---

## Local development

```bash
npm install
npm run dev          # dev server at http://localhost:3000
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run build        # production static export to /out
npm test             # Jest (49 tests)
npm run test:coverage
```

To replicate the exact GitHub Pages build environment locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://www.edwinchelliah.com npm run build
```

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (build) | Canonical URL for metadata and sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Footer contact link (defaults to `sweetlinepriya.edwin@gmail.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 3+ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 3+ | Supabase public anon key |

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as GitHub Actions
repository secrets (Settings → Secrets → Actions) to enable live features.

**Important:** These variables are baked into the static HTML at build time.
If you add or change secrets, push a commit to `main` to trigger a fresh build.

Never set `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable.

---

## Security headers

The file `public/_headers` is served automatically by Netlify and Cloudflare Pages.
For GitHub Pages, configure equivalent headers at the CDN or hosting edge layer:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

A Content Security Policy is also set via `<meta http-equiv>` in `src/app/layout.tsx`
as a fallback for GitHub Pages.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank page on GitHub Pages | Missing `trailingSlash: true` or bad basePath | Confirm `trailingSlash: true` in `next.config.js` and `GITHUB_PAGES=true` in workflow |
| Images missing | Wrong path | Place files under `public/images/` and reference with a leading slash |
| Workflow fails on install | Dependency issue | Re-run the action; check `package.json` |
| Custom domain not serving HTTPS | DNS not propagated | Wait 30–60 min; disable and re-enable "Enforce HTTPS" in Pages settings |
| `/admin/` or `/upload/` shows "Admin setup pending" | Supabase env vars not in build | Add secrets to GitHub Actions, then push a commit to trigger a rebuild |
| `/admin/` shows "Database setup incomplete" | `admin_users` table not created | Run `supabase/schema.sql` in Supabase SQL editor |
| `/admin/` shows "Access denied" | User not in `admin_users` | Run the INSERT shown on screen (your UID is pre-filled) |
| `/upload/` shows database error | `family_members` table missing | Run `supabase/add-family-upload.sql` in Supabase SQL editor |
| `/upload/` shows "not authorised" | User not registered as family member | Run `supabase/register-family-members.sql` with correct UUIDs |
| RSVP not saving | `rsvp_attendance` table missing | Run `supabase/add-rsvp.sql` in Supabase SQL editor |
| Memory form shows Phase 1 message | Supabase not configured | Expected; submissions are directed to the family contact email |
