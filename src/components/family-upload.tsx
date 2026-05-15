'use client';

import { Check, ImagePlus, LogIn, LogOut, Trash2, Upload } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { defaultContent } from '@/data/memorial';

type UploadState = 'idle' | 'submitting' | 'success' | 'error';

type GalleryUpload = {
  id: string;
  title: string;
  caption: string | null;
  album: string;
  storage_path: string;
  status: 'pending' | 'approved' | 'removed';
  created_at: string;
  signedUrl?: string;
};

const ALBUMS = ['Memories', 'Recent', 'Retirement', 'Mentor'];
const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

type Props = { language?: 'en' | 'ta' };

function albumFolder(album: string) {
  return album
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gallery';
}

export function FamilyUpload({ language = 'en' }: Props) {
  const labels = defaultContent.upload;

  const [user, setUser] = useState<User | null>(null);
  const [isFamilyMember, setIsFamilyMember] = useState(false);
  const [memberCheckDone, setMemberCheckDone] = useState(false);
  const [setupError, setSetupError] = useState(false);
  const [uploads, setUploads] = useState<GalleryUpload[]>([]);
  const [state, setState] = useState<UploadState>('idle');
  const [notice, setNotice] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Auth listener
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Check family_members membership when user changes
  useEffect(() => {
    if (!supabase || !user) {
      const id = setTimeout(() => { setIsFamilyMember(false); setMemberCheckDone(true); }, 0);
      return () => clearTimeout(id);
    }
    setMemberCheckDone(false);
    supabase
      .from('family_members')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          // Table missing or RLS error — surface setup problem rather than "not authorised"
          setSetupError(true);
          setIsFamilyMember(false);
        } else {
          setSetupError(false);
          setIsFamilyMember(!!data);
        }
        setMemberCheckDone(true);
      });
  }, [user]);

  // Load this user's own submissions with signed URLs
  useEffect(() => {
    if (!supabase || !user || !isFamilyMember) return;
    const client = supabase;
    client
      .from('gallery_photos')
      .select('id,title,caption,album,storage_path,status,created_at')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        const rows = (data as GalleryUpload[]) ?? [];
        const withUrls = await Promise.all(
          rows.map(async (row) => {
            const { data: signed } = await client.storage
              .from('gallery')
              .createSignedUrl(row.storage_path, 3600);
            return { ...row, signedUrl: signed?.signedUrl };
          })
        );
        setUploads(withUrls);
      });
  }, [user, isFamilyMember]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type) || file.size > MAX_BYTES) {
      setNotice(labels.validationError);
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setNotice('');
  }

  function removePhoto() {
    setPhoto(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (photoRef.current) photoRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase || !user) return;

    const form = new FormData(e.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    const caption = String(form.get('caption') ?? '').trim();
    const album = String(form.get('album') ?? '').trim();

    if (!title || !caption || !album || !photo) {
      setNotice(labels.validationError);
      return;
    }

    setState('submitting');
    setNotice('');

    const ext = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${albumFolder(album)}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(path, photo, { contentType: photo.type, upsert: false });

    if (uploadError) {
      setState('error');
      setNotice(labels.uploadError);
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('gallery_photos')
      .insert({
        title,
        caption,
        album,
        storage_path: path,
        alt_text: title,
        status: 'pending',
        uploaded_by: user.id,
      })
      .select('id,title,caption,album,storage_path,status,created_at')
      .single();

    if (insertError) {
      // Clean up the orphaned storage object
      await supabase.storage.from('gallery').remove([path]);
      setState('error');
      setNotice(labels.saveError);
      return;
    }

    setState('success');
    setNotice(labels.successMessage);
    removePhoto();
    (e.target as HTMLFormElement).reset();

    const { data: signed } = await supabase.storage
      .from('gallery')
      .createSignedUrl(path, 3600);
    setUploads((prev) => [
      { ...(inserted as GalleryUpload), signedUrl: signed?.signedUrl },
      ...prev,
    ]);
  }

  function statusBadge(status: GalleryUpload['status']) {
    const map = {
      pending: labels.statusPending,
      approved: labels.statusApproved,
      removed: labels.statusRemoved,
    };
    const colour = {
      pending: 'border-gold text-gold',
      approved: 'border-cedar text-cedar',
      removed: 'border-clay/50 text-clay/70 dark:border-white/20 dark:text-paper/40',
    };
    return (
      <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${colour[status]}`}>
        {map[status]}
      </span>
    );
  }

  // --- Not configured ---
  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl">{labels.pageTitle}</h1>
        <p className="mt-4 leading-7 text-ink/70 dark:text-paper/70">
          Add Supabase environment variables and run <code>supabase/schema.sql</code> +{' '}
          <code>supabase/add-family-upload.sql</code> to enable photo uploads.
        </p>
      </div>
    );
  }

  // --- Sign-in form ---
  if (!user) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!supabase) return;
          const fd = new FormData(e.currentTarget);
          const { error } = await supabase.auth.signInWithPassword({
            email: String(fd.get('email')),
            password: String(fd.get('password')),
          });
          setNotice(error ? labels.signInError : '');
        }}
        className="mx-auto grid max-w-md gap-4 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5"
      >
        <h1 className="font-serif text-3xl">{labels.pageTitle}</h1>
        <p className="text-sm text-ink/65 dark:text-paper/65">{labels.pageIntro}</p>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          autoComplete="current-password"
          className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-paper dark:bg-paper dark:text-ink"
        >
          <LogIn aria-hidden className="h-4 w-4" />
          {labels.signIn}
        </button>
        {notice && <p className="text-sm text-clay dark:text-gold">{notice}</p>}
      </form>
    );
  }

  // --- Checking membership ---
  if (!memberCheckDone) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <p className="text-sm text-ink/60 dark:text-paper/60">Checking access…</p>
      </div>
    );
  }

  // --- Database not set up yet ---
  if (setupError) {
    return (
      <div className="rounded-lg border border-clay/30 bg-clay/10 p-6 dark:border-gold/30 dark:bg-gold/10">
        <h1 className="font-serif text-2xl">{labels.pageTitle}</h1>
        <p className="mt-3 leading-7 text-ink/70 dark:text-paper/70">
          The family members database table has not been set up yet. Please ask the family admin to run{' '}
          <code className="rounded bg-ink/10 px-1 py-0.5 text-sm">supabase/add-family-upload.sql</code> in
          the Supabase SQL editor and register your account using{' '}
          <code className="rounded bg-ink/10 px-1 py-0.5 text-sm">supabase/register-family-members.sql</code>.
        </p>
        <button
          type="button"
          onClick={() => supabase?.auth.signOut()}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10"
        >
          <LogOut aria-hidden className="h-4 w-4" />
          {labels.signOut}
        </button>
      </div>
    );
  }

  // --- Not a family member ---
  if (!isFamilyMember) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-2xl">{labels.pageTitle}</h1>
        <p className="mt-3 text-ink/70 dark:text-paper/70">{labels.notAuthorised}</p>
        <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">
          Signed in as <strong>{user?.email}</strong>. If this is incorrect, sign out and try again.
        </p>
        <button
          type="button"
          onClick={() => supabase?.auth.signOut()}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10"
        >
          <LogOut aria-hidden className="h-4 w-4" />
          {labels.signOut}
        </button>
      </div>
    );
  }

  // --- Upload form + submissions list ---
  return (
    <div className={`grid gap-10 ${language === 'ta' ? 'tamil-content' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-clay dark:text-gold">
            {labels.pageTitle}
          </p>
          <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">{labels.pageIntro}</p>
        </div>
        <button
          type="button"
          onClick={() => supabase?.auth.signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10"
        >
          <LogOut aria-hidden className="h-4 w-4" />
          {labels.signOut}
        </button>
      </div>

      {/* Upload form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor="up-title" className="text-sm font-medium">
              {labels.titleLabel}
            </label>
            <input
              id="up-title"
              name="title"
              type="text"
              required
              maxLength={120}
              className="rounded-md border border-ink/10 bg-white px-4 py-2.5 text-sm dark:border-white/10 dark:bg-twilight"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="up-album" className="text-sm font-medium">
              {labels.albumLabel}
            </label>
            <select
              id="up-album"
              name="album"
              required
              defaultValue=""
              className="rounded-md border border-ink/10 bg-white px-4 py-2.5 text-sm dark:border-white/10 dark:bg-twilight"
            >
              <option value="" disabled>
                —
              </option>
              {ALBUMS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="up-caption" className="text-sm font-medium">
            {labels.captionLabel}
          </label>
          <input
            id="up-caption"
            name="caption"
            type="text"
            required
            maxLength={200}
            className="rounded-md border border-ink/10 bg-white px-4 py-2.5 text-sm dark:border-white/10 dark:bg-twilight"
          />
        </div>

        {/* Photo picker */}
        <div className="grid gap-2">
          <span className="text-sm font-medium">{labels.photoLabel}</span>
          <p className="text-xs text-ink/50 dark:text-paper/50">{labels.photoHint}</p>
          {preview ? (
            <div className="relative w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-28 w-40 rounded-md object-cover" />
              <button
                type="button"
                onClick={removePhoto}
                aria-label={labels.removePhoto}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink"
              >
                <Trash2 aria-hidden className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-clay focus-within:ring-2 focus-within:ring-gold dark:border-white/15">
              <ImagePlus aria-hidden className="h-4 w-4" />
              {labels.choosePhoto}
              <input
                ref={photoRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>

        {notice && (
          <p
            role="status"
            className={`text-sm ${state === 'success' ? 'text-cedar dark:text-gold' : 'text-clay dark:text-gold'}`}
          >
            {state === 'success' && <Check aria-hidden className="mr-1 inline h-4 w-4" />}
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-sm text-paper transition disabled:opacity-60 dark:bg-paper dark:text-ink"
        >
          <Upload aria-hidden className="h-4 w-4" />
          {state === 'submitting' ? labels.submitting : labels.submit}
        </button>
      </form>

      {/* My submissions */}
      <section>
        <h2 className="mb-5 font-serif text-2xl">{labels.myUploadsTitle}</h2>
        {uploads.length === 0 ? (
          <p className="text-sm text-ink/60 dark:text-paper/60">{labels.noUploads}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploads.map((up) => (
              <div
                key={up.id}
                className="overflow-hidden rounded-lg border border-ink/10 bg-white/65 shadow-soft dark:border-white/10 dark:bg-white/5"
              >
                {up.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={up.signedUrl}
                    alt={up.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-linen dark:bg-white/5">
                    <ImagePlus aria-hidden className="h-8 w-8 text-ink/20" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-lg leading-snug">{up.title}</p>
                    {statusBadge(up.status)}
                  </div>
                  <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{up.caption}</p>
                  <p className="mt-2 text-xs text-ink/40 dark:text-paper/40">
                    {up.album} · {new Date(up.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
