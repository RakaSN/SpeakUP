import { auth, signOut } from '@/features/auth/server/auth';
import { redirect } from 'next/navigation';
import { NotificationService } from '@/features/notifications/server/notification.service';
import { NotificationBell } from '@/features/notifications/components/notification-bell';

export async function Header() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const unreadCount = await NotificationService.getUnreadCount(session.user.id);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:h-[60px]">
      <div>
        <h2 className="text-lg font-semibold md:hidden">SpeakUp</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Bell Notifikasi Mandiri */}
        <NotificationBell unreadCount={unreadCount} />

        <div className="text-sm font-medium text-muted-foreground">
          {session.user.name || session.user.email}
        </div>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-destructive hover:underline focus:outline-none"
          >
            Keluar
          </button>
        </form>
      </div>
    </header>
  );
}
