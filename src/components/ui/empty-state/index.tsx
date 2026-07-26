import React from 'react';
import Link from 'next/link';
import { EmptyStateProps } from './types';

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionHref,
  className = '',
  ...props
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      aria-hidden="true"
      className="w-12 h-12 text-muted-foreground opacity-60"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-surface-muted/40 ${className}`.trim()}
      {...props}
    >
      <div className="mb-4 p-3 rounded-full bg-surface shadow-xs">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

export * from './types';
