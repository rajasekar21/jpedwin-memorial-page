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
  background: #f0e8ff;  /* light mode page background (mild lavender) */
  color: #271f3d;
}

.dark body {
  background: #171225;
}

.lavender-floral-bg {
  background-color: #f0e8ff;
  background-image: radial-gradient(ellipse at 60% 0%, rgba(185,134,232,0.15), transparent 55%);
}
```

---

## 2. Changing text content

Content is split into English and Tamil files:

```
src/data/memorial-content/en.ts   ← all English text
src/data/memorial-content/ta.ts   ← all Tamil text
```

Both files follow the same structure. The sections are:

| Key | What it controls |
|-----|-----------------|
| `nav` | Header navigation labels, language button, accessibility strings |
| `hero` | Eyebrow tag, primary and secondary CTA button labels, portrait alt text |
| `sections` | Eyebrow and title for About, Timeline, Gallery, Tributes, Family, Events |
| `memorialProfile` | Full name, birth/death year, death date, quote, biography, values, family message |
| `achievements` | The three "About" cards (title, description, icon) |
| `timeline` | Year, title, description, icon for each life milestone card |
| `galleryPhotos` | Static fallback image src, alt text, album tab, caption |
| `tributes` | Static fallback tributes (name, relationship, message, date). `message` can be one string or an array of strings for multiple paragraphs. |
| `events` | Remembrance events (title, date, location, details) |
| `rsvp` | RSVP form field labels, hints, success and error messages |
| `form` | Memory submission form labels and messages |
| `upload` | Family photo upload page labels and messages |
| `qr` | QR code page labels |
| `footer` | Dedication line, contact label, visitor count label, QR link label |
| `tributeLabels` | Photo alt prefix and date locale |

### Name, dates, quote, biography

```ts
// src/data/memorial-content/en.ts
memorialProfile: {
  fullName:  'J.P. Edwin Chelliah',
  birthYear: '1955',
  deathYear: '2025',
  deathDate: '6 June 2025',
  portrait:  '/images/edwinchelliah.jpg',
  quote: ['Line one of the quote.', 'Line two if needed.'],
  biography: [
    'First paragraph.',
    'Second paragraph.',
  ],
  values: ['Kindness', 'Integrity', 'Family'],
  familyMessage: 'We remember him ...',
  shortDedication: 'Dedicated by family and friends ...',
}
```

### Timeline events

```ts
timeline: [
  {
    year:        '1955',
    title:       'A Life Begins',
    description: 'Born into a loving family ...',
    icon:        Sparkles,
  },
  // copy the block to add more entries
]
```

Icons come from `lucide-react`. Commonly used: `Award`, `BookOpen`, `Briefcase`, `GraduationCap`, `Heart`, `Home`, `Sparkles`, `Users`, `Camera`, `Church`, `Star`.

### Remembrance events and RSVP

Events appear in the Events section. In-person events automatically show an RSVP form; online events do not.

```ts
events: [
  {
    title:    'Annual Remembrance Gathering',
    date:     'Every June',
    location: 'Family residence',   // any non-"Online" value shows RSVP form
    details:  'A quiet evening of prayer, stories, and shared food.',
  },
  {
    title:    'Digital Tribute Collection',
    date:     'Open year-round',
    location: 'Online',             // "Online" hides the RSVP form
    details:  'Send photographs, letters, and memories ...',
  },
]
```

RSVP form labels are in the `rsvp` key in each language file:

```ts
rsvp: {
  formTitle:       'RSVP for this gathering',
  nameLabel:       'Your name',
  emailLabel:      'Email',
  emailHint:       '(optional)',
  guestCountLabel: 'Number of guests',
  messageLabel:    'Message',
  messageHint:     '(optional)',
  submit:          'Confirm attendance',
  submitting:      'Sending…',
  successMessage:  'Thank you — your attendance has been noted.',
  phaseOneMessage: 'To confirm your attendance, please email the family at {email}.',
  errorMessage:    'Could not save your RSVP right now. Please try again.',
}
```

### Gallery photos (static fallbacks)

```ts
galleryPhotos: [
  {
    src:     '/images/memories/memories-1.jpg',
    alt:     'Memories album photo',
    album:   'Memories',      // tab: Memories | Recent | Retirement | Mentor
    caption: 'Sunday lunch, 1990',
  },
  {
    src:     '/images/memories/memories-2.jpg',
    alt:     'Memories album photo',
    album:   'Memories',
    caption: 'A cherished memory',
  },
]
```

These are shown when no approved photos exist in Supabase. The gallery shows one cover card per album, then opens all photos in that album with left/right navigation. When family members upload and admin approves photos, those appear instead.

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

### Gallery photos (static)

1. Add photo files to album folders under `public/images/` - e.g. `public/images/memories/memories-1.jpg`, `public/images/retirement/retirement-1.jpg`
2. Update or add entries in `galleryPhotos` in `en.ts` and `ta.ts`
3. Push to `main`

**Recommended size:** 800 × 600 px, under 500 KB each.

### Gallery photos (via family upload)

Family members with registered accounts can upload photos at `https://www.edwinchelliah.com/upload/`.
The admin approves them at `https://www.edwinchelliah.com/admin/` under the Gallery tab.
Approved photos are shown in the gallery automatically using signed Supabase Storage URLs.

**Image tips:**
- Use `.jpg` for photos; `.webp` for best compression
- Compress before uploading at [squoosh.app](https://squoosh.app)
- Use lowercase filenames with hyphens: `memories-1.jpg`

---

## 4. Family contact email

The contact email is set in two places:

1. **GitHub Actions secret** — `NEXT_PUBLIC_CONTACT_EMAIL=sweetlinepriya.edwin@gmail.com`
2. **`.env.local`** — `NEXT_PUBLIC_CONTACT_EMAIL=sweetlinepriya.edwin@gmail.com`
3. **`next.config.js`** — fallback default: `sweetlinepriya.edwin@gmail.com`

After changing the secret, push a commit to `main` to trigger a rebuild.

---

## 5. QR code page

The `/qr/` page generates a printable QR card for funeral booklets and remembrance programmes.
It reads the site URL from `siteConfig.url` in `src/lib/site.ts` — no editing needed.

Labels for the QR page are in the `qr` key in each language file:

```ts
qr: {
  eyebrow:     'Digital memorial',
  pageTitle:   'QR Code for Printed Programmes',
  pageIntro:   'Download or print this QR card ...',
  subtitle:    'Digital memorial',
  scanPrompt:  'Scan to visit the digital memorial ...',
  downloadPng: 'Download PNG',
  print:       'Print card',
  printedBy:   'Preserved with love by family and friends',
}
```

---

## 6. How to deploy changes

```bash
git add .
git commit -m "Update content / photos / colours"
git push origin main
```

GitHub Actions rebuilds and publishes to **https://www.edwinchelliah.com** within 2–3 minutes.

Check status: https://github.com/rajasekar21/jpedwin-memorial-page/actions

---

## 7. File map

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
    globals.css           ← Base colours, fade-in animation, Tamil font sizing, print CSS
    layout.tsx            ← Metadata, CSP headers, PWA meta tags
    page.tsx              ← Static entry; passes JSON-LD to HomePage
    admin/page.tsx        ← Admin route (noindex)
    upload/page.tsx       ← Family upload route (noindex)
    qr/page.tsx           ← QR code print page

  components/
    home-page.tsx         ← Full bilingual page layout
    gallery.tsx           ← Gallery with filter tabs and lightbox
    gallery-supabase.tsx  ← Fetches approved photos; falls back to static
    memory-form.tsx       ← Memory submission form with validation
    memory-tributes.tsx   ← Live Supabase or static fallback tributes
    rsvp-form.tsx         ← Per-event RSVP form
    admin-panel.tsx       ← Moderation UI (Memories / Gallery / RSVP tabs)
    family-upload.tsx     ← Authenticated family photo upload
    qr-card.tsx           ← QR code card with PNG download and print
    visitor-count.tsx     ← Eye-icon visitor counter
    theme-provider.tsx    ← Header, nav, dark mode toggle, language switcher
    motion-wrapper.tsx    ← Scroll fade-in (IntersectionObserver)
    section.tsx           ← Reusable section wrapper
    error-boundary.tsx    ← Catches render errors

  lib/
    site.ts               ← siteConfig, withBasePath helper
    supabase.ts           ← Supabase client (null when not configured)
    validation.ts         ← Zod schemas for memory form
    structured-data.ts    ← JSON-LD generators

public/
  images/
    edwinchelliah.jpg     ← Portrait photo
    gallery-*.svg         ← Gallery placeholders (replace with real photos)
    og-image.svg          ← OpenGraph / Twitter Card image
    icon-192.png          ← PWA icon
    icon-512.png          ← PWA icon
  favicon.svg             ← Browser tab icon
  manifest.json           ← PWA manifest
  _headers                ← CDN security headers (Netlify / Cloudflare)
  CNAME                   ← Custom domain (do not edit)

supabase/
  schema.sql                  ← Core tables, RLS, storage policies, triggers
  add-family-upload.sql       ← family_members table + gallery upload RLS
  add-rsvp.sql                ← rsvp_attendance table + RLS
  register-family-members.sql ← INSERT statements for Sweetline Priya & Angeline Gunavathy

tailwind.config.ts            ← Colour palette and font definitions
next.config.js                ← Static export, trailing slash, env defaults
.github/workflows/deploy.yml  ← GitHub Actions CI/CD
```

