'use client';

import { useState, useTransition } from 'react';
import { changeStatusAction } from '@/features/tickets/server/ticket-manage.action';

export function TicketActions({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (action: 'resolve' | 'close' | 'reject') => {
    const note = prompt(`Masukkan catatan / alasan untuk aksi [${action.toUpperCase()}]:`);
    if (note === null) return; // Batal jika dipencet cancel

    setError(null);
    const formData = new FormData();
    formData.append('ticketId', ticketId);
    formData.append('action', action);
    formData.append('note', note);

    startTransition(async () => {
      const res = await changeStatusAction(formData);
      if (!res.success) {
        setError(res.error || 'Gagal mengubah status');
      }
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Aksi Pengelola</h3>

      {error && (
        <div className="rounded-md bg-destructive/15 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleStatusChange('resolve')}
          disabled={isPending}
          className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-200 bg-background px-4 py-2 text-sm font-medium text-emerald-600 shadow-sm hover:bg-emerald-50 focus-visible:outline-none disabled:opacity-50"
        >
          {isPending ? 'Memproses...' : 'Tandai Selesai (Resolve)'}
        </button>

        <button
          onClick={() => handleStatusChange('close')}
          disabled={isPending}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:opacity-50"
        >
          {isPending ? 'Memproses...' : 'Tutup Tiket (Close)'}
        </button>

        <button
          onClick={() => handleStatusChange('reject')}
          disabled={isPending}
          className="inline-flex h-9 items-center justify-center rounded-md border border-destructive/30 bg-background px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-destructive/10 focus-visible:outline-none disabled:opacity-50"
        >
          {isPending ? 'Memproses...' : 'Tolak Laporan (Reject)'}
        </button>
      </div>
    </div>
  );
}
