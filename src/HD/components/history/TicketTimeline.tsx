import { useState } from 'react';
import { useTicketHistory, type HistoryFilters } from '../../hooks/useTicketHistory';
import { Avatar } from '../ui/Avatar';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import type { TicketStatus, TicketPriority } from '../../types/database.types';

interface TicketTimelineProps {
  ticketId: string;
  isAdmin: boolean;
}

const fieldTypeOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'assigned_to', label: 'Atribuição' },
  { value: 'message', label: 'Mensagens' },
  { value: 'tag', label: 'Tags' },
  { value: 'custom_field', label: 'Campos personalizados' },
  { value: 'subject', label: 'Assunto' },
  { value: 'description', label: 'Descrição' },
];

function getFieldIcon(fieldName: string): string {
  if (fieldName === 'status') return 'ri-refresh-line';
  if (fieldName === 'priority') return 'ri-flag-line';
  if (fieldName === 'assigned_to') return 'ri-user-add-line';
  if (fieldName === 'message') return 'ri-message-3-line';
  if (fieldName === 'internal_note') return 'ri-file-list-3-line';
  if (fieldName === 'tag_added') return 'ri-price-tag-3-line';
  if (fieldName === 'tag_removed') return 'ri-price-tag-3-line';
  if (fieldName === 'subject') return 'ri-edit-line';
  if (fieldName === 'description') return 'ri-file-text-line';
  if (fieldName.startsWith('custom_field:')) return 'ri-list-settings-line';
  return 'ri-information-line';
}

function getFieldColor(fieldName: string): string {
  if (fieldName === 'status') return 'bg-blue-100 text-blue-600';
  if (fieldName === 'priority') return 'bg-orange-100 text-orange-600';
  if (fieldName === 'assigned_to') return 'bg-purple-100 text-purple-600';
  if (fieldName === 'message') return 'bg-teal-100 text-teal-600';
  if (fieldName === 'internal_note') return 'bg-slate-100 text-slate-600';
  if (fieldName === 'tag_added') return 'bg-green-100 text-green-600';
  if (fieldName === 'tag_removed') return 'bg-red-100 text-red-600';
  if (fieldName === 'subject' || fieldName === 'description') return 'bg-indigo-100 text-indigo-600';
  if (fieldName.startsWith('custom_field:')) return 'bg-amber-100 text-amber-600';
  return 'bg-slate-100 text-slate-600';
}

function getFieldLabel(fieldName: string): string {
  if (fieldName === 'status') return 'Status alterado';
  if (fieldName === 'priority') return 'Prioridade alterada';
  if (fieldName === 'assigned_to') return 'Responsável alterado';
  if (fieldName === 'message') return 'Mensagem enviada';
  if (fieldName === 'internal_note') return 'Nota interna adicionada';
  if (fieldName === 'tag_added') return 'Tag adicionada';
  if (fieldName === 'tag_removed') return 'Tag removida';
  if (fieldName === 'subject') return 'Assunto alterado';
  if (fieldName === 'description') return 'Descrição alterada';
  if (fieldName.startsWith('custom_field:')) {
    const customFieldName = fieldName.replace('custom_field:', '');
    return `Campo "${customFieldName}" alterado`;
  }
  return 'Alteração';
}

function renderValue(fieldName: string, value: string | null, isOld: boolean = false) {
  if (!value) {
    return <span className="text-slate-400 italic">Não definido</span>;
  }

  if (fieldName === 'status') {
    return <StatusBadge status={value as TicketStatus} />;
  }

  if (fieldName === 'priority') {
    return <PriorityBadge priority={value as TicketPriority} />;
  }

  if (fieldName === 'assigned_to') {
    return <span className="text-slate-700 font-medium">Admin ID: {value}</span>;
  }

  if (fieldName === 'tag_added' || fieldName === 'tag_removed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
        <i className="ri-price-tag-3-line text-[10px]"></i>
        {value}
      </span>
    );
  }

  if (fieldName === 'message' || fieldName === 'internal_note') {
    return (
      <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mt-2 border border-slate-200">
        {value.length > 100 ? `${value.substring(0, 100)}...` : value}
      </div>
    );
  }

  return <span className="text-slate-700">{value}</span>;
}

export function TicketTimeline({ ticketId, isAdmin }: TicketTimelineProps) {
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { history, isLoading, error } = useTicketHistory(ticketId, filters);

  const handleFilterChange = (key: keyof HistoryFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
          <i className="ri-error-warning-line text-2xl text-rose-500"></i>
        </div>
        <p className="text-slate-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com filtros */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Histórico de Alterações</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className={`ri-filter-3-line ${hasActiveFilters ? 'text-teal-600' : ''}`}></i>
            Filtros
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            )}
          </button>
        </div>

        {/* Filtros expansíveis */}
        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Tipo de alteração
              </label>
              <select
                value={filters.fieldType || ''}
                onChange={(e) => handleFilterChange('fieldType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              >
                {fieldTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Data inicial
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Data final
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <i className="ri-history-line text-2xl text-slate-400"></i>
            </div>
            <p className="text-slate-500 text-sm">
              {hasActiveFilters
                ? 'Nenhuma alteração encontrada com os filtros aplicados'
                : 'Nenhuma alteração registrada ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => {
              const isLast = index === history.length - 1;
              const showMessage = entry.field_name === 'message' || entry.field_name === 'internal_note';
              const showTag = entry.field_name === 'tag_added' || entry.field_name === 'tag_removed';
              const showChange = !showMessage && !showTag;

              return (
                <div key={entry.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-5 top-12 bottom-0 w-px bg-slate-200"></div>
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getFieldColor(entry.field_name)}`}>
                    <i className={`${getFieldIcon(entry.field_name)} text-base`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {entry.user && (
                            <Avatar name={entry.user.full_name} size="xs" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {entry.user?.full_name || 'Usuário desconhecido'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatRelativeTime(entry.created_at)}
                            </p>
                          </div>
                        </div>
                        {entry.user?.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-medium rounded-full">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Action label */}
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        {getFieldLabel(entry.field_name)}
                      </p>

                      {/* Value changes */}
                      {showChange && (
                        <div className="flex items-center gap-3">
                          {entry.old_value && (
                            <>
                              <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-1">De:</p>
                                {renderValue(entry.field_name, entry.old_value, true)}
                              </div>
                              <i className="ri-arrow-right-line text-slate-400"></i>
                            </>
                          )}
                          <div className="flex-1">
                            {entry.old_value && (
                              <p className="text-xs text-slate-500 mb-1">Para:</p>
                            )}
                            {renderValue(entry.field_name, entry.new_value)}
                          </div>
                        </div>
                      )}

                      {/* Tag changes */}
                      {showTag && renderValue(entry.field_name, entry.new_value || entry.old_value)}

                      {/* Message preview */}
                      {showMessage && renderValue(entry.field_name, entry.new_value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
