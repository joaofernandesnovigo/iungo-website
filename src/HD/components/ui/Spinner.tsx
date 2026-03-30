
import { cn } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

// ============================================
// COMPONENT
// ============================================

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'border-2 border-slate-200 border-t-iungo-primary rounded-full animate-spin',
          sizeStyles[size]
        )}
      />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
  );
}

// ============================================
// FULL PAGE SPINNER
// ============================================

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-slate-200 border-t-iungo-primary rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default Spinner;
