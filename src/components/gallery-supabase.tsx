'use client';

import { useEffect, useState } from 'react';
import { Gallery } from '@/components/gallery';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { GalleryPhoto, MemorialContent } from '@/data/memorial';

type Props = {
  fallbackPhotos: GalleryPhoto[];
  labels: MemorialContent['gallery'];
};

type DbPhoto = {
  id: string;
  title: string;
  caption: string | null;
  album: string;
  storage_path: string;
  alt_text: string;
};

/** Fetches approved gallery photos from Supabase and falls back to static content. */
export function GallerySupabase({ fallbackPhotos, labels }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackPhotos);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    client
      .from('gallery_photos')
      .select('id,title,caption,album,storage_path,alt_text')
      .eq('status', 'approved')
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (error || !data || data.length === 0) return;

        const withUrls = await Promise.all(
          (data as DbPhoto[]).map(async (row) => {
            const { data: signed } = await client.storage
              .from('gallery')
              .createSignedUrl(row.storage_path, 3600);
            if (!signed?.signedUrl) return null;
            return {
              src: signed.signedUrl,
              alt: row.alt_text,
              album: row.album,
              caption: row.caption ?? row.title,
            } satisfies GalleryPhoto;
          })
        );

        const valid = withUrls.filter((p): p is GalleryPhoto => p !== null);
        if (valid.length > 0) setPhotos(valid);
      });
  }, []);

  return <Gallery photos={photos} labels={labels} />;
}
