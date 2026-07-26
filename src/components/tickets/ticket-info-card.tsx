import { User, Calendar, Tag, AlertCircle, FileText, Lock } from 'lucide-react';
import { Card, CardContent, Badge, Avatar } from '@/components/ui';

interface TicketInfo {
  isAnonymous?: boolean;
  reporter: { name: string };
  createdAt: Date | string;
  category: { name: string };
  priority: { name: string };
  description: string;
}

export function TicketInfoCard({ ticket }: { ticket: TicketInfo }) {
  const reporterName = ticket.isAnonymous ? 'Pelapor Anonim' : ticket.reporter.name;

  return (
    <Card variant="default" className="border-border/80 shadow-xs">
      <CardContent className="p-6 space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Avatar name={reporterName} size="md" />
            <div>

              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>{reporterName}</span>
                {ticket.isAnonymous && (
                  <Badge variant="outline" size="sm" className="text-[10px] bg-muted/50">
                    <Lock className="w-3 h-3 mr-1" />
                    Anonim
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(ticket.createdAt).toLocaleString('id-ID')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="font-medium text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {ticket.category.name}
            </Badge>
            <Badge
              variant={ticket.priority.name.toLowerCase().includes('tinggi') ? 'destructive' : 'secondary'}
              size="sm"
              className="font-medium text-xs"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {ticket.priority.name}
            </Badge>
          </div>
        </div>

        {/* Narrative Content Body */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Deskripsi Laporan Pengaduan</span>
          </h3>
          <div className="p-4 rounded-xl bg-surface-muted/40 border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {ticket.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
