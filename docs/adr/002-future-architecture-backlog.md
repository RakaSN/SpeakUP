# Architecture Decision Record (ADR) 002: Future Architecture Backlog

## Status
Proposed / Backlog for Sprint 3 & Sprint 4

## Context
Seiring bertambahnya beban aplikasi SpeakUp dan berkembangnya kompleksitas fitur operasional, diperlukan perencanaan evolusi arsitektur untuk mempertahankan performa dan kejelasan *responsibility* modul.

---

## 1. Lightweight CQRS (Command Query Responsibility Segregation)
- **Problem**: Modul Service (`NotificationService`, `UserService`, `TicketService`) berpotensi menggelembung jika menggabungkan logika mutasi data (Commands) dan pengambilan data kompleks (Queries).
- **Plan**: Memisahkan modul query yang berat ke dalam `*QueryService` (contoh: `NotificationQueryService`) dan mutasi transaksi ke dalam `*CommandService`.

---

## 2. Caching Layer (Redis for High-Frequency Reads)
- **Problem**: Pemanggilan `getUnreadCount()` pada komponen `Header` terjadi pada setiap request halaman, yang dapat menjadi *bottleneck* I/O database jika trafik tinggi.
- **Plan**: Mengintegrasikan Redis Caching Layer khusus untuk query frekuensi tinggi (*Unread Notification Count*, *User Permission Cache*), dengan *Cache Invalidation* berbasis Event.

---

## 3. Asynchronous Queue & Background Worker
- **Problem**: `EventBus` saat ini berjalan secara *synchronous in-memory*. Saat penambahan listener berbiaya komputasi tinggi (Email SMTP, WhatsApp API, Generator PDF), response time HTTP akan melambat.
- **Plan**: Mengubah listener `EventBus` menjadi *Asynchronous Job Queue* (contoh: BullMQ + Redis) yang dieksekusi oleh *Background Worker process* terpisah.
