import Link from 'next/link';
import { ArrowLeft, Tag, FileText } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

export function TicketHeader({ title, ticketNumber, statusName }: { title: string; ticketNumber: string; statusName: string }) {
  return (
    <div className="space-y-4 border-b border-border/80 pb-6">
      <Link href="/dashboard/tickets" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Kembali ke Daftar Tiket</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              #{ticketNumber}
            </span>
            <Badge variant="info" size="sm" className="font-medium">
              {statusName}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-foreground pt-1">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
