import React from 'react';
import { SkeletonProps } from './types';

export function Skeleton({
  className = '',
  variant = 'default',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted rounded-md';
  
  let variantClasses = '';
  switch (variant) {
    case 'avatar':
      variantClasses = 'rounded-full h-10 w-10';
      break;
    case 'card':
      variantClasses = 'h-32 w-full rounded-lg';
      break;
    case 'text':
      variantClasses = 'h-4 w-3/4 rounded';
      break;
    case 'table-row':
      variantClasses = 'h-12 w-full rounded';
      break;
    default:
      variantClasses = '';
  }

  const customStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      style={customStyle}
      {...props}
    />
  );
}

export * from './types';
