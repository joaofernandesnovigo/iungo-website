import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, profile, isLoading: authLoading, user, isInitialized } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Captura mensagem de sucesso da URL (vinda do callback)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(decodeURIComponent(message));
      // Remove o parâmetro da URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search]);

  // Redireciona automaticamente se já estiver autenticado
  useEffect(() => {
    // Aguarda o AuthContext terminar de inicializar
    if (!isInitialized) {
      return;
    }

    // Se está autenticado E tem perfil, redireciona
    if (isAuthenticated && profile) {
      const redirectPath = profile.role === 'admin' 
        ? '/hd/admin' 
        : '/hd/meus-chamados';
      
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, profile, isInitialized, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailNotConfirmed(false);
    setSuccessMessage('');

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Verifica se o erro é de email não confirmado
        if (signInError.includes('Email não confirmado') || signInError.includes('Email not confirmed')) {
          setEmailNotConfirmed(true);
          setError('Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada e clique no link de confirmação.');
        } else {
          setError(signInError);
        }
        setLoading(false);
        return;
      }

      // Login bem-sucedido - o useEffect acima vai redirecionar automaticamente
      
    } catch (err) {
      console.error('❌ LoginPage - Erro no login:', err);
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError('Por favor, digite seu email para reenviar a confirmação.');
      return;
    }

    setResendingEmail(true);
    setError('');

    try {
      const { supabase } = await import('../lib/supabase');

      if (!supabase) {
        setError('Supabase não configurado no .env.');
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/hd/auth/callback`,
        },
      });

      if (resendError) {
        setError('Erro ao reenviar email: ' + resendError.message);
      } else {
        setEmailNotConfirmed(false);
        setSuccessMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      }
    } catch (err) {
      console.error('Erro ao reenviar email:', err);
      setError('Erro ao reenviar email. Tente novamente.');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <img 
            src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9b6a7cb2a8e2dbc199b2b5247d5e284a.png"
            alt="Iungo Intelligence"
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Portal do Cliente</h1>
          <p className="text-slate-600">Acesse sua conta para gerenciar seus chamados</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
              <i className="ri-checkbox-circle-line text-xl text-emerald-600 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-sm text-emerald-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Mensagem de Email Não Confirmado */}
          {emailNotConfirmed && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <i className="ri-mail-line text-xl text-amber-600 mt-0.5"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">Email não confirmado</h3>
                  <p className="text-sm text-amber-800">
                    Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada e clique no link de confirmação.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleResendEmail}
                disabled={resendingEmail}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {resendingEmail ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Reenviando...
                  </>
                ) : (
                  <>
                    <i className="ri-mail-send-line mr-2"></i>
                    Reenviar Email de Confirmação
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && !emailNotConfirmed && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <i className="ri-error-warning-line text-xl text-rose-600 mt-0.5"></i>
              <p className="text-sm text-rose-800 flex-1">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/hd/esqueci-senha"
                className="text-slate-700 hover:text-slate-900 font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Entrando...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line mr-2"></i>
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Link para Registro */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Ainda não tem uma conta?{' '}
              <Link
                to="/hd/registro"
                className="text-slate-800 hover:text-slate-600 font-semibold"
              >
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>

        {/* Link para voltar */}
        <div className="mt-6 text-center">
          <Link
            to="/hd"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
