import type { RouteObject } from 'react-router';
import { lazy } from 'react';

// Lazy load pages
const HomePage = lazy(() => import('../pages/home/page'));
const SobrePage = lazy(() => import('../pages/sobre/page'));
const PlataformaPage = lazy(() => import('../pages/plataforma/page'));
const SolucoesPage = lazy(() => import('../pages/solucoes/page'));
const ConvertPage = lazy(() => import('../pages/solucoes/convert/page'));
const AttendantPage = lazy(() => import('../pages/solucoes/attendant/page'));
const ResolvePage = lazy(() => import('../pages/solucoes/resolve/page'));
const ConciergePage = lazy(() => import('../pages/solucoes/concierge/page'));
const BehaviorPage = lazy(() => import('../pages/solucoes/behavior/page'));
const OrganizerPage = lazy(() => import('../pages/solucoes/organizer/page'));
const CasosDeUsoPage = lazy(() => import('../pages/casos-de-uso/page'));
const CarreirasPage = lazy(() => import('../pages/carreiras/page'));
const ContatoPage = lazy(() => import('../pages/contato/page'));
const AgendamentoPage = lazy(() => import('../pages/agendamento/page'));
const PoliticaPrivacidadePage = lazy(() => import('../pages/politica-privacidade/page'));
const ManualAcessoPage = lazy(() => import('../pages/manual-acesso/page'));
const TutoriaisPage = lazy(() => import('../pages/tutoriais/page'));
const CursosPage = lazy(() => import('../pages/cursos/page'));
const CursosLoginPage = lazy(() => import('../pages/cursos/login/page'));
const CursosRegistroPage = lazy(() => import('../pages/cursos/registro/page'));
const MeusCursosPage = lazy(() => import('../pages/cursos/meus-cursos/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Helpdesk: tudo lazy para o site público carregar sem puxar o bundle do HD
const HDWelcomePage = lazy(() => import('../HD/pages/WelcomePage'));
const HDLoginPage = lazy(() => import('../HD/pages/LoginPage'));
const HDRegisterPage = lazy(() => import('../HD/pages/RegisterPage'));
const HDForgotPasswordPage = lazy(() => import('../HD/pages/ForgotPasswordPage'));
const HDAuthCallbackPage = lazy(() => import('../HD/pages/AuthCallbackPage'));
const HDMyTicketsPage = lazy(() => import('../HD/pages/MyTickets/page'));
const HDAllTicketsPage = lazy(() => import('../HD/pages/AllTickets/page'));
const HDTicketDetailPage = lazy(() => import('../HD/pages/TicketDetail/page'));
const HDAdminDashboard = lazy(() => import('../HD/pages/AdminDashboard'));
const HDSettingsPage = lazy(() => import('../HD/pages/Settings/page'));
const HDUnauthorizedPage = lazy(() => import('../HD/pages/UnauthorizedPage'));
const HDAccountDisabledPage = lazy(() => import('../HD/pages/AccountDisabledPage'));

const ProtectedRoute = lazy(async () => {
  const mod = await import('../HD/components/auth/ProtectedRoute');
  return { default: mod.ProtectedRoute };
});

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sobre',
    element: <SobrePage />,
  },
  {
    path: '/plataforma',
    element: <PlataformaPage />,
  },
  {
    path: '/solucoes',
    element: <SolucoesPage />,
  },
  {
    path: '/solucoes/convert',
    element: <ConvertPage />,
  },
  {
    path: '/solucoes/attendant',
    element: <AttendantPage />,
  },
  {
    path: '/solucoes/resolve',
    element: <ResolvePage />,
  },
  {
    path: '/solucoes/concierge',
    element: <ConciergePage />,
  },
  {
    path: '/solucoes/behavior',
    element: <BehaviorPage />,
  },
  {
    path: '/solucoes/organizer',
    element: <OrganizerPage />,
  },
  {
    path: '/casos-de-uso',
    element: <CasosDeUsoPage />,
  },
  {
    path: '/carreiras',
    element: <CarreirasPage />,
  },
  {
    path: '/contato',
    element: <ContatoPage />,
  },
  {
    path: '/agendamento',
    element: <AgendamentoPage />,
  },
  {
    path: '/politica-privacidade',
    element: <PoliticaPrivacidadePage />,
  },
  {
    path: '/cursos',
    element: <CursosPage />,
  },
  {
    path: '/cursos/login',
    element: <CursosLoginPage />,
  },
  {
    path: '/cursos/registro',
    element: <CursosRegistroPage />,
  },
  {
    path: '/cursos/meus-cursos',
    element: <MeusCursosPage />,
  },
  {
    path: '/manual-acesso',
    element: <ManualAcessoPage />,
  },
  {
    path: '/tutoriais',
    element: <TutoriaisPage />,
  },
  // HD Routes
  {
    path: '/hd',
    element: <HDWelcomePage />,
  },
  {
    path: '/hd/portal',
    element: <HDWelcomePage />,
  },
  {
    path: '/hd/login',
    element: <HDLoginPage />,
  },
  {
    path: '/hd/registro',
    element: <HDRegisterPage />,
  },
  {
    path: '/hd/esqueci-senha',
    element: <HDForgotPasswordPage />,
  },
  {
    path: '/hd/auth/callback',
    element: <HDAuthCallbackPage />,
  },
  {
    path: '/hd/meus-chamados',
    element: (
      <ProtectedRoute>
        <HDMyTicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/todos-chamados',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <HDAllTicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/tickets/:id',
    element: (
      <ProtectedRoute>
        <HDTicketDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <HDAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <HDAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/configuracoes',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <HDSettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hd/nao-autorizado',
    element: <HDUnauthorizedPage />,
  },
  {
    path: '/hd/conta-desativada',
    element: <HDAccountDisabledPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
