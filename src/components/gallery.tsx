'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent, type GalleryPhoto, type MemorialContent } from '@/data/memorial';
import { withBasePath } from '@/lib/site';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const SLIDESHOW_INTERVAL_MS = 5000;

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
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
  const activeAlbum = albums.includes(album) ? album : labels.all;
  const activePhoto = active ? active.photos[active.index] : null;
  const hasCarousel = active ? active.photos.length > 1 : false;
  const previousPhotoLabel = labels.previousPhoto ?? 'Previous photo';
  const nextPhotoLabel = labels.nextPhoto ?? 'Next photo';
  const pauseSlideshowLabel = labels.pauseSlideshow ?? 'Pause slideshow';
  const playSlideshowLabel = labels.playSlideshow ?? 'Play slideshow';
  const displayAlbumName = (name: string) => labels.albumNames?.[name] ?? name;

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
    setIsSlideshowPlaying(true);
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

  useEffect(() => {
    if (!active || active.photos.length <= 1 || !isSlideshowPlaying) return;

    const interval = window.setInterval(showNextPhoto, SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [active, isSlideshowPlaying]);

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

  // Warm the browser cache for adjacent lightbox photos so arrow navigation feels instant.
  useEffect(() => {
    if (!active || active.photos.length <= 1) return;

    const adjacentPhotos = [
      active.photos[active.index === 0 ? active.photos.length - 1 : active.index - 1],
      active.photos[active.index === active.photos.length - 1 ? 0 : active.index + 1]
    ];

    const preloads = adjacentPhotos.map((photo) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = withBasePath(photo.src);
      return image;
    });

    return () => {
      preloads.forEach((image) => {
        image.src = '';
      });
    };
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
            {item === labels.all ? item : displayAlbumName(item)}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleAlbums.map((group) => (
          <button
            key={group.name}
            type="button"
            onClick={(e) => openModal(group, e.currentTarget)}
            aria-label={`${labels.viewPhoto}: ${displayAlbumName(group.name)}`}
            className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white text-left shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-white/5"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-linen dark:bg-white/10">
              <Image
                src={withBasePath(group.cover.src)}
                alt={group.cover.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </span>
            <span className="block h-20 px-4 py-4 text-sm text-ink/75 dark:text-paper/75">
              <span className="block font-medium text-ink dark:text-paper">{displayAlbumName(group.name)}</span>
              <span className="line-clamp-2 block">{group.photos.length === 1 ? group.cover.caption : `${group.photos.length} ${labels.photoCount}`}</span>
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
            className="relative flex h-[86vh] max-h-[780px] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-paper shadow-soft dark:bg-twilight"
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
            <div className="relative min-h-0 flex-1 bg-black/5 dark:bg-black/20">
              <Image
                src={withBasePath(activePhoto.src)}
                alt={activePhoto.alt}
                fill
                sizes="min(1024px, 100vw)"
                className="object-contain"
              />
            </div>
            <div className="flex h-20 items-start justify-between gap-4 overflow-hidden px-5 py-4 text-sm text-ink/75 dark:text-paper/75">
              <p className="line-clamp-2">{activePhoto.caption}</p>
              {hasCarousel ? (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSlideshowPlaying((playing) => !playing)}
                    aria-label={isSlideshowPlaying ? pauseSlideshowLabel : playSlideshowLabel}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/20 dark:text-paper/70"
                  >
                    {isSlideshowPlaying ? <Pause aria-hidden className="h-4 w-4" /> : <Play aria-hidden className="h-4 w-4" />}
                  </button>
                  <p className="text-ink/50 dark:text-paper/50">
                    {active ? active.index + 1 : 0} / {active ? active.photos.length : 0}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
