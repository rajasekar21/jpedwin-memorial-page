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

## Phase 4 — Advanced preservation (future)

- Privacy-friendly analytics (Plausible or Fathom)
- QR code sharing for printed funeral and remembrance programmes
- Printable tribute page (print-optimised CSS layout)
- Anniversary email reminders to subscribed family members
- RSVP for remembrance events with Supabase attendance table
- AI-assisted biography and memorial summary generation
- Optional background music toggle with explicit user consent
- Family tree visualisation
- Gallery upload workflow for family members (authenticated upload without admin panel)
