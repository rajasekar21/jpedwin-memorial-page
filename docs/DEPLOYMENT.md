# Deployment Guide

## Architecture

The site is a static Next.js 16 export (`output: 'export'`) hosted on GitHub Pages.
All content is pre-rendered to HTML at build time. Supabase is called directly from
the browser using the public anon key and Row Level Security — no server is needed.

If a server-side layer is ever required (IP-based rate limiting, private API keys,
signed upload flows), migrate to Vercel and add Next.js Route Handlers.

---

## Folder structure

```
.github/workflows/deploy.yml   GitHub Actions CI/CD
docs/                          Guides: editing, DNS, Supabase, roadmap
public/                        Static assets served as-is
  images/                      Portrait, gallery, OG image, PWA icons
  _headers                     CDN security headers (Netlify / Cloudflare)
  CNAME                        Custom domain
  favicon.svg
  manifest.json
src/app/                       Next.js routes (/, /admin, robots.txt, sitemap.xml)
src/components/                UI components
src/data/memorial-content/     Bilingual content (en.ts / ta.ts)
src/lib/                       site.ts, supabase.ts, validation.ts, structured-data.ts
supabase/schema.sql            Database schema, RLS policies, storage policies, triggers
next.config.js                 Static export config
tailwind.config.ts             Colour palette
```

---

## GitHub Pages setup

1. Push to `https://github.com/rajasekar21/jpedwin-memorial-page` (the canonical repo).
2. In GitHub → Settings → Pages, set **Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.
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
repository secrets to enable live memory submissions and the admin panel.

Never set `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable.

---

## Security headers

The file `public/_headers` is served automatically by Netlify and Cloudflare Pages.
For GitHub Pages (which does not support custom response headers), configure equivalent
headers at the CDN or hosting edge layer:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank page on GitHub Pages | Confirm `GITHUB_PAGES=true` in the workflow and `trailingSlash: true` in `next.config.js` |
| Images missing | Place files under `public/images/` and reference them with a leading slash |
| Workflow fails on install | Re-run the action; check `package.json` has valid version ranges |
| Custom domain not serving HTTPS | Wait for DNS propagation, then disable and re-enable "Enforce HTTPS" in Pages settings |
| Admin or upload page shows "setup pending" | Supabase env vars not in build — add secrets to GitHub Actions, push a new commit |
| Admin page shows "Access denied" | User not in `admin_users` table — run the INSERT shown on screen |
| Upload page shows "database error" | Run `supabase/add-family-upload.sql` in Supabase SQL editor |
| Upload page shows "not authorised" | User not in `family_members` — run `supabase/register-family-members.sql` |
| Memory form shows Phase 1 message | Expected when Supabase is not configured; submissions go to family email |
