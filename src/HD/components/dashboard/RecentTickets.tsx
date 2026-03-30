import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TicketWithRelations } from '../../hooks/useTickets';
import { Badge } from '../ui/Badge';

interface RecentTicketsProps {
  tickets: TicketWithRelations[];
  isLoading: boolean;
  onTicketClick?: (ticketId: string) => void;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  new: { label: 'Novo', variant: 'info' },
  open: { label: 'Aberto', variant: 'warning' },
  pending: { label: 'Pendente', variant: 'default' },
  resolved: { label: 'Resolvido', variant: 'success' },
  closed: { label: 'Fechado', variant: 'default' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Baixa', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Média', color: 'bg-slate-100 text-slate-700' },
  high: { label: 'Alta', color: 'bg-amber-100 text-amber-700' },
  urgent: { label: 'Urgente', color: 'bg-rose-100 text-rose-700' },
};

export function RecentTickets({ tickets, isLoading, onTicketClick }: RecentTicketsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Últimos Chamados
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">
          Últimos Chamados
        </h3>
        <span className="text-xs text-gray-500">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="ri-inbox-line text-xl text-gray-400"></i>
          </div>
          <p className="text-sm">Nenhum chamado recente</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status] || statusConfig.new;
            const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
            
            return (
              <div
                key={ticket.id}
                onClick={() => onTicketClick?.(ticket.id)}
                className="p-3 rounded-lg border border-gray-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">
                        #{ticket.ticket_number}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priority.color}`}>
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-slate-700 transition-colors">
                      {ticket.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {ticket.client?.full_name || 'Cliente'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(ticket.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={status.variant} size="sm">
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentTickets;
