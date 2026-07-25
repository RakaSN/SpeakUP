# SpeakUp - Use Cases

## Aktor Utama
1. **Pelapor**: Pengguna akhir yang berkepentingan untuk menyampaikan aspirasi, pengaduan, atau konsultasi (Siswa, Guru, Orang Tua, Masyarakat).
2. **Pengelola**: Pengguna internal sekolah yang memiliki tanggung jawab untuk memantau, mendisposisi, dan menyelesaikan laporan (Admin, BK, Wakasek, Kepsek).

## Daftar Use Case (MVP)

### UC-01: Autentikasi Sistem
- **Aktor**: Pelapor, Pengelola
- **Kondisi Awal**: Pengguna belum login.
- **Deskripsi**: Aktor memasukkan kombinasi username/email dan password. Sistem memvalidasi, kemudian memberikan hak akses (sesi) berdasarkan *role* (peran) masing-masing.

### UC-02: Membuat Tiket Laporan Baru
- **Aktor**: Pelapor
- **Kondisi Awal**: Pelapor sudah berada di Dashboard personal.
- **Deskripsi**: Pelapor memilih kategori keluhan/konsultasi, mengetikkan judul, dan rincian masalah, lalu mengirimnya. Sistem merespons dengan menerbitkan Nomor Tiket.

### UC-03: Melacak Progress (Tracking Tiket)
- **Aktor**: Pelapor
- **Kondisi Awal**: Pelapor memiliki setidaknya satu Nomor Tiket.
- **Deskripsi**: Pelapor dapat melihat daftar keseluruhan tiket yang dimilikinya dan mengklik salah satu tiket untuk melihat *timeline* riwayat pemrosesan dan status terkini.

### UC-04: Memantau Dashboard Statistik
- **Aktor**: Pengelola (Kepala Sekolah, Wakasek, Admin)
- **Deskripsi**: Pengelola mengakses antarmuka yang menampilkan rangkuman data secara visual: total laporan bulan ini, persentase laporan selesai, beban kerja, dll.

### UC-05: Melakukan Disposisi Tiket
- **Aktor**: Pengelola (Admin / Super Admin)
- **Kondisi Awal**: Terdapat laporan baru (*Menunggu*).
- **Deskripsi**: Admin membaca keluhan awal dan menugaskan penyelesaian keluhan tersebut kepada aktor Pengelola yang lebih spesifik (assignee).

### UC-06: Memperbarui Status & Tindak Lanjut
- **Aktor**: Pengelola (Assignee / Petugas yang Ditugaskan)
- **Kondisi Awal**: Petugas telah menerima disposisi laporan.
- **Deskripsi**: Petugas memberikan catatan atau respons resmi dari sekolah, dan memperbarui status pelacakan laporan dari *Menunggu* menjadi *Diproses*, hingga akhirnya ditutup (*Selesai*).

### UC-07: Mengakses Riwayat Aktivitas (Audit Trail)
- **Aktor**: Pengelola
- **Deskripsi**: Pengelola memiliki akses log untuk melihat "Siapa melakukan apa dan kapan" terhadap suatu tiket untuk tujuan evaluasi dan transparansi (Audit).
