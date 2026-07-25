import { db } from '@/shared/server/db';
import { createUserAction } from '@/features/users/server/user.action';
import Link from 'next/link';

export default async function CreateUserPage() {
  const roles = await db.role.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-2xl py-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Pengguna Baru</h1>
          <p className="text-sm text-muted-foreground">Buat akun baru dan tetapkan peran (RBAC).</p>
        </div>
        <Link
          href="/dashboard/users"
          className="text-sm font-medium text-muted-foreground hover:underline"
        >
          &larr; Kembali
        </Link>
      </div>

      <form action={createUserAction} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="name">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Masukkan nama pengguna..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">Alamat Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="email@sekolah.sch.id"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">Password (Opsional)</label>
          <input
            type="password"
            id="password"
            name="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Default: SpeakUp2026!"
          />
          <p className="text-xs text-muted-foreground">Jika dikosongkan, password bawaan adalah `SpeakUp2026!`.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="status">Status Akun</label>
          <select
            id="status"
            name="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ACTIVE">Aktif (ACTIVE)</option>
            <option value="INACTIVE">Nonaktif (INACTIVE)</option>
            <option value="LOCKED">Terkunci (LOCKED)</option>
          </select>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <label className="text-sm font-semibold">Penugasan Peran (Roles)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
                <input
                  type="checkbox"
                  name="roleIds"
                  value={role.id}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Simpan Pengguna
          </button>
        </div>
      </form>
    </div>
  );
}
