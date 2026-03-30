
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';
import type { Profile } from '../../types/database.types';

interface AssigneeDropdownProps {
  currentAssigneeId: string | null;
  currentAssigneeName?: string | null;
  ticketId: string;
  onAssign: (ticketId: string, adminId: string | null) => Promise<{ error: string | null }>;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function AssigneeDropdown({
  currentAssigneeId,
  currentAssigneeName,
  ticketId,
  onAssign,
  disabled = false,
  size = 'sm',
}: AssigneeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch admins when dropdown opens
  useEffect(() => {
    if (isOpen && admins.length === 0) {
      fetchAdmins();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      console.error('Erro ao carregar admins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (adminId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (adminId === currentAssigneeId) {
      setIsOpen(false);
      return;
    }

    setIsAssigning(true);
    const result = await onAssign(ticketId, adminId);
    setIsAssigning(false);

    if (!result.error) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const sizeClasses = size === 'sm' 
    ? 'text-xs py-1 px-2' 
    : 'text-sm py-1.5 px-3';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        disabled={disabled || isAssigning}
        className={`
          flex items-center gap-1.5 rounded-lg border transition-all cursor-pointer
          ${sizeClasses}
          ${currentAssigneeId 
            ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100' 
            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isAssigning ? 'opacity-70' : ''}
        `}
      >
        {isAssigning ? (
          <>
            <i className="ri-loader-4-line animate-spin" />
            <span>Atribuindo...</span>
          </>
        ) : currentAssigneeId ? (
          <>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <span className="text-[8px] font-medium text-white">
                {currentAssigneeName?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <span className="truncate max-w-[80px]">{currentAssigneeName}</span>
            <i className="ri-arrow-down-s-line text-teal-500" />
          </>
        ) : (
          <>
            <i className="ri-user-add-line" />
            <span>Atribuir</span>
            <i className="ri-arrow-down-s-line" />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Atribuir a
            </p>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="px-3 py-4 text-center">
              <i className="ri-loader-4-line animate-spin text-slate-400 text-lg" />
              <p className="text-xs text-slate-500 mt-1">Carregando...</p>
            </div>
          ) : (
            <>
              {/* Unassign option */}
              <button
                onClick={(e) => handleAssign(null, e)}
                className={`
                  w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer
                  ${!currentAssigneeId ? 'bg-slate-50' : ''}
                `}
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <i className="ri-user-unfollow-line text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Não atribuído</p>
                  <p className="text-[10px] text-slate-400">Remover atribuição</p>
                </div>
                {!currentAssigneeId && (
                  <i className="ri-check-line text-teal-500 ml-auto" />
                )}
              </button>

              {/* Divider */}
              <div className="border-t border-slate-100 my-1" />

              {/* Admin list */}
              {admins.length === 0 ? (
                <div className="px-3 py-3 text-center">
                  <p className="text-xs text-slate-500">Nenhum admin disponível</p>
                </div>
              ) : (
                admins.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={(e) => handleAssign(admin.id, e)}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer
                      ${currentAssigneeId === admin.id ? 'bg-teal-50' : ''}
                    `}
                  >
                    <Avatar name={admin.full_name} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{admin.full_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{admin.email}</p>
                    </div>
                    {currentAssigneeId === admin.id && (
                      <i className="ri-check-line text-teal-500 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AssigneeDropdown;
