'use server';

import { auth } from '@/features/auth/server/auth';
import { TicketService } from '@/features/tickets/server/ticket.service';
import { StorageService } from '@/shared/server/storage.service';
import { CreateTicketSchema } from '../validators/ticket.validator';
import { db } from '@/shared/server/db';
import { redirect } from 'next/navigation';

export async function createTicketAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Anda harus login untuk membuat tiket' };
  }

  // Ekstrak data dari FormData
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    typeId: formData.get('typeId'),
    categoryId: formData.get('categoryId'),
    priorityId: formData.get('priorityId'),
    isAnonymous: formData.get('isAnonymous') === 'true',
    visibility: formData.get('visibility') || 'INTERNAL',
  };

  const validation = CreateTicketSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' };
  }

  const file = formData.get('attachment') as File | null;
  
  let newTicketId = '';

  try {
    let attachmentData = null;
    
    // Handle upload pertama kali jika ada
    if (file && file.size > 0) {
      attachmentData = await StorageService.uploadTicketAttachment(file);
    }

    // Panggil service bisnis dengan transaksi
    const ticket = await TicketService.createTicket({
      ...validation.data,
      reporterId: session.user.id,
    });

    newTicketId = ticket.id;

    // Tambahkan attachment jika ada (menggunakan DB transaksi lanjutan/terpisah,
    // di sini kita gabungkan logic karena service terpusat, idealnya di service, 
    // namun untuk simplifikasi kita insert via DB instance)
    if (attachmentData) {
      await db.ticketAttachment.create({
        data: {
          ticketId: ticket.id,
          uploadedById: session.user.id,
          fileName: attachmentData.fileName,
          fileUrl: attachmentData.fileUrl,
          fileType: attachmentData.fileType,
          fileSize: attachmentData.fileSize,
        },
      });
    }

  } catch (error) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan sistem' };
  }

  // Jika sukses, redirect (Redirect akan melempar error khusus Next.js, jadi harus di luar try-catch)
  redirect(`/dashboard/tickets/${newTicketId}`);
}
