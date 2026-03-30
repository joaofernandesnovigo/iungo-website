import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** CSS class names for the left icon (e.g. `"ri-search-line"`). */
  leftIcon?: string;
  /** CSS class names for the right icon (e.g. `"ri-arrow-right-line"`). */
  rightIcon?: string;
  /** Optional custom React nodes to replace the default icons. */
  leftIconNode?: ReactNode;
  rightIconNode?: ReactNode;
}

// ============================================
// STYLES
// ============================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-iungo-primary text-white hover:bg-iungo-primary/90 shadow-sm',
  secondary: 'bg-iungo-secondary text-white hover:bg-iungo-secondary/90 shadow-sm',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

// ============================================
// COMPONENT
// ============================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      leftIconNode,
      rightIconNode,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Defensive programming: ensure variant/size fallback to defaults if an unexpected value is passed
    const safeVariant = variantStyles[variant] ? variant : 'primary';
    const safeSize = sizeStyles[size] ? size : 'md';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iungo-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer',
          variantStyles[safeVariant],
          sizeStyles[safeSize],
          className
        )}
        {...props}
      >
        {/* Left Icon / Loader */}
        {isLoading ? (
          <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
        ) : leftIconNode ? (
          leftIconNode
        ) : leftIcon ? (
          <i className={leftIcon} aria-hidden="true" />
        ) : null}

        {/* Button Content */}
        <span className="flex-1">{children}</span>

        {/* Right Icon */}
        {rightIconNode && !isLoading ? (
          rightIconNode
        ) : rightIcon && !isLoading ? (
          <i className={rightIcon} aria-hidden="true" />
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
