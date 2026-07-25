import { TicketService } from '@/features/tickets/server/ticket.service';
import { TicketHeader } from '@/components/tickets/ticket-header';
import { TicketInfoCard } from '@/components/tickets/ticket-info-card';
import { ActivityTimeline } from '@/components/tickets/activity-timeline';
import { AssignmentHistory } from '@/components/tickets/assignment-history';
import { AttachmentList } from '@/components/tickets/attachment-list';
import { TicketActions } from '@/components/tickets/ticket-actions';

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await TicketService.getTicket(id);

  return (
    <div className="flex flex-col gap-8 py-6">
      <TicketHeader 
        title={ticket.title} 
        ticketNumber={ticket.ticketNumber} 
        statusName={ticket.status.name} 
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Kolom Kiri: Info Tiket Utama */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <TicketInfoCard ticket={ticket} />
            <AttachmentList attachments={ticket.attachments} />
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <ActivityTimeline activities={ticket.activities} />
          </div>
        </div>

        {/* Kolom Kanan: Aksi & Assignment */}
        <div className="space-y-8">
          <AssignmentHistory assignments={ticket.assignments} />
          <TicketActions ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}
