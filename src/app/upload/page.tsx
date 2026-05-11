import type { Metadata } from 'next';
import Link from 'next/link';
import { FamilyUpload } from '@/components/family-upload';

export const metadata: Metadata = {
  title: 'Family Photo Upload',
  robots: { index: false, follow: false }
};

export default function UploadPage() {
  return (
    <main className="lavender-floral-bg min-h-screen px-5 py-10 text-ink dark:bg-twilight dark:text-paper sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-ink/65 hover:text-ink dark:text-paper/65 dark:hover:text-paper focus:outline-none focus:ring-2 focus:ring-gold"
        >
          ← Back to memorial
        </Link>
        <FamilyUpload />
      </div>
    </main>
  );
}
