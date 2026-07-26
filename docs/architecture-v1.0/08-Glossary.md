---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 08. Glossary (Kamus Istilah)

Kamus istilah (*Glossary*) ini mendefinisikan bahasa persatuan (*Ubiquitous Language*) yang digunakan di seluruh arsitektur dan *codebase* SpeakUp. Tujuannya adalah memastikan tidak ada ambiguasi istilah saat berkomunikasi antara *developer*, *stakeholder*, dan *domain expert*.

## Istilah Domain (Domain Terms)

| Istilah | Definisi / Maksud di SpeakUp |
|---|---|
| **Activity (Aktivitas)** | Catatan historis *user-facing* yang bisa dilihat oleh Pelapor mengenai status/perkembangan tiketnya (misal: "Tiket disetujui", "Tiket sedang ditangani"). Berbeda dengan **Audit**. |
| **Audit (Audit Log)** | Catatan teknis sistem *backend* (tidak terlihat oleh Pelapor) yang mencatat entitas mana yang berubah, properti apa saja yang diubah (`oldValue` ➡️ `newValue`), siapa pelakunya, serta IP Address/User-Agent-nya. |
| **Assignment (Disposisi / Penugasan)** | Proses mentransfer kepemilikan atau tanggung jawab penanganan sebuah tiket dari *Admin* (penerima awal) kepada *Petugas / Guru BK*. |
| **Event** | Sinyal sistematis yang dipancarkan secara asinkron (misal: `TICKET_CREATED`) ketika sesuatu yang penting terjadi di dalam domain. |
| **Listener** | Modul sekunder/latar belakang yang menunggu dan merespons suatu **Event** (misal: `NotificationListener` bereaksi mengirim email setelah mendeteksi `TICKET_CREATED`). |
| **Master Data** | Data referensi dasar yang mengendalikan parameter aplikasi (seperti daftar *Kategori Tiket*, *Tingkat Prioritas*, *Daftar Status*). Dikelola secara mandiri oleh *Admin*. |
| **Reporter (Pelapor)** | Aktor utama sistem, biasanya Siswa, yang mengunggah keluhan, masalah, atau meminta sesi konsultasi. |
| **SLA (Service Level Agreement)** | Tenggat waktu / standar waktu pelayanan maskimal yang dijanjikan oleh sekolah untuk merespons/menyelesaikan sebuah tiket, diukur dalam jam (`slaHours`). |
| **SLA Freeze** | Konsep pembekuan aturan SLA pada saat tiket dibuat. Tiket lama tidak akan terpengaruh jika admin sistem kelak memodifikasi nilai `slaHours` untuk kategori/prioritas di tabel *Master Data*. |
| **Strategy (Pola Strategi)** | Pola desain perangkat lunak (*Design Pattern*) yang memungkinkan *DashboardService* mengganti algoritma pengumpulan metrik/kueri secara dinamis (misal: *AdminStrategy* mengkueri seluruh tiket sekolah, sedangkan *BKStrategy* hanya mengkueri tiket yang ditugaskan kepadanya). |
| **Dashboard Metric** | Sekumpulan titik data (angka, grafik) yang dihasilkan oleh *DashboardService* untuk memberikan ringkasan status operasional (misal: Jumlah Tiket Baru, Jumlah Tiket *Overdue*). |
