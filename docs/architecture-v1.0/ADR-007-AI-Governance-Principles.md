---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x & v2.x (AI Integration Architecture)
---

# ADR-007: AI Governance & Integration Principles

## 📄 Status
`Accepted` (Terkunci sebelum pengodean modul AI diawali di Sprint 3C)

---

## 🏛️ Konteks
Seiring dimulainya persiapan menuju Sprint 3C (*Intelligence Platform*), aplikasi SpeakUp akan mengintegrasikan kemampuan *Artificial Intelligence* (AI) untuk klasifikasi pengaduan, deteksi tren, ringkasan kronologi, dan rekomendasi penanganan. 

Tanpa tata kelola arsitektur yang ketat, integrasi AI berisiko merusak integritas *Business Rules*, menyebabkan efek samping yang tidak terduga pada database, atau menghasilkan keputusan yang tidak dapat dipertanggungjawabkan (*black box decision*).

---

## ⚖️ 5 Prinsip Utuh Tata Kelola AI

### 1. AI Berjalan Murni Sebagai `BackgroundJob`
Model atau agen AI dilarang keras dipanggil secara *synchronous* di dalam *main HTTP request thread* atau *Server Actions* yang dapat memblokir pengguna. Seluruh operasi pemrosesan AI wajib dibungkus dalam abstraksi `BackgroundJob` (misal: `AIClassificationJob`, `AISummaryJob`) dan dikelola oleh `SchedulerService` / `JobExecutor`.

### 2. Sifat Non-Destruktif (*Recommendation Only*)
AI bertindak murni sebagai sistem pendukung keputusan (*Decision Support System*). AI dilarang melakukan perubahan status permanen yang bersifat destruktif pada database secara mandiri (misal: menghapus tiket, mengubah status menjadi *Closed*, atau memblokir pengguna). AI hanya menghasilkan rekomendasi, draf teks, atau tag usulan.

### 3. Transparansi & Auditabilitas (*Auditability & Prompt Versioning*)
Seluruh eksekusi AI wajib dapat dilacak. Setiap hasil keluaran AI harus mencatat:
- Kode dan versi prompt yang digunakan.
- Nama dan versi model AI (misal: `Gemini 1.5 Flash v1`).
- *Token usage* dan waktu eksekusi.
- Log transaksi disimpan di tabel *AuditLog* / *JobExecutionLog*.

### 4. Keterjelasan Alasan (*Explainability*)
Setiap hasil analisis atau rekomendasi yang dihasilkan oleh AI wajib menyertakan konteks atau alasan ringkas (*rationale*) yang dapat dibaca oleh pengguna (Guru BK / Admin) di UI. Pengguna harus memahami *mengapa* AI memberikan saran tertentu.

### 5. Pengambilalihan Manusia (*Human Override*)
Pengguna manusia yang berwenang (Guru BK / Admin) memiliki hak mutlak untuk meninjau, menerima, mengubah, atau menolak (*override*) seluruh hasil rekomendasi AI. Keputusan akhir selalu berada di tangan pengguna manusia.

---

## 🔮 Dampak Arsitektur

- **Terisolasi**: Pembangunan modul AI di Sprint 3C tidak akan mengubah satu baris pun *Core Business Rules* atau skema dasar *Ticket*.
- **Konsisten**: AI mengikuti *Job Lifecycle*, *Logging*, *Retry Strategy*, dan *Observability Dashboard* yang sama dengan *System Jobs* lainnya.
