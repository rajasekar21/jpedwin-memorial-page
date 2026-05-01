'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

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
