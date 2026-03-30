
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Button from '../../../components/base/Button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login - Iungo Intelligence';
    
    // Verificar se já está logado
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/cursos/meus-cursos');
      }
    } catch (err) {
      console.error('Error checking user:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/cursos/meus-cursos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iungo-navy to-iungo-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>
              logo
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mt-6 mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-iungo-light-gray">
            Acesse sua conta para continuar aprendendo
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <i className="ri-error-warning-fill text-red-400 text-xl mr-3"></i>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full whitespace-nowrap"
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

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link to="/cursos/registro" className="text-iungo-blue font-semibold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/cursos" className="text-white hover:text-iungo-light-blue transition-colors">
            <i className="ri-arrow-left-line mr-2"></i>
            Voltar para Cursos
          </Link>
        </div>
      </div>
    </div>
  );
}
