'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { galleryPhotos, type GalleryPhoto } from '@/data/memorial';
import { withBasePath } from '@/lib/site';

const albums = ['All', ...Array.from(new Set(galleryPhotos.map((photo) => photo.album)))] as const;

export function Gallery() {
  const [album, setAlbum] = useState<(typeof albums)[number]>('All');
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  const photos = useMemo(() => (album === 'All' ? galleryPhotos : galleryPhotos.filter((photo) => photo.album === album)), [album]);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Photo albums">
        {albums.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAlbum(item)}
            className={`rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-gold ${
              album === item
                ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
                : 'border-ink/10 bg-white/50 text-ink hover:border-clay dark:border-white/10 dark:bg-white/5 dark:text-paper'
            }`}
            role="tab"
            aria-selected={album === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
        {photos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(photo)}
            className="mb-5 block w-full overflow-hidden rounded-lg border border-ink/10 bg-white text-left shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-white/5"
          >
            <Image
              src={withBasePath(photo.src)}
              alt={photo.alt}
              width={640}
              height={780}
              className="h-auto w-full"
              loading="lazy"
            />
            <span className="block px-4 py-4 text-sm text-ink/75 dark:text-paper/75">{photo.caption}</span>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={() => setActive(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-paper shadow-soft dark:bg-twilight" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Close photo preview"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <Image src={withBasePath(active.src)} alt={active.alt} width={1100} height={820} className="max-h-[72vh] w-full object-contain" />
            <p className="px-5 py-4 text-sm text-ink/75 dark:text-paper/75">{active.caption}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
