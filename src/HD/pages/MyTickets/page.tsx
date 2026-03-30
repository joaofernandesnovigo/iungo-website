import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../hooks/useTickets';
import { useMetrics } from '../../hooks/useMetrics';
import { useTicketCustomFieldValues } from '../../hooks/useCustomFields';
import { TicketList, TicketPagination } from '../../components/tickets/TicketList';
import { TicketFiltersBar } from '../../components/tickets/TicketFilters';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { Spinner } from '../../components/ui/Spinner';
import { Sidebar } from '../../components/layout/Sidebar';
import { StatusTabs } from './components/StatusTabs';
import type { TicketPriority, TicketStatus, TicketFilters as TFilters } from '../../types/database.types';
import type { TicketWithRelations } from '../../hooks/useTickets';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, isAuthenticated, isInitialized, isLoading: authLoading } = useAuth();
  const { metrics } = useMetrics();
  const { saveValues } = useTicketCustomFieldValues();

  const initialStatus = searchParams.get('status') as TicketStatus | null;
  const [activeTab, setActiveTab] = useState<TicketStatus | 'all'>(initialStatus || 'all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Build filters based on active tab
  const [customFilters, setCustomFilters] = useState<TFilters>({});
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
    setPage,
    nextPage,
    prevPage,
    setFilters,
    clearFilters,
  } = useTickets({
    filters: mergedFilters,
    pagination: { limit: 10 },
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

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      navigate('/hd/login');
    }
  }, [isInitialized, authLoading, isAuthenticated, navigate]);

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
    category_id?: string;
    customFieldValues?: { field_id: string; value: string }[];
  }) => {
    const result = await createTicket({
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      category_id: data.category_id,
      client_id: profile?.id || '',
    });

    // Salvar valores dos campos personalizados se houver
    if (result.data && data.customFieldValues && data.customFieldValues.length > 0) {
      try {
        await saveValues(result.data.id, data.customFieldValues);
      } catch (err) {
        console.error('Erro ao salvar campos personalizados:', err);
      }
    }

    return { error: result.error };
  }, [createTicket, profile, saveValues]);

  const handleTicketClick = useCallback((ticket: TicketWithRelations) => {
    navigate(`/hd/tickets/${ticket.id}`);
  }, [navigate]);

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
  const openCount = tickets.filter(t => ['new', 'open', 'pending'].includes(t.status)).length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

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
              <h2 className="text-xl font-bold text-slate-900">Meus Chamados</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Acompanhe e gerencie seus chamados de suporte
              </p>
            </div>

            <div className="flex items-center gap-3">
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
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-medium text-amber-700">{openCount} em aberto</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-medium text-emerald-700">{resolvedCount} resolvidos</span>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mb-4">
            <StatusTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tickets={tickets}
              total={pagination.total}
            />
          </div>

          {/* Filters */}
          <div className="mb-4">
            <TicketFiltersBar
              filters={customFilters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Ticket List */}
          <div className="mb-4">
            <TicketList
              tickets={tickets}
              isLoading={isLoading}
              error={error}
              onTicketClick={handleTicketClick}
              showClient={false}
              showAssignee={true}
              emptyMessage={
                activeTab === 'all'
                  ? 'Você ainda não tem chamados'
                  : `Nenhum chamado com status "${activeTab === 'new' ? 'Novo' : activeTab === 'open' ? 'Aberto' : activeTab === 'pending' ? 'Pendente' : activeTab === 'resolved' ? 'Resolvido' : 'Fechado'}"`
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

          {/* Empty State CTA */}
          {!isLoading && tickets.length === 0 && activeTab === 'all' && (
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
                <i className="ri-customer-service-2-line text-4xl text-teal-500"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Precisa de ajuda?
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
                Abra um chamado e nossa equipe de suporte irá ajudá-lo o mais rápido possível.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <i className="ri-add-line text-lg"></i>
                Abrir Primeiro Chamado
              </button>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                <i className="ri-question-line text-xl text-teal-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Como funciona?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Abra um chamado descrevendo seu problema. Nossa equipe responderá em até 24 horas úteis.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                <i className="ri-notification-3-line text-xl text-amber-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Notificações</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Você receberá um e-mail sempre que houver uma atualização no seu chamado.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                <i className="ri-shield-check-line text-xl text-emerald-600"></i>
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Privacidade</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seus chamados são privados e visíveis apenas para você e nossa equipe de suporte.
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
