import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Returns an ephemeral, isolated Supabase client that does NOT persist session.
 * This guarantees creating an auth account will NEVER log out or overwrite
 * the currently logged-in school administrator.
 */
export function getIsolatedAuthClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Generates a clean, compliant temporary password for school accounts.
 */
export function generateDefaultPassword(prefix = 'Absas') {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}@2026${rand}`;
}

/**
 * Creates login credentials in Supabase Auth (auth.users) for a teacher or student.
 * Safely preserves the existing admin session.
 */
export async function createPortalUser({ email, password, fullName, role }) {
  if (!email || !email.trim()) {
    throw new Error('A valid email address is required to create a login account.');
  }
  if (!password || password.trim().length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const client = getIsolatedAuthClient();
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await client.auth.signUp({
    email: cleanEmail,
    password: password.trim(),
    options: {
      data: {
        full_name: fullName || '',
        role: role || 'user',
        created_by: 'sims_admin_portal',
      },
    },
  });

  if (error) {
    if (error.message?.includes('Database error saving new user')) {
      throw new Error(
        'Database trigger conflict on auth.users. Please execute this in your Supabase SQL Editor once: DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; DROP FUNCTION IF EXISTS public.handle_new_user();'
      );
    }
    if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
      throw new Error(`An account with email "${cleanEmail}" is already registered in the login system.`);
    }
    throw error;
  }

  // With email confirmation enabled, Supabase returns a fake user (empty identities)
  // instead of an error when the email is already registered.
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error(`An account with email "${cleanEmail}" is already registered in the login system.`);
  }

  return {
    user: data?.user,
    email: cleanEmail,
    password: password.trim(),
  };
}
