import React from 'react';

export interface ForbiddenStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  homeHref?: string;
}
