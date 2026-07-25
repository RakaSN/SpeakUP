# SpeakUp - Domain Model

Domain Model ini menggambarkan entitas utama dalam sistem SpeakUp. Mengikuti prinsip skalabilitas, **Ticket** berdiri sebagai tulang punggung yang didukung oleh tabel-tabel **Master Data**.

```text
User
│
├── Pelapor (Siswa, Guru, Orang Tua, Masyarakat)
├── Admin
├── BK
├── Wakasek
├── Kepala Sekolah
└── Super Admin (Pengendali Sistem)

Master Data (Dinamis, dikelola via Dashboard)
│
├── Types (Jenis: Pengaduan, Konsultasi, Surat, Helpdesk)
├── Categories (Klasifikasi: Bullying, Akademik, Sarpras)
├── Statuses (Submitted, Verified, In Progress, Resolved, Rejected)
└── Priorities (Low, Medium, High, Critical)

Ticket (Entitas Transaksional)
│
├── Relasi ke Master Data (Type, Category, Status, Priority)
├── Visibility (Public, Internal, Confidential, Strictly Confidential)
├── Anonimitas (Flag is_anonymous)
├── Assignment History (Tabel disposisi terpisah untuk melacak alur penugasan)
├── Activity (Audit Log)
└── Attachment

Notification
└── Entitas komunikasi internal yang dipicu oleh perubahan/disposisi tiket.
```

## Keunggulan Desain Ini
1. **Pemisahan Konsep `Type` dan `Category`**: Tipe mendefinisikan *Workflow* layanan (Ini Pengaduan atau Konsultasi?). Kategori mendefinisikan ranah masalah (Bullying, Sarpras). Sangat modular.
2. **Histori Penugasan Kuat**: Kita dapat melihat tiket A pernah ditangani Admin selama 2 jam, lalu dilempar ke BK dan diselesaikan dalam 2 hari.
3. **Konfigurasi Tanpa Kode (No Code Changes)**: Jika sekolah butuh Kategori Laporan baru atau Jenis Layanan baru, Super Admin cukup menambahkannya di Master Data via UI tanpa *deploy* ulang server.
