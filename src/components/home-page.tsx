'use client';

import Image from 'next/image';
import { ArrowDown, CalendarDays, Feather, Heart, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultLanguage, memorialContent, type Language } from '@/data/memorial';
import { Gallery } from '@/components/gallery';
import { MemoryForm } from '@/components/memory-form';
import { MemoryTributes } from '@/components/memory-tributes';
import { FadeIn } from '@/components/motion-wrapper';
import { Section } from '@/components/section';
import { SiteHeader } from '@/components/theme-provider';
import { VisitorCount } from '@/components/visitor-count';
import { withBasePath } from '@/lib/site';

type HomePageProps = {
  jsonLd: object[];
};

export function HomePage({ jsonLd }: HomePageProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const content = memorialContent[language];
  const { memorialProfile } = content;

  useEffect(() => {
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
  }, [language]);

  return (
    <main
      id="main-content"
      className={`lavender-floral-bg overflow-hidden text-ink dark:bg-twilight dark:text-paper ${
        language === 'ta' ? 'tamil-content' : ''
      }`}
    >
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-md bg-gold px-4 py-2 text-sm font-medium text-ink shadow-soft transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ink"
      >
        {content.nav.skipToMain}
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader content={content} language={language} onLanguageChange={setLanguage} />

      <section id="home" className="relative flex min-h-dvh items-center px-5 pb-14 pt-32 sm:px-8 lg:px-12">
        <div className="lavender-floral-bg absolute inset-0 -z-10 dark:bg-[radial-gradient(circle_at_25%_20%,rgba(185,134,232,0.18),transparent_32%),linear-gradient(135deg,#171225_0%,#231a38_55%,#2b315c_100%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <p
              className={`mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-ink/70 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-paper/70 ${
                language === 'ta' ? 'whitespace-nowrap text-[0.5rem] sm:text-[0.65rem] lg:text-xs' : 'text-sm'
              }`}
            >
              <Feather aria-hidden className="h-4 w-4 shrink-0" />
              <span>{content.hero.eyebrow}</span>
            </p>
            <h1
              className={`whitespace-nowrap font-serif leading-tight text-ink dark:text-paper ${
                language === 'ta'
                  ? 'text-[clamp(0.9rem,4vw,3rem)]'
                  : 'text-[clamp(1.55rem,7vw,4.5rem)]'
              }`}
            >
              {memorialProfile.fullName}
            </h1>
            <p className="mt-4 flex items-center gap-3 font-serif text-lg text-ink/65 dark:text-paper/65">
              <span aria-hidden className="text-clay dark:text-gold">✝</span>
              <span>{memorialProfile.birthYear}</span>
              <span aria-hidden className="text-gold">–</span>
              <span>{memorialProfile.deathYear}</span>
              <span aria-hidden className="text-clay dark:text-gold">✝</span>
            </p>
            <blockquote
              className={`mt-8 max-w-2xl border-l-2 border-gold pl-5 font-serif leading-relaxed text-ink/80 dark:text-paper/80 ${
                language === 'ta' ? 'text-base sm:text-lg lg:text-xl' : 'text-2xl'
              }`}
            >
              {memorialProfile.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#about"
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 font-medium text-paper transition hover:bg-clay focus:outline-none focus:ring-2 focus:ring-gold dark:bg-paper dark:text-ink ${
                  language === 'ta' ? 'text-xs sm:text-sm' : 'text-sm'
                }`}
              >
                {content.hero.primaryCta}
                <ArrowDown aria-hidden className="h-4 w-4" />
              </a>
              <a
                href="#tributes"
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/15 px-5 py-3 font-medium text-ink transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/15 dark:text-paper ${
                  language === 'ta' ? 'text-xs sm:text-sm' : 'text-sm'
                }`}
              >
                {content.hero.secondaryCta}
                <Heart aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-white/50 bg-white/45 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <Image
              src={withBasePath(memorialProfile.portrait)}
              alt={content.hero.portraitAlt}
              width={720}
              height={880}
              priority
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      <Section id="about" eyebrow={content.sections.about.eyebrow} title={content.sections.about.title}>
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
              {content.achievements.map((item) => {
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

      <Section id="timeline" eyebrow={content.sections.timeline.eyebrow} title={content.sections.timeline.title} className="lavender-floral-bg dark:bg-white/[0.03]">
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.timeline.map((event, index) => {
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

      <Section id="gallery" eyebrow={content.sections.gallery.eyebrow} title={content.sections.gallery.title}>
        <Gallery photos={content.galleryPhotos} labels={content.gallery} />
      </Section>

      <Section id="tributes" eyebrow={content.sections.tributes.eyebrow} title={content.sections.tributes.title} className="lavender-floral-bg dark:bg-white/[0.03]">
        <FadeIn>
          <MemoryTributes fallbackTributes={content.tributes} labels={content.tributeLabels} />
        </FadeIn>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="font-serif text-2xl">{content.sections.tributes.formTitle}</h3>
            <p className="mt-3 leading-7 text-ink/65 dark:text-paper/65">
              {content.sections.tributes.formIntro}
            </p>
          </div>
          <MemoryForm labels={content.form} />
        </div>
      </Section>

      <Section id="family" eyebrow={content.sections.family.eyebrow} title={content.sections.family.title}>
        <div className="rounded-lg border border-ink/10 bg-white/65 p-8 shadow-soft dark:border-white/10 dark:bg-white/5">
          <p className="font-serif text-2xl leading-10 text-ink/80 dark:text-paper/80">{memorialProfile.familyMessage}</p>
        </div>
      </Section>

      <Section id="events" eyebrow={content.sections.events.eyebrow} title={content.sections.events.title} className="lavender-floral-bg dark:bg-white/[0.03]">
        <div className="grid gap-5 md:grid-cols-2">
          {content.events.map((event) => (
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
            <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@edwinchelliah.com'}`} className="inline-flex items-center gap-2 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:hover:text-paper">
              <Mail aria-hidden className="h-4 w-4" />
              {content.footer.familyContact}
            </a>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden className="h-4 w-4" />
              {content.footer.preserved}
            </span>
            <VisitorCount label={content.footer.visitorCount} />
          </div>
        </div>
      </footer>
    </main>
  );
}
