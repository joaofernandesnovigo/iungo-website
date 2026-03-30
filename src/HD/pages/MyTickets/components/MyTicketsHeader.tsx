import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface MyTicketsHeaderProps {
  onNewTicket: () => void;
}

export function MyTicketsHeader({ onNewTicket }: MyTicketsHeaderProps) {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
              <i className="ri-customer-service-2-line text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">READDY</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Help Desk</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/hd"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
              Dashboard
            </Link>
            <span className="text-slate-300 mx-1">|</span>
            <span className="px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">
              Meus Tickets
            </span>
          </nav>

          {/* Mobile Back Button */}
          <Link
            to="/hd"
            className="md:hidden flex items-center gap-1 text-sm text-slate-500 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
            <span>Voltar</span>
          </Link>

          {/* User */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewTicket}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <i className="ri-add-line text-base"></i>
              Novo Chamado
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500">
                  {profile?.company_name || 'Cliente'}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Sair"
              >
                <i className="ri-logout-box-r-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MyTicketsHeader;
