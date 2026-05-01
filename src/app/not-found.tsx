import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 text-center text-ink dark:bg-twilight dark:text-paper">
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-clay dark:text-gold">Page not found</p>
        <h1 className="font-serif text-4xl">This memory page is not available.</h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper dark:bg-paper dark:text-ink">
          Return home
        </Link>
      </div>
    </main>
  );
}
