# SpeakUp - Architecture Decision Record (ADR)

---

## ADR-001: Entitas Utama (*Core Entity*)
- **Decision**: Menggunakan `Ticket` sebagai *core entity* pada sistem.
- **Reason**: Semua bentuk layanan sekolah dapat direpresentasikan sebagai sebuah *Ticket* yang memiliki siklus hidup.
- **Consequence**: Mudah menambah modul layanan baru tanpa merombak arsitektur sistem inti.

## ADR-002: Kontrol Akses (*Access Control*)
- **Decision**: Menggunakan sistem otorisasi *Role-Based Access Control* (RBAC) secara komprehensif.
- **Reason**: Sistem melibatkan hierarki sekolah kompleks (Kepsek, Wakasek, BK, Admin, Super Admin).
- **Consequence**: Logika keamanan terpusat dan middleware *authorization* lebih konsisten.

## ADR-003: Pencatatan Riwayat (*Audit Logging*)
- **Decision**: Menetapkan tabel `ticket_activities` sebagai sistem *append-only*.
- **Reason**: Histori adalah catatan forensik yang merekam kejadian nyata. Data historis tidak boleh di-*edit*.
- **Consequence**: Sistem menjadi sangat akuntabel dan transparan.

## ADR-004: Pemisahan Konsep `Type` dan `Category`
- **Decision**: Memisahkan Jenis Layanan (`Type` - misal: Pengaduan) dan Klasifikasi Masalah (`Category` - misal: Bullying) menjadi dua dimensi yang berbeda dalam sebuah tiket.
- **Reason**: Memberikan kombinasi matriks tak terbatas. (Contoh: `Type=Helpdesk IT`, `Category=Fasilitas`).
- **Consequence**: Memudahkan pelaporan statistik dan *querying* multidimensi.

## ADR-005: Pendekatan `Master Data` vs `Enum`
- **Decision**: Data statis (Status, Type, Category, Priority) tidak disimpan sebagai `Enum` statis di kode/database, melainkan direlasikan ke tabel `Master Data`.
- **Reason**: Skalabilitas. Jika sekolah butuh mengubah siklus penanganan (status) atau menambah klasifikasi pelanggaran baru, tidak perlu campur tangan tim IT untuk *deploy* ulang server aplikasi.
- **Consequence**: Desain tabel lebih banyak (relasi FK), namun mengamankan visibilitas jangka panjang proyek.

## ADR-006: Entitas `Ticket Assignment` Tersendiri
- **Decision**: Menghapus field tunggal `assignee_id` dari tabel `tickets` dan menggantinya dengan tabel histori disposisi `ticket_assignments`.
- **Reason**: Satu kasus masalah sekolah sering berpindah-pindah penanggung jawab (Admin -> BK -> Wakasek Kesiswaan).
- **Consequence**: Melacak "Berapa lama tiket mandek di meja BK sebelum dilimpahkan ke Wakasek?" menjadi sangat mudah dilakukan.

## ADR-007: Privasi Berlapis (`Visibility` & `is_anonymous`)
- **Decision**: Mengintegrasikan perlindungan identitas berlapis: penyamaran identitas pelapor (is_anonymous) dan pengaturan jarak pandang konten (Visibility: Public/Internal/Confidential).
- **Reason**: Aplikasi sekolah menaungi masalah rentan (*high sensitivity*) seperti pelecehan atau perundungan yang menuntut jaminan kerahasiaan penuh, namun juga menaungi keluhan ringan yang tak masalah dipublikasikan.
- **Consequence**: Sistem memenuhi standar perlindungan anak di ranah digital, namun implementasi *query filter* di backend akan sedikit kompleks.
