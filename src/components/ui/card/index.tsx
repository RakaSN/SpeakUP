import React from 'react';
import {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './types';

export function Card({
  className = '',
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  let variantClasses = '';
  switch (variant) {
    case 'muted':
      variantClasses = 'bg-surface-muted/60 border-border text-card-foreground';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border-border text-card-foreground';
      break;
    case 'glass':
      variantClasses = 'bg-surface/70 backdrop-blur-md border-border/80 text-card-foreground shadow-sm';
      break;
    default:
      variantClasses = 'bg-surface border-border text-card-foreground shadow-xs hover:shadow-md';
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: CardTitleProps) {
  return (
    <h3
      className={`font-heading text-xl font-semibold leading-none tracking-tight text-foreground ${className}`.trim()}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export * from './types';
