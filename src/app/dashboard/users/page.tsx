import { UserService, type UserStatus } from '@/features/users/server/user.service';
import Link from 'next/link';
import {
  PageHeader,
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Avatar,
  EmptyState,
} from '@/components/ui';
import { Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';

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

  const getStatusBadge = (userStatus: UserStatus) => {
    switch (userStatus) {
      case 'ACTIVE':
        return <Badge variant="success">Aktif</Badge>;
      case 'INACTIVE':
        return <Badge variant="warning">Nonaktif</Badge>;
      case 'LOCKED':
        return <Badge variant="destructive">Terkunci</Badge>;
      default:
        return <Badge variant="outline">{userStatus}</Badge>;
    }
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <PageHeader
        title="Manajemen Pengguna & Peran"
        description="Kelola akun pengajar, pembimbing BK, administrator, dan hak akses pengguna sekolah."
        badge={<Badge variant="info">Total: {meta.totalItems}</Badge>}
        actions={
          <Link href="/dashboard/users/create">
            <Button variant="default" size="sm" className="font-medium">
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Pengguna Baru
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <Card variant="muted" className="p-4">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Cari nama pengguna atau email..."
            className="flex-1 bg-surface"
            leftIcon={<Search className="w-4 h-4" />}
          />

          <select
            name="status"
            defaultValue={status || ''}
            className="h-9.5 w-full sm:w-48 rounded-lg border border-input bg-surface px-3 py-1.5 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            <option value="">Semua Status Akun</option>
            <option value="ACTIVE">Aktif (ACTIVE)</option>
            <option value="INACTIVE">Nonaktif (INACTIVE)</option>
            <option value="LOCKED">Terkunci (LOCKED)</option>
          </select>

          <Button type="submit" variant="default" size="sm" className="w-full sm:w-auto font-medium">
            <Search className="w-4 h-4 mr-1.5" />
            Cari
          </Button>
        </form>
      </Card>

      {/* Tabel Pengguna */}
      <Card variant="default" className="overflow-hidden">
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState
              title="Tidak Ada Pengguna"
              description="Tidak ada data pengguna yang sesuai dengan kriteria pencarian atau status akun."
              actionLabel="Reset Pencarian"
              actionHref="/dashboard/users"
              className="py-16 border-0 bg-transparent"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm table-modern">
                <thead>
                  <tr>
                    <th>Pengguna</th>
                    <th>Email</th>
                    <th>Peran (Roles)</th>
                    <th>Status Akun</th>
                    <th>Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((user) => (
                    <tr key={user.id}>
                      <td className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-semibold text-foreground">{user.name}</span>
                      </td>
                      <td className="text-muted-foreground font-mono text-xs">{user.email}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {user.userRoles.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">Tanpa Peran</span>
                          ) : (
                            user.userRoles.map((ur) => (
                              <Badge key={ur.roleId} variant="secondary" size="sm">
                                {ur.role.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs pt-2">
          <p className="text-muted-foreground">
            Halaman <span className="font-semibold text-foreground">{meta.currentPage}</span> dari{' '}
            <span className="font-semibold text-foreground">{meta.totalPages}</span> ({meta.totalItems} Total User)
          </p>
          <div className="flex gap-2">
            {meta.currentPage > 1 && (
              <Link
                href={`/dashboard/users?page=${meta.currentPage - 1}${search ? `&search=${search}` : ''}`}
              >
                <Button variant="outline" size="sm" className="font-medium">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
              </Link>
            )}
            {meta.currentPage < meta.totalPages && (
              <Link
                href={`/dashboard/users?page=${meta.currentPage + 1}${search ? `&search=${search}` : ''}`}
              >
                <Button variant="outline" size="sm" className="font-medium">
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
