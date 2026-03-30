
import { useAuth } from '../contexts/AuthContext';

export function AccountDisabledPage() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Optionally show a user‑friendly message here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
          <i className="ri-user-forbid-line text-4xl text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Conta Desativada
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          A conta{' '}
          <span className="font-medium">{profile?.email ?? 'seu e‑mail'}</span> foi
          desativada. Entre em contato com o suporte para mais informações.
        </p>

        {/* Support Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <p className="text-sm text-gray-500 mb-2">Precisa de ajuda?</p>
          <a
            href="mailto:suporte@iungo.com.br"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            suporte@iungo.com.br
          </a>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <i className="ri-logout-box-line mr-2" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}

export default AccountDisabledPage;
