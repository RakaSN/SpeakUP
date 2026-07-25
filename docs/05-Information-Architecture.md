# SpeakUp - Information Architecture (IA)

Merupakan pemetaan hierarki informasi dan struktur navigasi aplikasi untuk fase MVP.

## A. Navigasi Area Pelapor

**1. Dashboard Pelapor (`/dashboard`)**
   - Ringkasan Jumlah Tiket (Total, Aktif, Selesai)
   - Daftar Laporan/Tiket Terbaru (List View)
   - Tombol Akses Cepat (Quick Action) -> "Buat Laporan Baru"

**2. Manajemen Laporan Saya (`/my-tickets`)**
   - Halaman Formulir Pengaduan / Konsultasi (`/my-tickets/create`)
   - Halaman Detail & Tracking Tiket (`/my-tickets/{id}`)
     - Informasi Judul & Deskripsi
     - Status Badge (Menunggu/Diproses/Selesai)
     - Timeline Riwayat Aktivitas Tiket

**3. Pengaturan (`/settings`)**
   - Profil Akun (Nama, Ubah Password)
   - Keluar Sistem (Logout)

---

## B. Navigasi Area Pengelola

**1. Dashboard Admin (`/admin/dashboard`)**
   - Widget Statistik Global (Total Laporan Masuk, Sedang Diproses, Selesai)
   - Notifikasi Laporan Masuk Terbaru

**2. Manajemen Semua Laporan (`/admin/tickets`)**
   - Tabel Daftar Laporan Masuk (Dengan fitur Filter/Pencarian Status & Kategori)
   - Tab khusus: "Laporan Ditugaskan Kepada Saya" (Assigned to Me)
   - Halaman Detail Tiket & Aksi (`/admin/tickets/{id}`)
     - Detail lengkap laporan (termasuk identitas pelapor jika diizinkan)
     - Fitur *Disposisi* (Assign to user)
     - Form Pembaruan Status & Tambah Catatan Tindak Lanjut
     - Log Audit Trail per tiket

**3. Manajemen Pengguna (Role: Super Admin) (`/admin/users`)**
   - Daftar Pengguna Sistem
   - Manajemen Role/Hak Akses

**4. Pengaturan Sistem (`/admin/settings`)**
   - Manajemen Kategori Laporan
   - Pengaturan Aplikasi
   - Keluar Sistem (Logout)
