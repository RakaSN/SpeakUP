import { auth, signOut } from '@/features/auth/server/auth';
import { redirect } from 'next/navigation';
import { NotificationService } from '@/features/notifications/server/notification.service';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { Avatar, Badge, Button } from '@/components/ui';
import { LogOut, Menu } from 'lucide-react';

export async function Header() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const unreadCount = await NotificationService.getUnreadCount(session.user.id);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/80 bg-surface/80 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            S
          </div>
          <h2 className="text-base font-bold font-heading tracking-tight">SpeakUp</h2>
        </div>
        {/* Desktop breadcrumb area placeholder */}
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" size="sm" className="text-[10px] font-mono">
            Cockpit Mode
          </Badge>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <NotificationBell unreadCount={unreadCount} />

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border/60">
          <Avatar name={session.user.name || 'U'} size="sm" />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">
              {session.user.name || 'User'}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {session.user.email}
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
