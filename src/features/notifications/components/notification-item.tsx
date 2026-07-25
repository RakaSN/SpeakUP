'use client';

import { useTransition } from 'react';
import { markAsReadAction } from '../server/notification.action';

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title: string;
    message: string;
    readAt: Date | string | null;
    createdAt: Date | string;
  };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();

  const isRead = !!notification.readAt;

  const handleMarkAsRead = () => {
    if (isRead || isPending) return;
    startTransition(async () => {
      await markAsReadAction(notification.id);
    });
  };

  const typeColorMap = {
    INFO: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    SUCCESS: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    WARNING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    ERROR: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div
      onClick={handleMarkAsRead}
      className={`group flex items-start gap-4 p-4 border-b last:border-0 transition-colors cursor-pointer ${
        isRead ? 'bg-background opacity-75' : 'bg-muted/30 font-medium hover:bg-muted/50'
      }`}
    >
      <div className={`mt-0.5 rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${typeColorMap[notification.type]}`}>
        {notification.type}
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold truncate">{notification.title}</p>
          <span className="text-xs text-muted-foreground shrink-0">
            {new Date(notification.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {!isRead && (
        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" title="Belum dibaca" />
      )}
    </div>
  );
}
