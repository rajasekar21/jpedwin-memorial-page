# Roadmap

## Phase 1 — Static memorial ✅ Complete

- Static Next.js 16 export on GitHub Pages
- Bilingual English and Tamil content (`en.ts` / `ta.ts`)
- Portrait, gallery placeholder SVGs, biography, timeline, tributes, events
- Hero with ✝ cross symbol, birth/death years, quote
- Phase 1 offline memory submission: form validates and guides visitors to email the family
- Honeypot spam trap, localStorage rate limiting, Zod validation, MIME-type photo check
- SEO: OpenGraph, Twitter Card, JSON-LD structured data (Person, WebSite, WebPage, Event)
- Sitemap, robots.txt, `_headers` security file
- PWA: manifest, icon-192.png, icon-512.png, theme colour
- Security: CSP via `<meta http-equiv>`, Referrer-Policy, Permissions-Policy
- Mild lavender brand colour (`#f0e8ff`) throughout
- 49 passing Jest tests

## Phase 2 — Custom domain ✅ Complete

- GoDaddy DNS records pointing to GitHub Pages IPs
- `CNAME` file in the published site
- HTTPS enforced via GitHub Pages (Let's Encrypt)
- WWW canonical redirect from apex domain

## Phase 3 — Dynamic platform ✅ Complete

- Supabase PostgreSQL with Row Level Security
- Memory submissions go into a moderated `pending` queue
- Admin panel at `/admin/`: Supabase Auth sign-in, approve/remove posts and photos
- Author photo uploads to Supabase Storage `memories` bucket (5 MB, JPEG/PNG/WebP)
- Approved photos displayed as signed URLs with 1-hour TTL
- Auto-delete orphaned storage objects via DB trigger when post status → `removed`
- Visitor counter via Supabase RPC with localStorage fallback
- Graceful degradation: all Supabase features fall back to Phase 1 static content when env vars absent
- Admin panel auth hardening: verifies `admin_users` membership after sign-in
  - Shows "Database setup incomplete" if schema not run
  - Shows "Access denied" with pre-filled SQL INSERT if user not in `admin_users`

## Phase 4 — Advanced preservation ✅ Complete

- **QR code page** (`/qr/`): printable QR card for funeral booklets and remembrance programmes
  - SVG QR code (react-qr-code, error correction H)
  - Download as PNG (canvas export)
  - Print-optimised CSS (white/black, hidden nav)
  - Bilingual labels (English + Tamil)
  - Footer link: "Print QR code"

- **Gallery upload for family members** (`/upload/`):
  - Supabase Auth sign-in (restricted to registered family members)
  - Upload to `gallery` bucket under album folders: `memories/`, `recent/`, `retirement/`, `mentor/`
  - Inserts `gallery_photos` row with `status: 'pending'`
  - My submissions grid with signed URLs and status badges
  - Diagnostic messages for missing tables, unregistered users
  - Registered members: Sweetline Priya, Angeline Gunavathy
  - Admin gallery tab: thumbnails, approve/remove, signed URLs

- **RSVP for remembrance events**:
  - Per-event RSVP form (name, email, guest count, message)
  - Shown for in-person events; hidden for online events
  - `rsvp_attendance` Supabase table with public insert / admin read RLS
  - Phase 1 fallback: directs visitors to family email
  - Admin RSVP tab: all responses grouped by event, guest totals table

- **Content updates**:
  - Death date updated to 6 June 2025 everywhere
  - Annual Remembrance Gathering: Every June (was April)
  - Family contact email: sweetlinepriya.edwin@gmail.com
  - Tamil hero eyebrow text shortened and made fully responsive

## Phase 5 — Future enhancements

- Privacy-friendly analytics (Plausible or Fathom)
- Anniversary email reminders to subscribed family members
- Email confirmations for RSVPs (requires server layer)
- AI-assisted biography and memorial summary generation
- Optional background music toggle with explicit user consent
- Family tree visualisation
- IP-based rate limiting (requires Vercel + Route Handlers)
