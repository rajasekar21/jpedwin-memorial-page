'use client';

import { Check, ImagePlus, LogIn, LogOut, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Status = 'pending' | 'approved' | 'removed';
type Tab = 'memories' | 'gallery';

type MemoryPost = {
  id: string;
  name: string;
  relationship: string;
  message: string;
  photo_path: string | null;
  status: Status;
  created_at: string;
  photoUrl?: string;
};

type GalleryPhoto = {
  id: string;
  title: string;
  caption: string | null;
  album: string;
  storage_path: string;
  status: Status;
  created_at: string;
  signedUrl?: string;
};

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('memories');
  const [posts, setPosts] = useState<MemoryPost[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load memory posts when signed in
  useEffect(() => {
    if (!supabase || !user) return;
    const client = supabase;
    client
      .from('memory_posts')
      .select('id,name,relationship,message,photo_path,status,created_at')
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        const rows = (data as MemoryPost[]) ?? [];
        const withPhotos = await Promise.all(
          rows.map(async (post) => {
            if (!post.photo_path) return post;
            const { data: signed } = await client.storage
              .from('memories')
              .createSignedUrl(post.photo_path, 3600);
            return { ...post, photoUrl: signed?.signedUrl };
          })
        );
        setPosts(withPhotos);
      });
  }, [user]);

  // Load gallery photos when signed in
  useEffect(() => {
    if (!supabase || !user) return;
    const client = supabase;
    client
      .from('gallery_photos')
      .select('id,title,caption,album,storage_path,status,created_at')
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        const rows = (data as GalleryPhoto[]) ?? [];
        const withUrls = await Promise.all(
          rows.map(async (photo) => {
            const { data: signed } = await client.storage
              .from('gallery')
              .createSignedUrl(photo.storage_path, 3600);
            return { ...photo, signedUrl: signed?.signedUrl };
          })
        );
        setGalleryPhotos(withUrls);
      });
  }, [user]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get('email')),
      password: String(fd.get('password')),
    });
    setNotice(error ? 'Sign-in failed. Please check your credentials.' : 'Signed in.');
  }

  async function updatePost(id: string, status: Status) {
    if (!supabase || updatingId) return;
    setUpdatingId(id);
    const { error } = await supabase.from('memory_posts').update({ status }).eq('id', id);
    setUpdatingId(null);
    if (error) { setNotice('Could not update this post. Please try again.'); return; }
    setPosts((cur) => cur.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function updateGallery(id: string, status: Status) {
    if (!supabase || updatingId) return;
    setUpdatingId(id);
    const { error } = await supabase.from('gallery_photos').update({ status }).eq('id', id);
    setUpdatingId(null);
    if (error) { setNotice('Could not update this photo. Please try again.'); return; }
    setGalleryPhotos((cur) => cur.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function StatusBadge({ status }: { status: Status }) {
    const colour: Record<Status, string> = {
      pending: 'border-gold/60 text-gold',
      approved: 'border-cedar text-cedar',
      removed: 'border-ink/20 text-ink/40 dark:border-white/20 dark:text-paper/40',
    };
    return (
      <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${colour[status]}`}>
        {status}
      </span>
    );
  }

  function ActionButtons({
    id, onUpdate,
  }: { id: string; onUpdate: (id: string, s: Status) => void }) {
    return (
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onUpdate(id, 'approved')}
          disabled={updatingId !== null}
          className="inline-flex items-center gap-2 rounded-full bg-cedar px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          <Check aria-hidden className="h-4 w-4" />
          {updatingId === id ? 'Saving…' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => onUpdate(id, 'removed')}
          disabled={updatingId !== null}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm disabled:opacity-50 dark:border-white/10"
        >
          <Trash2 aria-hidden className="h-4 w-4" />
          Remove
        </button>
      </div>
    );
  }

  // --- Not configured ---
  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl">Admin setup pending</h1>
        <p className="mt-4 leading-7 text-ink/70 dark:text-paper/70">
          Add Supabase environment variables and run the SQL in{' '}
          <code>supabase/schema.sql</code> to enable moderation, gallery uploads,
          guestbook review, and biography management.
        </p>
      </div>
    );
  }

  // --- Sign-in ---
  if (!user) {
    return (
      <form
        onSubmit={login}
        className="mx-auto grid max-w-md gap-4 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5"
      >
        <h1 className="font-serif text-3xl">Family admin</h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="email"
          className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password"
          className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <button type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-paper dark:bg-paper dark:text-ink">
          <LogIn aria-hidden className="h-4 w-4" />
          Sign in
        </button>
        {notice && <p className="text-sm text-clay dark:text-gold">{notice}</p>}
      </form>
    );
  }

  const pendingMemories = posts.filter((p) => p.status === 'pending').length;
  const pendingGallery = galleryPhotos.filter((p) => p.status === 'pending').length;

  // --- Dashboard ---
  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-clay dark:text-gold">Moderation</p>
          <h1 className="font-serif text-4xl">Family admin</h1>
        </div>
        <button type="button" onClick={() => supabase?.auth.signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10">
          <LogOut aria-hidden className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {notice && <p className="text-sm text-clay dark:text-gold">{notice}</p>}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-ink/10 dark:border-white/10" role="tablist">
        {(['memories', 'gallery'] as Tab[]).map((t) => {
          const count = t === 'memories' ? pendingMemories : pendingGallery;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-gold ${
                tab === t
                  ? 'border-b-2 border-ink font-medium dark:border-paper'
                  : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              {t}
              {count > 0 && (
                <span className="rounded-full bg-clay px-2 py-0.5 text-xs text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Memories tab */}
      {tab === 'memories' && (
        <div className="grid gap-4">
          {posts.length === 0 && (
            <p className="text-sm text-ink/60 dark:text-paper/60">No memory submissions yet.</p>
          )}
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {post.photoUrl && (
                    <span
                      className="h-12 w-12 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.photoUrl})` }}
                      role="img"
                      aria-label={`Photo of ${post.name}`}
                    />
                  )}
                  <div>
                    <h2 className="font-serif text-xl">{post.name}</h2>
                    <p className="text-sm text-ink/60 dark:text-paper/60">
                      {post.relationship} · {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={post.status} />
              </div>
              <p className="mt-4 leading-7 text-ink/75 dark:text-paper/75">{post.message}</p>
              <ActionButtons id={post.id} onUpdate={updatePost} />
            </article>
          ))}
        </div>
      )}

      {/* Gallery tab */}
      {tab === 'gallery' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPhotos.length === 0 && (
            <p className="col-span-full text-sm text-ink/60 dark:text-paper/60">
              No gallery photo submissions yet.
            </p>
          )}
          {galleryPhotos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-lg border border-ink/10 bg-white/70 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              {photo.signedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.signedUrl}
                  alt={photo.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-linen dark:bg-white/5">
                  <ImagePlus aria-hidden className="h-8 w-8 text-ink/20" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-lg leading-snug">{photo.title}</p>
                    <p className="mt-0.5 text-xs text-ink/50 dark:text-paper/50">
                      {photo.album} · {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={photo.status} />
                </div>
                {photo.caption && (
                  <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">{photo.caption}</p>
                )}
                <ActionButtons id={photo.id} onUpdate={updateGallery} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
