import React from 'react';
import Link from 'next/link';
import { ForbiddenStateProps } from './types';

export function ForbiddenState({
  title = 'Akses Ditolak (403)',
  message = 'Anda tidak memiliki hak akses untuk membuka halaman atau fitur ini. Silakan hubungi Administrator jika ini adalah kesalahan.',
  homeHref = '/dashboard',
  className = '',
  ...props
}: ForbiddenStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-warning/20 bg-warning/5 ${className}`.trim()}
      {...props}
    >
      <div className="mb-4 p-3 rounded-full bg-warning/10">
        <svg
          aria-hidden="true"
          className="w-10 h-10 text-warning"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      <Link
        href={homeHref}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}

export * from './types';
