import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TicketWithRelations } from '../../hooks/useTickets';
import type { TicketStatus, TicketPriority } from '../../types/database.types';
import { AssigneeDropdown } from './AssigneeDropdown';
import { TagBadge } from '../tags/TagBadge';
import { useTicketTags } from '../../hooks/useTicketTags';

// ============================================
// STATUS & PRIORITY CONFIGS
// ============================================

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; icon: string }> = {
  new: { 
    label: 'Novo', 
    color: 'text-sky-700', 
    bg: 'bg-sky-50 border-sky-200',
    icon: 'ri-add-circle-line'
  },
  open: { 
    label: 'Aberto', 
    color: 'text-amber-700', 
    bg: 'bg-amber-50 border-amber-200',
    icon: 'ri-folder-open-line'
  },
  pending: { 
    label: 'Pendente', 
    color: 'text-orange-700', 
    bg: 'bg-orange-50 border-orange-200',
    icon: 'ri-time-line'
  },
  resolved: { 
    label: 'Resolvido', 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50 border-emerald-200',
    icon: 'ri-check-line'
  },
  closed: { 
    label: 'Fechado', 
    color: 'text-slate-600', 
    bg: 'bg-slate-100 border-slate-200',
    icon: 'ri-lock-line'
  },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bg: string; icon: string }> = {
  low: { 
    label: 'Baixa', 
    color: 'text-slate-600', 
    bg: 'bg-slate-100 border-slate-200',
    icon: 'ri-arrow-down-line'
  },
  medium: { 
    label: 'Média', 
    color: 'text-sky-700', 
    bg: 'bg-sky-50 border-sky-200',
    icon: 'ri-subtract-line'
  },
  high: { 
    label: 'Alta', 
    color: 'text-orange-700', 
    bg: 'bg-orange-50 border-orange-200',
    icon: 'ri-arrow-up-line'
  },
  urgent: { 
    label: 'Urgente', 
    color: 'text-rose-700', 
    bg: 'bg-rose-50 border-rose-200',
    icon: 'ri-alarm-warning-line'
  },
};

// ============================================
// BADGE COMPONENTS
// ============================================

interface BadgeProps {
  status?: TicketStatus;
  priority?: TicketPriority;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  if (!status) return null;
  const config = STATUS_CONFIG[status];
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.bg} ${config.color} ${sizeClasses}`}>
      <i className={`${config.icon} text-[10px]`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }: BadgeProps) {
  if (!priority) return null;
  const config = PRIORITY_CONFIG[priority];
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.bg} ${config.color} ${sizeClasses}`}>
      <i className={`${config.icon} text-[10px]`} />
      {config.label}
    </span>
  );
}

// ============================================
// TICKET CARD COMPONENT
// ============================================

interface TicketCardProps {
  ticket: TicketWithRelations;
  onClick?: (ticket: TicketWithRelations) => void;
  showClient?: boolean;
  showAssignee?: boolean;
  isSelected?: boolean;
  onAssign?: (ticketId: string, adminId: string | null) => Promise<{ error: string | null }>;
  canAssign?: boolean;
}

export function TicketCard({ 
  ticket, 
  onClick, 
  showClient = true,
  showAssignee = true,
  isSelected = false,
  onAssign,
  canAssign = false,
}: TicketCardProps) {
  const { tags } = useTicketTags(ticket.id);
  
  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(ticket.created_at), {
      addSuffix: true,
      locale: ptBR,
    });
  }, [ticket.created_at]);

  const updatedAgo = useMemo(() => {
    return formatDistanceToNow(new Date(ticket.updated_at), {
      addSuffix: true,
      locale: ptBR,
    });
  }, [ticket.updated_at]);

  return (
    <div
      onClick={() => onClick?.(ticket)}
      className={`
        group relative bg-white rounded-xl border p-4 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-teal-200' : ''}
        ${isSelected ? 'border-teal-400 ring-2 ring-teal-100 shadow-md' : 'border-slate-200'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {ticket.ticket_number}
            </span>
            <StatusBadge status={ticket.status} size="sm" />
            <PriorityBadge priority={ticket.priority} size="sm" />
            {tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
            {ticket.subject}
          </h3>
        </div>
        
        {/* Time indicator */}
        <div className="flex-shrink-0 text-right">
          <span className="text-xs text-slate-500">{timeAgo}</span>
        </div>
      </div>

      {/* Description preview */}
      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
        {ticket.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          {/* Client info */}
          {showClient && ticket.client && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <span className="text-[10px] font-medium text-white">
                  {ticket.client.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="truncate max-w-[120px]">{ticket.client.full_name}</span>
            </div>
          )}

          {/* Assignee info - with dropdown if canAssign */}
          {showAssignee && (
            canAssign && onAssign ? (
              <AssigneeDropdown
                currentAssigneeId={ticket.assigned_to}
                currentAssigneeName={ticket.assigned_admin?.full_name}
                ticketId={ticket.id}
                onAssign={onAssign}
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <i className="ri-user-settings-line text-slate-400" />
                {ticket.assigned_admin ? (
                  <span className="truncate max-w-[100px]">{ticket.assigned_admin.full_name}</span>
                ) : (
                  <span className="text-slate-400 italic">Não atribuído</span>
                )}
              </div>
            )
          )}
        </div>

        {/* Updated time */}
        <div className="flex items-center gap-1">
          <i className="ri-refresh-line text-slate-400" />
          <span>Atualizado {updatedAgo}</span>
        </div>
      </div>

      {/* Hover indicator */}
      {onClick && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="ri-arrow-right-s-line text-xl text-teal-500" />
        </div>
      )}
    </div>
  );
}

// ============================================
// TICKET LIST COMPONENT
// ============================================

interface TicketListProps {
  tickets: TicketWithRelations[];
  isLoading?: boolean;
  error?: string | null;
  onTicketClick?: (ticket: TicketWithRelations) => void;
  selectedTicketId?: string;
  showClient?: boolean;
  showAssignee?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  onAssign?: (ticketId: string, adminId: string | null) => Promise<{ error: string | null }>;
  canAssign?: boolean;
}

export function TicketList({
  tickets,
  isLoading = false,
  error = null,
  onTicketClick,
  selectedTicketId,
  showClient = true,
  showAssignee = true,
  emptyMessage = 'Nenhum ticket encontrado',
  emptyIcon = 'ri-ticket-line',
  onAssign,
  canAssign = false,
}: TicketListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
              <div className="h-5 w-14 bg-slate-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-full bg-slate-100 rounded mb-1" />
            <div className="h-4 w-2/3 bg-slate-100 rounded mb-3" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 flex items-center justify-center">
          <i className="ri-error-warning-line text-2xl text-rose-500" />
        </div>
        <h3 className="font-medium text-rose-800 mb-1">Erro ao carregar tickets</h3>
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (tickets.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <i className={`${emptyIcon} text-3xl text-slate-400`} />
        </div>
        <h3 className="font-medium text-slate-700 mb-1">{emptyMessage}</h3>
        <p className="text-sm text-slate-500">
          Quando houver tickets, eles aparecerão aqui.
        </p>
      </div>
    );
  }

  // Ticket list
  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={onTicketClick}
          showClient={showClient}
          showAssignee={showAssignee}
          isSelected={selectedTicketId === ticket.id}
          onAssign={onAssign}
          canAssign={canAssign}
        />
      ))}
    </div>
  );
}

// ============================================
// PAGINATION COMPONENT
// ============================================

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function TicketPagination({
  page,
  totalPages,
  total,
  limit,
  hasNext,
  hasPrev,
  onPageChange,
  onNextPage,
  onPrevPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (page > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-1 py-3">
      {/* Info */}
      <p className="text-sm text-slate-600">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{total}</span> tickets
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={onPrevPage}
          disabled={!hasPrev}
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors
            ${hasPrev 
              ? 'text-slate-700 hover:bg-slate-100 cursor-pointer' 
              : 'text-slate-300 cursor-not-allowed'}
          `}
        >
          <i className="ri-arrow-left-s-line" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) => (
          pageNum === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${page === pageNum 
                  ? 'bg-teal-500 text-white' 
                  : 'text-slate-700 hover:bg-slate-100'}
              `}
            >
              {pageNum}
            </button>
          )
        ))}

        {/* Next */}
        <button
          onClick={onNextPage}
          disabled={!hasNext}
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors
            ${hasNext 
              ? 'text-slate-700 hover:bg-slate-100 cursor-pointer' 
              : 'text-slate-300 cursor-not-allowed'}
          `}
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export { STATUS_CONFIG, PRIORITY_CONFIG };
export default TicketList;
