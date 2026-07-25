'use client';

import Link from 'next/link';

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return (
    <Link
      href="/dashboard/notifications"
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground transition-colors"
      title="Notifikasi Inbox"
    >
      <span className="text-base">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
