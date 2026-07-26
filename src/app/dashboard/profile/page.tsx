import { auth } from '@/features/auth/server/auth';
import { changePasswordAction } from '@/features/users/server/user.action';
import { db } from '@/shared/server/db';
import { redirect } from 'next/navigation';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Avatar,
} from '@/components/ui';
import { User, Shield, KeyRound } from 'lucide-react';

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
    <div className="space-y-8 max-w-2xl py-4 animate-fade-in">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi pribadi dan keamanan kata sandi Anda."
      />

      {/* Ringkasan Profil */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-primary" />
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border/60">
            <Avatar name={user.name} size="lg" />
            <div>
              <p className="text-lg font-bold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Nama Lengkap</p>
              <p className="font-semibold text-foreground">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Alamat Email</p>
              <p className="font-semibold text-foreground font-mono text-xs">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Status Akun</p>
              <Badge variant={user.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                {user.status === 'ACTIVE' ? 'Aktif' : user.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Peran / Roles</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {user.userRoles.map((ur) => (
                  <Badge key={ur.roleId} variant="secondary" size="sm">
                    {ur.role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Ganti Password */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4 text-primary" />
            Keamanan & Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={changePasswordAction} className="space-y-5">
            <Input
              type="password"
              id="oldPassword"
              name="oldPassword"
              label="Password Saat Ini"
              placeholder="Masukkan password lama..."
              leftIcon={<KeyRound className="w-4 h-4" />}
            />

            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              label="Password Baru"
              placeholder="Minimal 8 karakter..."
              helperText="Gunakan kombinasi huruf besar, kecil, angka, dan simbol."
              leftIcon={<KeyRound className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button type="submit" variant="default" className="font-semibold">
                <Shield className="w-4 h-4 mr-1.5" />
                Perbarui Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
