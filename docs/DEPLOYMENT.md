# Deployment Guide

## Architecture overview

Phase 1 is a static Next.js export hosted on GitHub Pages. The site reads editable memorial content from `src/data/memorial.ts` and local images from `public/images`.

Phase 3 keeps GitHub Pages possible by using Supabase directly from the browser with Row Level Security. If a future server is needed for stronger rate limiting, private AI calls, or image transformations, migrate the same Next.js app to Vercel and add route handlers.

## Folder structure

```text
.github/workflows/deploy.yml   GitHub Pages CI/CD
docs/                          Deployment, DNS, and maintenance guides
public/images/                 Portrait, gallery, and OpenGraph assets
src/app/                       Next.js app routes
src/components/                UI and client components
src/data/memorial.ts           Family-editable memorial content
src/lib/                       Site, Supabase, and validation utilities
supabase/schema.sql            Database schema and RLS policies
```

## GitHub Pages setup

1. Create or open `https://github.com/rajasekar21/webpage-design`.
2. Push this project to the `main` branch.
3. In GitHub, open Settings -> Pages.
4. Under Build and deployment, choose GitHub Actions.
5. Run the `Deploy static memorial site` workflow or push to `main`.
6. The site will publish at `https://rajasekar21.github.io/webpage-design/`.

## Local commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

For GitHub Pages parity:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://rajasekar21.github.io/webpage-design npm run build
```

## Repository creation commands

```bash
git init
git branch -M main
git remote add origin https://github.com/rajasekar21/webpage-design.git
git add .
git commit -m "Build memorial website platform"
git push -u origin main
```

## Troubleshooting

- Blank page on GitHub Pages: confirm `GITHUB_PAGES=true` is set in the workflow and `next.config.js` uses the correct repo name.
- Images missing: place files under `public/images` and reference them with a leading slash in `src/data/memorial.ts`.
- Workflow fails during dependency install: rerun the action, then check that `package.json` has valid versions.
- Custom domain not serving HTTPS: wait for DNS propagation, then disable and re-enable Enforce HTTPS in GitHub Pages.
