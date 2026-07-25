# SpeakUp — Product Requirements Document (PRD) & User Manual v1.0

> [!NOTE]
> Dokumen ini mencakup *Product Requirements Document* (PRD) sesuai detail yang diberikan, serta draf awal Panduan Pengguna (User Manual) untuk aplikasi SpeakUp versi 1.0 (MVP).

---

## Bagian I: Product Requirements Document (PRD)

### 1. Informasi Proyek
- **Nama Proyek:** SpeakUp
- **Tagline:** *Speak Safely. We Listen. We Act.*
- **Versi:** 1.0
- **Status:** Draft
- **Pemilik Proyek:** SMKS Kampung Jawa Jakarta
- **Project Lead:** Raka Sepyan Nurfiqri

### 2. Latar Belakang
SMKS Kampung Jawa Jakarta belum memiliki sistem pengaduan dan konsultasi digital yang terintegrasi. Saat ini penyampaian pengaduan masih dilakukan secara langsung, melalui WhatsApp, atau media lain yang belum terdokumentasi dengan baik.

Kondisi tersebut menyebabkan beberapa kendala, seperti:
- Sulit melacak status penyelesaian laporan.
- Tidak adanya nomor tiket sebagai identitas laporan.
- Riwayat penanganan tidak terdokumentasi.
- Sulit melakukan monitoring dan evaluasi.
- Kerahasiaan identitas pelapor belum terjamin secara sistem.

SpeakUp dirancang sebagai solusi untuk menyediakan platform yang aman, transparan, terdokumentasi, dan mudah digunakan oleh seluruh warga sekolah.

### 3. Visi
Menjadi platform layanan digital sekolah yang terpercaya untuk menyampaikan pengaduan, konsultasi, dan aspirasi secara aman, transparan, serta akuntabel.

### 4. Misi
1. Mempermudah penyampaian laporan.
2. Menjamin kerahasiaan identitas pelapor.
3. Memastikan setiap laporan memiliki proses yang jelas.
4. Mendukung pengambilan keputusan berbasis data.
5. Membangun budaya komunikasi yang sehat di lingkungan sekolah.

### 5. Tujuan
SpeakUp dibangun untuk:
- Mempermudah pelaporan.
- Mempercepat tindak lanjut.
- Meningkatkan transparansi.
- Mengurangi laporan yang hilang.
- Menyediakan histori lengkap setiap kasus.
- Menjadi pusat layanan digital sekolah.

### 6. Permasalahan Saat Ini
| Permasalahan | Dampak |
|---|---|
| Pengaduan dilakukan melalui WhatsApp/lisan | Sulit ditelusuri |
| Tidak ada nomor tiket | Sulit monitoring |
| Tidak ada histori | Sulit evaluasi |
| Tidak ada dashboard | Kepala sekolah sulit melihat statistik |
| Belum ada audit trail | Kurang akuntabel |

### 7. Stakeholder
**Internal:**
- Kepala Sekolah
- Wakil Kepala Sekolah
- Bimbingan Konseling (BK)
- Guru
- Tata Usaha
- Operator Sekolah
- Admin Sistem

**Eksternal:**
- Peserta Didik
- Orang Tua/Wali
- Masyarakat

### 8. Target Pengguna
**Pelapor:**
- Peserta Didik
- Guru
- Tendik
- Orang Tua
- Masyarakat

**Pengelola:**
- Admin
- BK
- Wakasek
- Kepala Sekolah
- Super Admin

### 9. Ruang Lingkup Versi 1 (MVP)
Versi pertama tidak perlu langsung memiliki semua fitur. Fokus hanya pada:
- Login
- Dashboard
- Pengaduan
- Konsultasi
- Tracking Tiket
- Disposisi
- Update Status
- Riwayat Aktivitas

*Yang belum masuk MVP: AI Assistant, WhatsApp Gateway, Live Chat, Mobile App, Push Notification, Multi Sekolah, Multi Bahasa.*

### 10. Nilai yang Dipegang (Core Values)
- **Confidential:** Identitas pelapor dilindungi.
- **Fair:** Semua laporan diproses sesuai prosedur.
- **Transparent:** Pelapor dapat melihat perkembangan laporannya sesuai hak akses.
- **Human First:** Teknologi mendukung pelayanan, bukan menggantikan empati.

### 11. Indikator Keberhasilan
Setelah implementasi, diharapkan:
- 100% laporan memiliki nomor tiket.
- Semua laporan dapat dilacak statusnya.
- Waktu respons awal lebih cepat dibanding proses manual.
- Kepala sekolah dapat melihat statistik laporan melalui dashboard.
- Seluruh aktivitas penting tercatat dalam audit log.

### 12. Prinsip Pengembangan
- **Security First:** Prioritas utama keamanan dan perlindungan data.
- **Privacy by Design:** Privasi dirancang sejak awal, bukan ditambahkan belakangan.
- **Simple User Experience:** Antarmuka sederhana, intuitif, dan mudah digunakan.
- **Mobile Friendly:** Tampilan optimal di perangkat seluler.
- **Modular Architecture:** Arsitektur modular agar mudah dikembangkan.
- **Scalable:** Mampu menangani pertumbuhan jumlah pengguna dan data.
- **Easy Maintenance:** Mudah dipelihara dan dikembangkan lebih lanjut.

### 13. Roadmap
**Phase 1: MVP**
- Login, Ticket, Dashboard, Disposisi

**Phase 2: Collaboration**
- Komentar, Lampiran, Email Notification, Export

**Phase 3: Analytics**
- Dashboard Statistik, SLA, Grafik, Audit

**Phase 4: Smart Platform**
- AI Assistant, Insight, Prediksi, Rekomendasi

> [!IMPORTANT]
> **Arsitektur Masa Depan**
> SpeakUp tidak akan "terkunci" sebagai aplikasi pengaduan saja. Lima tahun lagi, ketika sekolah ingin menambahkan layanan baru (permohonan surat, pelaporan fasilitas, helpdesk IT), fondasi sistemnya sudah siap.
>
> `SpeakUp ├── Pengaduan ├── Konsultasi ├── Aspirasi ├── Whistleblowing ├── Helpdesk └── Layanan Baru...`

---

## Bagian II: Panduan Pengguna (User Manual) - Versi 1 (MVP)

> [!TIP]
> Panduan ini berfokus pada fitur Minimum Viable Product (MVP) untuk memberikan gambaran alur kerja di aplikasi SpeakUp bagi para pengguna.

### A. Panduan untuk Pelapor
*(Peserta Didik, Guru, Tendik, Orang Tua, Masyarakat)*

1. **Login ke Sistem**
   - Buka portal SpeakUp.
   - Masukkan *username/email* dan *password* Anda.
2. **Dashboard Pelapor**
   - Setelah login, Anda akan melihat Dashboard yang berisi ringkasan laporan aktif Anda.
3. **Membuat Pengaduan / Konsultasi Baru**
   - Klik tombol **"Buat Laporan Baru"** atau **"Konsultasi Baru"**.
   - Isi detail laporan: Kategori, Judul, dan Deskripsi secara jelas.
   - Klik **"Kirim"**. Sistem akan otomatis menghasilkan **Nomor Tiket** sebagai identitas laporan.
4. **Melacak Status Laporan (Tracking Tiket)**
   - Gunakan fitur **Tracking Tiket** dengan memasukkan nomor tiket, atau langsung klik tiket Anda di Dashboard.
   - Anda dapat melihat status terkini laporan Anda secara *real-time* (misal: *Menunggu*, *Diproses*, *Selesai*).

### B. Panduan untuk Pengelola
*(Admin, BK, Wakasek, Kepala Sekolah, Super Admin)*

1. **Login & Pemantauan Dashboard**
   - Login menggunakan akun pengelola.
   - Di Dashboard, Kepala Sekolah dan pengelola lainnya dapat melihat **Statistik Laporan** secara keseluruhan untuk mendukung pengambilan keputusan.
2. **Manajemen Laporan & Disposisi**
   - Buka menu **Daftar Laporan Masuk**.
   - Admin/Super Admin dapat melakukan **Disposisi** (meneruskan tiket) kepada petugas yang berwenang (misalnya tiket masalah kenakalan diteruskan ke Guru BK).
3. **Update Status & Tindak Lanjut**
   - Petugas yang ditugaskan dapat membuka tiket tersebut.
   - Lakukan tindak lanjut dan perbarui status laporan (Contoh: Ubah status dari *Menunggu* menjadi *Diproses* atau *Selesai*).
   - Seluruh perubahan status akan terlihat oleh Pelapor, menjamin prinsip *Transparent*.
4. **Riwayat Aktivitas (Audit Trail)**
   - Seluruh aktivitas mulai dari login, pembuatan tiket, disposisi, hingga update status akan tercatat dalam **Riwayat Aktivitas** secara otomatis.
   - Hal ini bertujuan agar seluruh alur kerja dapat dievaluasi dan dipertanggungjawabkan (*Fair & Accountable*).
