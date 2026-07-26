'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/features/auth/server/login.action';
import { Button, Input, ErrorState } from '@/components/ui';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        toast.info('Memverifikasi kredensial...');
        const res = await loginAction(formData);
        if (res && !res.success) {
          setError(res.error || 'Login gagal.');
          toast.error(res.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        } else {
          toast.success('Login berhasil! Mengalihkan ke dashboard...');
        }
      } catch {
        // NextAuth handle redirect automatically
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <ErrorState
          title="Login Gagal"
          message={error}
          className="p-4 text-xs"
        />
      )}

      <div className="space-y-1.5">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Sekolah"
          required
          placeholder="guru@speakup.id"
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Input
          id="password"
          name="password"
          type="password"
          label="Kata Sandi"
          required
          placeholder="••••••••"
          className="h-10 text-sm"
        />
      </div>

      <Button
        type="submit"
        variant="default"
        isLoading={isPending}
        className="w-full h-10 text-sm font-semibold shadow-sm mt-2"
      >
        <LogIn className="w-4 h-4 mr-2" />
        <span>Masuk ke Dashboard</span>
      </Button>
    </form>
  );
}
