'use server';

import { auth } from '@/features/auth/server/auth';
import { UserService, type UserStatus } from './user.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUserAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const status = (formData.get('status') as UserStatus) || 'ACTIVE';
  const roleIds = formData.getAll('roleIds') as string[];

  if (!name || !email) {
    return;
  }

  try {
    await UserService.createUser({ name, email, password, status, roleIds }, session.user.id);
    revalidatePath('/dashboard/users');
  } catch (error) {
    // Handled
  }
  redirect('/dashboard/users');
}

export async function updateUserAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const status = (formData.get('status') as UserStatus) || undefined;
  const roleIds = formData.getAll('roleIds') as string[];

  if (!id) return;

  try {
    await UserService.updateUser(id, { name, email, status, roleIds }, session.user.id);
    revalidatePath('/dashboard/users');
  } catch (error) {
    // Handled
  }
}

export async function resetPasswordAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthenticated' };

  try {
    const newPassword = await UserService.resetPassword(userId, session.user.id);
    return { success: true, newPassword };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Gagal mereset password' };
  }
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!oldPassword || !newPassword) {
    return;
  }

  try {
    await UserService.changePassword(session.user.id, oldPassword, newPassword);
    revalidatePath('/dashboard/profile');
  } catch (error) {
    // Handled
  }
}
