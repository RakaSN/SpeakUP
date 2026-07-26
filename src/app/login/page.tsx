import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 selection:bg-primary/20 relative overflow-hidden">
      {/* Subtle gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[15%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      {/* Return to Home link */}
      <div className="w-full max-w-md mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-3 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-md transition-transform hover:scale-105">
              S
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight text-foreground">SpeakUp</span>
          </Link>
          <Badge variant="success" size="sm" className="bg-success/15 text-success border-success/30 font-medium">
            Portal Auth SDS v2.0
          </Badge>
          <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight pt-2">
            Masuk ke Portal Petugas
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs">
            Akses dashboard khusus Guru BK, Tenaga Pendidik, dan Administrator Sekolah.
          </p>
        </div>

        <Card variant="glass" className="border border-border/60 shadow-xl animate-scale-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>Autentikasi Akun</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Masukkan email resmi dan kata sandi Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Terenkripsi dengan TLS & NextAuth Standard</span>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} SMKS Kampung Jawa Jakarta.
          </p>
        </div>
      </div>
    </div>
  );
}
