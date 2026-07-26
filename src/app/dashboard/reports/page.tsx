import { MasterDataService } from '@/features/master-data/server/master-data.service';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
} from '@/components/ui';
import { FileDown } from 'lucide-react';

type SelectOption = { id: string; name: string };

export default async function ReportsExportPage() {
  const [categories, statuses] = await Promise.all([
    MasterDataService.getTicketCategories(),
    MasterDataService.getTicketStatuses(),
  ]);

  return (
    <div className="space-y-6 max-w-3xl py-4 animate-fade-in">
      <PageHeader
        title="Pusat Laporan & Ekspor Data"
        description="Unduh rekapitulasi data pengaduan sekolah dalam format Excel / CSV sesuai hak akses eksekutif."
        badge={<Badge variant="info">SDS v1.0 Export</Badge>}
      />

      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileDown className="w-4 h-4 text-primary" />
            Filter Ekspor Laporan Resmi
          </CardTitle>
          <CardDescription>Tentukan rentang tanggal dan parameter pengaduan yang ingin diunduh</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/reports/export" method="GET" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="date"
                id="startDate"
                name="startDate"
                label="Tanggal Mulai"
              />
              <Input
                type="date"
                id="endDate"
                name="endDate"
                label="Tanggal Sampai"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground" htmlFor="categoryId">
                  Kategori Pengaduan
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((c: SelectOption) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground" htmlFor="statusId">
                  Status Alur Tiket
                </label>
                <select
                  id="statusId"
                  name="statusId"
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Semua Status</option>
                  {statuses.map((s: SelectOption) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex justify-end">
              <Button type="submit" variant="default" className="px-6 font-semibold">
                <FileDown className="w-4 h-4 mr-1.5" />
                Unduh Laporan (.csv)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
