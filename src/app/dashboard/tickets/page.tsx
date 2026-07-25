import { TicketService } from '@/features/tickets/server/ticket.service';
import { MasterDataService } from '@/features/master-data/server/master-data.service';
import { TicketFilters } from '@/components/tickets/ticket-filters';
import Link from 'next/link';

export default async function TicketListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const statusId = typeof params.statusId === 'string' ? params.statusId : undefined;
  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;

  const [ticketData, statuses, categories] = await Promise.all([
    TicketService.listTickets({ page, limit: 10, statusId, categoryId, search }),
    MasterDataService.getTicketStatuses(),
    MasterDataService.getTicketCategories(),
  ]);

  const { items: tickets, meta } = ticketData;

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Tiket</h1>
          <p className="text-muted-foreground">Daftar laporan dan konsultasi aktif.</p>
        </div>
        <Link
          href="/dashboard/tickets/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none"
        >
          Buat Tiket Baru
        </Link>
      </div>

      <TicketFilters statuses={statuses} categories={categories} />

      <div className="rounded-md border bg-card">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="text-lg font-semibold">Tidak ada tiket</h3>
            <p className="text-sm text-muted-foreground">Sesuaikan filter atau buat tiket baru.</p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID Tiket</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Judul</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategori</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prioritas</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dibuat Pada</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{ticket.ticketNumber}</td>
                    <td className="p-4 align-middle max-w-[300px] truncate">{ticket.title}</td>
                    <td className="p-4 align-middle">{ticket.category.name}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {ticket.priority.name}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                        {ticket.status.name}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan halaman {meta.currentPage} dari {meta.totalPages}
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`?page=${meta.currentPage - 1}${statusId ? `&statusId=${statusId}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}${search ? `&search=${search}` : ''}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Sebelumnya
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`?page=${meta.currentPage + 1}${statusId ? `&statusId=${statusId}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}${search ? `&search=${search}` : ''}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Selanjutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
