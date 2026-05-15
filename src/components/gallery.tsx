'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent, type GalleryPhoto, type MemorialContent } from '@/data/memorial';
import { withBasePath } from '@/lib/site';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type GalleryProps = {
  photos?: GalleryPhoto[];
  labels?: MemorialContent['gallery'];
};

type GalleryAlbum = {
  name: string;
  photos: GalleryPhoto[];
  cover: GalleryPhoto;
};

type ActiveAlbum = {
  photos: GalleryPhoto[];
  index: number;
};

/** Filterable photo gallery with an accessible lightbox modal and focus trap. */
export function Gallery({ photos: contentPhotos = defaultContent.galleryPhotos, labels = defaultContent.gallery }: GalleryProps) {
  const albums = useMemo(() => [labels.all, ...Array.from(new Set(contentPhotos.map((p) => p.album)))], [labels.all, contentPhotos]);
  const [album, setAlbum] = useState(labels.all);
  const [active, setActive] = useState<ActiveAlbum | null>(null);
  const activeAlbum = albums.includes(album) ? album : labels.all;
  const activePhoto = active ? active.photos[active.index] : null;
  const hasCarousel = active ? active.photos.length > 1 : false;
  const previousPhotoLabel = labels.previousPhoto ?? 'Previous photo';
  const nextPhotoLabel = labels.nextPhoto ?? 'Next photo';

  // Refs for focus management
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const albumGroups = useMemo(() => {
    const groups = new Map<string, GalleryPhoto[]>();

    contentPhotos.forEach((photo) => {
      const group = groups.get(photo.album) ?? [];
      group.push(photo);
      groups.set(photo.album, group);
    });

    return Array.from(groups, ([name, photos]) => ({
      name,
      photos,
      cover: photos[0]
    }));
  }, [contentPhotos]);

  const visibleAlbums = useMemo(
    () => (activeAlbum === labels.all ? albumGroups : albumGroups.filter((group) => group.name === activeAlbum)),
    [activeAlbum, albumGroups, labels.all]
  );

  function openModal(group: GalleryAlbum, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActive({ photos: group.photos, index: 0 });
  }

  function closeModal() {
    setActive(null);
    // Restore focus to the photo button that opened the modal
    triggerRef.current?.focus();
    triggerRef.current = null;
  }

  function showPreviousPhoto() {
    setActive((current) => {
      if (!current) return current;
      return {
        ...current,
        index: current.index === 0 ? current.photos.length - 1 : current.index - 1
      };
    });
  }

  function showNextPhoto() {
    setActive((current) => {
      if (!current) return current;
      return {
        ...current,
        index: current.index === current.photos.length - 1 ? 0 : current.index + 1
      };
    });
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

    if (e.key === 'ArrowLeft' && hasCarousel) {
      e.preventDefault();
      showPreviousPhoto();
      return;
    }

    if (e.key === 'ArrowRight' && hasCarousel) {
      e.preventDefault();
      showNextPhoto();
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
        {visibleAlbums.map((group) => (
          <button
            key={group.name}
            type="button"
            onClick={(e) => openModal(group, e.currentTarget)}
            aria-label={`${labels.viewPhoto}: ${group.name}`}
            className="mb-5 block w-full overflow-hidden rounded-lg border border-ink/10 bg-white text-left shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-white/5"
          >
            <Image
              src={withBasePath(group.cover.src)}
              alt={group.cover.alt}
              width={640}
              height={780}
              className="h-auto w-full"
              loading="lazy"
            />
            <span className="block px-4 py-4 text-sm text-ink/75 dark:text-paper/75">
              <span className="block font-medium text-ink dark:text-paper">{group.name}</span>
              <span>{group.photos.length === 1 ? group.cover.caption : `${group.photos.length} photos`}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${labels.dialogLabel}: ${activePhoto.caption}`}
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
            {hasCarousel ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousPhoto}
                  aria-label={previousPhotoLabel}
                  className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-paper focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <ChevronLeft aria-hidden className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNextPhoto}
                  aria-label={nextPhotoLabel}
                  className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-paper focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <ChevronRight aria-hidden className="h-6 w-6" />
                </button>
              </>
            ) : null}
            <Image
              src={withBasePath(activePhoto.src)}
              alt={activePhoto.alt}
              width={1100}
              height={820}
              className="max-h-[72vh] w-full object-contain"
            />
            <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm text-ink/75 dark:text-paper/75">
              <p>{activePhoto.caption}</p>
              {hasCarousel ? (
                <p className="shrink-0 text-ink/50 dark:text-paper/50">
                  {active.index + 1} / {active.photos.length}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
