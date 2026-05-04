'use client';

import { ImagePlus, Send, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useId, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { memoryPhotoSchema, memorySubmissionSchema } from '@/lib/validation';

type FormState = 'idle' | 'sending' | 'success' | 'error';

const RATE_LIMIT_KEY = 'memory_submissions';
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const memoryPhotoBucket = 'memories';

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const timestamps: number[] = Array.isArray(parsed)
      ? parsed.filter((t): t is number => typeof t === 'number')
      : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_SUBMISSIONS) return false;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, now]));
    return true;
  } catch {
    return false;
  }
}

/** Form for submitting a visitor memory; includes honeypot, rate-limiting, photo upload, and Supabase integration. */
export function MemoryForm() {
  const uid = useId();
  const nameId = `${uid}-name`;
  const relationshipId = `${uid}-relationship`;
  const messageId = `${uid}-message`;
  const photoId = `${uid}-photo`;
  const statusId = `${uid}-status`;

  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [selectedPhotoName, setSelectedPhotoName] = useState('');

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (photoPreview) URL.revokeObjectURL(photoPreview);

    if (!file) {
      setPhotoPreview('');
      setSelectedPhotoName('');
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setSelectedPhotoName(file.name);
  }

  function clearPhoto(form: HTMLFormElement | null) {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    setSelectedPhotoName('');

    const input = form?.elements.namedItem('photo') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setMessage('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const photo = form.get('photo');

    // Honeypot: bots fill hidden fields, humans do not.
    if (form.get('website')) {
      setState('success');
      setMessage('Your memory has been received. Thank you.');
      formElement.reset();
      clearPhoto(formElement);
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
    const parsedPhoto = memoryPhotoSchema.safeParse(photo instanceof File && photo.size > 0 ? photo : undefined);

    if (!parsed.success || !parsedPhoto.success) {
      setState('error');
      setMessage(parsedPhoto.success ? 'Please complete every field with a respectful memory before submitting.' : parsedPhoto.error.issues[0]?.message ?? 'Please choose a valid photo.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setState('success');
      setMessage('Your message is ready. In Phase 1, please send it to the family contact so it can be added to the static tribute list.');
      formElement.reset();
      clearPhoto(formElement);
      return;
    }

    const client = supabase;
    let photoPath: string | null = null;

    if (parsedPhoto.data) {
      const extension = parsedPhoto.data.name.split('.').pop()?.toLowerCase() || 'jpg';
      photoPath = `memory-authors/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await client.storage.from(memoryPhotoBucket).upload(photoPath, parsedPhoto.data, {
        cacheControl: '3600',
        contentType: parsedPhoto.data.type,
        upsert: false
      });

      if (uploadError) {
        setState('error');
        setMessage('We could not upload the photo right now. Please try again or submit without a photo.');
        return;
      }
    }

    const { error } = await client.from('memory_posts').insert({
      ...parsed.data,
      photo_path: photoPath,
      status: 'pending'
    });

    if (error) {
      setState('error');
      setMessage('We could not save this memory right now. Please try again later.');
      return;
    }

    setState('success');
    setMessage('Thank you. Your memory was submitted and will appear after family moderation.');
    formElement.reset();
    clearPhoto(formElement);
  }

  const hasStatus = message.length > 0;
  const inputClass = 'rounded-md border border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:bg-twilight dark:text-paper';

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={hasStatus ? statusId : undefined}
      className="grid gap-4 rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      <input
        name="website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
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

      <div className="grid gap-2">
        <label htmlFor={photoId} className="text-sm font-medium text-ink dark:text-paper">
          Your photo <span className="font-normal text-ink/55 dark:text-paper/55">Optional JPG, PNG, or WebP up to 5 MB</span>
        </label>
        <label htmlFor={photoId} className="flex cursor-pointer flex-wrap items-center gap-4 rounded-md border border-dashed border-ink/15 bg-white px-4 py-4 dark:border-white/15 dark:bg-twilight">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm font-medium dark:border-white/10">
            <ImagePlus aria-hidden className="h-4 w-4" />
            Choose photo
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-normal text-ink/60 dark:text-paper/60">{selectedPhotoName || 'No photo selected'}</span>
          <input id={photoId} name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
        </label>
      </div>

      {photoPreview ? (
        <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-linen/70 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${photoPreview})` }} aria-hidden />
            <p className="truncate text-sm text-ink/70 dark:text-paper/70">{selectedPhotoName}</p>
          </div>
          <button type="button" onClick={(event) => clearPhoto(event.currentTarget.form)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/70 focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/10 dark:text-paper/70" aria-label="Remove selected photo">
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-clay focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-wait disabled:opacity-70 dark:bg-paper dark:text-ink"
      >
        <Send aria-hidden className="h-4 w-4" />
        {state === 'sending' ? 'Sending...' : 'Submit memory'}
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
