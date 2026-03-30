
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import type { TicketWithRelations } from '../../../hooks/useTickets';
import { formatDate } from '../../../lib/utils';
import { ExportButton } from './ExportButton';

interface TicketHeaderProps {
  ticket: TicketWithRelations;
  isConnected: boolean;
}

export function TicketHeader({ ticket, isConnected }: TicketHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-teal-600 transition-colors cursor-pointer flex items-center gap-1"
          >
            <i className="ri-arrow-left-line"></i>
            Voltar
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Chamado</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-700">#{ticket.ticket_number}</span>
        </div>

        {/* Title and Status */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-slate-900 truncate">
                {ticket.subject}
              </h1>
              {isConnected && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ao vivo
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <i className="ri-calendar-line text-slate-400"></i>
                Aberto em {formatDate(ticket.created_at)}
              </span>
              {ticket.client && (
                <span className="flex items-center gap-1.5">
                  <i className="ri-user-line text-slate-400"></i>
                  {ticket.client.full_name}
                </span>
              )}
              {ticket.assigned_admin && (
                <span className="flex items-center gap-1.5">
                  <i className="ri-customer-service-line text-slate-400"></i>
                  Atribuído a {ticket.assigned_admin.full_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ExportButton ticketId={ticket.id} ticketNumber={ticket.ticket_number} />
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketHeader;
