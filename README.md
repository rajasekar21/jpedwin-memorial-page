# J.P. Edwin Chelliah Memorial Webpage

A calm, respectful, production-ready memorial website hosted at **[www.edwinchelliah.com](https://www.edwinchelliah.com)**.

Built with Next.js static export and deployed via GitHub Pages with a custom GoDaddy domain.

## Live Site

**https://www.edwinchelliah.com**

## What is included

- Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- Static export for GitHub Pages with custom domain
- Responsive memorial sections: hero, biography, timeline, gallery, tributes, family message, events, footer
- Bilingual English and Tamil memorial content with a header language switcher
- Tamil-specific typography and spacing support for readable Tamil text and poetry
- Dark mode, keyboard-friendly controls, semantic HTML, reduced-motion support
- Gallery filtering and lightbox
- Phase 1 offline memory submission guidance
- Phase 3 Supabase-ready memory moderation and admin page
- SEO metadata, sitemap, robots, OpenGraph image
- GitHub Actions deployment workflow
- GoDaddy DNS and Supabase setup documentation

## Edit memorial content

English and Tamil content are managed separately:

```text
src/data/memorial-content/en.ts
src/data/memorial-content/ta.ts
```

Shared content types and language wiring live in:

```text
src/data/memorial-content/types.ts
src/data/memorial-content/index.ts
src/data/memorial.ts
```

The homepage uses the bilingual content through:

```text
src/components/home-page.tsx
src/components/theme-provider.tsx
```

Replace images in:

```text
public/images/
```

Tamil text should be entered directly as Unicode Tamil. Preserve poetry line breaks in the content strings, and use the existing Tamil language view to verify spacing on mobile and desktop.

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

Pushing to `main` automatically triggers GitHub Actions which builds and deploys the site to GitHub Pages at [www.edwinchelliah.com](https://www.edwinchelliah.com).

See also:

- `docs/DEPLOYMENT.md`
- `docs/GODADDY_DOMAIN.md`
- `docs/SUPABASE.md`
- `docs/ROADMAP.md`

## GoDaddy DNS Configuration

Add these records in your GoDaddy DNS settings:

| Type  | Name | Value                   | TTL  |
|-------|------|-------------------------|------|
| CNAME | www  | rajasekar21.github.io   | 1hr  |
| A     | @    | 185.199.108.153         | 1hr  |
| A     | @    | 185.199.109.153         | 1hr  |
| A     | @    | 185.199.110.153         | 1hr  |
| A     | @    | 185.199.111.153         | 1hr  |

## Maintenance for family members

Keep changes small and reviewed. Update English text in `src/data/memorial-content/en.ts`, Tamil text in `src/data/memorial-content/ta.ts`, add compressed images to `public/images`, and let GitHub Actions publish the site after changes are merged into `main`.
