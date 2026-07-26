import React from 'react';

export type UXState = 'loading' | 'empty' | 'error' | 'forbidden' | 'success';

export interface StateWrapperProps {
  state: UXState;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  forbiddenTitle?: string;
  forbiddenMessage?: string;
  className?: string;
}
