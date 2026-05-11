'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const localCountKey = 'jpedwin_memorial_visitor_count';
const sessionCountedKey = 'jpedwin_memorial_visitor_counted';

type VisitorCountProps = {
  label: string;
};

function getLocalVisitCount() {
  try {
    const current = Number.parseInt(window.localStorage.getItem(localCountKey) ?? '0', 10) || 0;
    const hasCountedThisSession = window.sessionStorage.getItem(sessionCountedKey) === 'true';
    const next = hasCountedThisSession ? current : current + 1;

    window.localStorage.setItem(localCountKey, String(next));
    window.sessionStorage.setItem(sessionCountedKey, 'true');

    return next;
  } catch {
    return null;
  }
}

export function VisitorCount({ label }: VisitorCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function updateVisitCount() {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.rpc('increment_site_visit_count');

        if (!error && typeof data === 'number') {
          if (isMounted) {
            setCount(data);
          }
          return;
        }
      }

      const localCount = getLocalVisitCount();
      if (isMounted) {
        setCount(localCount);
      }
    }

    updateVisitCount();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2" aria-live="polite">
      <Eye aria-hidden className="h-4 w-4" />
      {label}: {count === null ? '...' : count.toLocaleString()}
    </span>
  );
}
