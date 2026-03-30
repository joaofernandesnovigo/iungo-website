
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Button from '../../../components/base/Button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function RegistroPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Criar Conta - Iungo Intelligence';
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form fields
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Digite um e-mail válido');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil do usuário
        try {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Even if profile creation fails, we can still proceed
            // The user is created, just log the error
          }
        } catch (profileErr) {
          console.error('Profile creation failed:', profileErr);
        }

        navigate('/cursos/meus-cursos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iungo-navy to-iungo-blue flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>
              logo
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mt-6 mb-2">
            Crie sua conta
          </h2>
          <p className="text-iungo-light-gray">
            Comece sua jornada de aprendizado em IA
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <i className="ri-error-warning-fill text-red-400 text-xl mr-3"></i>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iungo-blue focus:border-transparent text-sm"
                placeholder="Digite a senha novamente"
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
                  Criando conta...
                </>
              ) : (
                <>
                  <i className="ri-user-add-line mr-2"></i>
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/cursos/login" className="text-iungo-blue font-semibold hover:underline">
                Fazer login
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
