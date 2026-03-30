
import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// ============================================
// COMPONENT
// ============================================

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate a stable id: prefer the explicit `id` prop,
    // otherwise derive one from the label (if present).
    // Fallback to a random string to avoid undefined ids.
    const textareaId =
      id ??
      (label ? label.toLowerCase().replace(/\s/g, '-') : `textarea-${Math.random().toString(36).substr(2, 9)}`);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-lg border transition-all duration-200 resize-none',
            'bg-white text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-iungo-primary/20 focus:border-iungo-primary',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea };
export default Textarea;
