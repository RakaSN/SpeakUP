# SpeakUp - Development Roadmap

Berdasarkan arsitektur *Modular* dan prinsip *Scalable*, pengembangan SpeakUp diproyeksikan menjadi 4 fase utama.

## Phase 1: MVP (Minimum Viable Product)
**Fokus**: Peluncuran awal yang memastikan fungsionalitas pengumpulan data dan pelacakan keluhan dasar berjalan.
- Pengembangan Sistem Login & Manajemen Sesi (Roles: Pelapor vs Pengelola).
- Pembuatan antarmuka Form Pengaduan & Konsultasi.
- Mekanisme Generator Nomor Tiket (Ticket Tracking).
- Dashboard pengguna dan ringkasan metrik.
- Fitur Disposisi Laporan (Admin assign tiket ke user spesifik).
- Fitur Pembaruan Status & Perekaman Riwayat Aktivitas (Audit Trail).

## Phase 2: Collaboration & Feedback
**Fokus**: Membangun komunikasi yang lebih kaya antara pelapor dan sekolah.
- Implementasi fitur komentar / ruang obrolan tanya jawab di dalam tiket.
- Dukungan unggah *attachment* (foto bukti, tangkapan layar, atau dokumen).
- Integrasi *Email Notification* (Pelapor mendapat email saat status laporan berubah).
- Fitur *Export* data laporan untuk rekapitulasi (CSV/PDF) bagi Kepala Sekolah.

## Phase 3: Analytics & Measurement
**Fokus**: Menjadikan aplikasi sebagai pusat pengambilan keputusan (*Data-driven*).
- Dashboard Statistik Lanjutan (Grafik interaktif, tren kasus per bulan).
- Peta penyebaran masalah berdasarkan kategori (Kesiswaan, Fasilitas, dll).
- Pengukuran performa (SLA - *Service Level Agreement*): Waktu respons rata-rata untuk sebuah tiket ditanggapi/diselesaikan.
- *Advanced Audit Trail* untuk kebutuhan akuntabilitas.

## Phase 4: Smart Platform & Ekosistem
**Fokus**: Otomatisasi AI dan penambahan fungsionalitas modular sekolah.
- AI Assistant: Memberikan kategorisasi pintar saat pelapor mengetik keluhan.
- AI Insight: Prediksi tren masalah (misal: "Kemungkinan puncak keluhan fasilitas terjadi di musim hujan").
- Ekspansi Layanan Baru: Mengubah aplikasi dari "Sistem Pengaduan" menjadi ekosistem penuh (menambahkan menu "Bantuan IT", "Permohonan Surat/Izin", "Reservasi Ruangan") menggunakan fondasi struktur tiket yang sudah kokoh dari Phase 1.
