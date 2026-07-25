import { MasterDataService } from '@/features/master-data/server/master-data.service';
import { TicketForm } from '@/components/tickets/ticket-form';

export default async function CreateTicketPage() {
  const [types, categories, priorities] = await Promise.all([
    MasterDataService.getTicketTypes(),
    MasterDataService.getTicketCategories(),
    MasterDataService.getTicketPriorities(),
  ]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Laporan Baru</h1>
        <p className="text-muted-foreground">Isi detail keluhan, aspirasi, atau konsultasi Anda dengan jelas.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <TicketForm types={types} categories={categories} priorities={priorities} />
      </div>
    </div>
  );
}
