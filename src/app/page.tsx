'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Smartphone,
  Search,
  FileText,
  Lock,
  ArrowRight,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Divider,
} from '@/components/ui';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState('');

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast.error('Masukkan kode resi tiket pengaduan Anda');
      return;
    }
    toast.info(`Mencari tiket ${trackingCode.trim()}...`);
    router.push(`/tracking/${trackingCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-heading text-xl shadow-sm transition-transform hover:scale-105">
              S
            </div>
            <div>
              <span className="text-xl font-bold font-heading tracking-tight text-foreground">
                SpeakUp
              </span>
              <Badge variant="success" size="sm" className="ml-2 bg-success/15 text-success border-success/30 font-medium">
                PX v1.1
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-medium">
                <Lock className="w-4 h-4 mr-1.5 opacity-70" />
                Masuk Petugas
              </Button>
            </Link>
            <Link href="/dashboard/tickets/create">
              <Button variant="default" size="sm" className="shadow-sm font-medium">
                <FileText className="w-4 h-4 mr-1.5" />
                Buat Laporan
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center">
        <div className="text-center max-w-3xl space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Pengaduan & Konseling Digital SchoolOS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-foreground leading-[1.12]">
            Suara Anda Berharga, <br />
            <span className="gradient-text">Aman & Terlindungi</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Sampaikan pengaduan, saran, atau permohonan konseling secara anonim dan terstruktur.
            Tim Guru BK siap merespon secara profesional dan terukur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard/tickets/create" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full sm:w-auto text-base shadow-md group">
                <FileText className="w-5 h-5 mr-2" />
                <span>Buat Laporan Pengaduan</span>
                <ArrowRight className="w-4 h-4 ml-2 opacity-70 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>Login Guru & BK</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Tracking Card */}
        <div className="w-full max-w-xl mt-14 animate-slide-up stagger-1">
          <Card variant="glass" className="p-2 sm:p-4 border border-border/60 shadow-lg">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Lacak Status Tiket Pengaduan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Masukkan kode unik resi tiket untuk memantau progres tanpa login.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTrackTicket} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Input
                    placeholder="Contoh: TK-2026-07-A1B2C3"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                  <Button type="submit" variant="default" className="shrink-0 font-medium">
                    <Search className="w-4 h-4 mr-1.5" />
                    Lacak Resi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full mt-24">
          <Card variant="default" className="animate-fade-in stagger-1 group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">100% Rahasia & Anonim</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Identitas Anda terlindungi sepenuhnya. Pilih mode anonim jika tidak ingin mencantumkan nama.
              </p>
            </CardContent>
          </Card>

          <Card variant="default" className="animate-fade-in stagger-2 group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Respon SLA Terukur</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setiap laporan dipantau dengan batas waktu respon otomatis untuk penanganan lebih cepat.
              </p>
            </CardContent>
          </Card>

          <Card variant="default" className="animate-fade-in stagger-3 ai-card-glow group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span>AI Insights</span>
                <Badge variant="outline" size="sm" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20">Governed</Badge>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Klasifikasi kategori dan estimasi risiko otomatis membantu Guru BK menetapkan prioritas.
              </p>
            </CardContent>
          </Card>

          <Card variant="default" className="animate-fade-in stagger-4 group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center transition-transform group-hover:scale-110">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Responsif di Smartphone</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Antarmuka dioptimalkan secara rapi untuk HP, tablet, maupun komputer di mana saja.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <section className="w-full mt-24 py-16">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="outline" size="sm" className="px-3 py-1">
              Alur Sederhana
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
              Bagaimana SpeakUp Bekerja?
            </h2>
            <p className="text-sm text-muted-foreground">
              3 langkah praktis untuk mengutarakan pendapat dan memantau hasilnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Tulis Pengaduan',
                desc: 'Isi judul, pilih kategori pengaduan, sertakan bukti lampiran jika ada, dan pilih opsi publikasi/anonim.',
              },
              {
                step: '2',
                title: 'Dapatkan Kode Resi',
                desc: 'Simpan kode resi tiket unik yang dihasilkan sistem secara otomatis untuk melacak progres secara publik.',
              },
              {
                step: '3',
                title: 'Tindak Lanjut Tim BK',
                desc: 'Guru BK memproses laporan, memberikan disposisi, dan memperbarui status hingga kasus terselesaikan.',
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-surface border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                {idx < 2 && (
                  <ChevronRight className="hidden md:block absolute right-[-20px] top-1/2 text-muted-foreground/30 w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full mt-8 py-16 border-t border-border/40">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="outline" size="sm" className="px-3 py-1">
              Pertanyaan Umum
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <Card variant="default" className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Apakah laporan saya benar-benar anonim?</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  Ya. Jika Anda memilih mode anonim, nama dan ID identitas Anda tidak disimpan dalam record tiket yang dapat dilihat publik maupun petugas.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Berapa lama laporan saya akan diproses?</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  Setiap laporan memiliki target SLA (biasanya 24–48 jam kerja). Laporan berisiko tinggi diprioritaskan otomatis oleh sistem.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Divider />

      {/* Footer */}
      <footer className="bg-surface/50 py-10 border-t border-border/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold font-heading text-base">
              S
            </div>
            <span className="text-base font-bold font-heading text-foreground">SpeakUp Platform</span>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-left">
            © 2026 SpeakUp — SMKS Kampung Jawa Jakarta. Seluruh Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="text-border">•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </Link>
            <span className="text-border">•</span>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              SDS v2.0 PX
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
