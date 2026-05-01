import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          {eyebrow ? <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-clay dark:text-gold">{eyebrow}</p> : null}
          <h2 className="font-serif text-3xl text-ink sm:text-4xl dark:text-paper">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
