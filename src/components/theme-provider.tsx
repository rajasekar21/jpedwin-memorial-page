'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  ['About',    '#about'],
  ['Timeline', '#timeline'],
  ['Gallery',  '#gallery'],
  ['Tributes', '#tributes'],
  ['Family',   '#family'],
  ['Events',   '#events']
];

const sectionIds = navItems.map(([, href]) => href.slice(1));

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="absolute bottom-0 left-0 h-[2px] bg-gold transition-[width] duration-100"
      style={{ width: `${progress}%` }}
    />
  );
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────
export function ThemeToggle() {
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-sm backdrop-blur transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight/80 dark:text-paper"
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <Moon aria-hidden className="h-5 w-5 dark:hidden" />
      <Sun aria-hidden className="hidden h-5 w-5 dark:block" />
    </button>
  );
}

// ─── Site header ──────────────────────────────────────────────────────────────
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll spy — track active section + update URL hash
  useEffect(() => {
    const candidates = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          candidates.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick the section with the highest visible ratio
        let topId = '';
        let topRatio = 0;
        for (const [id, ratio] of candidates) {
          if (ratio > topRatio) { topRatio = ratio; topId = id; }
        }
        if (topId) {
          setActiveSection(topId);
          const hash = `#${topId}`;
          if (window.location.hash !== hash) {
            window.history.replaceState(null, '', hash);
          }
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-10% 0px -60% 0px' }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    function onScroll() {
      if (isMenuOpen) setIsMenuOpen(false);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl dark:border-white/10 dark:bg-twilight/80">
      <nav
        className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          onClick={closeMenu}
          className="font-serif text-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper"
        >
          J.P. Edwin Chelliah
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(([label, href]) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative text-sm transition focus:outline-none focus:ring-2 focus:ring-gold
                  ${isActive
                    ? 'font-medium text-ink dark:text-paper'
                    : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper'
                  }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] rounded-full bg-gold" />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-sm backdrop-blur transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight/80 dark:text-paper md:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            title={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>

        <ScrollProgressBar />
      </nav>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-ink/10 bg-paper/95 px-5 py-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-twilight/95 md:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-1">
            {navItems.map(([label, href]) => {
              const id = href.slice(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold
                    ${isActive
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
