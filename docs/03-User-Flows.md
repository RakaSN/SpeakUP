# SpeakUp - User Flows

## 1. Flow Pelapor (Membuat dan Melacak Laporan)
1. **Login**: Pelapor mengakses halaman SpeakUp, memasukkan kredensial dan masuk ke sistem.
2. **Akses Dashboard**: Sistem menampilkan dashboard personal pelapor yang memuat daftar dan status tiket yang pernah dibuat.
3. **Membuka Form Laporan**: Pelapor menekan tombol "Buat Laporan" atau "Konsultasi Baru". Sistem merender formulir pengisian.
4. **Pengisian Form**: Pelapor mengisi rincian laporan yang terdiri dari: Kategori, Judul, dan Deskripsi detail.
5. **Submit**: Pelapor menekan tombol "Kirim".
6. **Generate Tiket**: Sistem memvalidasi masukan, menyimpan data ke dalam database, menghasilkan Nomor Tiket unik, dan menampilkan halaman sukses berisi nomor tersebut.
7. **Tracking Status**: Di lain waktu, Pelapor kembali login atau menggunakan fitur Tracking (pencarian) untuk melihat status terkini laporannya (apakah masih *Menunggu*, *Diproses*, atau sudah *Selesai*).

## 2. Flow Pengelola (Disposisi & Pemrosesan Laporan)
1. **Login Pengelola**: Pengelola (Admin/BK/Wakasek) login ke sistem.
2. **Dashboard Statistik**: Sistem menampilkan dashboard pengelola dengan statistik laporan dan metrik utama.
3. **Melihat Daftar Laporan Masuk**: Pengelola membuka halaman "Daftar Laporan Masuk".
4. **Tindakan Disposisi (Khusus Admin)**:
   - Admin melihat ada laporan baru berstatus *Menunggu*.
   - Admin meninjau laporan dan menggunakan fitur "Disposisi" untuk menugaskan (assign) laporan tersebut kepada petugas spesifik (Misalnya, diteruskan ke Guru BK).
5. **Update Status & Tindak Lanjut (Oleh Assignee/Petugas)**:
   - Petugas yang menerima disposisi membuka tiket tersebut di akunnya sendiri.
   - Petugas melakukan evaluasi/tindakan di dunia nyata, kemudian memberikan **Catatan Tindak Lanjut** di dalam aplikasi.
   - Petugas mengubah status tiket menjadi *Diproses* (sedang ditangani) atau *Selesai* (jika sudah tuntas).
6. **Audit & Transparansi**: Semua perpindahan disposisi dan perubahan status ini langsung masuk ke log "Riwayat Aktivitas" tiket, sehingga Pelapor dapat melihat *progress* tersebut dari akun mereka.
