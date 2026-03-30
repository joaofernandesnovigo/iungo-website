import { useState, useEffect } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import type { TicketWithRelations } from '../../../hooks/useTickets';
import type { Profile, TicketStatus, TicketPriority } from '../../../types/database.types';
import { formatDate, formatDateTime } from '../../../lib/utils';
import { useTicketTags } from '../../../hooks/useTicketTags';
import { TagSelector } from '../../../components/tags';
import { useCustomFields, useTicketCustomFieldValues } from '../../../hooks/useCustomFields';
import type { CustomFieldWithValue } from '../../../types/category.types';

interface TicketSidebarProps {
  ticket: TicketWithRelations;
  admins: Profile[];
  isAdmin: boolean;
  isUpdating: boolean;
  onStatusChange: (status: TicketStatus) => Promise<{ error: string | null }>;
  onAssigneeChange: (adminId: string | null) => Promise<{ error: string | null }>;
  onPriorityChange: (priority: TicketPriority) => Promise<{ error: string | null }>;
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'new', label: 'Novo' },
  { value: 'open', label: 'Aberto' },
  { value: 'pending', label: 'Pendente' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'closed', label: 'Fechado' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function TicketSidebar({
  ticket,
  admins,
  isAdmin,
  isUpdating,
  onStatusChange,
  onAssigneeChange,
  onPriorityChange,
}: TicketSidebarProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const { tags, addTag, removeTag } = useTicketTags(ticket.id);
  
  // Buscar campos personalizados da categoria do ticket
  const { fields } = useCustomFields(ticket.category_id || undefined);
  const { values: fieldValues } = useTicketCustomFieldValues(ticket.id);
  const [customFieldsWithValues, setCustomFieldsWithValues] = useState<CustomFieldWithValue[]>([]);

  // Calcular tamanho total dos anexos
  const [totalAttachmentsSize, setTotalAttachmentsSize] = useState(0);
  const [attachmentsCount, setAttachmentsCount] = useState(0);

  // Combinar campos com valores
  useEffect(() => {
    if (fields.length > 0) {
      const fieldsWithValues = fields.map(field => {
        const valueRecord = fieldValues.find(v => v.custom_field_id === field.id);
        return {
          ...field,
          value: valueRecord?.value || '',
        };
      });
      setCustomFieldsWithValues(fieldsWithValues);
    }
  }, [fields, fieldValues]);

  // Calcular estatísticas de anexos (simulado - em produção viria do backend)
  useEffect(() => {
    // Em uma implementação real, você buscaria todas as mensagens do ticket
    // e calcularia o tamanho total dos anexos
    // Por enquanto, vamos simular com dados do ticket
    setAttachmentsCount(0);
    setTotalAttachmentsSize(0);
  }, [ticket.id]);

  const handleStatusChange = async (status: TicketStatus) => {
    setShowStatusDropdown(false);
    await onStatusChange(status);
  };

  const handlePriorityChange = async (priority: TicketPriority) => {
    setShowPriorityDropdown(false);
    await onPriorityChange(priority);
  };

  const handleAssigneeChange = async (adminId: string | null) => {
    setShowAssigneeDropdown(false);
    await onAssigneeChange(adminId);
  };

  const formatFieldValue = (field: CustomFieldWithValue) => {
    if (!field.value) return '-';
    
    switch (field.field_type) {
      case 'checkbox':
        return field.value === 'true' ? 'Sim' : 'Não';
      case 'date':
        return formatDate(field.value);
      default:
        return field.value;
    }
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-slate-50/50 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Ticket Info */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Informações do Chamado
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Número</p>
              <p className="text-sm font-medium text-slate-700">#{ticket.ticket_number}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Criado em</p>
              <p className="text-sm text-slate-700">{formatDateTime(ticket.created_at)}</p>
            </div>
            {ticket.resolved_at && (
              <div>
                <p className="text-[11px] text-slate-400 mb-1">Resolvido em</p>
                <p className="text-sm text-slate-700">{formatDateTime(ticket.resolved_at)}</p>
              </div>
            )}
            {ticket.closed_at && (
              <div>
                <p className="text-[11px] text-slate-400 mb-1">Fechado em</p>
                <p className="text-sm text-slate-700">{formatDateTime(ticket.closed_at)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Anexos - Estatísticas */}
        {attachmentsCount > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Anexos
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <i className="ri-attachment-2 text-teal-600 text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    {attachmentsCount} arquivo{attachmentsCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(totalAttachmentsSize)} total
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campos Personalizados */}
        {customFieldsWithValues.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Informações Adicionais
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              {customFieldsWithValues.map((field) => (
                <div key={field.id}>
                  <p className="text-[11px] text-slate-400 mb-1">{field.field_name}</p>
                  <p className="text-sm text-slate-700">{formatFieldValue(field)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <TagSelector
            selectedTags={tags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            disabled={!isAdmin}
          />
        </div>

        {/* Status */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Status
          </h3>
          {isAdmin ? (
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={isUpdating}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <StatusBadge status={ticket.status} />
                <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                        ticket.status === option.value ? 'bg-slate-50' : ''
                      }`}
                    >
                      <StatusBadge status={option.value} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl">
              <StatusBadge status={ticket.status} />
            </div>
          )}
        </div>

        {/* Priority */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Prioridade
          </h3>
          {isAdmin ? (
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                disabled={isUpdating}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <PriorityBadge priority={ticket.priority} />
                <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              {showPriorityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePriorityChange(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                        ticket.priority === option.value ? 'bg-slate-50' : ''
                      }`}
                    >
                      <PriorityBadge priority={option.value} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl">
              <PriorityBadge priority={ticket.priority} />
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Responsável
          </h3>
          {isAdmin ? (
            <div className="relative">
              <button
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                disabled={isUpdating}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {ticket.assigned_admin ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.assigned_admin.full_name} size="xs" />
                    <span className="text-sm text-slate-700">{ticket.assigned_admin.full_name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Não atribuído</span>
                )}
                <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleAssigneeChange(null)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Não atribuído
                  </button>
                  {admins.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => handleAssigneeChange(admin.id)}
                      className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                        ticket.assigned_to === admin.id ? 'bg-slate-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={admin.full_name} size="xs" />
                        <span className="text-sm text-slate-700">{admin.full_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl">
              {ticket.assigned_admin ? (
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.assigned_admin.full_name} size="xs" />
                  <span className="text-sm text-slate-700">{ticket.assigned_admin.full_name}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Aguardando atribuição</span>
              )}
            </div>
          )}
        </div>

        {/* Client Info */}
        {ticket.client && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Cliente
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={ticket.client.full_name} size="md" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{ticket.client.full_name}</p>
                  {ticket.client.company_name && (
                    <p className="text-xs text-slate-500">{ticket.client.company_name}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <i className="ri-mail-line text-slate-400"></i>
                  <span className="truncate">{ticket.client.email}</span>
                </div>
                {ticket.client.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <i className="ri-phone-line text-slate-400"></i>
                    <span>{ticket.client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <i className="ri-calendar-line text-slate-400"></i>
                  <span>Cliente desde {formatDate(ticket.client.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketSidebar;
