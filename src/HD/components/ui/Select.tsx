
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

// ============================================
// COMPONENT
// ============================================

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a deterministic ID when none is supplied.
    // Fallback to a sanitized version of the label to keep it stable.
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 px-3 pr-10 text-sm rounded-lg border transition-all duration-200',
              'bg-white text-slate-900 appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-iungo-primary/20 focus:border-iungo-primary',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <i className="ri-arrow-down-s-line" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Exportação nomeada
export { Select };
export default Select;
