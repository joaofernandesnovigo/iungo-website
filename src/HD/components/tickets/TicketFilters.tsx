import { useState, useCallback } from 'react';
import type { TicketFilters, TicketStatus, TicketPriority } from '../../types/database.types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from './TicketList';
import { useTags } from '../../hooks/useTags';
import { TagBadge } from '../tags/TagBadge';

// ============================================
// TYPES
// ============================================

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  onClear: () => void;
  showAssigneeFilter?: boolean;
  showClientFilter?: boolean;
}

// ============================================
// FILTER CHIP COMPONENT
// ============================================

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  icon?: string;
}

function FilterChip({ label, isActive, onClick, color, icon }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
        transition-all duration-200 cursor-pointer whitespace-nowrap
        ${isActive 
          ? `${color || 'bg-teal-500 text-white'} shadow-sm` 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
      `}
    >
      {icon && <i className={`${icon} text-[10px]`} />}
      {label}
    </button>
  );
}

// ============================================
// TICKET FILTERS COMPONENT
// ============================================

export function TicketFiltersBar({
  filters,
  onFiltersChange,
  onClear,
}: TicketFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const { tags } = useTags();

  // Handle search with debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  // Toggle status filter
  const toggleStatus = useCallback((status: TicketStatus) => {
    const currentStatuses = Array.isArray(filters.status) 
      ? filters.status 
      : filters.status 
        ? [filters.status] 
        : [];

    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];

    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  }, [filters, onFiltersChange]);

  // Toggle priority filter
  const togglePriority = useCallback((priority: TicketPriority) => {
    const currentPriorities = Array.isArray(filters.priority) 
      ? filters.priority 
      : filters.priority 
        ? [filters.priority] 
        : [];

    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];

    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  }, [filters, onFiltersChange]);

  // Toggle tag filter
  const toggleTag = useCallback((tagId: string) => {
    const currentTags = filters.tag_ids || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    onFiltersChange({
      ...filters,
      tag_ids: newTags.length > 0 ? newTags : undefined,
    });
  }, [filters, onFiltersChange]);

  // Check if status is active
  const isStatusActive = (status: TicketStatus) => {
    if (Array.isArray(filters.status)) {
      return filters.status.includes(status);
    }
    return filters.status === status;
  };

  // Check if priority is active
  const isPriorityActive = (priority: TicketPriority) => {
    if (Array.isArray(filters.priority)) {
      return filters.priority.includes(priority);
    }
    return filters.priority === priority;
  };

  // Check if tag is active
  const isTagActive = (tagId: string) => {
    return filters.tag_ids?.includes(tagId) || false;
  };

  // Count active filters
  const activeFilterCount = [
    filters.status ? (Array.isArray(filters.status) ? filters.status.length : 1) : 0,
    filters.priority ? (Array.isArray(filters.priority) ? filters.priority.length : 1) : 0,
    filters.search ? 1 : 0,
    filters.assigned_to !== undefined ? 1 : 0,
    filters.client_id ? 1 : 0,
    filters.tag_ids ? filters.tag_ids.length : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por número, assunto ou descrição..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm 
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 
                     focus:border-teal-400 transition-all"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        {/* Toggle filters button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${isExpanded || activeFilterCount > 0
              ? 'bg-teal-50 text-teal-700 border border-teal-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
          `}
        >
          <i className="ri-filter-3-line" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 
                     hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <i className="ri-close-circle-line" />
            Limpar
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Status filters */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <FilterChip
                    key={status}
                    label={config.label}
                    icon={config.icon}
                    isActive={isStatusActive(status)}
                    onClick={() => toggleStatus(status)}
                    color={isStatusActive(status) ? `${config.bg} ${config.color} border ${config.bg.replace('bg-', 'border-')}` : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* Priority filters */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Prioridade
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((priority) => {
                const config = PRIORITY_CONFIG[priority];
                return (
                  <FilterChip
                    key={priority}
                    label={config.label}
                    icon={config.icon}
                    isActive={isPriorityActive(priority)}
                    onClick={() => togglePriority(priority)}
                    color={isPriorityActive(priority) ? `${config.bg} ${config.color} border ${config.bg.replace('bg-', 'border-')}` : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      transition-all duration-200 cursor-pointer
                      ${isTagActive(tag.id) ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-60 hover:opacity-100'}
                    `}
                  >
                    <TagBadge tag={tag} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TicketFiltersBar;
