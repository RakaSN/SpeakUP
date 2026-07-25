# SpeakUp - Permission Matrix (RBAC)

Matriks ini menjadi acuan mutlak untuk implementasi *Role-Based Access Control* (RBAC) di tingkat API (Backend) maupun tampilan antarmuka (Frontend). Ditambahkan peran `Super Admin` dan kontrol `Visibility`.

| Fitur / Aksi | Pelapor | Admin | BK | Wakasek | Kepsek | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Buat Tiket Baru** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Kelola Master Data (Kategori, Status, Tipe)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Lihat Semua Tiket (Visibility Public/Internal)** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Lihat Tiket *Strictly Confidential*** | ❌ | ❌ | ✅* | ❌ | ❌ | ✅ |
| **Lihat Identitas Pelapor (*Bypass Anonymous*)** | ❌ | ❌ | ✅* | ❌ | ✅ | ✅ |
| **Disposisi / Assign Tiket ke Petugas Lain** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Update Status Tiket & Beri Tanggapan** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Kelola Daftar Pengguna (User Management)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

*\*Keterangan Tambahan:* 
- Tanda **✅\*** pada peran **BK** (Bimbingan Konseling) untuk tiket *Confidential* dan *Anonimitas* mengindikasikan bahwa akses tersebut hanya diizinkan **JIKA** tiket tersebut memang telah didisposisikan (*assigned*) kepadanya secara langsung, ATAU jenis kategorinya memang *default* ditangani BK. Jika tiket ditugaskan ke Wakasek, BK tidak berhak melihat identitas anonim dari tiket tersebut.
