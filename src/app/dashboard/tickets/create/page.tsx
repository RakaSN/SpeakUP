import { MasterDataService } from '@/features/master-data/server/master-data.service';
import { TicketForm } from '@/components/tickets/ticket-form';
import {
  PageHeader,
  Card,
  CardContent,
  Badge,
} from '@/components/ui';
import { FileText } from 'lucide-react';

export default async function CreateTicketPage() {
  const [types, categories, priorities] = await Promise.all([
    MasterDataService.getTicketTypes(),
    MasterDataService.getTicketCategories(),
    MasterDataService.getTicketPriorities(),
  ]);

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl animate-fade-in">
      <PageHeader
        title="Buat Laporan Baru"
        description="Isi detail keluhan, aspirasi, atau konsultasi Anda dengan jelas."
        badge={
          <Badge variant="info" size="sm">
            <FileText className="w-3 h-3 mr-1" />
            Formulir Pengaduan
          </Badge>
        }
      />

      <Card variant="default" className="shadow-sm">
        <CardContent className="p-6">
          <TicketForm types={types} categories={categories} priorities={priorities} />
        </CardContent>
      </Card>
    </div>
  );
}
