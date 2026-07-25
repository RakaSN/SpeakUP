import { UserService, type UserStatus } from '@/features/users/server/user.service';
import Link from 'next/link';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const status = (resolvedParams.status as UserStatus) || undefined;

  const { items, meta } = await UserService.listUsers({ page, limit: 10, search, status });

  const statusBadgeMap = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    INACTIVE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    LOCKED: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-sm text-muted-foreground">Kelola pengguna, status akun, dan penugasan peran (RBAC).</p>
        </div>
        <Link
          href="/dashboard/users/create"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 shrink-0"
        >
          + Tambah Pengguna
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Cari nama atau email..."
          className="flex h-9 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />

        <select
          name="status"
          defaultValue={status || ''}
          className="flex h-9 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Semua Status</option>
          <option value="ACTIVE">Aktif (ACTIVE)</option>
          <option value="INACTIVE">Nonaktif (INACTIVE)</option>
          <option value="LOCKED">Terkunci (LOCKED)</option>
        </select>

        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Cari
        </button>
      </form>

      {/* Tabel Pengguna */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Peran (Roles)</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{user.name}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">Tanpa Peran</span>
                        ) : (
                          user.userRoles.map((ur) => (
                            <span key={ur.roleId} className="inline-flex items-center rounded-md border bg-secondary px-2 py-0.5 text-xs font-semibold">
                              {ur.role.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeMap[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs pt-2">
          <p className="text-muted-foreground">
            Halaman {meta.currentPage} dari {meta.totalPages} ({meta.totalItems} User)
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`/dashboard/users?page=${meta.currentPage - 1}${search ? `&search=${search}` : ''}`}
                className="px-3 py-1 rounded border bg-background hover:bg-muted"
              >
                Sebelumnya
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`/dashboard/users?page=${meta.currentPage + 1}${search ? `&search=${search}` : ''}`}
                className="px-3 py-1 rounded border bg-background hover:bg-muted"
              >
                Berikutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
