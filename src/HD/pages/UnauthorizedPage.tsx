
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function UnauthorizedPage() {
  const { isAuthenticated, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <i className="ri-shield-cross-line text-4xl text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Acesso Não Autorizado
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          {isAuthenticated ? (
            <>
              Sua conta <span className="font-medium">{profile?.email}</span> não tem
              permissão para acessar esta página.
            </>
          ) : (
            'Você precisa estar autenticado para acessar esta página.'
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/hd"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <i className="ri-home-line mr-2" />
                Ir para Início
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <i className="ri-logout-box-line mr-2" />
                Sair da Conta
              </button>
            </>
          ) : (
            <Link
              to="/hd/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              <i className="ri-login-box-line mr-2" />
              Fazer Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
