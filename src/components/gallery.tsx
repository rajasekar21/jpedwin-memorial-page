'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent, type GalleryPhoto, type MemorialContent } from '@/data/memorial';
import { withBasePath } from '@/lib/site';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type GalleryProps = {
  photos?: GalleryPhoto[];
  labels?: MemorialContent['gallery'];
};

/** Filterable photo gallery with an accessible lightbox modal and focus trap. */
export function Gallery({ photos: contentPhotos = defaultContent.galleryPhotos, labels = defaultContent.gallery }: GalleryProps) {
  const albums = useMemo(() => [labels.all, ...Array.from(new Set(contentPhotos.map((p) => p.album)))], [labels.all, contentPhotos]);
  const [album, setAlbum] = useState(labels.all);
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const activeAlbum = albums.includes(album) ? album : labels.all;

  // Refs for focus management
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredPhotos = useMemo(
    () => (activeAlbum === labels.all ? contentPhotos : contentPhotos.filter((p) => p.album === activeAlbum)),
    [activeAlbum, labels.all, contentPhotos]
  );

  function openModal(photo: GalleryPhoto, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActive(photo);
  }

  function closeModal() {
    setActive(null);
    // Restore focus to the photo button that opened the modal
    triggerRef.current?.focus();
    triggerRef.current = null;
  }

  // Focus close button when modal opens; lock body scroll
  useEffect(() => {
    if (active) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  // Trap Tab/Shift+Tab within modal; close on Escape
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      {/* Album filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label={labels.ariaLabel}>
        {albums.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAlbum(item)}
            role="tab"
            aria-selected={activeAlbum === item}
            className={`rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-gold ${
              activeAlbum === item
                ? 'border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink'
                : 'border-ink/10 bg-white/50 text-ink hover:border-clay dark:border-white/10 dark:bg-white/5 dark:text-paper'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
        {filteredPhotos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={(e) => openModal(photo, e.currentTarget)}
            aria-label={`${labels.viewPhoto}: ${photo.caption}`}
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

      {/* Lightbox modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${labels.dialogLabel}: ${active.caption}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={modalRef}
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-paper shadow-soft dark:bg-twilight"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label={labels.closePreview}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <Image
              src={withBasePath(active.src)}
              alt={active.alt}
              width={1100}
              height={820}
              className="max-h-[72vh] w-full object-contain"
            />
            <p className="px-5 py-4 text-sm text-ink/75 dark:text-paper/75">{active.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
