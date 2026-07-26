'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  StateWrapper,
  PageHeader,
  Divider,
} from '@/components/ui';
import { ArrowLeft, CheckCircle2, Clock, Circle } from 'lucide-react';

interface TrackingData {
  code: string;
  category: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  lastUpdated: string;
  isAnonymous: boolean;
  timeline: Array<{
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
}

export default function PublicTrackingPage() {
  const params = useParams();
  const code = (params?.code as string) || '';

  const [state, setState] = useState<'loading' | 'empty' | 'error' | 'success'>('loading');
  const [ticket, setTicket] = useState<TrackingData | null>(null);

  useEffect(() => {
    if (!code) {
      setState('empty');
      return;
    }

    // Simulate fetching tracking data safely
    const timer = setTimeout(() => {
      if (code.toLowerCase() === 'notfound') {
        setState('empty');
      } else if (code.toLowerCase() === 'error') {
        setState('error');
      } else {
        setTicket({
          code: code.toUpperCase(),
          category: 'Pengaduan Kedisiplinan & Konseling',
          status: 'IN_PROGRESS',
          createdAt: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          lastUpdated: '10 menit lalu',
          isAnonymous: true,
          timeline: [
            {
              title: 'Laporan Diterima Sistem',
              description: 'Pengaduan telah masuk dan mendapatkan nomor resi resmi.',
              timestamp: '26 Juli 2026 09:00',
              completed: true,
            },
            {
              title: 'Ditinjau oleh Tim BK',
              description: 'Petugas sedang mempelajari isi laporan dan menganalisis prioritas.',
              timestamp: '26 Juli 2026 10:15',
              completed: true,
            },
            {
              title: 'Proses Tindak Lanjut',
              description: 'Petugas sedang berkoordinasi dengan pihak terkait secara tertutup.',
              timestamp: '26 Juli 2026 11:30',
              completed: false,
            },
            {
              title: 'Selesai & Tutup Laporan',
              description: 'Tindakan penanganan rampung.',
              timestamp: 'Pendataan akhir',
              completed: false,
            },
          ],
        });
        setState('success');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [code]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <Badge variant="success">Selesai</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">Sedang Diproses</Badge>;
      default:
        return <Badge variant="info">Diterima</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-border/60 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold transition-transform group-hover:scale-105">
            S
          </div>
          <span className="font-bold font-heading text-lg">SpeakUp</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="font-medium">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Beranda
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <PageHeader
          title="Pelacakan Status Pengaduan"
          description={`Resi Pengaduan: ${code}`}
          badge={ticket ? getStatusBadge(ticket.status) : undefined}
        />

        <StateWrapper
          state={state}
          emptyTitle="Kode Pengaduan Tidak Ditemukan"
          emptyDescription="Silakan periksa kembali kode tiket yang Anda masukkan atau hubungi pihak sekolah."
          onRetry={() => setState('loading')}
        >
          {ticket && (
            <div className="space-y-6">
              {/* Ticket Overview Card */}
              <Card variant="default" className="animate-scale-in">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle>{ticket.category}</CardTitle>
                      <CardDescription>
                        Dibuat pada {ticket.createdAt} • {ticket.isAnonymous ? '🔒 Laporan Anonim' : 'Pelapor Terdaftar'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" size="lg">
                      Terakhir diperbarui {ticket.lastUpdated}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Progress Timeline Card */}
              <Card variant="default" className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Alur Penanganan Tiket</CardTitle>
                  <CardDescription>
                    Lacak tahapan penanganan pengaduan Anda oleh Tim BK secara transparan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative pl-8 space-y-8">
                    {/* Connecting line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border rounded-full" />

                    {ticket.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className="relative group animate-fade-in"
                        style={{ animationDelay: `${idx * 120}ms` }}
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-8 top-0.5 z-10">
                          {step.completed ? (
                            <div className="w-[30px] h-[30px] rounded-full bg-success text-success-foreground flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : idx === ticket.timeline.findIndex(s => !s.completed) ? (
                            <div className="w-[30px] h-[30px] rounded-full bg-warning/20 text-warning-foreground flex items-center justify-center border-2 border-warning">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-[30px] h-[30px] rounded-full bg-muted border-2 border-border flex items-center justify-center">
                              <Circle className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 pl-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-base font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.title}
                            </h4>
                            {step.completed && (
                              <Badge variant="success" size="sm">
                                Selesai
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          <span className="inline-block text-xs font-mono text-muted-foreground/70 pt-0.5">
                            {step.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </StateWrapper>
      </main>

      <Divider />
      <footer className="bg-surface/50 py-6 text-center text-xs text-muted-foreground border-t border-border/60">
        © 2026 SpeakUp Platform. Pelacakan Publik SDS v1.0.
      </footer>
    </div>
  );
}
