import React from 'react';
import { AvatarProps } from './types';

export function Avatar({
  src,
  alt = '',
  name = 'User',
  size = 'md',
  roleBadge,
  className = '',
  ...props
}: AvatarProps) {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  let sizeClasses = 'w-9 h-9 text-xs';
  switch (size) {
    case 'sm':
      sizeClasses = 'w-7 h-7 text-xs';
      break;
    case 'lg':
      sizeClasses = 'w-12 h-12 text-base';
      break;
    case 'xl':
      sizeClasses = 'w-16 h-16 text-lg';
      break;
  }

  return (
    <div className={`relative inline-block ${className}`.trim()} {...props}>
      <div
        className={`relative flex items-center justify-center rounded-full overflow-hidden bg-primary/10 text-primary font-semibold select-none ring-2 ring-background shadow-xs ${sizeClasses}`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {roleBadge && (
        <span
          title={roleBadge}
          className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background"
        />
      )}
    </div>
  );
}

export * from './types';
