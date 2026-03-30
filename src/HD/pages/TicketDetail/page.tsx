import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTicketDetail } from '../../hooks/useTicketDetail';
import { useMetrics } from '../../hooks/useMetrics';
import { Sidebar } from '../../components/layout/Sidebar';
import { Spinner } from '../../components/ui/Spinner';
import { TicketHeader } from './components/TicketHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { TicketSidebar } from './components/TicketSidebar';
import { TicketTimeline } from '../../components/history';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isAdmin, isAuthenticated, isInitialized, isLoading: authLoading } = useAuth();
  const { metrics } = useMetrics();
  const [activeTab, setActiveTab] = useState<'messages' | 'history'>('messages');

  const {
    ticket,
    messages,
    admins,
    isLoading,
    isLoadingMessages,
    isSending,
    isUpdating,
    error,
    isConnected,
    sendMessage,
    updateStatus,
    assignTicket,
    updatePriority,
  } = useTicketDetail(id);

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      navigate('/hd/login');
    }
  }, [isInitialized, authLoading, isAuthenticated, navigate]);

  // Check if user has access to this ticket
  useEffect(() => {
    if (ticket && profile && !isAdmin && ticket.client_id !== profile.id) {
      navigate('/hd/nao-autorizado');
    }
  }, [ticket, profile, isAdmin, navigate]);

  // Loading state
  if (!isInitialized || authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-slate-500 mt-3 text-sm">Carregando chamado...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar
          metrics={{
            totalNew: metrics?.totalNew,
            totalAwaitingResponse: metrics?.totalAwaitingResponse,
          }}
        />
        <main className="flex-1 ml-[260px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
              <i className="ri-error-warning-line text-4xl text-rose-500"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Chamado não encontrado</h2>
            <p className="text-slate-500 text-sm mb-6">
              {error || 'O chamado que você está procurando não existe ou foi removido.'}
            </p>
            <button
              onClick={() => navigate('/hd/meus-chamados')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line"></i>
              Voltar aos Chamados
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isTicketClosed = ticket.status === 'closed';

  return (
    <div className="min-h-screen bg-slate-50/80 flex">
      {/* Main Sidebar */}
      <Sidebar
        metrics={{
          totalNew: metrics?.totalNew,
          totalAwaitingResponse: metrics?.totalAwaitingResponse,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen">
        {/* Ticket Header */}
        <TicketHeader ticket={ticket} isConnected={isConnected} />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages/History Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Tabs */}
            <div className="px-6 pt-4 border-b border-slate-200 bg-white">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'bg-white text-slate-800 border-b-2 border-slate-800'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <i className="ri-message-3-line mr-2"></i>
                  Mensagens
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'history'
                      ? 'bg-white text-slate-800 border-b-2 border-slate-800'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <i className="ri-history-line mr-2"></i>
                  Histórico
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'messages' ? (
              <>
                <MessageList
                  messages={messages}
                  isLoading={isLoadingMessages}
                  currentUserId={profile?.id || ''}
                  ticketDescription={ticket.description}
                  ticketCreatedAt={ticket.created_at}
                  clientName={ticket.client?.full_name}
                />

                {/* Closed ticket notice */}
                {isTicketClosed && (
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <i className="ri-lock-line"></i>
                      <span>Este chamado foi fechado e não aceita novas mensagens.</span>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                {!isTicketClosed && (
                  <MessageInput
                    onSend={sendMessage}
                    isSending={isSending}
                    isAdmin={isAdmin}
                    disabled={isTicketClosed}
                  />
                )}
              </>
            ) : (
              <TicketTimeline ticketId={ticket.id} isAdmin={isAdmin} />
            )}
          </div>

          {/* Right Sidebar - Ticket Details */}
          <TicketSidebar
            ticket={ticket}
            admins={admins}
            isAdmin={isAdmin}
            isUpdating={isUpdating}
            onStatusChange={updateStatus}
            onAssigneeChange={assignTicket}
            onPriorityChange={updatePriority}
          />
        </div>
      </main>
    </div>
  );
}
