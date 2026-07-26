import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  roleBadge?: 'STUDENT' | 'TEACHER' | 'COUNSELOR' | 'ADMIN' | 'HEADMASTER';
}
