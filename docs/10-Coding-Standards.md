# SpeakUp - Coding Standards

Dokumen ini mendefinisikan aturan dasar penulisan dan pengelolaan kode (Codebase Guidelines) yang digunakan dalam proyek SpeakUp.

## 1. Arsitektur & Struktur Direktori (General)
- **Modular by Design**: Pisahkan *concern* (logika) ke dalam folder/modul yang spesifik. Komponen yang berkaitan dengan "Laporan" dan "Autentikasi" harus independen, mempersiapkan sistem agar mudah diekspansi untuk Phase 4.
- **Separation of Concerns**: Bedakan layer Routing, Business Logic (Controller/Service), dan Data Access (Model/Repository).

## 2. Penamaan (Naming Conventions)
- **Variabel & Fungsi**: Gunakan aturan `camelCase` (contoh: `generateTicketNumber`, `ticketStatus`).
- **Nama Class / Komponen UI**: Gunakan aturan `PascalCase` (contoh: `TicketController`, `DashboardWidget`).
- **Kolom Database & File Konfigurasi**: Gunakan aturan `snake_case` (contoh: `created_at`, `assignee_id`).
- **Konstanta (Constants)**: Gunakan huruf kapital dan underscore `UPPER_SNAKE_CASE` (contoh: `MAX_UPLOAD_SIZE`).

## 3. Keamanan (Security First Implementation)
- **Parameter Validation & Sanitization**: Jangan pernah mempercayai input dari *client-side*. Seluruh body request POST/PATCH wajib divalidasi dan disanitasi di sisi backend (mencegah XSS dan SQL Injection).
- **Password Handling**: Password *hard-coded* atau *plaintext* di-database dilarang keras. Gunakan pustaka hashing industri standar (seperti `Bcrypt` atau `Argon2`).
- **Otorisasi API**: Endpoint yang memanipulasi data (/admin/*) harus diverifikasi menggunakan pengecekan peran pengguna (*Role-Based Access Control* / RBAC).

## 4. Gaya Penulisan Kode (Code Style)
- **Komentar & Dokumentasi**: Beri komentar yang menjelaskan "MENGAPA" kode ini dibuat, bukan "APA" (kecuali logika sangat kompleks). Gunakan *Docblocks* untuk fungsi utama.
- **Konsistensi Format**: Gunakan formator otomatis terstandar (seperti Prettier, ESLint, atau standar bahasa backend terkait) untuk memastikan lekukan (*indentation*) kode selalu konsisten.

## 5. Standar Commit (Git Version Control)
Gunakan format "Conventional Commits" untuk kerapian riwayat *version control*:
- `feat:` (Penambahan fitur baru) - *contoh: feat: add user dashboard*
- `fix:` (Perbaikan bug) - *contoh: fix: resolve ticket status bug*
- `docs:` (Perubahan dokumentasi)
- `refactor:` (Restrukturisasi kode tanpa mengubah fungsionalitas akhir)

## 6. Penanganan Error (Graceful Degradation)
- Seluruh *exception* backend harus ditangkap (dihandle) agar aplikasi tidak *crash*.
- Format *response payload* API untuk error harus selalu sama di seluruh titik akhir:
  ```json
  {
    "error": true,
    "code": 403,
    "message": "Anda tidak memiliki hak akses untuk disposisi tiket ini."
  }
  ```
