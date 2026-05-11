import { createClient } from '@supabase/supabase-js';

// NEVER use SUPABASE_SERVICE_ROLE_KEY here — it must stay server-side only.
// Prefixing it with NEXT_PUBLIC_ would expose it in the client bundle.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;
