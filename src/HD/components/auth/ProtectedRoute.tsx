
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/database.types';
import { Spinner } from '../ui/Spinner';
import React from 'react';

// ============================================
// TYPES
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles permitidas para acessar esta rota */
  allowedRoles?: UserRole[];
  /** Redirecionar para esta rota se não autenticado */
  redirectTo?: string;
  /** Redirecionar para esta rota se não autorizado (role incorreta) */
  unauthorizedRedirect?: string;
  /** Inverter lógica: rota apenas para usuários NÃO autenticados */
  guestOnly?: boolean;
  /** Rota para redirecionar usuários autenticados (quando guestOnly=true) */
  authenticatedRedirect?: string;
}

// ============================================
// LOADING SCREEN
// ============================================

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-600 text-sm">Carregando...</p>
      </div>
    </div>
  );
}

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/hd/login',
  unauthorizedRedirect = '/hd/nao-autorizado',
  guestOnly = false,
  authenticatedRedirect = '/hd/meus-chamados',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized, profile } = useAuth();
  const location = useLocation();

  // -----------------------------------------------------------------
  // Aguardar inicialização para evitar flash de conteúdo
  // -----------------------------------------------------------------
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  // -----------------------------------------------------------------
  // Modo Guest Only: rota apenas para não autenticados
  // -----------------------------------------------------------------
  if (guestOnly) {
    if (isAuthenticated) {
      // Usuário autenticado tentando acessar rota de guest
      // Redirecionar para dashboard apropriado
      const redirectPath =
        profile?.role === 'admin' ? '/hd/admin' : authenticatedRedirect;

      return <Navigate to={redirectPath} replace />;
    }
    // Usuário não autenticado pode acessar
    return <>{children}</>;
  }

  // -----------------------------------------------------------------
  // Verificar autenticação
  // -----------------------------------------------------------------
  if (!isAuthenticated) {
    // Salvar a rota atual para redirecionar após login
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // -----------------------------------------------------------------
  // Verificar role (se especificada)
  // -----------------------------------------------------------------
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = profile?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(
        `🚫 Acesso negado: Role "${userRole}" não está em [${allowedRoles.join(
          ', '
        )}]`
      );
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  // -----------------------------------------------------------------
  // Verificar se perfil está ativo
  // -----------------------------------------------------------------
  if (profile && !profile.is_active) {
    return <Navigate to="/hd/conta-desativada" replace />;
  }

  // -----------------------------------------------------------------
  // Tudo OK - renderizar children
  // -----------------------------------------------------------------
  return <>{children}</>;
}

// ============================================
// CONVENIENCE COMPONENTS
// ============================================

/** Rota apenas para Admins */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

/** Rota apenas para Clientes */
export function ClientRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      {children}
    </ProtectedRoute>
  );
}

/** Rota para qualquer usuário autenticado */
export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

/** Rota apenas para usuários não autenticados (login, registro) */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute guestOnly authenticatedRedirect="/hd/meus-chamados">
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;
