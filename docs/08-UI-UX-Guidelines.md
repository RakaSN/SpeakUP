# SpeakUp - UI/UX Guidelines

## 1. Prinsip Desain (Design Principles)
- **Simple & Intuitive**: Fungsi utama (membuat laporan dan melacak laporan) harus langsung terlihat. Jangan sembunyikan fitur utama di balik navigasi yang dalam.
- **Mobile First / Responsive**: Sebagian besar Pelapor (Siswa dan Orang Tua) diproyeksikan akan menggunakan gawai pribadi (Smartphone). Desain web/app harus optimal saat ditampilkan dalam resolusi ponsel.
- **Trust & Safe Space**: Tampilan visual harus mencerminkan platform resmi, profesional, dan aman. Ini akan membantu meyakinkan pengguna bahwa laporan mereka (dan identitas mereka) dijaga secara serius.

## 2. Warna (Color Palette)
Rekomendasi tema visual:
- **Primary Color**: Biru Gelap / *Navy Blue* (#1E3A8A) - Memberikan kesan otoritas, aman, dan institusi pendidikan.
- **Secondary / Action Color**: Biru Muda / *Teal* (#0D9488) - Digunakan untuk tombol utama (Call-to-Action) seperti "Kirim Laporan".
- **Semantic Colors** (Penting untuk Indikator Status):
  - *Warning* (Status: Menunggu) - Kuning/Oranye hangat (#F59E0B)
  - *Info* (Status: Diproses) - Biru Cerah (#3B82F6)
  - *Success* (Status: Selesai) - Hijau (#10B981)
- **Background**: Putih pudar (Off-white / #F3F4F6) untuk keseluruhan *body*, dipadukan dengan panel kartu berwarna putih bersih (#FFFFFF).

## 3. Tipografi (Typography)
- Gunakan keluarga font *Sans-Serif* modern (Contoh: **Inter**, **Roboto**, **Plus Jakarta Sans**).
- Penekanan pada keterbacaan (readability). Teks panjang dalam *Description* form harus menggunakan ukuran minimal `16px` dengan *line-height* yang nyaman (min. 1.5).

## 4. Komponen Kunci Antarmuka
- **Kartu (Cards)**: Tampilkan daftar tiket di dashboard menggunakan desain berbasis kartu yang memiliki bayangan lembut (*subtle drop-shadow*) agar berdimensi.
- **Lencana (Badges)**: Status tiket (Menunggu/Diproses/Selesai) harus selalu direpresentasikan secara konsisten menggunakan Badge warna warni di mana pun nomor tiket tersebut muncul.
- **Bilah Proses (Timeline / Progress)**: Tampilkan Riwayat Aktivitas pelacakan tiket dalam bentuk garis waktu visual secara vertikal agar pengguna mudah mengerti urutan langkah yang telah diambil sekolah.
