import type { Metadata } from 'next';
import Link from 'next/link';
import { QrCard } from '@/components/qr-card';
import { siteConfig } from '@/lib/site';
import { defaultContent } from '@/data/memorial';

export const metadata: Metadata = {
  title: 'QR Code — J.P. Edwin Chelliah Memorial',
  description: 'Scan to visit the digital memorial for J.P. Edwin Chelliah.',
};

export default function QrPage() {
  const { memorialProfile, qr } = defaultContent;

  return (
    <main className="lavender-floral-bg min-h-screen px-5 py-10 text-ink dark:bg-twilight dark:text-paper sm:px-8">
      <div className="mx-auto max-w-lg">
        {/* Back link — hidden when printing */}
        <Link
          href="/"
          className="no-print mb-10 inline-flex text-sm text-ink/65 hover:text-ink dark:text-paper/65 dark:hover:text-paper focus:outline-none focus:ring-2 focus:ring-gold"
        >
          ← Back to memorial
        </Link>

        <div className="no-print mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-clay dark:text-gold">
            {qr.eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-3xl">{qr.pageTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-ink/65 dark:text-paper/65">
            {qr.pageIntro}
          </p>
        </div>

        <QrCard
          url={siteConfig.url}
          fullName={memorialProfile.fullName}
          birthYear={memorialProfile.birthYear}
          deathDate={memorialProfile.deathDate}
          labels={{
            subtitle: qr.subtitle,
            scanPrompt: qr.scanPrompt,
            downloadPng: qr.downloadPng,
            print: qr.print,
            printedBy: qr.printedBy,
          }}
        />
      </div>
    </main>
  );
}
