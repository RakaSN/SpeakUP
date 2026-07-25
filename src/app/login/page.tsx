import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Masuk ke SpeakUp
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan kata sandi Anda untuk mengakses sistem
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="px-8 text-center text-xs text-muted-foreground">
          SMKS Kampung Jawa Jakarta &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
