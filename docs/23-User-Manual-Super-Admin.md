# 📖 Panduan Penggunaan Aplikasi — Super Admin

**Sistem**: SpeakUp (Platform Pengaduan & Konsultasi Digital)  
**Peran**: Super Admin / Pengelola Sistem  
**URL**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🔑 1. Kredensial Login Default
- **Email**: `admin@speakup.id` *(sesuai konfigurasi `.env`)*
- **Password**: `AdminSpeakUp2026!` *(sesuai konfigurasi `.env`)*

---

## 🏠 2. Menu Dashboard & Ringkasan Metrik
Setelah berhasil login, Super Admin akan diarahkan ke **Operational Dashboard** yang menyajikan:
- **Total Tiket Masuk**: Keseluruhan pengaduan dari seluruh siswa/pelapor.
- **Tiket Aktif**: Tiket dalam status `OPEN`, `ASSIGNED`, atau `IN_PROGRESS`.
- **Tiket Terlambat (Overdue SLA)**: Tiket yang telah melewati estimasi jam penyelesaian (`targetResolutionAt`).
- **Visual Badge SLA**:
  - 🟢 **ON TRACK**: Waktu penyelesaian masih aman.
  - 🟡 **AT RISK**: Sisa waktu penyelesaian <= 4 jam.
  - 🔴 **OVERDUE**: Melebihi tenggat waktu SLA.

---

## 👥 3. Pengelolaan Pengguna (`/dashboard/users`)
Super Admin memiliki wewenang penuh dalam manajemen pengguna (Manajemen Akses & RBAC):
1. **Tambah Pengguna Baru**:
   - Klik tombol **"+ Tambah User"**.
   - Isi Nama, Email, Role (*Admin, Guru BK, Kepala Sekolah, Reporter/Siswa*), NISN/NIP, dan Password.
   - Klik **Simpan**.
2. **Ubah Status Akun**:
   - Mengubah status akun menjadi `ACTIVE`, `INACTIVE`, atau `LOCKED` untuk memblokir akses secara sementara/permanen.
3. **Reset Password Manual**:
   - Membantu pengguna yang lupa kata sandi dengan mengatur ulang password dari panel Admin.

---

## ⚙️ 4. Pengelolaan Data Master (`/dashboard/master-data`)
Mengatur parameter sistem pengaduan:
1. **Master Kategori Tiket**: Menambah/mengedit kategori (misal: *Bullying, Fasilitas, Akademik, Lainnya*).
2. **Master Prioritas & SLA**: Setting jam penyelesaian (`slaHours`). Misal: Prioritas *Tinggi* = 24 Jam, *Rendah* = 72 Jam.
3. **Proteksi Soft-Delete (Deactivation Guard)**:
   - Jika suatu Kategori/Prioritas sudah pernah digunakan oleh tiket aktif, sistem **tidak akan menghapusnya secara fisik**, melainkan secara otomatis mengubah statusnya menjadi Non-Aktif (`isActive = false`) agar histori tiket lama tidak rusak.

---

## 📊 5. Analitik & Laporan (`/dashboard/analytics` & `/dashboard/reports`)
1. **Analitik Sistem**: Melihat tren pengaduan 6 bulan terakhir, distribusi kategori terbanyak, dan rasio ketepatan waktu penyelesaian SLA.
2. **Ekspor Laporan (CSV / Excel)**:
   - Akses `/dashboard/reports`.
   - Pilih rentang tanggal atau kategori tiket.
   - Klik **"Download CSV Report"**. File otomatis terunduh berformat UTF-8 BOM yang dapat langsung dibuka rapi di Microsoft Excel.

---

## 🔔 6. Notifikasi & Audit Log
1. **Notifikasi Lonceng (Top-Nav)**: Setiap kali ada tiket baru atau perubahan status, ikon lonceng di kanan atas akan menampilkan *unread counter*. Klik **"Mark All as Read"** untuk membersihkan notifikasi.
2. **Audit Log System**: Seluruh aktivitas krusial (Login, Ganti Password, Reset Password, Ubah Status Tiket) terekam secara otomatis di sistem Audit Log lengkap dengan informasi IP Address dan detail perubahan data (`oldValue` ➡️ `newValue`).
