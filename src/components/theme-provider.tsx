'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  ['About', '#about'],
  ['Timeline', '#timeline'],
  ['Gallery', '#gallery'],
  ['Tributes', '#tributes'],
  ['Events', '#events']
];

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

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl dark:border-white/10 dark:bg-twilight/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12" aria-label="Main navigation">
        <a href="#home" onClick={closeMenu} className="font-serif text-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper">
          Memorial
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-ink/70 transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper/70 dark:hover:text-paper">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-sm backdrop-blur transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight/80 dark:text-paper md:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            title={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div id="mobile-navigation" className="border-t border-ink/10 bg-paper/95 px-5 py-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-twilight/95 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-ink/75 transition hover:bg-ink/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:text-paper/75 dark:hover:bg-white/10 dark:hover:text-paper"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
