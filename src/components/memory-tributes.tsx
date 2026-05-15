'use client';

import { useEffect, useRef, useState } from 'react';
import { defaultContent, type MemorialContent, type Tribute, type TributeMessage } from '@/data/memorial';
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
  message: TributeMessage;
  date: string;
  photoUrl?: string;
};

type MemoryTributesProps = {
  fallbackTributes: Tribute[];
  labels?: MemorialContent['tributeLabels'];
};

type TributeMessageBodyProps = {
  message: TributeMessage;
};

const memoryPhotoBucket = 'memories';
const collapsedMessageHeight = 224;

function initialsFor(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric'
  });
}

function TributeMessageBody({ message }: TributeMessageBodyProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const messages = Array.isArray(message) ? message : [message];

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    function updateOverflow() {
      const content = contentRef.current;
      if (!content) return;

      setCanExpand(content.scrollHeight > collapsedMessageHeight + 1);
    }

    updateOverflow();

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [message, isExpanded]);

  return (
    <div>
      <div className="relative">
        <div ref={contentRef} className={`space-y-4 ${isExpanded ? '' : 'max-h-56 overflow-hidden'}`}>
          {messages.map((line, index) =>
            Array.isArray(message) ? (
              <p key={index} className="font-serif text-base leading-7 text-ink/80 dark:text-paper/80">
                {line}
              </p>
            ) : (
              <p key={index} className="font-serif text-base leading-7 text-ink/80 dark:text-paper/80">
                &ldquo;{line}&rdquo;
              </p>
            )
          )}
        </div>
        {canExpand && !isExpanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-paper to-paper/0 dark:from-twilight dark:to-twilight/0" />
        ) : null}
      </div>
      {canExpand ? (
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-clay underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 dark:text-gold dark:focus-visible:ring-gold/40"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  );
}

export function MemoryTributes({ fallbackTributes, labels = defaultContent.tributeLabels }: MemoryTributesProps) {
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
            date: formatDate(memory.created_at, labels.dateLocale),
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
  }, [labels.dateLocale]);

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
          <TributeMessageBody message={tribute.message} />
          <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-4 text-sm text-ink/60 dark:border-white/10 dark:text-paper/60">
            {tribute.photoUrl ? (
              <span
                className="h-12 w-12 shrink-0 rounded-full border border-ink/10 bg-cover bg-center dark:border-white/10"
                style={{ backgroundImage: `url(${tribute.photoUrl})` }}
                aria-label={`${labels.photoOf} ${tribute.name}`}
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
