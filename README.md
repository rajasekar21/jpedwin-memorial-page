# J.P. Edwin Chelliah — Digital Memorial

A calm, respectful, production-ready memorial website at **[www.edwinchelliah.com](https://www.edwinchelliah.com)**.

Built with Next.js 16 static export, deployed via GitHub Actions to GitHub Pages, with a custom GoDaddy domain.

---

## Live site

**https://www.edwinchelliah.com**

---

## What is included

**Core**
- Next.js 16.2.6, TypeScript, Tailwind CSS, Lucide icons
- Static export (`output: export`) for GitHub Pages with custom domain
- PWA-ready: `manifest.json`, `icon-192.png`, `icon-512.png`, `favicon.svg`

**Memorial sections**
- Hero with portrait, birth/death years with ✝ symbol, and quote
- Biography, life timeline, photo gallery, tributes, family message, remembrance events, footer

**Bilingual support**
- English and Tamil content managed in separate files (`en.ts` / `ta.ts`)
- Language switcher in the header; Tamil-specific font sizing and line-height
- `lang` attribute on `<html>` updates dynamically

**Interactivity**
- Dark mode, scroll-triggered fade animations (IntersectionObserver + CSS, no heavy library)
- Gallery filter tabs and lightbox modal
- Visitor counter (localStorage fallback, Supabase RPC when enabled)

**Memory submissions (Phase 1 + Phase 3)**
- Phase 1 offline mode: form validates and guides visitors to contact the family
- Phase 3 Supabase mode: submissions go into a moderated queue; admin panel for approve / remove
- Honeypot spam trap, localStorage rate limiting (3 per hour), Zod validation, MIME-type photo check

**Admin panel** (`/admin/`)
- Supabase Auth sign-in (blocked from search crawlers)
- Approve / remove memory posts and author photos
- Graceful setup guidance when Supabase is not configured

**SEO and performance**
- OpenGraph + Twitter Card metadata, structured data (JSON-LD: Person, WebSite, WebPage, Event)
- `sitemap.xml`, `robots.txt`, `_headers` security file
- Content Security Policy, Referrer-Policy, Permissions-Policy

**Tests**
- Jest + React Testing Library: 49 tests across 7 suites

---

## Edit memorial content

All text content is split by language:

```
src/data/memorial-content/en.ts   ← English text
src/data/memorial-content/ta.ts   ← Tamil text
src/data/memorial-content/types.ts
src/data/memorial-content/index.ts
src/data/memorial.ts              ← wires languages together
```

See `docs/EDITING_GUIDE.md` for a full walkthrough of changing colours, content, and photos.

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
npm run build         # Production build
npm test              # Jest test suite
npm run test:coverage # Coverage report
```

---

## Deploy

Pushing to `main` triggers GitHub Actions → builds → deploys to GitHub Pages at [www.edwinchelliah.com](https://www.edwinchelliah.com).

Check deployment status: https://github.com/rajasekar21/jpedwin-memorial-page/actions

See `docs/DEPLOYMENT.md` for full details.

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

## Enable Supabase (Phase 3)

Add to GitHub Actions secrets and local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

See `docs/SUPABASE.md` for full setup.

---

## Maintenance

Keep changes small and reviewed.

- Edit English text in `src/data/memorial-content/en.ts`
- Edit Tamil text in `src/data/memorial-content/ta.ts`
- Add compressed images to `public/images/`
- Commit and push to `main` — the site redeploys automatically within 2–3 minutes

---

## Docs

| File | Contents |
|------|----------|
| `docs/EDITING_GUIDE.md` | Colours, content, photos, file map |
| `docs/DEPLOYMENT.md` | Build, deploy, folder structure, troubleshooting |
| `docs/GODADDY_DOMAIN.md` | DNS, HTTPS, WWW/apex setup |
| `docs/SUPABASE.md` | Database schema, storage, RLS, environment variables |
| `docs/ROADMAP.md` | Phase status and future features |
