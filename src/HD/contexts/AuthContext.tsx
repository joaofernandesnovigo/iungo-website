import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

// -----------------------------------------------------------------
// Context
// -----------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------------------------------------------
// Hook
// -----------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// -----------------------------------------------------------------
// Provider
// -----------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // -----------------------------------------------------------------
  // Fetch Profile
  // -----------------------------------------------------------------
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    console.log('🔍 HD Auth - Buscando perfil para:', userId);
    
    try {
      console.log('📡 HD Auth - Fazendo query no Supabase...');
      
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📡 HD Auth - Resposta do Supabase recebida');
      console.log('📊 HD Auth - Data:', JSON.stringify(data, null, 2));
      console.log('📊 HD Auth - Error:', JSON.stringify(error, null, 2));

      if (error) {
        console.error('❌ HD Auth - Erro ao buscar perfil:', error.code, error.message, error.details);
        
        // Se o perfil não existe, cria um temporário
        if (error.code === 'PGRST116') {
          console.log('⚠️ HD Auth - Perfil não encontrado, criando perfil temporário...');
          const tempProfile: Profile = {
            id: userId,
            email: user?.email || '',
            full_name: null,
            role: 'user',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return tempProfile;
        }
        
        return null;
      }

      if (!data) {
        console.error('❌ HD Auth - Nenhum perfil retornado');
        return null;
      }

      console.log('✅ HD Auth - Perfil encontrado:', data.email, 'Role:', data.role);
      return data as Profile;
      
    } catch (error) {
      console.error('💥 HD Auth - Exceção ao buscar perfil:', error);
      console.error('💥 HD Auth - Stack:', error instanceof Error ? error.stack : 'N/A');
      
      // Cria perfil temporário em caso de exceção
      console.log('⚠️ HD Auth - Criando perfil temporário devido a exceção...');
      const tempProfile: Profile = {
        id: userId,
        email: user?.email || '',
        full_name: null,
        role: 'user',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return tempProfile;
    }
  };

  // -----------------------------------------------------------------
  // Initialize Auth
  // -----------------------------------------------------------------
  useEffect(() => {
    console.log('🔵 HD Auth - Iniciando...');

    if (!supabase) {
      console.warn('🔵 HD Auth - Supabase ausente; auth desativada.');
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    const client = supabase;

    const initAuth = async () => {
      try {
        console.log('🔵 HD Auth - Obtendo sessão...');
        const { data: { session }, error } = await client.auth.getSession();

        if (error) {
          console.error('❌ HD Auth - Erro ao obter sessão:', error);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        if (session?.user) {
          console.log('✅ HD Auth - Sessão encontrada:', session.user.id);
          setUser(session.user);
          
          const userProfile = await fetchProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        } else {
          console.log('ℹ️ HD Auth - Nenhuma sessão encontrada');
        }
      } catch (error) {
        console.error('❌ HD Auth - Erro ao inicializar:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('✅ HD Auth - Inicialização concluída');
      }
    };

    initAuth();

    // -----------------------------------------------------------------
    // Auth State Listener
    // -----------------------------------------------------------------
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 HD Auth - Evento:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ HD Auth - SIGNED_IN detectado');
          console.log('👤 HD Auth - User ID:', session.user.id);
          console.log('🔄 HD Auth - Buscando perfil após SIGNED_IN...');
          
          setUser(session.user);
          
          const userProfile = await fetchProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            console.log('✅ HD Auth - Perfil carregado após SIGNED_IN');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🔴 HD Auth - SIGNED_OUT detectado');
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 HD Auth - TOKEN_REFRESHED');
        }
      }
    );

    return () => {
      console.log('🔴 HD Auth - Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  // -----------------------------------------------------------------
  // Sign In
  // -----------------------------------------------------------------
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      return {
        error:
          'Supabase não configurado. Adicione VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY no .env',
      };
    }

    console.log('🔐 HD Auth - Tentando login:', email);

    try {
      console.log('📡 HD Auth - Chamando signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📡 HD Auth - Resposta do signInWithPassword recebida');
      console.log('📊 HD Auth - Data:', data);
      console.log('📊 HD Auth - Error:', error);

      if (error) {
        console.error('❌ HD Auth - Erro no login:', error);
        return { error: error.message };
      }

      if (!data.user) {
        console.error('❌ HD Auth - Nenhum usuário retornado');
        return { error: 'Nenhum usuário retornado' };
      }

      console.log('✅ HD Auth - Login bem-sucedido, usuário:', data.user.id);
      console.log('⏳ HD Auth - Aguardando processamento do evento SIGNED_IN...');
      
      // Aguardar um pouco para o evento ser processado
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ HD Auth - Processamento concluído');
      
      return { error: null };
    } catch (error) {
      console.error('❌ HD Auth - Erro ao fazer login:', error);
      return { error: error instanceof Error ? error.message : 'Erro ao fazer login' };
    }
  };

  // -----------------------------------------------------------------
  // Sign Up
  // -----------------------------------------------------------------
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    if (!supabase) {
      return {
        error:
          'Supabase não configurado. Adicione VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY no .env',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/hd/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (!data.user) {
        return { error: 'Erro ao criar usuário' };
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erro ao criar conta' };
    }
  };

  // -----------------------------------------------------------------
  // Sign Out
  // -----------------------------------------------------------------
  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // -----------------------------------------------------------------
  // Update Profile
  // -----------------------------------------------------------------
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: string | null }> => {
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    if (!supabase) {
      return {
        error:
          'Supabase não configurado. Adicione VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY no .env',
      };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Atualiza o perfil local
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erro ao atualizar perfil' };
    }
  };

  // -----------------------------------------------------------------
  // Context Value
  // -----------------------------------------------------------------
  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user && !!profile,
    isAdmin: profile?.role === 'admin',
    isLoading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
