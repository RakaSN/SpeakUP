import { auth } from '@/features/auth/server/auth';
import { NotificationService, type NotificationType } from '@/features/notifications/server/notification.service';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import { markAllAsReadAction } from '@/features/notifications/server/notification.action';
import Link from 'next/link';

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const type = (resolvedParams.type as NotificationType) || undefined;
  const isUnreadOnly = resolvedParams.filter === 'unread';

  const { items, meta } = await NotificationService.getNotifications(session.user.id, {
    page,
    limit: 10,
    type,
    isUnreadOnly,
  });

  return (
    <div className="space-y-6 max-w-4xl py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kotak Masuk Notifikasi</h1>
          <p className="text-sm text-muted-foreground">Pemberitahuan terkini mengenai aktivitas tiket dan sistem Anda.</p>
        </div>

        <form action={markAllAsReadAction}>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Tandai Semua Dibaca
          </button>
        </form>
      </div>

      {/* Navigasi Filter */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium border-b pb-3">
        <Link
          href="/dashboard/notifications"
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            !type && !isUnreadOnly ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
          }`}
        >
          Semua
        </Link>
        <Link
          href="/dashboard/notifications?filter=unread"
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            isUnreadOnly ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
          }`}
        >
          Belum Dibaca
        </Link>
        <Link
          href="/dashboard/notifications?type=INFO"
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            type === 'INFO' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
          }`}
        >
          Info
        </Link>
        <Link
          href="/dashboard/notifications?type=SUCCESS"
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            type === 'SUCCESS' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
          }`}
        >
          Sukses
        </Link>
        <Link
          href="/dashboard/notifications?type=WARNING"
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            type === 'WARNING' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
          }`}
        >
          Peringatan
        </Link>
      </div>

      {/* Listing Notifikasi */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden divide-y">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Tidak ada notifikasi yang ditemukan.
          </div>
        ) : (
          items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>

      {/* Pagination sederajat */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs">
          <p className="text-muted-foreground">
            Halaman {meta.currentPage} dari {meta.totalPages} ({meta.totalItems} Notifikasi)
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`/dashboard/notifications?page=${meta.currentPage - 1}${type ? `&type=${type}` : ''}`}
                className="px-3 py-1 rounded border bg-background hover:bg-muted"
              >
                Sebelumnya
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`/dashboard/notifications?page=${meta.currentPage + 1}${type ? `&type=${type}` : ''}`}
                className="px-3 py-1 rounded border bg-background hover:bg-muted"
              >
                Berikutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
