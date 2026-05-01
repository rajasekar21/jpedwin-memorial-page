# Memorial Website Platform

A calm, respectful, production-ready memorial website that begins as a lightweight GitHub Pages static site and can evolve into a Supabase-backed memories platform.

## What is included

- Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- Static export for GitHub Pages
- Responsive memorial sections: hero, biography, timeline, gallery, tributes, family message, events, footer
- Dark mode, keyboard-friendly controls, semantic HTML, reduced-motion support
- Gallery filtering and lightbox
- Phase 1 offline memory submission guidance
- Phase 3 Supabase-ready memory moderation and admin page
- SEO metadata, sitemap, robots, OpenGraph image
- GitHub Actions deployment workflow
- GoDaddy DNS and Supabase setup documentation

## Edit memorial content

Update family-approved content in:

```text
src/data/memorial.ts
```

Replace images in:

```text
public/images/
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Deploy

See:

- `docs/DEPLOYMENT.md`
- `docs/GODADDY_DOMAIN.md`
- `docs/SUPABASE.md`
- `docs/ROADMAP.md`

## Maintenance for family members

Keep changes small and reviewed. Update text in `src/data/memorial.ts`, add compressed images to `public/images`, and let GitHub Actions publish the site after changes are merged into `main`.
