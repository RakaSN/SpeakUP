---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 01. Architecture Principles & Business Rules

## 🏛️ Visi Arsitektur

SpeakUp dirancang untuk menjadi sistem yang stabil, dapat dipelihara (*maintainable*), dan siap diperluas (*extensible*). Kami menggunakan pola **Clean Architecture** (atau N-Tier) yang secara tegas memisahkan logika antarmuka (UI) dari logika bisnis, dikombinasikan dengan pendekatan **Event-Driven** untuk operasi asinkronus (notifikasi, audit).

### 3 Prinsip Utama
1. **Isolasi Logika Bisnis (Service Layer)**
   - UI (*React Components* & *Server Actions*) dilarang keras memanggil `db` (Prisma) secara langsung.
   - Semua manipulasi data dan penerapan aturan bisnis (misal: validasi SLA, penugasan) harus melalui *Service Layer* (contoh: `TicketService`).
2. **Kemandirian Modul (Modularity)**
   - Modul operasional (seperti *Ticket*) tidak boleh diikat dengan logika sekunder (seperti *Notification* atau *Audit*).
   - *EventBus* digunakan untuk merangkaikan logika sekunder. Saat tiket dibuat, `TicketService` hanya memancarkan event `TICKET_CREATED`, membiarkan `NotificationListener` bereaksi secara independen.
3. **Ketahanan Data Historis (Data Integrity)**
   - Operasi yang mengubah struktur referensi tidak boleh merusak data lampau. Jika sebuah kategori dihapus, tiket lama yang menggunakan kategori tersebut harus tetap utuh.

---

## 🚫 Architecture Non-Goals

Untuk menjaga batasan desain yang jelas dan mencegah *over-engineering* pada versi 1.x:
- **Tidak Menggunakan Microservices**: Aplikasi ini sengaja dibangun sebagai Monolit Modular untuk menyederhanakan *deployment* dan operasional sekolah.
- **Tidak Mendukung Multi-Tenant**: Setiap instansi SpeakUp ditujukan untuk satu sekolah independen.
- **Tidak Melakukan Distributed Transactions**: Seluruh transaksi dikunci di tingkat single database PostgreSQL (`prisma.$transaction`).
- **Tidak Menggunakan External Message Broker**: Menggunakan Node.js `EventEmitter` internal alih-alih Redis / RabbitMQ untuk menekan kebutuhan infrastruktur.

---

## ⚖️ Business Rules Absolut

Ini adalah aturan-aturan tidak tertulis yang dikodifikasi secara paksa dalam logika sistem v1.0.

### 1. Perlindungan Data Master (*Deactivation Guard*)
Sistem melarang keras penghapusan (*hard-delete*) Data Master (Kategori, Prioritas, Jenis, Status) jika data tersebut sedang/pernah direferensikan oleh tiket mana pun.
**Mekanisme**: Sistem akan secara otomatis mengalihkan *hard-delete* menjadi *soft-deactivation* (`isActive = false`). Kategori tersebut tidak akan muncul di form pembuatan tiket baru, namun tetap valid untuk tiket lama.

### 2. SLA Freeze (Pembekuan SLA)
Saat tiket dibuat, nilai jam SLA (*Service Level Agreement*) disalin dari *Priority* Master dan dikunci secara permanen di dalam entitas `Ticket` menjadi `slaHours` dan `targetResolutionAt`.
**Alasan**: Jika Administrator nanti mengubah "High Priority" dari 24 jam menjadi 48 jam, tiket yang *sudah ada* tetap mengacu pada SLA awal (24 jam). 

### 3. Otomatisasi Status & Evaluasi SLA
Admin dilarang secara manual menetapkan status `RESOLVED_ON_TIME` atau `RESOLVED_LATE`. 
Admin hanya mengubah status menjadi `RESOLVED`. Sistem akan secara otomatis membandingkan `resolvedAt` (saat ini) dengan `targetResolutionAt` (batas waktu) dan menetapkan predikat ketepatan waktu.

### 4. Segregasi Hak Akses (RBAC) yang Ketat
- **Pelapor (Siswa)**: Dibatasi secara ekstrem (Hanya bisa `Create Ticket` dan melihat miliknya sendiri). Tidak memiliki rute dasbor lain.
- **Guru BK / Assignee**: Dapat mengelola tiket yang ditugaskan kepada meingat mereka dan mengubah status.
- **Kepala Sekolah**: Memiliki pandangan helikopter (*read-only*) untuk dashboard analitik dan pelaporan ekspor CSV.
- **Administrator**: Memiliki hak akses penuh, termasuk konfigurasi Data Master dan manajemen Pengguna.

---

## 🔮 Future Extension Points (Sprint 3B & 3C)

- **Background Job Engine**: Framework job untuk otomasi SLA, auto-escalation, dan pembersihan data.
- **Queue Worker System**: Antrean kerja asinkronus untuk pengiriman email massal dan pembuatan laporan.
- **AI Intelligence Layer**: Modul AI untuk rekomendasi kategorisasi, ringkasan pengaduan, dan analisis sentimen.

