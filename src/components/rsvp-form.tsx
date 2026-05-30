'use client';

import { UserCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type RsvpLabels = {
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  emailHint: string;
  guestCountLabel: string;
  messageLabel: string;
  messageHint: string;
  submit: string;
  submitting: string;
  successMessage: string;
  phaseOneMessage: string;
  errorMessage: string;
};

type Props = {
  eventTitle: string;
  labels: RsvpLabels;
  contactEmail: string;
};

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function RsvpForm({ eventTitle, labels, contactEmail }: Props) {
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'submitting') return;

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const guestCount = Number(fd.get('guest_count') ?? 1);
    const message = String(fd.get('message') ?? '').trim();

    if (!name) return;

    if (!isSupabaseConfigured || !supabase) {
      setState('success');
      return;
    }

    setState('submitting');
    const { error } = await supabase.from('rsvp_attendance').insert({
      event_title: eventTitle,
      name,
      email: email || null,
      guest_count: guestCount,
      message: message || null,
    });

    setState(error ? 'error' : 'success');
  }

  if (state === 'success') {
    const msg = isSupabaseConfigured
      ? labels.successMessage
      : labels.phaseOneMessage.replace('{email}', contactEmail);
    return (
      <p className="mt-4 rounded-lg border border-cedar/30 bg-cedar/10 px-4 py-3 text-sm text-cedar dark:border-gold/30 dark:bg-gold/10 dark:text-gold">
        {msg}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 grid gap-3 rounded-lg border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5"
    >
      <h4 className="flex items-center gap-2 font-serif text-lg">
        <UserCheck aria-hidden className="h-5 w-5 text-clay dark:text-gold" />
        {labels.formTitle}
      </h4>

      {/* Name */}
      <div className="grid gap-1">
        <label htmlFor={`rsvp-name-${eventTitle}`} className="text-sm font-medium">
          {labels.nameLabel} <span aria-hidden className="text-clay">*</span>
        </label>
        <input
          id={`rsvp-name-${eventTitle}`}
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight"
        />
      </div>

      {/* Email + guest count row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor={`rsvp-email-${eventTitle}`} className="text-sm font-medium">
            {labels.emailLabel}
            <span className="ml-1 text-xs text-ink/50 dark:text-paper/50">{labels.emailHint}</span>
          </label>
          <input
            id={`rsvp-email-${eventTitle}`}
            name="email"
            type="email"
            autoComplete="email"
            className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor={`rsvp-guests-${eventTitle}`} className="text-sm font-medium">
            {labels.guestCountLabel}
          </label>
          <select
            id={`rsvp-guests-${eventTitle}`}
            name="guest_count"
            defaultValue="1"
            className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="grid gap-1">
        <label htmlFor={`rsvp-msg-${eventTitle}`} className="text-sm font-medium">
          {labels.messageLabel}
          <span className="ml-1 text-xs text-ink/50 dark:text-paper/50">{labels.messageHint}</span>
        </label>
        <textarea
          id={`rsvp-msg-${eventTitle}`}
          name="message"
          rows={2}
          className="resize-none rounded-md border border-ink/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight"
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-700 dark:text-red-300">{labels.errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="justify-self-start inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-clay disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-paper dark:text-ink"
      >
        {state === 'submitting' ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
