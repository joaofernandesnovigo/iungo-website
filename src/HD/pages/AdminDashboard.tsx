import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMetrics } from '../hooks/useMetrics';
import { useTickets } from '../hooks/useTickets';
import { MetricCard, PriorityChart, ActivityChart, RecentTickets } from '../components/dashboard';
import { CreateTicketModal } from '../components/tickets/CreateTicketModal';
import { Spinner } from '../components/ui/Spinner';
import { Sidebar } from '../components/layout/Sidebar';
import type { TicketPriority } from '../types/database.types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const { metrics, isLoading: isLoadingMetrics } = useMetrics();
  const { tickets, isLoading: isLoadingTickets, createTicket } = useTickets({
    pagination: { limit: 5 },
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Listen for sidebar "Novo Chamado" event
  useEffect(() => {
    const handler = () => setIsCreateModalOpen(true);
    window.addEventListener('hd:open-create-ticket', handler);
    return () => window.removeEventListener('hd:open-create-ticket', handler);
  }, []);

  const handleCreateTicket = useCallback(async (data: {
    subject: string;
    description: string;
    priority: TicketPriority;
  }) => {
    const result = await createTicket(data);
    return { error: result.error };
  }, [createTicket]);

  const handleTicketClick = useCallback((ticketId: string) => {
    navigate(`/hd/chamado/${ticketId}`);
  }, [navigate]);

  const formatResponseTime = (minutes: number | null) => {
    if (minutes === null) return '--';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return `${hours}h ${mins}min`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  if (isLoadingMetrics && isLoadingTickets) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-3">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex">
      {/* Sidebar */}
      <Sidebar
        metrics={{
          totalNew: metrics?.totalNew,
          totalAwaitingResponse: metrics?.totalAwaitingResponse,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 ml-[260px] transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isAdmin ? 'Dashboard' : 'Meus Chamados'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAdmin
                  ? 'Visão geral do suporte técnico'
                  : 'Acompanhe seus chamados de suporte'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <i className="ri-add-line text-base"></i>
                Novo Chamado
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-6 lg:px-8 py-6">
          {/* Greeting */}
          <div className="mb-6 p-5 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl text-white">
            <h3 className="text-lg font-semibold">
              Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {isAdmin
                ? `Você tem ${metrics?.totalNew ?? 0} tickets novos e ${metrics?.totalAwaitingResponse ?? 0} aguardando resposta.`
                : 'Veja o resumo dos seus chamados abaixo.'}
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Novos"
              value={metrics?.totalNew ?? 0}
              subtitle="Aguardando atendimento"
              icon={<i className="ri-inbox-line text-xl"></i>}
              color="slate"
            />
            <MetricCard
              title="Aguardando Resposta"
              value={metrics?.totalAwaitingResponse ?? 0}
              subtitle="Pendentes de ação"
              icon={<i className="ri-time-line text-xl"></i>}
              color="amber"
            />
            <MetricCard
              title="Resolvidos Hoje"
              value={metrics?.resolvedToday ?? 0}
              subtitle="Finalizados com sucesso"
              icon={<i className="ri-checkbox-circle-line text-xl"></i>}
              color="emerald"
            />
            {isAdmin && (
              <MetricCard
                title="Tempo Médio"
                value={formatResponseTime(metrics?.avgFirstResponseTime ?? null)}
                subtitle="Primeira resposta"
                icon={<i className="ri-speed-line text-xl"></i>}
                color="indigo"
              />
            )}
            {!isAdmin && (
              <MetricCard
                title="Total Abertos"
                value={
                  (metrics?.ticketsByStatus.new ?? 0) +
                  (metrics?.ticketsByStatus.open ?? 0) +
                  (metrics?.ticketsByStatus.pending ?? 0)
                }
                subtitle="Em andamento"
                icon={<i className="ri-folder-open-line text-xl"></i>}
                color="rose"
              />
            )}
          </div>

          {/* Charts and Recent Tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {metrics?.recentActivity && (
                <ActivityChart data={metrics.recentActivity} />
              )}
              {metrics?.ticketsByPriority && (
                <PriorityChart data={metrics.ticketsByPriority} />
              )}
            </div>

            {/* Right Column - Recent Tickets */}
            <div className="lg:col-span-1">
              <RecentTickets
                tickets={tickets}
                isLoading={isLoadingTickets}
                onTicketClick={handleTicketClick}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}

export default AdminDashboard;
