'use server';

import { auth } from '@/features/auth/server/auth';
import { TicketService } from '@/features/tickets/server/ticket.service';
import { revalidatePath } from 'next/cache';

export async function assignTicketAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthenticated' };
  }

  const ticketId = formData.get('ticketId') as string;
  const assigneeId = formData.get('assigneeId') as string;
  const note = formData.get('note') as string;

  if (!ticketId || !assigneeId) {
    return { success: false, error: 'ID Tiket dan Petugas wajib diisi' };
  }

  try {
    await TicketService.assignTicket(ticketId, assigneeId, session.user.id, note);
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Gagal melakukan disposisi' };
  }
}

export async function changeStatusAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthenticated' };
  }

  const ticketId = formData.get('ticketId') as string;
  const action = formData.get('action') as string; // 'resolve' | 'close' | 'reject'
  const note = formData.get('note') as string;

  if (!ticketId || !action) {
    return { success: false, error: 'Data tidak lengkap' };
  }

  try {
    if (action === 'resolve') {
      await TicketService.resolveTicket(ticketId, session.user.id, note);
    } else if (action === 'close') {
      await TicketService.closeTicket(ticketId, session.user.id, note);
    } else if (action === 'reject') {
      await TicketService.rejectTicket(ticketId, session.user.id, note);
    }
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Gagal mengubah status' };
  }
}
