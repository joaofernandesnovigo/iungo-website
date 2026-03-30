
import { cn } from '../../lib/utils';
import Button from './Button';

// ============================================
// TYPES
// ============================================

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function EmptyState({
  icon = 'ri-inbox-line',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <i className={cn(icon, 'text-3xl text-slate-400')} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} leftIcon="ri-add-line">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
