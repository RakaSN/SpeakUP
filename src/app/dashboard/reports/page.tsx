import { MasterDataService } from '@/features/master-data/server/master-data.service';

type SelectOption = { id: string; name: string };

export default async function ReportsExportPage() {
  const [categories, statuses] = await Promise.all([
    MasterDataService.getTicketCategories(),
    MasterDataService.getTicketStatuses(),
  ]);

  return (
    <div className="space-y-6 max-w-2xl py-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Pusat Laporan & Ekspor Data</h1>
        <p className="text-sm text-muted-foreground">Unduh rekapitulasi data tiket dalam format Excel / CSV berdasarkan periode tanggal dan filter.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Filter Ekspor Laporan</h3>

        <form action="/api/reports/export" method="GET" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="startDate">Tanggal Mulai</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="endDate">Tanggal Sampai</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="categoryId">Kategori Tiket</label>
              <select
                id="categoryId"
                name="categoryId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Semua Kategori</option>
                {categories.map((c: SelectOption) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="statusId">Status Tiket</label>
              <select
                id="statusId"
                name="statusId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Semua Status</option>
                {statuses.map((s: SelectOption) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              📥 Ekspor ke Excel (.csv)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
