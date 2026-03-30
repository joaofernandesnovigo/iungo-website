
import React from 'react';
import { cn, statusColors, priorityColors, statusLabels, priorityLabels, statusIcons, priorityIcons } from '../../lib/utils';
import type { TicketStatus, TicketPriority } from '../../types/database.types';

// ============================================
// STATUS BADGE
// ============================================

interface StatusBadgeProps {
  status: TicketStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
  const colors = statusColors[status];
  const label = statusLabels[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {showIcon && (
        <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      )}
      {label}
    </span>
  );
}

// ============================================
// PRIORITY BADGE
// ============================================

interface PriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, showIcon = true, size = 'md' }: PriorityBadgeProps) {
  const colors = priorityColors[priority];
  const label = priorityLabels[priority];
  const icon = priorityIcons[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {showIcon && <i className={icon} />}
      {label}
    </span>
  );
}

// ============================================
// GENERIC BADGE
// ============================================

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-teal-100 text-teal-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  error: 'bg-rose-100 text-rose-700',
  info: 'bg-sky-100 text-sky-700',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
