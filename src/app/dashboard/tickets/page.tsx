import { TicketService } from '@/features/tickets/server/ticket.service';
import { MasterDataService } from '@/features/master-data/server/master-data.service';
import { TicketFilters } from '@/components/tickets/ticket-filters';
import Link from 'next/link';
import {
  PageHeader,
  Card,
  CardContent,
  Badge,
  Button,
  EmptyState,
} from '@/components/ui';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const getPriorityVariant = (name: string) => {
    switch (name.toLowerCase()) {
      case 'tinggi':
      case 'high':
      case 'urgent':
        return 'destructive';
      case 'sedang':
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      <PageHeader
        title="Manajemen Tiket Pengaduan"
        description="Kelola daftar laporan, permohonan konseling, dan tindak lanjut pengaduan aktif."
        badge={<Badge variant="info">Total: {meta?.totalItems || tickets.length}</Badge>}
        actions={
          <Link href="/dashboard/tickets/create">
            <Button variant="default" size="sm" className="font-medium">
              <Plus className="w-4 h-4 mr-1.5" />
              Buat Tiket Baru
            </Button>
          </Link>
        }
      />

      <TicketFilters statuses={statuses} categories={categories} />

      <Card variant="default" className="overflow-hidden">
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <EmptyState
              title="Belum Ada Tiket"
              description="Tidak ada pengaduan yang cocok dengan kriteria filter saat ini. Sesuaikan filter atau buat tiket baru."
              actionLabel="Buat Tiket Baru"
              actionHref="/dashboard/tickets/create"
              className="py-16 border-0 bg-transparent"
            />
          ) : (
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-left text-sm table-modern">
                <thead>
                  <tr>
                    <th>No. Tiket</th>
                    <th>Judul Pengaduan</th>
                    <th>Kategori</th>
                    <th>Prioritas</th>
                    <th>Status</th>
                    <th>Tanggal Dibuat</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="font-mono font-semibold text-xs text-foreground">
                        {ticket.ticketNumber}
                      </td>
                      <td className="font-medium text-foreground max-w-[280px] truncate">
                        {ticket.title}
                      </td>
                      <td className="text-muted-foreground text-sm">{ticket.category.name}</td>
                      <td>
                        <Badge variant={getPriorityVariant(ticket.priority.name)} size="sm">
                          {ticket.priority.name}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant="info" size="sm">
                          {ticket.status.name}
                        </Badge>
                      </td>
                      <td className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-right">
                        <Link href={`/dashboard/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm" className="text-xs font-medium">
                            Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Halaman <span className="font-semibold text-foreground">{meta.currentPage}</span> dari{' '}
            <span className="font-semibold text-foreground">{meta.totalPages}</span>
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`?page=${meta.currentPage - 1}${statusId ? `&statusId=${statusId}` : ''}${
                  categoryId ? `&categoryId=${categoryId}` : ''
                }${search ? `&search=${search}` : ''}`}
              >
                <Button variant="outline" size="sm" className="font-medium">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`?page=${meta.currentPage + 1}${statusId ? `&statusId=${statusId}` : ''}${
                  categoryId ? `&categoryId=${categoryId}` : ''
                }${search ? `&search=${search}` : ''}`}
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
