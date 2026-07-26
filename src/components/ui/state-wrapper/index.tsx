import React from 'react';
import { StateWrapperProps } from './types';
import { Skeleton } from '../skeleton';
import { EmptyState } from '../empty-state';
import { ErrorState } from '../error-state';
import { ForbiddenState } from '../forbidden-state';

export function StateWrapper({
  state,
  children,
  loadingFallback,
  emptyTitle = 'Belum Ada Data',
  emptyDescription = 'Data yang Anda cari saat ini belum tersedia.',
  emptyActionLabel,
  onEmptyAction,
  errorTitle,
  errorMessage,
  onRetry,
  forbiddenTitle,
  forbiddenMessage,
  className = '',
}: StateWrapperProps) {
  switch (state) {
    case 'loading':
      return (
        loadingFallback || (
          <div className={`space-y-4 p-6 ${className}`.trim()}>
            <Skeleton variant="card" />
            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        )
      );

    case 'empty':
      return (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
          className={className}
        />
      );

    case 'error':
      return (
        <ErrorState
          title={errorTitle}
          message={errorMessage}
          onRetry={onRetry}
          className={className}
        />
      );

    case 'forbidden':
      return (
        <ForbiddenState
          title={forbiddenTitle}
          message={forbiddenMessage}
          className={className}
        />
      );

    case 'success':
    default:
      return <>{children}</>;
  }
}

export * from './types';
