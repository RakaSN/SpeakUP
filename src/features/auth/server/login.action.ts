'use server';

import { signIn } from '@/features/auth/server/auth';
import { AuthError } from 'next-auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email dan password wajib diisi.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Email atau password salah.' };
        default:
          return { success: false, error: 'Terjadi kesalahan sistem saat login.' };
      }
    }
    // Next.js redirect errors need to be rethrown
    throw error;
  }
}
