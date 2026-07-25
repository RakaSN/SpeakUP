export function TicketHeader({ title, ticketNumber, statusName }: { title: string; ticketNumber: string; statusName: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground font-medium">#{ticketNumber}</p>
      </div>
      <div>
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
          {statusName}
        </span>
      </div>
    </div>
  );
}
