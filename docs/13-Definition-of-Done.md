# SpeakUp - Definition of Done (DoD)

Untuk menjaga kualitas sistem SpeakUp sejak awal, sebuah iterasi/fitur (Sprint) tidak dianggap selesai (Done) jika belum memenuhi kriteria mutlak berikut:

## Kriteria Code & Quality
- [ ] **Tidak ada Error / Warning**: Tidak ada TypeScript error dan ESLint warning di seluruh *codebase*.
- [ ] **Kode Bersih**: Mematuhi prinsip *clean code* sesuai standar pada file `10-Coding-Standards.md`.

## Kriteria Fungsional & Testing
- [ ] **Unit / Integration Test Lulus**: Semua skenario *test* kritis (terutama otentikasi, disposisi, dan pembuatan tiket) berjalan sukses.
- [ ] **Uji RBAC (Role-Based Access Control)**: Fitur telah diuji coba mensimulasikan berbagai *role* pengguna (Pelapor, Admin, BK) dan sistem berhasil memblokir akses yang tidak sah (403 Forbidden).

## Kriteria Keamanan & Transparansi
- [ ] **Audit Log Tercatat**: Setiap aksi *mutate* data penting (Create, Update, Delete) berhasil tersimpan di tabel log aktivitas/audit.
- [ ] **Validasi Input Terlindungi**: Seluruh form input telah disanitasi dari sisi *server* (mencegah eksploitasi *payload* berbahaya).

## Kriteria Antarmuka (UI/UX)
- [ ] **Responsif Berjalan Baik**: UI tidak berantakan saat dibuka di layar *mobile* maupun *desktop*.
- [ ] **Komponen Intuitif**: Setiap tombol aksi memberikan umpan balik (*loading state*, pesan sukses, atau pesan error yang mudah dipahami).

## Kriteria Dokumentasi
- [ ] **API Terdokumentasi**: Spesifikasi endpoint baru telah dicatatkan ke dalam *API Documentation* agar mudah dibaca oleh tim.
- [ ] **Struktur *Self-Explanatory***: Flow aplikasi dari awal sampai akhir berjalan logis tanpa perlu panduan tambahan yang membingungkan.
