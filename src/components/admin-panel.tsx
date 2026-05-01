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
  status: 'pending' | 'approved' | 'removed';
  created_at: string;
};

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<MemoryPost[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from('memory_posts')
      .select('id,name,relationship,message,status,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPosts((data as MemoryPost[]) ?? []));
  }, [user]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setNotice(error ? error.message : 'Signed in.');
  }

  async function updatePost(id: string, status: MemoryPost['status']) {
    if (!supabase) return;
    const { error } = await supabase.from('memory_posts').update({ status }).eq('id', id);
    if (error) {
      setNotice(error.message);
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
        <input name="email" type="email" required placeholder="Email" className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <input name="password" type="password" required placeholder="Password" className="rounded-md border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-twilight" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-paper dark:bg-paper dark:text-ink">
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
        <button onClick={() => supabase?.auth.signOut()} className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10">
          <LogOut aria-hidden className="h-4 w-4" />
          Sign out
        </button>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl">{post.name}</h2>
                <p className="text-sm text-ink/60 dark:text-paper/60">{post.relationship} · {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full border border-ink/10 px-3 py-1 text-xs uppercase tracking-[0.12em] dark:border-white/10">{post.status}</span>
            </div>
            <p className="mt-4 leading-7 text-ink/75 dark:text-paper/75">{post.message}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => updatePost(post.id, 'approved')} className="inline-flex items-center gap-2 rounded-full bg-cedar px-4 py-2 text-sm text-white">
                <Check aria-hidden className="h-4 w-4" />
                Approve
              </button>
              <button onClick={() => updatePost(post.id, 'removed')} className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10">
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
