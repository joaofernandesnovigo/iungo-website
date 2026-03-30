
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

// ============================================
// CARD
// ============================================

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles: Record<CardProps['padding'], string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        paddingStyles[padding],
        hover &&
          'hover:shadow-md hover:border-slate-300 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// CARD HEADER
// ============================================

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-iungo-primary/10 flex items-center justify-center text-iungo-primary">
            <i className={cn(icon, 'text-lg')} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================
// CARD CONTENT
// ============================================

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({
  children,
  className,
}: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

// ============================================
// CARD FOOTER
// ============================================

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({
  children,
  className,
}: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-slate-100', className)}>
      {children}
    </div>
  );
}

export default Card;
