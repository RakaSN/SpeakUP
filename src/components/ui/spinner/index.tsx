import React from 'react';
import { SpinnerProps } from './types';

export function Spinner({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}: SpinnerProps) {
  let sizeClasses = 'w-6 h-6';
  switch (size) {
    case 'sm':
      sizeClasses = 'w-4 h-4';
      break;
    case 'lg':
      sizeClasses = 'w-8 h-8';
      break;
    case 'xl':
      sizeClasses = 'w-12 h-12';
      break;
  }

  let variantClasses = 'text-primary';
  switch (variant) {
    case 'secondary':
      variantClasses = 'text-secondary-foreground';
      break;
    case 'current':
      variantClasses = 'text-current';
      break;
    case 'white':
      variantClasses = 'text-white';
      break;
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center ${className}`.trim()}
      {...props}
    >
      <svg
        className={`animate-spin motion-reduce:animate-none ${sizeClasses} ${variantClasses}`}
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
      <span className="sr-only">Memuat...</span>
    </div>
  );
}

export * from './types';
