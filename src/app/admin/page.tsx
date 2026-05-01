import Link from 'next/link';
import { AdminPanel } from '@/components/admin-panel';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-ink dark:bg-twilight dark:text-paper sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-flex text-sm text-ink/65 hover:text-ink dark:text-paper/65 dark:hover:text-paper">
          Back to memorial
        </Link>
        <AdminPanel />
      </div>
    </main>
  );
}
