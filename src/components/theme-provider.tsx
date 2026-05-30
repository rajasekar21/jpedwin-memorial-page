'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent, defaultLanguage, type Language, type MemorialContent } from '@/data/memorial';

const SCROLL_SPY_ROOT_MARGIN = '-10% 0px -60% 0px';

function ScrollProgressBar({ label }: { label: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
        barRef.current.setAttribute('aria-valuenow', String(Math.round(pct)));
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label={label}
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      className="absolute bottom-0 left-0 h-[2px] bg-gold transition-[width] duration-100"
      style={{ width: '0%' }}
    />
  );
}

export function ThemeToggle({ label = defaultContent.nav.toggleTheme }: { label?: string }) {
  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', next);
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-sm backdrop-blur transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight/80 dark:text-paper"
      aria-label={label}
      title={label}
    >
      <Moon aria-hidden className="h-5 w-5 dark:hidden" />
      <Sun aria-hidden className="hidden h-5 w-5 dark:block" />
    </button>
  );
}

type SiteHeaderProps = {
  content?: MemorialContent;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
};

export function SiteHeader({ content, language, onLanguageChange }: SiteHeaderProps) {
  const activeContent = content ?? defaultContent;
  const activeLanguage = language ?? defaultLanguage;
  const handleLanguageChange = onLanguageChange ?? (() => undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navItems = activeContent.nav.items;
  const sectionIds = useMemo(() => navItems.map(({ href }) => href.slice(1)), [navItems]);

  useEffect(() => {
    const candidates = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          candidates.set(entry.target.id, entry.intersectionRatio);
        }

        let topId = '';
        let topRatio = 0;
        for (const [id, ratio] of candidates) {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        }

        if (topId) {
          setActiveSection(topId);
          const hash = `#${topId}`;
          if (window.location.hash !== hash) {
            window.history.replaceState(null, '', hash);
          }
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: SCROLL_SPY_ROOT_MARGIN }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    function onScroll() {
      if (isMenuOpen) setIsMenuOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl dark:border-white/10 dark:bg-twilight/80">
      <nav
        className={`relative mx-auto flex max-w-6xl items-center justify-between gap-2 py-3 ${
          activeLanguage === 'ta' ? 'px-3 sm:px-4 lg:px-6' : 'px-4 sm:px-8 lg:px-12'
        }`}
        aria-label={activeContent.nav.ariaLabel}
      >
        <a
          href="#home"
          onClick={closeMenu}
          className={`shrink-0 whitespace-nowrap font-serif text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper ${
            activeLanguage === 'ta' ? 'text-[0.68rem] sm:text-xs lg:text-sm' : 'text-base sm:text-lg'
          }`}
        >
          {activeContent.memorialProfile.fullName}
        </a>

        <div className={`hidden items-center md:flex ${activeLanguage === 'ta' ? 'gap-2.5 lg:gap-3' : 'gap-6'}`}>
          {navItems.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-gold ${
                  isActive
                    ? 'font-medium text-ink dark:text-paper'
                    : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper'
                } ${activeLanguage === 'ta' ? 'text-[0.68rem] lg:text-xs' : 'text-sm'}`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] rounded-full bg-gold" />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`grid grid-cols-2 rounded-full border border-ink/10 bg-white/80 p-1 font-medium shadow-sm backdrop-blur dark:border-white/10 dark:bg-twilight/80 ${
              activeLanguage === 'ta' ? 'text-[0.6rem] sm:text-[0.68rem]' : 'text-[0.7rem] sm:text-xs'
            }`}
            role="group"
            aria-label={activeContent.nav.languageLabel}
          >
            {(['en', 'ta'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleLanguageChange(item)}
                aria-pressed={activeLanguage === item}
                className={`whitespace-nowrap rounded-full py-2 transition focus:outline-none focus:ring-2 focus:ring-gold ${
                  activeLanguage === item
                    ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                    : 'text-ink/70 hover:text-ink dark:text-paper/70 dark:hover:text-paper'
                } ${activeLanguage === 'ta' ? 'px-1.5 sm:px-2.5' : 'px-2.5 sm:px-4'}`}
              >
                {item === 'en' ? 'English' : 'தமிழ்'}
              </button>
            ))}
          </div>
          <ThemeToggle label={activeContent.nav.toggleTheme} />
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-sm backdrop-blur transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight/80 dark:text-paper md:hidden"
            aria-label={isMenuOpen ? activeContent.nav.closeMenu : activeContent.nav.openMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            title={isMenuOpen ? activeContent.nav.closeMenu : activeContent.nav.openMenu}
          >
            {isMenuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>

        <ScrollProgressBar label={activeContent.nav.scrollProgress} />
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-ink/10 bg-paper/95 px-5 py-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-twilight/95 md:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-1">
            {navItems.map(({ label, href }) => {
              const id = href.slice(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold ${
                    isActive
                      ? 'bg-gold/10 text-ink dark:bg-gold/10 dark:text-paper'
                      : 'text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-white/10 dark:hover:text-paper'
                  }`}
                >
                  {label}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
