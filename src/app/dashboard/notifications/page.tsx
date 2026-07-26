import { auth } from '@/features/auth/server/auth';
import { NotificationService, type NotificationType } from '@/features/notifications/server/notification.service';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import { markAllAsReadAction } from '@/features/notifications/server/notification.action';
import Link from 'next/link';
import {
  PageHeader,
  Card,
  Badge,
  Button,
} from '@/components/ui';
import { CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const filterOptions = [
    { href: '/dashboard/notifications', label: 'Semua', isActive: !type && !isUnreadOnly },
    { href: '/dashboard/notifications?filter=unread', label: 'Belum Dibaca', isActive: isUnreadOnly },
    { href: '/dashboard/notifications?type=INFO', label: 'Info', isActive: type === 'INFO' },
    { href: '/dashboard/notifications?type=SUCCESS', label: 'Sukses', isActive: type === 'SUCCESS' },
    { href: '/dashboard/notifications?type=WARNING', label: 'Peringatan', isActive: type === 'WARNING' },
  ];

  return (
    <div className="space-y-6 max-w-4xl py-4 animate-fade-in">
      <PageHeader
        title="Kotak Masuk Notifikasi"
        description="Pemberitahuan terkini mengenai aktivitas tiket dan sistem Anda."
        badge={<Badge variant="info">{meta.totalItems} Notifikasi</Badge>}
        actions={
          <form action={markAllAsReadAction}>
            <Button type="submit" variant="outline" size="sm" className="font-medium">
              <CheckCheck className="w-4 h-4 mr-1.5" />
              Tandai Semua Dibaca
            </Button>
          </form>
        }
      />

      {/* Navigasi Filter */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {filterOptions.map((opt) => (
          <Link
            key={opt.href}
            href={opt.href}
            className={`px-3.5 py-1.5 rounded-full border transition-all duration-150 ${
              opt.isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-surface hover:bg-accent border-border/80 text-foreground'
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* Listing Notifikasi */}
      <Card variant="default" className="overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Tidak ada notifikasi yang ditemukan.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs">
          <p className="text-muted-foreground">
            Halaman {meta.currentPage} dari {meta.totalPages} ({meta.totalItems} Notifikasi)
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`/dashboard/notifications?page=${meta.currentPage - 1}${type ? `&type=${type}` : ''}`}
              >
                <Button variant="outline" size="sm" className="font-medium">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`/dashboard/notifications?page=${meta.currentPage + 1}${type ? `&type=${type}` : ''}`}
              >
                <Button variant="outline" size="sm" className="font-medium">
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
