import { auth } from '@/features/auth/server/auth';
import { changePasswordAction } from '@/features/users/server/user.action';
import { db } from '@/shared/server/db';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRoles: { include: { role: true } },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl py-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi pribadi dan keamanan kata sandi Anda.</p>
      </div>

      {/* Ringkasan Profil */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Informasi Akun</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Nama Lengkap</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Alamat Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status Akun</p>
            <p className="font-semibold text-emerald-600">{user.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Peran / Roles</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.userRoles.map((ur) => (
                <span key={ur.roleId} className="rounded border bg-muted px-2 py-0.5 text-xs font-medium">
                  {ur.role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Ganti Password */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Keamanan & Password</h3>

        <form action={changePasswordAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="oldPassword">Password Saat Ini</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Masukkan password lama..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="newPassword">Password Baru</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Minimal 8 karakter..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Perbarui Password
          </button>
        </form>
      </div>
    </div>
  );
}
