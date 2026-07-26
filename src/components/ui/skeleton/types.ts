import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'avatar' | 'text' | 'table-row';
  width?: string | number;
  height?: string | number;
}
