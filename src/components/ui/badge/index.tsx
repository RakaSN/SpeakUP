import React from 'react';
import { BadgeProps } from './types';

export function Badge({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2';

  let variantClasses = '';
  switch (variant) {
    case 'secondary':
      variantClasses = 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      break;
    case 'outline':
      variantClasses = 'text-foreground border border-border hover:bg-accent';
      break;
    case 'success':
      variantClasses = 'bg-success/15 text-success border border-success/30';
      break;
    case 'warning':
      variantClasses = 'bg-warning/15 text-warning-foreground border border-warning/30';
      break;
    case 'destructive':
      variantClasses = 'bg-destructive/15 text-destructive border border-destructive/30';
      break;
    case 'info':
      variantClasses = 'bg-info/15 text-info border border-info/30';
      break;
    default:
      variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-2 py-0.5 text-xs';
      break;
    case 'lg':
      sizeClasses = 'px-3 py-1 text-sm';
      break;
    default:
      sizeClasses = 'px-2.5 py-0.5 text-xs';
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export * from './types';
