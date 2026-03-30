import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../hooks/useTickets';
import { useMetrics } from '../../hooks/useMetrics';
import { TicketList, TicketPagination } from '../../components/tickets/TicketList';
import { TicketFiltersBar } from '../../components/tickets/TicketFilters';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { Spinner } from '../../components/ui/Spinner';
import { Sidebar } from '../../components/layout/Sidebar';
import type { TicketPriority, TicketStatus, TicketFilters as TFilters } from '../../types/database.types';
import type { TicketWithRelations } from '../../hooks/useTickets';

// Status tabs configuration
const STATUS_TABS: { key: TicketStatus | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Todos', icon: 'ri-list-check-2' },
  { key: 'new', label: 'Novos', icon: 'ri-add-circle-line' },
  { key: 'open', label: 'Abertos', icon: 'ri-folder-open-line' },
  { key: 'pending', label: 'Pendentes', icon: 'ri-time-line' },
  { key: 'resolved', label: 'Resolvidos', icon: 'ri-check-line' },
  { key: 'closed', label: 'Fechados', icon: 'ri-lock-line' },
];

export default function AllTicketsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, isAdmin, isAuthenticated, isInitialized, isLoading: authLoading } = useAuth();
  const { metrics } = useMetrics();

  // Get initial filters from URL
  const initialStatus = searchParams.get('status') as TicketStatus | null;
  const initialPriority = searchParams.get('priority') as TicketPriority | null;

  const [activeTab, setActiveTab] = useState<TicketStatus | 'all'>(initialStatus || 'all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Build filters based on active tab and URL params
  const [customFilters, setCustomFilters] = useState<TFilters>({
    ...(initialPriority ? { priority: initialPriority } : {}),
  });

  const mergedFilters: TFilters = {
    ...customFilters,
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
  };

  const {
    tickets,
    isLoading,
    error,
    pagination,
    createTicket,
    updateTicket,
    setPage,
    nextPage,
    prevPage,
    setFilters,
    clearFilters,
  } = useTickets({
    filters: mergedFilters,
    pagination: { limit: 15 },
  });

  // Sync filters when tab or custom filters change
  useEffect(() => {
    setFilters(mergedFilters);
  }, [activeTab, customFilters]);

  // Listen for sidebar "Novo Chamado" event
  useEffect(() => {
    const handler = () => setIsCreateModalOpen(true);
    window.addEventListener('hd:open-create-ticket', handler);
    return () => window.removeEventListener('hd:open-create-ticket', handler);
  }, []);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (isInitialized && !authLoading) {
      if (!isAuthenticated) {
        navigate('/hd/login');
      } else if (!isAdmin) {
        navigate('/hd/nao-autorizado');
      }
    }
  }, [isInitialized, authLoading, isAuthenticated, isAdmin, navigate]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'all') {
      params.set('status', activeTab);
    }
    if (customFilters.priority) {
      const priority = Array.isArray(customFilters.priority) 
        ? customFilters.priority[0] 
        : customFilters.priority;
      params.set('priority', priority);
    }
    setSearchParams(params, { replace: true });
  }, [activeTab, customFilters.priority, setSearchParams]);

  const handleTabChange = useCallback((tab: TicketStatus | 'all') => {
    setActiveTab(tab);
    setPage(1);
  }, [setPage]);

  const handleFiltersChange = useCallback((filters: TFilters) => {
    const { status, ...rest } = filters;
    setCustomFilters(rest);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCustomFilters({});
    setActiveTab('all');
    clearFilters();
  }, [clearFilters]);

  const handleCreateTicket = useCallback(async (data: {
    subject: string;
    description: string;
    priority: TicketPriority;
  }) => {
    const result = await createTicket({
      ...data,
      client_id: profile?.id || '',
    });
    return { error: result.error };
  }, [createTicket, profile]);

  // Handle ticket assignment
  const handleAssignTicket = useCallback(async (ticketId: string, adminId: string | null) => {
    const result = await updateTicket(ticketId, { assigned_to: adminId });
    return result;
  }, [updateTicket]);

  const handleTicketClick = useCallback((ticket: TicketWithRelations) => {
    navigate(`/hd/tickets/${ticket.id}`);
  }, [navigate]);

  // Count tickets by status
  const getStatusCount = (status: TicketStatus | 'all') => {
    if (status === 'all') return pagination.total;
    return tickets.filter(t => t.status === status).length;
  };

  // Loading state
  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-slate-500 mt-3 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Stats summary
  const newCount = metrics?.totalNew || 0;
  const pendingCount = metrics?.totalAwaitingResponse || 0;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' && !['resolved', 'closed'].includes(t.status)).length;

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
              <h2 className="text-xl font-bold text-slate-900">Todos os Tickets</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gerencie todos os chamados de suporte
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick stats */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                {urgentCount > 0 && (
                  <button
                    onClick={() => {
                      setCustomFilters({ priority: 'urgent' });
                      setActiveTab('all');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-alarm-warning-line"></i>
                    {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <i className="ri-add-line text-base"></i>
                Novo Chamado
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-6 lg:px-8 py-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <i className="ri-ticket-2-line text-xl text-slate-600"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                  <p className="text-xs text-slate-500">Total de tickets</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sky-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                  <i className="ri-add-circle-line text-xl text-sky-600"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-sky-700">{newCount}</p>
                  <p className="text-xs text-slate-500">Novos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-orange-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <i className="ri-time-line text-xl text-orange-600"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
                  <p className="text-xs text-slate-500">Aguardando</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-rose-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                  <i className="ri-alarm-warning-line text-xl text-rose-600"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-700">{urgentCount}</p>
                  <p className="text-xs text-slate-500">Urgentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mb-4 bg-white rounded-xl border border-slate-200 p-1.5">
            <div className="flex items-center gap-1 overflow-x-auto">
              {STATUS_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                      ${isActive 
                        ? 'bg-teal-500 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    <i className={`${tab.icon} text-base`}></i>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <TicketFiltersBar
              filters={customFilters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
              showAssigneeFilter
              showClientFilter
            />
          </div>

          {/* Ticket List */}
          <div className="mb-4">
            <TicketList
              tickets={tickets}
              isLoading={isLoading}
              error={error}
              onTicketClick={handleTicketClick}
              showClient={true}
              showAssignee={true}
              onAssign={handleAssignTicket}
              canAssign={isAdmin}
              emptyMessage={
                activeTab === 'all'
                  ? 'Nenhum ticket encontrado'
                  : `Nenhum ticket com status "${STATUS_TABS.find(t => t.key === activeTab)?.label}"`
              }
              emptyIcon="ri-ticket-line"
            />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-xl border border-slate-200 px-4">
              <TicketPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={setPage}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            </div>
          )}

          {/* Empty State with Tips */}
          {!isLoading && tickets.length === 0 && activeTab === 'all' && !customFilters.search && !customFilters.priority && (
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
                <i className="ri-inbox-line text-4xl text-teal-500"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Nenhum ticket no sistema
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
                Quando os clientes abrirem chamados de suporte, eles aparecerão aqui para você gerenciar.
              </p>
            </div>
          )}

          {/* Admin Tips */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                <i className="ri-user-settings-line text-xl text-teal-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Atribuição</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clique em um ticket para atribuí-lo a um membro da equipe e acompanhar o progresso.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                <i className="ri-filter-3-line text-xl text-amber-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Filtros</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use os filtros para encontrar tickets por status, prioridade ou busca por texto.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center mb-3">
                <i className="ri-alarm-warning-line text-xl text-rose-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Prioridades</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tickets urgentes devem ser tratados primeiro. Fique atento aos indicadores vermelhos.
              </p>
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
