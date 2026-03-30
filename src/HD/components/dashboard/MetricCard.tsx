
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'teal' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'slate';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses: Record<
  NonNullable<MetricCardProps['color']>,
  { bg: string; icon: string; text: string }
> = {
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-100 text-teal-600',
    text: 'text-teal-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-600',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-100 text-rose-600',
    text: 'text-rose-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-100 text-indigo-600',
    text: 'text-indigo-600',
  },
  slate: {
    bg: 'bg-slate-50',
    icon: 'bg-slate-200 text-slate-700',
    text: 'text-slate-700',
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'slate',
  trend,
}: MetricCardProps) {
  // Defensive programming: ensure the color key exists
  const colors = colorClasses[color] ?? colorClasses['slate'];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs. ontem</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
