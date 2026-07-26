import React from 'react';
import { PageHeaderProps } from './types';

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className = '',
  ...props
}: PageHeaderProps) {
  return (
    <div className={`space-y-2 pb-6 border-b border-border mb-6 ${className}`.trim()} {...props}>
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight sm:text-3xl">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export * from './types';
