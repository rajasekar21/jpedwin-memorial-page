'use client';

import { Check, LogIn, LogOut, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type MemoryPost = {
  id: string;
  name: string;
  relationship: string;
  message: string;
  photo_path: string | null;
  status: 'pending' | 'approved' | 'removed';
  created_at: string;
};

type MemoryPostWithPhoto = MemoryPost & {
  photoUrl?: string;
};

const memoryPhotoBucket = 'memories';

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<MemoryPostWithPhoto[]>([]);
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    const client = supabase;

    client
      .from('memory_posts')
      .select('id,name,relationship,message,photo_path,status,created_at')
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        const postsWithPhotos = await Promise.all(
          ((data as MemoryPost[]) ?? []).map(async (post) => {
            if (!post.photo_path) return post;

            const { data: signed } = await client.storage.from(memoryPhotoBucket).createSignedUrl(post.photo_path, 60 * 60);
            return { ...post, photoUrl: signed?.signedUrl };
          })
        );

        setPosts(postsWithPhotos);
      });
  }, [user]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setNotice(error ? 'Sign-in failed. Please check your credentials.' : 'Signed in.');
  }

  async function updatePost(id: string, status: MemoryPost['status']) {
    if (!supabase || updatingId) return;
    setUpdatingId(id);
    const { error } = await supabase.from('memory_posts').update({ status }).eq('id', id);
    setUpdatingId(null);
    if (error) {
      setNotice('Could not update this post. Please try again.');
      return;
    }
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, status } : post)));
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl">Admin setup pending</h1>
        <p className="mt-4 leading-7 text-ink/70 dark:text-paper/70">
          Add Supabase environment variables and run the SQL in <code>supabase/schema.sql</code> to enable moderation, gallery uploads, guestbook review, and biography management.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <form onSubmit={login} className="mx-auto grid max-w-md gap-4 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl">Family admin</h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-paper dark:bg-paper dark:text-ink">
          <LogIn aria-hidden className="h-4 w-4" />
          Sign in
        </button>
        {notice ? <p className="text-sm text-clay dark:text-gold">{notice}</p> : null}
      </form>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-clay dark:text-gold">Moderation</p>
          <h1 className="font-serif text-4xl">Family admin</h1>
        </div>
        <button type="button" onClick={() => supabase?.auth.signOut()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10">
          <LogOut aria-hidden className="h-4 w-4" />
          Sign out
        </button>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {post.photoUrl ? (
                  <span
                    className="h-12 w-12 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.photoUrl})` }}
                    aria-label={`Photo of ${post.name}`}
                    role="img"
                  />
                ) : null}
                <div>
                  <h2 className="font-serif text-xl">{post.name}</h2>
                  <p className="text-sm text-ink/60 dark:text-paper/60">{post.relationship} - {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="rounded-full border border-ink/10 px-3 py-1 text-xs uppercase tracking-[0.12em] dark:border-white/10">{post.status}</span>
            </div>
            <p className="mt-4 leading-7 text-ink/75 dark:text-paper/75">{post.message}</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => updatePost(post.id, 'approved')}
                disabled={updatingId !== null}
                className="inline-flex items-center gap-2 rounded-full bg-cedar px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                <Check aria-hidden className="h-4 w-4" />
                {updatingId === post.id ? 'Saving…' : 'Approve'}
              </button>
              <button
                type="button"
                onClick={() => updatePost(post.id, 'removed')}
                disabled={updatingId !== null}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm disabled:opacity-50 dark:border-white/10"
              >
                <Trash2 aria-hidden className="h-4 w-4" />
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
