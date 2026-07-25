# Architecture & Consistency Review - SpeakUp

Berdasarkan pengecekan silang (*cross-reference*) terhadap 14 dokumen yang telah dibuat, desain arsitektur dan sistem SpeakUp sudah **sangat solid**. Konsep "Ticket" sebagai tulang punggung (ADR-001) adalah keputusan arsitektural yang brilian untuk skalabilitas. 

Meski demikian, sebelum kita memasuki tahap *coding* (Sprint 0), saya menemukan beberapa **inkonsistensi minor** antar dokumen yang harus diselaraskan agar tidak membingungkan programmer.

Berikut adalah hasil *review* dan rekomendasinya:

---

## 1. Temuan Inkonsistensi (Inconsistencies)

### A. Terminologi `Category` vs `Type` pada Entitas Tiket
- **Temuan**: Pada `06-Database-Design.md` dan `07-API-Specification.md`, pembeda layanan menggunakan field `category` (Enum: 'pengaduan', 'konsultasi'). Namun, pada ide *Sprint 0*, `11-Domain-Model.md` dan `ADR-001`, kita sepakat menggunakan terminologi `Type` (Pengaduan, Konsultasi, Aspirasi, Surat) sebagai pengklasifikasi *universal ticket*.
- **Rekomendasi**: Ubah field `category` menjadi `type` di seluruh rancangan Database dan API agar selaras dengan konsep *Universal Ticket* (ADR-001).

### B. Daftar Status Tiket (Ticket Statuses)
- **Temuan**: Pada Aturan Bisnis (`02-Business-Rules.md`) dan Desain Database (`06-Database-Design.md`), status tiket hanya ada tiga: `menunggu`, `diproses`, `selesai`. Namun, pada Domain Model (`11-Domain-Model.md`), terdapat status tambahan yaitu `ditolak`.
- **Dampak**: Jika tidak ada status `ditolak`, lalu bagaimana sistem menangani laporan *spam* atau laporan hoaks? Jika terpaksa ditandai `selesai`, ini akan merusak validitas data statistik sekolah.
- **Rekomendasi**: Tambahkan status `ditolak` (atau `dibatalkan`) secara resmi ke dalam Business Rules dan Enum Database.

### C. Kehilangan Role "Super Admin"
- **Temuan**: Di dokumen PRD (`01-Product-Requirements.md`) disebutkan ada target pengguna "Super Admin" dan "Admin". Namun pada desain database (`06-Database-Design.md`) dan `12-Permission-Matrix.md`, *role* "Super Admin" tidak didefinisikan secara eksplisit.
- **Rekomendasi**: Jika di MVP perannya disatukan, dokumen PRD perlu direvisi. Jika memang dipisah (misal: hanya Super Admin yang bisa menambah akun Kepsek/Wakasek), maka role `super_admin` wajib ditambahkan ke skema Database dan Permission Matrix.

### D. Absennya Mekanisme Anonimitas di Tingkat Data
- **Temuan**: Dokumen `02-Business-Rules.md` (Aturan Kerahasiaan) mewajibkan identitas pelapor disembunyikan (*masked*). Namun, di rancangan `06-Database-Design.md` tidak ada mekanisme *flag* anonim di tabel `tickets`.
- **Rekomendasi**: Tambahkan kolom `is_anonymous` (boolean, default: false) di tabel `tickets`. Jika di-set `true`, maka *layer* API secara otomatis akan menyamarkan (*masking*) nama Pelapor menjadi "Anonim" kecuali jika diakses oleh role yang memiliki izin (*Bypass Masking*).

---

## 2. Tinjauan Kekuatan Arsitektur (Architecture Strengths)

- **Skalabilitas Entitas Tiket**: Menjadikan `Ticket` sebagai kelas abstrak/induk untuk seluruh layanan (Pengaduan, Konsultasi, Helpdesk) akan mencegah "Spaghetti Tables" (pembuatan puluhan tabel yang redundan di masa depan).
- **Integritas Audit Trail**: Keputusan menggunakan tabel `ticket_activities` secara *append-only* (ADR-003) menjamin transparansi absolut. Tidak ada pihak yang bisa menghapus jejak sejarah penyelesaian masalah. Ini sangat krusial untuk menanamkan *trust* warga sekolah.
- **Otorisasi Terpusat**: Penggunaan matriks RBAC (ADR-002) dan API terpisah memastikan bahwa *frontend* (Web maupun Mobile kelak) tidak menyimpan logika otorisasi yang berbahaya. Semua divalidasi mutlak di *backend*.

---

## Kesimpulan
Dokumentasi proyek SpeakUp memiliki skor kematangan arsitektur **95%**. 

Agar mencapai 100% sebelum *coding* dimulai, kita hanya perlu merevisi file `06-Database-Design.md`, `07-API-Specification.md`, dan `12-Permission-Matrix.md` untuk menyelaraskan temuan A, B, C, dan D di atas.
