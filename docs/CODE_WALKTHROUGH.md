# Code Walkthrough — edwinchelliah.com

This document traces every file that executes, in the order it runs — from the first config
file Next.js reads at build time, through the static HTML generation, to every browser-side
effect that fires when a visitor opens the page.

---

## How this codebase boots

```
next.config.js          ← 1. Next.js reads this before anything else
src/app/layout.tsx      ← 2. Root HTML shell — wraps every page
src/app/page.tsx        ← 3. Home-page server component — builds JSON-LD
src/components/home-page.tsx  ← 4. Bilingual client component — the full UI
                              (all other components mount inside here)
```

The site is a **static export** (`output: 'export'`). Next.js runs the above chain at
build time, writes plain HTML files to `out/`, and GitHub Pages serves them.
There is no Node server at runtime — Supabase is called directly from the browser.

---

## Step 1 — `next.config.js`

**First file Next.js reads. Runs at build time only.**

```js
const nextConfig = {
  output: 'export',        // produce out/ with plain HTML — no server needed
  trailingSlash: true,     // out/admin/index.html served at /admin/
  reactStrictMode: true,
  images: { unoptimized: true },  // required for static export
  basePath: '',
  env: {
    NEXT_PUBLIC_SITE_URL:      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edwinchelliah.com',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sweetlinepriya.edwin@gmail.com',
    NEXT_PUBLIC_BASE_PATH:     ''
  }
};
```

`NEXT_PUBLIC_*` values are substituted into the JavaScript bundle at build time.
Changing a GitHub Actions secret only takes effect after a new build.

---

## Step 2 — `src/lib/site.ts`

**Imported by layout, structured-data, and QR card. Resolves early.**

```ts
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edwinchelliah.com'
};

export function withBasePath(path: string) { ... }
```

`siteConfig.url` is the single source of truth for the canonical URL used in
OpenGraph tags, JSON-LD schemas, the sitemap, and the QR code.

---

## Step 3 — `src/lib/supabase.ts`

**Imported by every component that touches live data. Runs at module load.**

```ts
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } })
  : null;
```

If the two `NEXT_PUBLIC_SUPABASE_*` env vars are absent from the build, `supabase`
is `null` and every component falls back to Phase 1 static mode gracefully.
This single boolean gates all live features.

---

## Step 4 — `src/data/memorial-content/types.ts`

**Pure TypeScript type definitions. No runtime cost.**

Defines `MemorialContent` — the shared contract that both language files must satisfy.
If a key is missing from `en.ts` or `ta.ts`, TypeScript refuses to compile.

---

## Step 5 — `src/data/memorial-content/en.ts` and `ta.ts`

**Content modules. Evaluated once at module load.**

All text, icons, and structured data for both languages live here.
Each file exports a single `MemorialContent` object — 300+ lines of bilingual content,
timeline entries, gallery photo metadata, tribute messages, and all form labels.

Key sections:

| Key | Purpose |
|-----|---------|
| `memorialProfile` | Full name, dates, portrait path, biography, quote, values |
| `timeline` | Year, title, description, Lucide icon per life milestone |
| `achievements` | Three "About" cards with Lucide icon |
| `galleryPhotos` | Static fallback photos shown before Supabase loads |
| `tributes` | Static fallback tributes |
| `events` | Title, date, location, details for each remembrance event |
| `rsvp` | All labels for the per-event RSVP form |
| `form` | Memory submission form labels and messages |
| `upload` | Family photo upload page labels |
| `qr` | QR code page labels |
| `footer` | Footer labels including family contact |

---

## Step 6 — `src/data/memorial-content/index.ts`

**Wires the two language files together.**

```ts
export const memorialContent: Record<Language, MemorialContent> = {
  en: englishContent,
  ta: tamilContent
};

export const defaultLanguage: Language = 'en';
export const defaultContent  = memorialContent['en'];

// Named convenience exports used by non-bilingual parts (structured-data, QR card)
export const memorialProfile = defaultContent.memorialProfile;
export const events          = defaultContent.events;
```

---

## Step 7 — `src/data/memorial.ts`

**Thin re-export. Single import path for the rest of the codebase.**

```ts
export { achievements, defaultContent, events, memorialContent, ... }
  from './memorial-content';
```

Every component imports from `@/data/memorial`, not directly from the content files.

---

## Step 8 — `src/lib/structured-data.ts`

**Generates JSON-LD schemas. Runs at build time as part of page generation.**

Four functions called in `page.tsx`:

| Function | Schema.org type | Content |
|----------|----------------|---------|
| `personSchema()` | `Person` | J.P. Edwin Chelliah — name, bio, birth/death dates, values |
| `webSiteSchema()` | `WebSite` | Site name, description, canonical URL |
| `memorialPageSchema()` | `WebPage` | Page title, breadcrumb |
| `eventsSchema()` | `Event[]` | One entry per remembrance event |

The schemas are inlined into the HTML as `<script type="application/ld+json">` by `home-page.tsx`.
Search engines (Google) use them to display rich results.

---

## Step 9 — `src/app/layout.tsx`

**Root layout. Wraps every page. Runs once at build time per route.**

Responsibilities:

1. **Metadata** — title, description, OpenGraph, Twitter Card
2. **Viewport** — device-width, color-scheme light/dark
3. **Theme colour** — `#f0e8ff` light / `#171225` dark (browser tab and PWA)
4. **CSP** — Content Security Policy built dynamically:
   - If Supabase is configured: `connect-src 'self' <supabase-url>` and `img-src 'self' blob: <supabase-url>`
   - Otherwise: `connect-src 'self'` and `img-src 'self' blob:`
5. **PWA meta** — manifest link, apple-touch-icon, apple-mobile-web-app-*
6. **ErrorBoundary** — catches React render errors and shows a fallback instead of a blank page
7. **`<html lang="en">`** — `lang` attribute; `home-page.tsx` updates it to `"ta"` when Tamil is active

```tsx
export default function RootLayout({ children }) {
  const csp = [...].join('; ');
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        ...
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## Step 10 — `src/app/page.tsx`

**Home page server component. The entry point for the `/` route.**

```tsx
const jsonLd = [personSchema(), webSiteSchema(), memorialPageSchema(), ...eventsSchema()];

export default function Home() {
  return <HomePage jsonLd={jsonLd} />;
}
```

This is the only server component in the main page tree.
It builds the JSON-LD array at build time and passes it down as a prop.

---

## Step 11 — `src/components/home-page.tsx`

**The main UI. This is where all visible content is assembled.**

Marked `'use client'` — React renders the initial HTML at build time (static generation),
then hydrates in the browser.

### State

```ts
const [language, setLanguage] = useState<Language>('en');
const content = memorialContent[language];  // switches all text on language change
```

### Effect — HTML lang attribute

```ts
useEffect(() => {
  document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
}, [language]);
```

Fires after every language toggle, keeping the `<html lang>` in sync for screen readers.

### Component tree rendered by `home-page.tsx`

```
<main>
  <a href="#main-content">      ← skip-to-content accessibility link
  <script type="application/ld+json">  ← JSON-LD inlined here
  <SiteHeader>                  ← fixed navigation header
  <section id="home">           ← hero: portrait, name, dates, quote, CTA buttons
  <Section id="about">          ← biography + achievement cards + values chips
    <FadeIn>                    ← scroll fade for biography text
    <FadeIn delay={0.1}>        ← scroll fade for achievement cards
  <Section id="timeline">       ← life milestone cards
    <FadeIn> × 6               ← one per timeline card, staggered
  <Section id="gallery">
    <GallerySupabase>           ← live photos from Supabase or static fallback
  <Section id="tributes">
    <MemoryTributes>            ← live or static fallback tributes
    <MemoryForm>                ← memory submission form
  <Section id="family">         ← family message
  <Section id="events">
    <article> × 2              ← event cards
      <RsvpForm>               ← RSVP form (in-person events only)
  <footer>
    <VisitorCount>              ← live or localStorage visitor counter
```

---

## Step 12 — `src/components/theme-provider.tsx` → `SiteHeader`

**Fixed navigation bar. Mounts immediately on hydration.**

Two effects run on mount:

```ts
// 1. ThemeToggle — reads localStorage to restore preferred theme
useEffect(() => {
  const stored = localStorage.getItem('theme');
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', stored ? stored === 'dark' : prefersDark);
}, []);

// 2. SiteHeader — IntersectionObserver for scroll spy
observerRef.current = new IntersectionObserver(entries => {
  // picks the section with the highest intersection ratio
  // updates URL hash via history.replaceState (no page reload)
  setActiveSection(topId);
}, { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-10% 0px -60% 0px' });
```

Also sets up a passive scroll listener to close the mobile menu when scrolling.

---

## Step 13 — `src/components/motion-wrapper.tsx` → `FadeIn`

**Scroll-triggered fade-in animation. Zero dependencies, pure CSS + JS.**

```ts
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.classList.add('is-visible');   // triggers CSS transition in globals.css
      observer.unobserve(el);           // fires once only
    }
  }, { rootMargin: '-40px' });
  observer.observe(el);
}, []);
```

CSS in `globals.css`:
```css
.fade-in            { opacity: 0; transform: translateY(14px); transition: 0.5s ease-out; }
.fade-in.is-visible { opacity: 1; transform: none; }

/* prefers-reduced-motion: skip animation */
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transform: none; transition: none; }
}
```

---

## Step 14 — `src/components/gallery-supabase.tsx`

**Fetches approved photos; falls back to static SVGs.**

```ts
const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackPhotos); // renders immediately

useEffect(() => {
  if (!isSupabaseConfigured || !supabase) return;  // Phase 1: stays on fallback
  client
    .from('gallery_photos').select(...).eq('status', 'approved')
    .then(async ({ data }) => {
      // generate signed URLs (1-hour TTL) for each approved photo
      const valid = withUrls.filter(p => p !== null);
      if (valid.length > 0) setPhotos(valid);  // replaces static fallback
    });
}, []);
```

The page renders with SVG placeholders on first paint. Supabase photos swap in after the
async fetch completes — no loading spinner shown because the fallback is already meaningful.

---

## Step 15 — `src/components/memory-tributes.tsx`

**Same pattern as gallery — live data over static fallback.**

Fetches `memory_posts` where `status = 'approved'` from Supabase.
Falls back to the static `tributes` array from `en.ts` / `ta.ts`.

---

## Step 16 — `src/components/memory-form.tsx`

**Visitor memory submission form.**

On submit:

```
1. Honeypot field check → if filled, silently succeed (bot trap)
2. Zod validation (name, relationship, message, photo MIME/size)
3. Rate-limit check → localStorage, 3 submissions per hour
4. If Supabase not configured → Phase 1: show guidance message with family email
5. If photo selected → upload to Supabase Storage `memories` bucket
6. Insert memory_posts row with status: 'pending'
7. On success → show success message; admin reviews in /admin/
```

---

## Step 17 — `src/components/rsvp-form.tsx`

**Per-event RSVP form. Shown for in-person events, hidden for Online.**

```ts
// Rendered conditionally in home-page.tsx:
{event.location !== 'Online' && event.location !== 'ஆன்லைன்' && (
  <RsvpForm eventTitle={event.title} labels={content.rsvp} contactEmail={...} />
)}
```

On submit:
1. If Supabase not configured → success message with family email (Phase 1 fallback)
2. Inserts into `rsvp_attendance` table — no moderation needed, just stored

---

## Step 18 — `src/components/visitor-count.tsx`

**Last effect to fire — after paint.**

```ts
useEffect(() => {
  if (isSupabaseConfigured && supabase) {
    // call Supabase RPC increment_site_visit_count()
    // returns new total; session-based (sessionStorage prevents double-counting)
  } else {
    // localStorage fallback
    // sessionStorage key prevents counting the same tab twice
  }
}, []);
```

---

## Full execution timeline

```
BUILD TIME (GitHub Actions / local npm run build)
─────────────────────────────────────────────────
next.config.js               ← env vars baked in
  └─ src/lib/site.ts         ← siteConfig URL resolved
  └─ src/data/memorial.ts    ← all bilingual content loaded
  └─ src/lib/structured-data.ts  ← JSON-LD schemas built
  └─ src/app/layout.tsx      ← HTML shell + CSP generated
  └─ src/app/page.tsx        ← home page pre-rendered to HTML
  └─ src/app/admin/page.tsx  ← /admin/ pre-rendered
  └─ src/app/upload/page.tsx ← /upload/ pre-rendered
  └─ src/app/qr/page.tsx     ← /qr/ pre-rendered
  └─ src/app/robots.ts       ← robots.txt generated
  └─ src/app/sitemap.ts      ← sitemap.xml generated
  → out/  (static HTML files uploaded to GitHub Pages)

BROWSER — first paint
─────────────────────
HTML shell loads (layout.tsx output)
  → ErrorBoundary mounts
  → HomePage hydrates
      → SiteHeader mounts
          → ThemeToggle reads localStorage → applies dark/light class
          → IntersectionObserver for scroll spy starts
          → scroll listener (mobile menu close) attaches
      → Hero section visible immediately (no FadeIn)
      → FadeIn observers attach to about/timeline/tributes sections

BROWSER — after first paint (async)
─────────────────────────────────────
GallerySupabase.useEffect    → fetch approved photos → swap in signed URLs
MemoryTributes.useEffect     → fetch approved tributes → replace static fallback
VisitorCount.useEffect       → increment counter (Supabase RPC or localStorage)
FadeIn.useEffect × N         → IntersectionObserver per fade-in element
```

---

## Data flow diagram

```
next.config.js
    │ env vars (NEXT_PUBLIC_*)
    ▼
src/lib/site.ts          src/lib/supabase.ts
    │ siteConfig.url          │ isSupabaseConfigured
    │                         │ supabase client (or null)
    ▼                         │
src/lib/structured-data.ts   │
    │ JSON-LD schemas          │
    ▼                         │
src/data/memorial.ts         │
    │ memorialContent          │
    │ (en + ta merged)         │
    ▼                         ▼
src/app/page.tsx ──────► src/components/home-page.tsx
    │ jsonLd prop               │ language state
    │                           │ content = memorialContent[language]
    ▼                           │
<script type="ld+json">        ├─► SiteHeader (theme, scroll spy, language switcher)
                               ├─► Section + FadeIn (about, timeline, family)
                               ├─► GallerySupabase ──► Supabase gallery_photos
                               ├─► MemoryTributes  ──► Supabase memory_posts
                               ├─► MemoryForm      ──► Supabase memory_posts (insert)
                               ├─► RsvpForm        ──► Supabase rsvp_attendance (insert)
                               └─► VisitorCount    ──► Supabase RPC / localStorage
```

---

## Other routes

| Route | Entry file | Server or client | Notes |
|-------|-----------|-----------------|-------|
| `/admin/` | `src/app/admin/page.tsx` | Server shell → client panel | `AdminPanel` checks `admin_users` after sign-in |
| `/upload/` | `src/app/upload/page.tsx` | Server shell → client form | `FamilyUpload` checks `family_members` after sign-in |
| `/qr/` | `src/app/qr/page.tsx` | Server shell → client card | `QrCard` uses `react-qr-code`; PNG download via canvas |

---

## Key design decisions

| Decision | Why |
|----------|-----|
| Static export (`output: 'export'`) | Zero server cost — GitHub Pages hosts for free; Supabase called from browser |
| `isSupabaseConfigured` boolean | Single check gates all live features; entire site works without Supabase |
| Language state in `home-page.tsx` | One `useState` drives all text — no context, no provider, no re-mount |
| Fallback-first data loading | Gallery and tributes render static content immediately; live data swaps in after fetch |
| IntersectionObserver for fade + scroll spy | No animation library dependency; respects `prefers-reduced-motion` |
| `'use client'` only where needed | `page.tsx`, `layout.tsx`, `section.tsx` are server components; only interactive components are client |
| Supabase anon key public | Safe by design — all access controlled by Row Level Security in the database |
