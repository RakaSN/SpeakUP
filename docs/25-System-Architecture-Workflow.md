# 🏗️ Cara Kerja Sistem (System Architecture & Workflow) — SpeakUp v1.0.0

Dokumen ini menjelaskan bagaimana komponen-komponen di dalam SpeakUp v1.0.0 saling berinteraksi dari ujung ke ujung (*end-to-end*). Dokumen ini sangat cocok digunakan sebagai dasar pembuatan *Checkpoint* Arsitektur.

---

## 1. Arsitektur Lapis (Layered Architecture)
SpeakUp menggunakan arsitektur *N-Tier* yang memisahkan antarmuka pengguna dari logika bisnis secara tegas:

1. **Presentation Layer (UI)**: Komponen React (Next.js App Router) berjalan di sisi *Client* dan *Server* (RSC).
2. **Server Actions (Controller)**: Menjembatani UI dengan backend. Bertugas menerima *payload* dari form, melakukan validasi dengan **Zod**, dan memanggil *Service Layer*.
3. **Service Layer (Logika Bisnis)**: Jantung aplikasi (`TicketService`, `AuditService`, `DashboardService`). Semua logika aturan bisnis (SLA, penugasan, visibilitas) dieksekusi di sini.
4. **EventBus (Asynchronous Pub/Sub)**: Modul *Event-Driven* yang memisahkan transaksi utama dari tugas-tugas reaktif seperti pengiriman notifikasi dan pencatatan jejak audit.
5. **Data Access Layer (ORM)**: **Prisma Client** mengeksekusi *query* ke database PostgreSQL.

---

## 2. Cara Kerja Alur Utama (Core Workflows)

### A. Alur Pembuatan Tiket (Ticket Creation Flow)
1. **Input**: Pengguna (Pelapor) mengisi formulir di `/dashboard/tickets/create`.
2. **Validasi**: Server Action memvalidasi input menggunakan Zod Schema.
3. **SLA Freeze**: `TicketService` mengambil nilai `slaHours` dari Master Prioritas yang dipilih.
4. **Kalkulasi Tenggat**: Server menghitung `targetResolutionAt` berdasarkan waktu pembuatan + `slaHours`.
5. **Transaksi Database**: Tiket disimpan ke PostgreSQL melalui Prisma.
6. **Trigger EventBus**: `TicketService` memancarkan event `TICKET_CREATED`.
7. **Reaksi Latar Belakang**:
   - `AuditListener` menangkap event ➡️ Menyimpan log `CREATE` ke tabel `AuditLog`.
   - `NotificationListener` menangkap event ➡️ Mengirim notifikasi *In-App* ke Admin.

### B. Alur Penugasan & Pembaruan Status (Ticket Assignment & Update)
1. **Input**: Admin menetapkan *Assignee* (Guru BK) atau mengubah status menjadi `RESOLVED`.
2. **Service Layer**: `TicketService` memvalidasi hak akses Admin/BK.
3. **Evaluasi SLA (Jika RESOLVED)**:
   - Sistem membandingkan `resolvedAt` dengan `targetResolutionAt`.
   - Menetapkan status `RESOLVED_ON_TIME` atau `RESOLVED_LATE`.
4. **Transaksi Database**: Data tiket diperbarui.
5. **Trigger EventBus**: Memancarkan event `TICKET_UPDATED` / `TICKET_ASSIGNED`.
6. **Reaksi Latar Belakang**: Notifikasi dikirimkan ke Pelapor dan Guru BK; Perubahan data (`oldValue` vs `newValue`) dicatat di Audit Log.

---

## 3. Cara Kerja Sistem Dasbor (Strategy Pattern)
Alih-alih menggunakan banyak *if-else* yang rumit di dalam komponen UI dasbor, SpeakUp menggunakan pola desain **Strategy Pattern**:

1. **Request**: Pengguna mengakses `/dashboard`.
2. **Identifikasi Peran**: `DashboardService` mengekstrak *Role* dari sesi otentikasi saat ini.
3. **Injeksi Strategi**:
   - Jika *Role* = `Admin`, gunakan `AdminDashboardStrategy`.
   - Jika *Role* = `Guru BK`, gunakan `GuruBKDashboardStrategy`.
   - Jika *Role* = `Kepala Sekolah`, gunakan `KepalaSekolahDashboardStrategy`.
   - Jika *Role* = `Reporter`, gunakan `ReporterDashboardStrategy`.
4. **Eksekusi & Return**: Strategi yang terpilih akan mengeksekusi *query* spesifik ke database (mengoptimalkan indeks dan mencegah N+1) lalu mengembalikan metrik yang diseragamkan (*Unified Interface*) ke komponen UI.

---

## 4. Cara Kerja Proteksi Data Master (Deactivation Guard)
Sistem melindungi integritas data histori tiket (misal: Jangan sampai tiket lama error karena Kategorinya dihapus):

1. **Input**: Admin mencoba menghapus Kategori "Bullying".
2. **Pengecekan Relasi (`MasterDataService`)**: Sistem mengecek apakah ada tiket yang menggunakan `categoryId` tersebut.
3. **Keputusan**:
   - Jika **Tidak Ada**: Kategori dihapus secara permanen (*Hard-Delete*).
   - Jika **Ada**: Sistem membatalkan *Hard-Delete* dan mengonversinya menjadi *Soft-Deactivation* (`isActive = false`).
4. **Efek UI**: Kategori "Bullying" menghilang dari form pilihan saat membuat tiket baru, tetapi tetap tampil normal pada tiket-tiket lama.

---

## 5. Cara Kerja Ekspor Laporan (CSV Export Engine)
1. **Request**: Admin / Kepala Sekolah menekan tombol "Download CSV".
2. **Stream Processing**: Server memanggil `ExportService` yang menarik data dari database menggunakan paginasi internal atau *cursor-based stream* untuk mencegah kebocoran memori (*Memory Leak*).
3. **Formatting**: Data diubah menjadi format *Comma Separated Values* (CSV).
4. **BOM Injection**: Server menyisipkan byte pembuka **UTF-8 BOM** (`\uFEFF`) agar aplikasi seperti Microsoft Excel dapat mengenali karakter bahasa Indonesia secara otomatis.
5. **Response**: File di-*stream* langsung ke *browser* pengguna dengan header `Content-Type: text/csv`.
