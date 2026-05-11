# Editing Guide — edwinchelliah.com

All edits go into `src/` or `public/`. After saving, commit and push to `main` — the site rebuilds and publishes automatically within 2–3 minutes.

---

## 1. Changing colours

### Colour palette — `tailwind.config.ts`

All site colours are defined in one place:

```ts
colors: {
  paper:   '#eadcf8',  // card and surface backgrounds
  ink:     '#271f3d',  // body text (light mode)
  linen:   '#f3ebfb',  // subtle borders and dividers
  clay:    '#7655a6',  // secondary accents, icons
  cedar:   '#5e6fa8',  // links and buttons
  gold:    '#b986e8',  // highlights, progress bar, selection
  twilight:'#171225',  // dark mode background
}
```

Change any hex value and every element using that colour updates instantly.

### Background and body colours — `src/app/globals.css`

```css
body {
  background: #f0e8ff;  /* light mode page background */
  color: #271f3d;
}

.dark body {
  background: #171225;  /* dark mode background */
}

.lavender-floral-bg {
  background-color: #f0e8ff;
  background-image: radial-gradient(ellipse at 60% 0%, rgba(185,134,232,0.15), transparent 55%);
}
```

Change `#f0e8ff` to any colour to retheme the whole page.

---

## 2. Changing text content

Content is split into English and Tamil files. Edit the one you need:

```
src/data/memorial-content/en.ts   ← all English text
src/data/memorial-content/ta.ts   ← all Tamil text
```

Both files follow the same structure. The sections inside are:

| Key | What it controls |
|-----|-----------------|
| `nav` | Header navigation labels and language button |
| `hero` | Eyebrow tag, CTA button labels, portrait alt text |
| `sections` | Eyebrow and title for About, Timeline, Gallery, Tributes, Family, Events |
| `memorialProfile` | Full name, birth/death year, quote, biography paragraphs, values, family message |
| `achievements` | The three "About" cards (title, description, icon) |
| `timeline` | Year, title, description, icon for each life milestone card |
| `galleryPhotos` | Image src, alt text, album tab, caption |
| `tributes` | Static fallback tributes (name, relationship, message, date) |
| `events` | Remembrance events (title, date, location, details) |
| `footer` | Dedication line, contact label, visitor count label |
| `form` | Memory submission form labels and messages |

### Name, dates, quote, biography

```ts
// src/data/memorial-content/en.ts
memorialProfile: {
  fullName: 'J.P.Edwin Chelliah',
  birthYear: '1955',
  deathYear: '2025',
  portrait: '/images/edwinchelliah.jpg',
  quote: ['Line one of the quote.', 'Line two if needed.'],
  biography: [
    'First paragraph.',
    'Second paragraph.',
  ],
  values: ['Kindness', 'Integrity', 'Family'],
  familyMessage: 'We remember him ...',
}
```

### Timeline events

```ts
timeline: [
  {
    year: '1955',
    title: 'A Life Begins',
    description: 'Born into a loving family ...',
    icon: Sparkles,
  },
  // copy the block to add more entries
]
```

Icons come from `lucide-react`. Commonly used: `Award`, `BookOpen`, `Briefcase`, `GraduationCap`, `Heart`, `Home`, `Sparkles`, `Users`, `Camera`, `Church`, `Star`.

### Gallery photos

```ts
galleryPhotos: [
  {
    src: '/images/gallery-family.svg',
    alt: 'Family gathering at home',
    album: 'Family',        // tab: Family | Career | Celebrations | Legacy
    caption: 'Sunday lunch, 1990',
  },
]
```

To add a new album tab (e.g. `'Faith'`), add it to the union type in `src/data/memorial-content/types.ts`:
```ts
album: 'Family' | 'Career' | 'Celebrations' | 'Legacy' | 'Faith';
```

---

## 3. Adding real photos

All images go in `public/images/`.

### Portrait

The current portrait is `public/images/edwinchelliah.jpg`.
To replace it, add the new file and update `portrait` in `en.ts` and `ta.ts`:
```ts
portrait: '/images/your-photo.jpg',
```
**Recommended size:** 400 × 500 px, under 300 KB.

### Gallery photos

1. Add photo files to `public/images/` — e.g. `family-1.jpg`
2. Update or add entries in `galleryPhotos` in `en.ts` and `ta.ts`
3. Push to `main`

**Recommended size:** 800 × 600 px, under 500 KB each.

**Image tips:**
- Use `.jpg` for photos; `.webp` for best compression
- Compress before uploading at [squoosh.app](https://squoosh.app)
- Use lowercase filenames with hyphens: `family-1990.jpg`

---

## 4. How to deploy changes

```bash
git add .
git commit -m "Update content / photos / colours"
git push origin main
```

GitHub Actions rebuilds and publishes to **https://www.edwinchelliah.com** within 2–3 minutes.

Check status: https://github.com/rajasekar21/jpedwin-memorial-page/actions

---

## 5. File map

```
src/
  data/
    memorial-content/
      en.ts          ← English text content
      ta.ts          ← Tamil text content
      types.ts       ← Shared TypeScript types
      index.ts       ← Language export wiring
    memorial.ts      ← Binds languages; re-exports for components
  app/
    globals.css      ← Base colours, fade-in animation, Tamil font sizing
    layout.tsx       ← Metadata, CSP headers, PWA meta tags
    page.tsx         ← Static entry; passes JSON-LD to HomePage
    admin/page.tsx   ← Admin route (hidden from crawlers)
  components/
    home-page.tsx    ← Full bilingual page layout
    gallery.tsx      ← Gallery with filter tabs and lightbox
    memory-form.tsx  ← Submission form with validation
    memory-tributes.tsx ← Live Supabase or static fallback tributes
    admin-panel.tsx  ← Moderation UI
    visitor-count.tsx   ← Eye-icon visitor counter
    theme-provider.tsx  ← Header, nav, dark mode toggle, language switcher
    motion-wrapper.tsx  ← Scroll fade-in (IntersectionObserver)
    section.tsx      ← Reusable section wrapper
    error-boundary.tsx  ← Catches render errors
  lib/
    site.ts          ← siteConfig, withBasePath helper
    supabase.ts      ← Supabase client (null when not configured)
    validation.ts    ← Zod schemas for memory form
    structured-data.ts  ← JSON-LD generators

public/
  images/
    edwinchelliah.jpg    ← Portrait photo
    gallery-*.svg        ← Gallery placeholders (replace with real photos)
    og-image.svg         ← OpenGraph/Twitter Card image
    icon-192.png         ← PWA icon
    icon-512.png         ← PWA icon
  favicon.svg            ← Browser tab icon
  manifest.json          ← PWA manifest
  _headers               ← CDN security headers (Netlify / Cloudflare)
  CNAME                  ← Custom domain (do not edit)

tailwind.config.ts       ← Colour palette and font definitions
supabase/schema.sql      ← Database schema, RLS policies, photo cleanup trigger
```
