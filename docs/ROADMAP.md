# Roadmap

## Phase 1 — Static memorial ✅ Complete

- Static Next.js 16 export on GitHub Pages
- Bilingual English and Tamil content (`en.ts` / `ta.ts`)
- Portrait, gallery placeholder SVGs, biography, timeline, tributes, events
- Phase 1 offline memory submission: form validates and guides visitors to email the family
- Honeypot spam field, localStorage rate limiting, Zod validation
- SEO: OpenGraph, Twitter Card, JSON-LD structured data, sitemap, robots
- PWA: manifest, icons, theme colour
- Security: CSP, Referrer-Policy, Permissions-Policy via `public/_headers`
- 49 passing Jest tests

## Phase 2 — Custom domain ✅ Complete

- GoDaddy DNS records pointing to GitHub Pages IPs
- `CNAME` file in the published site
- HTTPS enforced via GitHub Pages
- WWW canonical redirect

## Phase 3 — Dynamic platform ✅ Complete

- Supabase PostgreSQL with Row Level Security
- Memory submissions go into a moderated `pending` queue
- Admin panel at `/admin/`: Supabase Auth sign-in, approve / remove posts, photo moderation
- Author photo uploads to Supabase Storage `memories` bucket (5 MB, JPEG/PNG/WebP)
- Approved photos displayed as signed URLs with 1-hour TTL
- Auto-delete orphaned photos via DB trigger when post is set to `removed`
- Visitor counter via Supabase RPC with localStorage fallback
- Graceful degradation: all Supabase features fall back to Phase 1 static content when env vars are absent
- Admin panel auth hardening: verifies `admin_users` table membership after sign-in; shows clear error with SQL fix if not authorised

## Phase 4 — Advanced preservation ✅ Complete

- QR code sharing for printed funeral and remembrance programmes (`/qr` page, PNG download, print CSS)
- Gallery upload workflow for family members (`/upload` page, authenticated, pending review)
  - Family members database (`family_members` table, RLS)
  - Registered: Sweetline Priya, Angeline Gunavathy (pending UUID registration)
  - Upload page shows setup error and SQL instructions if tables not configured
- RSVP for remembrance events (`rsvp_attendance` Supabase table, per-event form, admin RSVP tab)
- Family contact email: `sweetlinepriya.edwin@gmail.com`
- Annual Remembrance Gathering updated to Every June
- Responsive Tamil hero eyebrow text across mobile, tablet, laptop

## Phase 5 — Future enhancements

- Privacy-friendly analytics (Plausible or Fathom)
- Anniversary email reminders to subscribed family members
- AI-assisted biography and memorial summary generation
- Optional background music toggle with explicit user consent
- Family tree visualisation
- IP-based rate limiting (requires server layer — Vercel + Route Handlers)
- Email confirmations for RSVPs
