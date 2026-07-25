import { auth } from '@/features/auth/server/auth';
import { DashboardService } from '@/features/dashboard/server/dashboard.service';
import { SlaBadge } from '@/features/sla/components/sla-badge';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await DashboardService.getDashboardData(session.user.id);

  return (
    <div className="space-y-8 py-4">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang kembali, <span className="font-semibold text-foreground">{session.user.name}</span>! (Mode: {data.roleName})
          </p>
        </div>
        <Link
          href="/dashboard/tickets/create"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 shrink-0"
        >
          + Buat Tiket Baru
        </Link>
      </div>

      {/* Grid Metrik Role-Based Strategy */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Total Tiket ({data.roleName})</p>
          <p className="text-3xl font-bold mt-2">{data.metrics.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Selesai (Resolved)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{data.metrics.resolved}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Dalam Proses (Pending)</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{data.metrics.pending}</p>
        </div>
        {data.metrics.overdue !== undefined && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Tiket Overdue (SLA)</p>
            <p className="text-3xl font-bold text-destructive mt-2">{data.metrics.overdue}</p>
          </div>
        )}
      </div>

      {/* Tabel Tiket Terakhir */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold">Tiket Terbaru ({data.roleName})</h3>
          <Link href="/dashboard/tickets" className="text-xs font-semibold text-primary hover:underline">
            Lihat Semua Tiket &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="p-3">No. Tiket</th>
                <th className="p-3">Judul</th>
                <th className="p-3">Status Tiket</th>
                <th className="p-3">Indikator SLA</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground text-xs">
                    Belum ada tiket untuk kategori ini.
                  </td>
                </tr>
              ) : (
                (data.recentTickets as unknown as Array<{
                  id: string;
                  ticketNumber: string;
                  title: string;
                  status: { name: string };
                  createdAt: Date;
                  resolvedAt?: Date | null;
                  targetResolutionAt?: Date | null;
                  slaStatus?: string | null;
                }>).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono font-semibold text-xs">{ticket.ticketNumber}</td>
                    <td className="p-3 font-medium">{ticket.title}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                        {ticket.status.name}
                      </span>
                    </td>
                    <td className="p-3">
                      <SlaBadge
                        createdAt={ticket.createdAt}
                        resolvedAt={ticket.resolvedAt}
                        targetResolutionAt={ticket.targetResolutionAt}
                        slaStatus={ticket.slaStatus}
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
