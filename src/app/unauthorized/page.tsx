import Link from 'next/link';
import { Card, CardContent, Button } from '@/components/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Card variant="default" className="mx-auto max-w-md shadow-lg animate-scale-in">
        <CardContent className="p-8 space-y-5 flex flex-col items-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive animate-fade-in">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Akses Ditolak
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Anda tidak memiliki izin (permission) yang cukup untuk mengakses halaman ini. Silakan hubungi administrator.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="font-medium">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
