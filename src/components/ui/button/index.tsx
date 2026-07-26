import React from 'react';
import { ButtonProps } from './types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

    let variantClasses = '';
    switch (variant) {
      case 'secondary':
        variantClasses =
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]';
        break;
      case 'outline':
        variantClasses =
          'border border-border bg-surface text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]';
        break;
      case 'ghost':
        variantClasses =
          'text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]';
        break;
      case 'danger':
        variantClasses =
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] shadow-xs';
        break;
      case 'success':
        variantClasses =
          'bg-success text-success-foreground hover:bg-success/90 active:scale-[0.98] shadow-xs';
        break;
      case 'link':
        variantClasses = 'text-primary underline-offset-4 hover:underline p-0 h-auto';
        break;
      default:
        variantClasses =
          'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-xs';
    }

    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = 'h-8 px-3 text-xs gap-1.5';
        break;
      case 'lg':
        sizeClasses = 'h-11 px-6 text-base gap-2.5';
        break;
      case 'icon':
        sizeClasses = 'h-9 w-9 p-0';
        break;
      default:
        sizeClasses = 'h-9.5 px-4 text-sm gap-2';
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <svg
            aria-hidden="true"
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export * from './types';
