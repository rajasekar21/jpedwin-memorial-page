'use client';

import { useEffect, useState } from 'react';
import type { Tribute } from '@/data/memorial';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type ApprovedMemory = {
  id: string;
  name: string;
  relationship: string;
  message: string;
  created_at: string;
  photo_path: string | null;
};

type DisplayTribute = {
  id: string;
  name: string;
  relationship: string;
  message: string;
  date: string;
  photoUrl?: string;
};

type MemoryTributesProps = {
  fallbackTributes: Tribute[];
};

const memoryPhotoBucket = 'memories';

function initialsFor(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
}

export function MemoryTributes({ fallbackTributes }: MemoryTributesProps) {
  const [approvedMemories, setApprovedMemories] = useState<DisplayTribute[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const client = supabase;
    let isMounted = true;

    async function loadApprovedMemories() {
      const { data } = await client
        .from('memory_posts')
        .select('id,name,relationship,message,created_at,photo_path')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!isMounted || !data) return;

      const memories = await Promise.all(
        (data as ApprovedMemory[]).map(async (memory) => {
          let photoUrl: string | undefined;

          if (memory.photo_path) {
            const { data: signed } = await client.storage.from(memoryPhotoBucket).createSignedUrl(memory.photo_path, 60 * 60);
            photoUrl = signed?.signedUrl;
          }

          return {
            id: memory.id,
            name: memory.name,
            relationship: memory.relationship,
            message: memory.message,
            date: formatDate(memory.created_at),
            photoUrl
          };
        })
      );

      setApprovedMemories(memories);
    }

    loadApprovedMemories();

    return () => {
      isMounted = false;
    };
  }, []);

  const tributes: DisplayTribute[] = [
    ...approvedMemories,
    ...fallbackTributes.map((tribute) => ({
      id: `static-${tribute.name}`,
      ...tribute
    }))
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tributes.map((tribute) => (
        <article key={tribute.id} className="h-full rounded-lg border border-ink/10 bg-paper p-6 shadow-soft dark:border-white/10 dark:bg-twilight">
          <p className="font-serif text-xl leading-8 text-ink/80 dark:text-paper/80">&ldquo;{tribute.message}&rdquo;</p>
          <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-4 text-sm text-ink/60 dark:border-white/10 dark:text-paper/60">
            {tribute.photoUrl ? (
              <span
                className="h-12 w-12 shrink-0 rounded-full border border-ink/10 bg-cover bg-center dark:border-white/10"
                style={{ backgroundImage: `url(${tribute.photoUrl})` }}
                aria-label={`Photo of ${tribute.name}`}
                role="img"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-linen text-sm font-semibold text-clay dark:border-white/10 dark:bg-white/10 dark:text-gold">
                {initialsFor(tribute.name)}
              </span>
            )}
            <div>
              <p className="font-medium text-ink dark:text-paper">{tribute.name}</p>
              <p>{tribute.relationship}</p>
              <p>{tribute.date}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
