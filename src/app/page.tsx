import Image from 'next/image';
import { ArrowDown, CalendarDays, Feather, Heart, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { achievements, events, memorialProfile, timeline, tributes } from '@/data/memorial';
import { Gallery } from '@/components/gallery';
import { MemoryForm } from '@/components/memory-form';
import { FadeIn } from '@/components/motion-wrapper';
import { Section } from '@/components/section';
import { ThemeToggle } from '@/components/theme-provider';
import { withBasePath } from '@/lib/site';

const navItems = [
  ['About', '#about'],
  ['Timeline', '#timeline'],
  ['Gallery', '#gallery'],
  ['Tributes', '#tributes'],
  ['Events', '#events']
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-paper text-ink dark:bg-twilight dark:text-paper">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl dark:border-white/10 dark:bg-twilight/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12" aria-label="Main navigation">
          <a href="#home" className="font-serif text-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper">
            Memorial
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-ink/70 transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper/70 dark:hover:text-paper">
                {label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </header>

      <section id="home" className="relative flex min-h-screen items-center px-5 pb-14 pt-28 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,rgba(180,147,90,0.22),transparent_32%),linear-gradient(135deg,#f7f3ed_0%,#ebe3d7_55%,#e6ece8_100%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(180,147,90,0.18),transparent_32%),linear-gradient(135deg,#161a22_0%,#1f252a_55%,#26352f_100%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm text-ink/70 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-paper/70">
              <Feather aria-hidden className="h-4 w-4" />
              Digital memorial and family archive
            </p>
            <h1 className="whitespace-nowrap font-serif text-[clamp(2.6rem,8vw,4.7rem)] leading-tight text-ink dark:text-paper">
              {memorialProfile.fullName}
            </h1>
            <p className="mt-4 text-lg text-ink/65 dark:text-paper/65">{memorialProfile.dates}</p>
            <blockquote className="mt-8 max-w-2xl border-l-2 border-gold pl-5 font-serif text-2xl leading-relaxed text-ink/80 dark:text-paper/80">
              {memorialProfile.quote}
            </blockquote>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#about" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-clay focus:outline-none focus:ring-2 focus:ring-gold dark:bg-paper dark:text-ink">
                Begin the story
                <ArrowDown aria-hidden className="h-4 w-4" />
              </a>
              <a href="#tributes" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/15 dark:text-paper">
                Leave a memory
                <Heart aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-white/50 bg-white/45 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Image
                src={withBasePath(memorialProfile.portrait)}
                alt={`Portrait of ${memorialProfile.fullName}`}
                width={720}
                height={880}
                priority
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <Section id="about" eyebrow="About him" title="A life held in story, family, and enduring values.">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn>
            <div className="space-y-5 text-lg leading-8 text-ink/75 dark:text-paper/75">
              {memorialProfile.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid gap-4">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-ink/10 bg-white/65 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
                    <Icon aria-hidden className="mb-4 h-6 w-6 text-clay dark:text-gold" />
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-paper/65">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </FadeIn>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {memorialProfile.values.map((value) => (
            <span key={value} className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink/70 dark:border-white/10 dark:text-paper/70">
              {value}
            </span>
          ))}
        </div>
      </Section>

      <Section id="timeline" eyebrow="Life journey" title="Milestones preserved as a family archive." className="bg-linen/70 dark:bg-white/[0.03]">
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {timeline.map((event, index) => {
            const Icon = event.icon;
            return (
              <FadeIn key={event.title} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-ink/10 bg-paper p-5 shadow-soft dark:border-white/10 dark:bg-twilight">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="font-serif text-3xl text-clay dark:text-gold">{event.year}</span>
                    <Icon aria-hidden className="h-6 w-6 text-cedar dark:text-gold" />
                  </div>
                  <h3 className="font-serif text-xl">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65 dark:text-paper/65">{event.description}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      <Section id="gallery" eyebrow="Photo gallery" title="A visual archive of the moments that remain close.">
        <Gallery />
      </Section>

      <Section id="tributes" eyebrow="Memories and tributes" title="Words from the people whose lives he touched." className="bg-linen/70 dark:bg-white/[0.03]">
        <div className="grid gap-5 lg:grid-cols-3">
          {tributes.map((tribute, index) => (
            <FadeIn key={tribute.name} delay={index * 0.05}>
              <article className="h-full rounded-lg border border-ink/10 bg-paper p-6 shadow-soft dark:border-white/10 dark:bg-twilight">
                <p className="font-serif text-xl leading-8 text-ink/80 dark:text-paper/80">&ldquo;{tribute.message}&rdquo;</p>
                <div className="mt-6 border-t border-ink/10 pt-4 text-sm text-ink/60 dark:border-white/10 dark:text-paper/60">
                  <p className="font-medium text-ink dark:text-paper">{tribute.name}</p>
                  <p>{tribute.relationship}</p>
                  <p>{tribute.date}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="font-serif text-2xl">Submit a memory</h3>
            <p className="mt-3 leading-7 text-ink/65 dark:text-paper/65">
              Phase 1 keeps submissions offline for family review. When Supabase is enabled, this form sends memories into a moderated queue.
            </p>
          </div>
          <MemoryForm />
        </div>
      </Section>

      <Section id="family" eyebrow="Family tribute" title="Remembered at home, carried forward in love.">
        <div className="rounded-lg border border-ink/10 bg-white/65 p-8 shadow-soft dark:border-white/10 dark:bg-white/5">
          <p className="font-serif text-2xl leading-10 text-ink/80 dark:text-paper/80">{memorialProfile.familyMessage}</p>
        </div>
      </Section>

      <Section id="events" eyebrow="Remembrance events" title="Gatherings and moments of shared remembrance." className="bg-linen/70 dark:bg-white/[0.03]">
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.title} className="rounded-lg border border-ink/10 bg-paper p-6 shadow-soft dark:border-white/10 dark:bg-twilight">
              <CalendarDays aria-hidden className="mb-4 h-6 w-6 text-clay dark:text-gold" />
              <h3 className="font-serif text-xl">{event.title}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink/65 dark:text-paper/65">
                <MapPin aria-hidden className="h-4 w-4" />
                {event.location}
              </p>
              <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">{event.date}</p>
              <p className="mt-4 leading-7 text-ink/70 dark:text-paper/70">{event.details}</p>
            </article>
          ))}
        </div>
      </Section>

      <footer className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-ink/10 pt-8 text-sm text-ink/60 dark:border-white/10 dark:text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>{memorialProfile.shortDedication}</p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:family@example.com" className="inline-flex items-center gap-2 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:hover:text-paper">
              <Mail aria-hidden className="h-4 w-4" />
              Family contact
            </a>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden className="h-4 w-4" />
              Preserved with care
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
