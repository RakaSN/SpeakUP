---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 07. Architecture Decision Summary

Halaman ini merupakan ringkasan dari keputusan-keputusan arsitektur besar yang telah diambil (*Architecture Decision Records* / ADR). Dokumen ini berfungsi sebagai referensi cepat.

| Topik Keputusan | Status | Penjelasan Singkat | Manfaat Utama | Referensi / Versi |
|---|---|---|---|---|
| **Service Layer (N-Tier)** | `Accepted` | Memisahkan logika manipulasi database (Prisma) ke dalam *class/object Service* (`TicketService.ts`), yang kemudian dipanggil oleh Server Actions. Server Actions dan Route Handlers murni difokuskan untuk memvalidasi input HTTP. | Kode yang dapat digunakan kembali (*reusable*), mudah diuji (*testable*), sentralisasi *Business Rules*. | ADR-001 / v1.0 |
| **EventBus (Asynchronous)** | `Accepted` | Menggunakan mekanisme Pub/Sub internal (`events` API di Node.js) untuk memicu proses sampingan (Notifikasi, Audit) tanpa memblokir atau menahan transaksi utama (seperti pembuatan tiket). | *Loose coupling*, mempercepat respons ke klien karena klien tidak perlu menunggu *email/log* terkirim. | ADR-002 / v1.0 |
| **Strategy Pattern Dashboard** | `Accepted` | UI Dasbor hanya memiliki satu file komponen masuk. *DashboardService* mendeteksi jenis pengguna dan meluncurkan *Strategy Class* khusus (Admin vs BK vs Reporter) untuk membentuk kueri Prisma dan statistik spesifik. | Menghindari file *spaghetti* `if-else` yang sangat besar di UI. Mencegah *N+1 query problem*. | ADR-003 / v1.0 |
| **SLA Freeze** | `Accepted` | Waktu SLA (misal 24 jam) tidak selalu merujuk pada tabel `MasterPriority`. Nilainya disalin (`slaHours`) dan di-*freeze* (`targetResolutionAt`) ke dalam entitas Tiket pada saat pembuatan. | Jika *Master Priority* berubah esok harinya, SLA untuk tiket-tiket yang lama tetap utuh/historis, tidak berubah secara magis. | ADR-004 / v1.0 |
| **Soft Delete Guardrails** | `Accepted` | Master Data yang sudah dihapus oleh pengguna tidak dihapus secara *hard-delete* (menghilangkan baris di DB) apabila data itu terikat dengan tabel lain. Ia hanya ditandai `isActive = false` (*Soft Deactivation*). | Menjaga referensi *foreign key* dan mencegah *crash* pada UI Dasbor atau halaman Laporan di masa mendatang. | ADR-005 / v1.0 |
| **Role-Based Access Control** | `Accepted` | Menggunakan Auth.js dipadukan dengan validasi lapisan (*Server Action* + Middleware) yang mengembalikan enum Role statis (Admin, BK, Kepsek, Reporter). | Keamanan *zero-trust* pada setiap perpindahan halaman dan mutasi data server. | ADR-006 / v1.0 |
| **Background Job Framework** | `Accepted` | Abstraksi `BackgroundJob` dan `SchedulerService` terpusat di `instrumentation.ts` tanpa dependensi Redis/RabbitMQ. | Fondasi otomatisasi (SLA reminder, auto-escalation, cleanup) yang terkontrol. | ADR-006B / v1.1 |
| **AI Governance Principles** | `Accepted` | 5 Prinsip utama AI (BackgroundJob, Non-Destructive, Auditability, Explainability, Human Override). | Membuka fitur kecerdasan AI tanpa merusak integritas *Business Rules* atau keamanan data. | ADR-007 / v1.1 |
| **AI Runtime & Capability Registry** | `Accepted` | Service Discovery terpusat (`AICapabilityRegistry`), Decorator Telemetri (`TelemetryAIProvider`), dan kontrak standar `AICapability<TInput, TOutput>`. | Menghilangkan *direct coupling* pada Job/Service, memberikan observabilitas AIOps terukur dan *rich health check*. | ADR-008 / v1.2 |
| **AI Model Evaluation & Quality Tracking** | `Accepted` | Pemisahan tegas domain Adopsi vs Kualitas, *Estimated Operational Precision*, 5-bucket *Confidence Calibration*, metrik *Time-to-Accept*, dan *Lifecycle States*. | Menutup *evaluation loop* AI, membedakan antara masalah kepercayaan pengguna vs performa model. | ADR-009 / v1.3 |




