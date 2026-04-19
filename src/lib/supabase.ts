import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Pull envs from Astro/Vercel env (import.meta.env) with process.env fallback for
// Node-only contexts. Never throw at import — gate reads inside callers.
const url =
  (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined) ??
  (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : undefined) ??
  '';
const anonKey =
  (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined) ??
  (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_ANON_KEY : undefined) ??
  '';

let _client: SupabaseClient | null = null;

/**
 * Get (or lazily create) the anon Supabase client. Safe to call at request
 * time even if env vars aren't set — the returned client will simply fail
 * on network requests and the caller can handle the error.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export const TABLES = {
  waitlist: 'meridian_waitlist',
  content: 'meridian_content',
} as const;

export type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export type ContentRow = {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  excerpt: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};
