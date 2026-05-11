# J.P. Edwin Chelliah — Digital Memorial

A calm, respectful, production-ready memorial website at **[www.edwinchelliah.com](https://www.edwinchelliah.com)**.

Built with Next.js 16 static export, deployed via GitHub Actions to GitHub Pages, with a custom GoDaddy domain and a Supabase backend for live memory submissions, gallery uploads, event RSVPs, and family moderation.

---

## Live site

**https://www.edwinchelliah.com**

| Page | URL | Purpose |
|------|-----|---------|
| Memorial home | `/` | Public — full bilingual memorial |
| Admin panel | `/admin/` | Family only — moderate memories, gallery, RSVPs |
| Family upload | `/upload/` | Family only — submit photos for review |
| QR code card | `/qr/` | Printable QR card for funeral programmes |

---

## What is included

### Core
- Next.js 16.2.6, TypeScript, Tailwind CSS, Lucide icons
- Static export (`output: export`) for GitHub Pages with custom domain
- PWA-ready: `manifest.json`, `icon-192.png`, `icon-512.png`, `favicon.svg`
- Mild lavender brand colour (`#f0e8ff`) throughout

### Memorial sections
- Hero with portrait, birth/death years with ✝ symbol, and quote
- Biography, life timeline, photo gallery, tributes, family message
- Remembrance events with per-event RSVP forms
- Footer with family contact email, visitor counter, QR code link

### Bilingual support
- English and Tamil content in separate files (`en.ts` / `ta.ts`)
- Language switcher in the header; Tamil-specific font sizing and line-height
- `lang` attribute on `<html>` updates dynamically

### Interactivity
- Dark mode, scroll-triggered fade animations (IntersectionObserver + CSS)
- Gallery filter tabs and lightbox modal
- Visitor counter (localStorage fallback → Supabase RPC)

### Memory submissions
- Phase 1 offline mode: form validates and guides visitors to email the family
- Phase 3 Supabase mode: submissions go into a moderated queue
- Honeypot spam trap, localStorage rate limiting (3 per hour), Zod validation, MIME-type photo check

### Event RSVP
- Per-event RSVP form (name, email, guest count, message)
- Stored in `rsvp_attendance` Supabase table
- Phase 1 fallback: directs visitors to email the family
- Admin RSVP tab shows all responses grouped by event with guest totals

### Gallery upload (family members)
- Family members sign in at `/upload/` and submit photos for review
- Photos stored in Supabase Storage `gallery` bucket
- Admin approves/removes via the Gallery tab in `/admin/`
- Registered family members: Sweetline Priya, Angeline Gunavathy

### Admin panel (`/admin/`)
- Supabase Auth sign-in (hidden from search crawlers)
- Three tabs: **Memories**, **Gallery**, **RSVP**
- Clear diagnostic messages: setup error, access denied (with pre-filled SQL), or dashboard
- Verifies user is in `admin_users` table before showing any data

### QR code (`/qr/`)
- Printable QR card for funeral booklets and remembrance programmes
- Scan-to-visit the full digital memorial
- Download as PNG or print directly from the browser

### SEO and performance
- OpenGraph + Twitter Card metadata, JSON-LD structured data (Person, WebSite, WebPage, Event)
- `sitemap.xml`, `robots.txt`, `_headers` security file
- Content Security Policy, Referrer-Policy, Permissions-Policy

### Tests
- Jest + React Testing Library: 49 tests across 7 suites

---

## Edit memorial content

All text is split by language:

```
src/data/memorial-content/en.ts   ← English text
src/data/memorial-content/ta.ts   ← Tamil text
src/data/memorial-content/types.ts
src/data/memorial-content/index.ts
src/data/memorial.ts              ← wires languages together
```

See `docs/EDITING_GUIDE.md` for a full walkthrough of changing colours, content, photos, and labels.

---

## Run locally

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run typecheck     # TypeScript check
npm run lint          # ESLint
npm run build         # Production build → out/
npm test              # Jest test suite
npm run test:coverage # Coverage report
```

To replicate the exact GitHub Pages build:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://www.edwinchelliah.com npm run build
```

---

## Deploy

Pushing to `main` triggers GitHub Actions → builds → deploys to GitHub Pages.

```bash
git add .
git commit -m "Your change"
git push origin main
```

Build status: **https://github.com/rajasekar21/jpedwin-memorial-page/actions**

See `docs/DEPLOYMENT.md` for full details.

---

## Enable Supabase

Add to GitHub Actions repository secrets (Settings → Secrets → Actions) and local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CONTACT_EMAIL=sweetlinepriya.edwin@gmail.com
```

After adding secrets, push a commit to `main` to trigger a rebuild — env vars are baked in at build time.

See `docs/SUPABASE.md` for the full setup checklist.

---

## GoDaddy DNS

| Type  | Name | Value                 | TTL |
|-------|------|-----------------------|-----|
| CNAME | www  | rajasekar21.github.io | 1hr |
| A     | @    | 185.199.108.153       | 1hr |
| A     | @    | 185.199.109.153       | 1hr |
| A     | @    | 185.199.110.153       | 1hr |
| A     | @    | 185.199.111.153       | 1hr |

See `docs/GODADDY_DOMAIN.md` for step-by-step instructions.

---

## Family contact

| Role | Email |
|------|-------|
| Primary contact | sweetlinepriya.edwin@gmail.com |

---

## Docs

| File | Contents |
|------|----------|
| `docs/EDITING_GUIDE.md` | Colours, content, photos, new sections, file map |
| `docs/DEPLOYMENT.md` | Build, deploy, folder structure, troubleshooting |
| `docs/GODADDY_DOMAIN.md` | DNS, HTTPS, WWW/apex setup |
| `docs/SUPABASE.md` | Full setup checklist, admin, upload, RSVP, security |
| `docs/ROADMAP.md` | Phase status and future features |
