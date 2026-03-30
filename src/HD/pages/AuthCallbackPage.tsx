import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Spinner } from '../components/ui';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando confirmação...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Pega os parâmetros da URL (hash ou query)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');
        const error = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

        console.log('🔍 Callback params:', { type, hasAccessToken: !!accessToken, error });

        // Se houver erro
        if (error) {
          console.error('❌ Erro no callback:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'Erro ao confirmar email. Tente novamente.');
          setTimeout(() => navigate('/hd/login'), 3000);
          return;
        }

        // Se for confirmação de email (signup)
        if (type === 'signup' && accessToken && refreshToken) {
          console.log('✅ Confirmação de email detectada');
          
          // Define a sessão manualmente
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('❌ Erro ao definir sessão:', sessionError);
            setStatus('error');
            setMessage('Erro ao processar confirmação. Tente fazer login.');
            setTimeout(() => navigate('/hd/login'), 3000);
            return;
          }

          console.log('✅ Sessão definida:', sessionData.user?.email);

          // Verifica se o perfil existe
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.user!.id)
            .single();

          if (profileError || !profile) {
            console.log('⚠️ Perfil não encontrado, criando...');
            
            // Cria o perfil se não existir
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: sessionData.user!.id,
                email: sessionData.user!.email!,
                full_name: sessionData.user!.user_metadata?.full_name || '',
                phone: sessionData.user!.user_metadata?.phone || '',
                company: sessionData.user!.user_metadata?.company || '',
                role: 'client',
                is_active: true,
              });

            if (createError) {
              console.error('❌ Erro ao criar perfil:', createError);
              // Não bloqueia, pois o usuário já está autenticado
            } else {
              console.log('✅ Perfil criado com sucesso');
            }
          }

          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          
          // Redireciona para os chamados
          setTimeout(() => {
            navigate('/hd/meus-chamados');
          }, 2000);
          return;
        }

        // Se for recuperação de senha
        if (type === 'recovery' && accessToken) {
          console.log('🔑 Recuperação de senha detectada');
          setStatus('success');
          setMessage('Redirecionando para redefinir senha...');
          setTimeout(() => navigate('/hd/redefinir-senha'), 1000);
          return;
        }

        // Caso padrão - verifica sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Sessão ativa encontrada');
          setStatus('success');
          setMessage('Autenticado com sucesso! Redirecionando...');
          setTimeout(() => navigate('/hd/meus-chamados'), 1000);
        } else {
          console.log('⚠️ Nenhuma sessão encontrada');
          setStatus('error');
          setMessage('Sessão não encontrada. Faça login novamente.');
          setTimeout(() => navigate('/hd/login'), 2000);
        }

      } catch (error) {
        console.error('❌ Erro no callback:', error);
        setStatus('error');
        setMessage('Erro ao processar autenticação. Tente novamente.');
        setTimeout(() => navigate('/hd/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <Spinner size="lg" className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processando...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-3xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sucesso!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-close-line text-3xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ops!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/hd/login')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Ir para Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
