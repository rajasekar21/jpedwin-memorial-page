'use client';

import { Send } from 'lucide-react';
import { FormEvent, useId, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { memorySubmissionSchema } from '@/lib/validation';

type FormState = 'idle' | 'sending' | 'success' | 'error';

const RATE_LIMIT_KEY = 'memory_submissions';
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_SUBMISSIONS) return false;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, now]));
    return true;
  } catch {
    return true;
  }
}

/** Form for submitting a visitor memory; includes honeypot, rate-limiting, and Supabase integration. */
export function MemoryForm() {
  const uid = useId();
  const nameId = `${uid}-name`;
  const relationshipId = `${uid}-relationship`;
  const messageId = `${uid}-message`;
  const statusId = `${uid}-status`;

  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setMessage('');

    const form = new FormData(event.currentTarget);

    // Honeypot — bots fill hidden fields, humans don't
    if (form.get('website')) {
      setState('success');
      setMessage('Your memory has been received. Thank you.');
      event.currentTarget.reset();
      return;
    }

    if (!checkRateLimit()) {
      setState('error');
      setMessage('Too many submissions. Please wait an hour before submitting again.');
      return;
    }

    const parsed = memorySubmissionSchema.safeParse({
      name: form.get('name'),
      relationship: form.get('relationship'),
      message: form.get('message')
    });

    if (!parsed.success) {
      setState('error');
      setMessage('Please complete every field with a respectful memory before submitting.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setState('success');
      setMessage('Your message is ready. In Phase 1, please send it to the family contact so it can be added to the static tribute list.');
      event.currentTarget.reset();
      return;
    }

    const { error } = await supabase.from('memory_posts').insert({
      ...parsed.data,
      status: 'pending'
    });

    if (error) {
      setState('error');
      setMessage('We could not save this memory right now. Please try again later.');
      return;
    }

    setState('success');
    setMessage('Thank you. Your memory was submitted and will appear after family moderation.');
    event.currentTarget.reset();
  }

  const hasStatus = message.length > 0;
  const inputClass = "rounded-md border border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight dark:text-paper";

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={hasStatus ? statusId : undefined}
      className="grid gap-4 rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      {/* Honeypot — hidden from real users, traps bots */}
      <input
        name="website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={nameId} className="text-sm font-medium text-ink dark:text-paper">
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            aria-required="true"
            aria-describedby={hasStatus && state === 'error' ? statusId : undefined}
            className={inputClass}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={relationshipId} className="text-sm font-medium text-ink dark:text-paper">
            Relationship
          </label>
          <input
            id={relationshipId}
            name="relationship"
            required
            minLength={2}
            maxLength={80}
            autoComplete="off"
            aria-required="true"
            aria-describedby={hasStatus && state === 'error' ? statusId : undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor={messageId} className="text-sm font-medium text-ink dark:text-paper">
          Memory or tribute
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          aria-required="true"
          aria-describedby={hasStatus && state === 'error' ? statusId : undefined}
          className={`resize-y ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-clay focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-wait disabled:opacity-70 dark:bg-paper dark:text-ink"
      >
        <Send aria-hidden className="h-4 w-4" />
        {state === 'sending' ? 'Sending…' : 'Submit memory'}
      </button>

      {hasStatus && (
        <p
          id={statusId}
          role="alert"
          aria-live="polite"
          className={`text-sm ${state === 'error' ? 'text-red-700 dark:text-red-300' : 'text-cedar dark:text-gold'}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
