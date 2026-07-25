# SpeakUp - Initial Database Design

Desain arsitektur basis data relasional. Menggunakan pendekatan **Master Data** (Bukan hardcoded enum) untuk memberikan fleksibilitas maksimal kepada sekolah dalam menambah layanan di masa depan (ADR-004 & ADR-005).

## A. Master Data Tables
Keempat tabel ini dikelola oleh *Super Admin* dan memuat kerangka operasional sistem.
1. **`master_ticket_types`**: Menyimpan entitas layanan inti (Contoh: Pengaduan, Konsultasi, Helpdesk, Permohonan Surat).
2. **`master_ticket_categories`**: Menyimpan pengklasifikasian masalah (Contoh: Bullying, Kerusakan Fasilitas, Administrasi Akademik).
3. **`master_ticket_statuses`**: Menyimpan siklus operasional (Contoh: Submitted, Verified, In Progress, Resolved, Rejected).
4. **`master_ticket_priorities`**: Menyimpan tingkat urgensi (Contoh: Low, Medium, High, Critical).

*Struktur field standar master data: `id`, `name`, `description`, `is_active`, `created_at`, `updated_at`.*

---

## B. Core Operational Tables

### 1. Tabel `users`
- `id` (PK, UUID)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'pelapor', 'admin', 'bk', 'wakasek', 'kepsek', 'super_admin')
- `created_at`, `updated_at`

### 2. Tabel `tickets`
Entitas transaksi utama. Field statis telah diganti menjadi relasi tabel master.
- `id` (PK, UUID)
- `ticket_number` (String, Unique) -> Contoh: `SU-202607-001`
- `reporter_id` (FK -> `users.id`)
- `type_id` (FK -> `master_ticket_types.id`)
- `category_id` (FK -> `master_ticket_categories.id`)
- `status_id` (FK -> `master_ticket_statuses.id`)
- `priority_id` (FK -> `master_ticket_priorities.id`)
- `title` (String, max 255)
- `description` (Text)
- `is_anonymous` (Boolean, default: false)
- `visibility` (Enum: 'PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'STRICTLY_CONFIDENTIAL')
- `created_at`, `updated_at`

### 3. Tabel `ticket_assignments` (Workflow Assignment History)
Menangani penugasan tiket. Memungkinkan satu tiket berpindah tangan beberapa kali tanpa kehilangan histori penugasan sebelumnya (ADR-006).
- `id` (PK, UUID)
- `ticket_id` (FK -> `tickets.id`)
- `assignee_id` (FK -> `users.id`) -> Siapa yang ditugaskan
- `assigned_by` (FK -> `users.id`) -> Siapa yang mendisposisikan
- `is_active` (Boolean) -> True = Ini adalah pemegang tiket yang *current* (saat ini).
- `assigned_at` (Timestamp)

### 4. Tabel `ticket_activities` (Audit Log)
Tabel log sejarah kejadian tiket (*append-only*).
- `id` (PK, UUID)
- `ticket_id` (FK -> `tickets.id`)
- `actor_id` (FK -> `users.id`)
- `action` (String)
- `note` (Text, Nullable)
- `created_at` (Timestamp)

### 5. Tabel `notifications`
Sistem notifikasi dalam aplikasi.
- `id` (PK, UUID)
- `user_id` (FK -> `users.id`) -> Penerima notifikasi
- `title` (String)
- `message` (Text)
- `is_read` (Boolean, default: false)
- `created_at` (Timestamp)
