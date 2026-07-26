import React from 'react';
import { DividerProps } from './types';

export function Divider({
  orientation = 'horizontal',
  label,
  className = '',
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px h-full bg-border self-stretch ${className}`.trim()}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center w-full my-4 ${className}`.trim()}
        {...props}
      >
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 border-t border-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`w-full h-px bg-border my-4 ${className}`.trim()}
      {...props}
    />
  );
}

export * from './types';
