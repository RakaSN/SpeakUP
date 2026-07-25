import { auth } from './auth';
import { container } from '@/shared/server/container';
import { AppError } from '@/shared/lib/errors';

/**
 * Utilitas untuk memvalidasi sesi pengguna dan RBAC permission code.
 * Gunakan fungsi ini di dalam Route Handlers atau Server Actions.
 * 
 * @example
 * await authorize('ticket.create'); // Akan throw AppError jika tidak berhak
 */
export async function authorize(permissionCode: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new AppError('AUTH_INVALID', 'Sesi tidak valid atau Anda belum login.', 401);
  }

  // Memanggil Permission Service yang terinjeksi dari Container
  const hasAccess = await container.permissions.hasPermission(session.user.id, permissionCode);
  
  if (!hasAccess) {
    throw new AppError('AUTH_FORBIDDEN', `Akses ditolak: Anda tidak memiliki izin '${permissionCode}'.`, 403);
  }

  return session.user;
}
