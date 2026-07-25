# 📋 Dokumen Aturan Bisnis Resmi — SpeakUp v1.0.0 (Production)

Dokumen ini memuat seluruh **Aturan Bisnis (Business Rules)** yang berlaku aktif dan diimplementasikan secara tegas di dalam kodenut (*backend service, database constraint, & RBAC policy*) SpeakUp v1.0.0.

---

## 1. Aturan Pengguna, Keamanan & RBAC (User & Security Rules)

- **BR-USER-01 (Status Akun)**:
  Setiap akun pengguna memiliki status (`ACTIVE`, `INACTIVE`, `LOCKED`). Akun berstatus `INACTIVE` atau `LOCKED` diblokir secara otomatis dari seluruh fungsi login dan Server Action.
- **BR-USER-02 (Hirarki Peran / RBAC)**:
  Sistem memiliki 5 Peran (*Role*) utama dengan pembatasan wewenang tegas:
  1. `Super Admin`: Akses penuh ke seluruh konfigurasi sistem, RBAC, dan audit.
  2. `Admin`: Manajemen pengguna, penugasan tiket, pengelolaan data master, dan ekspor laporan.
  3. `Guru BK`: Penanganan tiket yang ditugaskan, penyesuaian status tiket, dan catat aktivitas resolusi.
  4. `Kepala Sekolah`: Akses dasbor analitik strategis sekolah dan pemantauan kinerja SLA.
  5. `Reporter` (Siswa/Ortu): Membuat pengaduan, memantau status tiket milik sendiri, dan mengelola profil pribadi.
- **BR-USER-03 (Proteksi Kata Sandi)**:
  Kata sandi disimpan dalam bentuk enkripsi hash `bcryptjs` (salt rounds = 10). Kata sandi mentah tidak pernah disimpan di database atau ditampilkan di log API.

---

## 2. Aturan Pelaporan & Kerahasiaan (Ticket & Confidentiality Rules)

- **BR-TKT-01 (Kewajiban Referensi Master Data)**:
  Setiap tiket yang dibuat wajib mereferensikan `categoryId` (*Master Category*) dan `priorityId` (*Master Priority*).
- **BR-TKT-02 (Prinsip Anonimitas / Masking)**:
  Apabila opsi `isAnonymous = true` diaktifkan oleh pelapor:
  - Identitas pelapor (Nama, Email, Foto) **disembunyikan (*masked*)** dari seluruh layar UI Admin, Guru BK, dan Kepala Sekolah.
  - Pelapor yang bersangkutan **tetap dapat memantau progres tiket** di Dasbor pribadinya.
- **BR-TKT-03 (Isolasi Akses Pelapor)**:
  Pengguna dengan peran `Reporter` hanya berhak melihat daftar tiket yang ia buat sendiri (`reporterId = currentUserId`). Pembukaan URL tiket milik pengguna lain akan ditolak oleh *Permission Guard*.

---

## 3. Aturan SLA Engine & Pembekuan SLA (SLA & Freeze Rules)

- **BR-SLA-01 (SLA Freeze / Pembekuan Parameter)**:
  Saat tiket pertama kali dibuat, `TicketService` akan mengopi nilai `slaHours` dari `MasterTicketPriority` yang dipilih ke kolom `tickets.sla_hours` (SLA Freeze).
  > **Implikasi**: Perubahan nilai `slaHours` pada Master Data oleh Admin di masa mendatang **tidak akan mengubah** sisa waktu atau kalkulasi SLA pada tiket-tiket lama yang sudah berjalan.
- **BR-SLA-02 (Kalkulasi Target Resolution)**:
  Timestamp target penyelesaian dihitung secara terpusat oleh server:
  $$\text{targetResolutionAt} = \text{createdAt} + (\text{slaHours} \times 3600 \text{ detik})$$
- **BR-SLA-03 (Evaluasi Ketepatan Waktu Resolusi)**:
  Saat tiket diubah statusnya menjadi `RESOLVED` atau `CLOSED`:
  - Jika `resolvedAt <= targetResolutionAt` ➡️ Status SLA dikunci sebagai `RESOLVED_ON_TIME`.
  - Jika `resolvedAt > targetResolutionAt` ➡️ Status SLA dikunci sebagai `RESOLVED_LATE`.
- **BR-SLA-04 (Klasifikasi Status SLA Real-time)**:
  - 🟢 **ON_TRACK**: Tiket masih aktif dan sisa waktu $> 4$ jam.
  - 🟡 **AT_RISK**: Tiket masih aktif dan sisa waktu $\le 4$ jam menuju tenggat.
  - 🔴 **OVERDUE**: Tiket masih aktif (`OPEN`/`IN_PROGRESS`) tetapi telah melewati `targetResolutionAt`.

---

## 4. Aturan Siklus Hidup & Disposisi Tiket (Lifecycle & Assignment)

- **BR-FLOW-01 (Status Lifecycle)**:
  Tiket bergerak mengikuti alur: `OPEN` (Baru) ➡️ `IN_PROGRESS` (Ditugaskan) ➡️ `RESOLVED` (Selesai) ➡️ `CLOSED` (Ditutup/Diarsip).
- **BR-FLOW-02 (Wewenang Penugasan)**:
  Hanya peran `Admin` dan `Super Admin` yang berhak menentukan atau mengubah `assigneeId` (Guru BK yang ditugaskan).

---

## 5. Aturan Proteksi Data Master (Deactivation Guard)

- **BR-MST-01 (Larangan Hard-Delete)**:
  Data Master (Kategori, Prioritas, Status) yang **pernah direferensikan** oleh minimal 1 tiket di dalam sistem **DILARANG HARAM** dihapus secara fisik dari database.
- **BR-MST-02 (Mekanisme Soft-Deactivation)**:
  Jika Admin melakukan tindakan "Hapus" pada Master Data yang terikat dengan tiket, sistem secara otomatis mengalihkan tindakannya menjadi penonaktifan (`isActive = false`). Master data tersebut tidak akan muncul lagi di form pembuatan tiket baru, namun histori tiket lama tetap utuh.

---

## 6. Aturan Strategy Pattern Dashboard (Dashboard Access Strategy)

- **BR-DASH-01 (Admin Dashboard)**: Menyajikan agregasi operasional sekolah (Total Tiket, Tiket Aktif, Tiket Overdue, Tiket Belum Ditugaskan).
- **BR-DASH-02 (BK Dashboard)**: Menyajikan beban kerja personal Guru BK (Tiket Ditugaskan ke Saya, Tiket Overdue Saya, Tiket Diselesaikan Hari Ini).
- **BR-DASH-03 (Kepala Sekolah Dashboard)**: Menyajikan agregasi strategis (Rasio Penyelesaian Tepat Waktu SLA, Grafik Tren 6 Bulan, Distribusi Kategori).
- **BR-DASH-04 (Reporter Dashboard)**: Menyajikan aktivitas pribadi (Tiket Saya, Tiket Sedang Diproses, Tiket Selesai).

---

## 7. Aturan Notifikasi & Jejak Audit (Notification & Audit Trail)

- **BR-NTF-01 (Trigger Event-Driven)**:
  Notifikasi dibuat secara otomatis melalui `EventBus` tanpa membebani transaksi utama saat event terjadi (`TICKET_CREATED`, `TICKET_ASSIGNED`, `TICKET_STATUS_CHANGED`).
- **BR-AUD-01 (Karakteristik Audit Log)**:
  Audit Log bersifat *Append-Only* (tidak dapat diubah atau dihapus oleh siapapun).
- **BR-AUD-02 (Scope Informasi Audit)**:
  Setiap aktivitas krusial mencatat: `userId`, `action` (LOGIN, CREATE, UPDATE, DELETE), `entity`, `entityId`, `oldValue` (JSON), `newValue` (JSON), `ipAddress`, dan `userAgent`.

---

## 8. Aturan Pelaporan & Ekspor Data (Report & Export Rules)

- **BR-REP-01 (Format Ekspor)**:
  Ekspor laporan menggunakan format CSV terkompresi dengan Header **UTF-8 BOM** (`\uFEFF`) untuk menjamin karakter dan simbol bahasa Indonesia tampil rapi tanpa karakter aneh saat dibuka di Microsoft Excel.
- **BR-REP-02 (Restriksi Akses Ekspor)**:
  Fitur ekspor laporan hanya dapat diakses oleh peran `Admin`, `Guru BK`, dan `Kepala Sekolah`. Pengguna berhak melakukan filter berdasarkan rentang tanggal dan kategori.
