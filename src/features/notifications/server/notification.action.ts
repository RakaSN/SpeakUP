'use server';

import { auth } from '@/features/auth/server/auth';
import { NotificationService } from './notification.service';
import { revalidatePath } from 'next/cache';

export async function markAsReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthenticated' };
  }

  try {
    await NotificationService.markAsRead(session.user.id, notificationId);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Gagal memperbarui notifikasi' };
  }
}

export async function markAllAsReadAction(_formData?: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  try {
    await NotificationService.markAllAsRead(session.user.id);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/notifications');
  } catch (error) {
    // Exception logged if needed
  }
}
