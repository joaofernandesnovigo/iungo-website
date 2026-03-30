
import { useMemo } from 'react';
import type { TicketStatus } from '../../../types/database.types';
import type { TicketWithRelations } from '../../../hooks/useTickets';

interface StatusTab {
  key: TicketStatus | 'all';
  label: string;
  icon: string;
  count: number;
}

interface StatusTabsProps {
  activeTab: TicketStatus | 'all';
  onTabChange: (tab: TicketStatus | 'all') => void;
  tickets: TicketWithRelations[];
  total: number;
}

export function StatusTabs({ activeTab, onTabChange, tickets, total }: StatusTabsProps) {
  const tabs: StatusTab[] = useMemo(() => {
    const countByStatus = (status: TicketStatus) =>
      tickets.filter((t) => t.status === status).length;

    return [
      { key: 'all', label: 'Todos', icon: 'ri-list-check', count: total },
      { key: 'new', label: 'Novos', icon: 'ri-add-circle-line', count: countByStatus('new') },
      { key: 'open', label: 'Abertos', icon: 'ri-folder-open-line', count: countByStatus('open') },
      { key: 'pending', label: 'Pendentes', icon: 'ri-time-line', count: countByStatus('pending') },
      { key: 'resolved', label: 'Resolvidos', icon: 'ri-check-line', count: countByStatus('resolved') },
      { key: 'closed', label: 'Fechados', icon: 'ri-lock-line', count: countByStatus('closed') },
    ];
  }, [tickets, total]);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${isActive
                ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
            `}
          >
            <i className={`${tab.icon} text-base`}></i>
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`
                  min-w-[20px] h-5 px-1.5 rounded-full text-xs flex items-center justify-center font-semibold
                  ${isActive ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-600'}
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StatusTabs;
