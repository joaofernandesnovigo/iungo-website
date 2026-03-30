import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** `null` se `.env` não tiver URL/chave — o site público carrega mesmo assim; o helpdesk precisa do Supabase. */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'readdy-helpdesk',
        },
      },
    })
  : null;

if (isSupabaseConfigured) {
  console.log('✅ Supabase Client inicializado com sucesso');
  console.log('🔗 URL:', supabaseUrl);
} else {
  console.warn(
    '⚠️ Supabase não configurado: defina VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY no .env para o helpdesk (/hd/*).'
  );
}

export const isAuthenticated = async (): Promise<boolean> => {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentProfile = async () => {
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
