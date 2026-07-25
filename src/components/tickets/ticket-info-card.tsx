interface TicketInfo {
  isAnonymous?: boolean;
  reporter: { name: string };
  createdAt: Date | string;
  category: { name: string };
  priority: { name: string };
  description: string;
}

export function TicketInfoCard({ ticket }: { ticket: TicketInfo }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-muted-foreground mb-1">Pelapor</p>
          <p className="font-semibold">{ticket.isAnonymous ? 'Anonim' : ticket.reporter.name}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground mb-1">Dibuat Pada</p>
          <p className="font-semibold">{new Date(ticket.createdAt).toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground mb-1">Kategori</p>
          <p className="font-semibold">{ticket.category.name}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground mb-1">Prioritas</p>
          <p className="font-semibold">{ticket.priority.name}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <p className="font-medium text-muted-foreground mb-2">Deskripsi Laporan</p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {ticket.description}
        </div>
      </div>
    </div>
  );
}
