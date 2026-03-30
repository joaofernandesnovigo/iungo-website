
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Sidebar navigation item.
 * @typedef {Object} NavItem
 * @property {string} label      - Text displayed for the item.
 * @property {string} icon       - Icon class name (e.g. "ri-dashboard-line").
 * @property {string} path       - Route path to navigate to.
 * @property {number} [badge]    - Optional badge number.
 * @property {boolean} [adminOnly] - If true, item is shown only for admin users.
 */

/**
 * Sidebar component.
 *
 * @param {Object} props
 * @param {{ totalNew?: number, totalAwaitingResponse?: number }=} props.metrics
 */
export function Sidebar({ metrics = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  /** @type {NavItem[]} */
  const navItems = [
    {
      label: 'Dashboard',
      icon: 'ri-dashboard-line',
      path: '/hd/dashboard',
      adminOnly: true,
    },
    {
      label: 'Todos os Tickets',
      icon: 'ri-list-check-2',
      path: '/hd/todos-chamados',
      badge: metrics?.totalNew,
      adminOnly: true,
    },
    {
      label: 'Meus Tickets',
      icon: 'ri-ticket-2-line',
      path: '/hd/meus-chamados',
    },
    {
      label: 'Tickets Novos',
      icon: 'ri-inbox-unarchive-line',
      path: '/hd/todos-chamados?status=new',
      badge: metrics?.totalNew,
      adminOnly: true,
    },
    {
      label: 'Aguardando',
      icon: 'ri-time-line',
      path: '/hd/todos-chamados?status=pending',
      badge: metrics?.totalAwaitingResponse,
      adminOnly: true,
    },
  ];

  // Filter items that require admin privileges
  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  /**
   * Checks if a given path matches the current location.
   *
   * @param {string} path
   * @returns {boolean}
   */
  const isActive = (path) => {
    try {
      if (path.includes('?')) {
        return location.pathname + location.search === path;
      }
      if (
        path === '/hd/dashboard' &&
        (location.pathname === '/hd/dashboard' ||
          location.pathname === '/hd/admin')
      ) {
        return true;
      }
      return location.pathname === path;
    } catch (e) {
      console.error('Error evaluating active state for path:', path, e);
      return false;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 z-50 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <a href="/hd" className="flex items-center gap-3 cursor-pointer">
          {!isCollapsed ? (
            <img
              src="https://static.readdy.ai/image/dbe1411a2951c25cbc2740909a126cdf/9b6a7cb2a8e2dbc199b2b5247d5e284a.png"
              alt="Iungo Intelligence"
              className="h-9 w-auto"
            />
          ) : (
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">IU</span>
            </div>
          )}
        </a>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <i
            className={`${
              isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'
            } text-lg`}
          ></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Menu Principal
          </p>
        )}

        {filteredItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                  active ? 'text-slate-700' : ''
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
              </div>

              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-rose-500 rounded-full">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </>
              )}

              {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute left-12 top-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="my-3 border-t border-slate-100"></div>

        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Ações
          </p>
        )}

        {/* Novo Chamado */}
        <button
          onClick={() => {
            const event = new CustomEvent('hd:open-create-ticket');
            window.dispatchEvent(event);
          }}
          title={isCollapsed ? 'Novo Chamado' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100/60 hover:bg-slate-200 transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-add-circle-line text-lg text-slate-600"></i>
          </div>
          {!isCollapsed && <span>Novo Chamado</span>}
        </button>

        {/* Urgentes (admin only) */}
        {isAdmin && (
          <button
            onClick={() => navigate('/hd/todos-chamados?priority=urgent')}
            title={isCollapsed ? 'Urgentes' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className="ri-alarm-warning-line text-lg"></i>
            </div>
            {!isCollapsed && <span>Urgentes</span>}
          </button>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-100 p-3">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-white">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {isAdmin ? 'Administrador' : 'Cliente'}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Sair"
            >
              <i className="ri-logout-box-r-line text-lg"></i>
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={signOut}
            className="mt-2 w-full p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            title="Sair"
          >
            <i className="ri-logout-box-r-line text-lg"></i>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
