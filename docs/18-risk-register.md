# 18. Risk Register

This document tracks potential operational and technical risks leading up to the production release of SpeakUp.

| ID | Risiko | Dampak | Kemungkinan | Mitigasi | Status |
|---|---|---|---|---|---|
| R-01 | Migrasi database gagal di Staging/Produksi | Tinggi | Rendah | Menggunakan `prisma migrate deploy`, backup data dengan `pg_dump` sebelum eksekusi, dan skenario *Rollback Verification Drill*. | Mitigated |
| R-02 | Salah konfigurasi *Environment Variables* (`.env`) | Sedang | Sedang | Memvalidasi seluruh variabel melalui `16-release-checklist.md` sebelum menjalankan Docker container. | Mitigated |
| R-03 | Kebocoran data akibat miskonfigurasi RBAC | Tinggi | Rendah | Melakukan pengujian matriks RBAC (Server Actions & Route Handlers) di `17-security-checklist.md`. | Open |
| R-04 | Penurunan performa Dashboard pada volume data besar | Sedang | Sedang | Eksekusi `volume-seed.ts` (1.000 tiket, 5.000 notifikasi) untuk *stress test* *N+1 query bottleneck* secara lokal/staging. | Open |
| R-05 | *Downtime* saat perbaikan Hotfix | Sedang | Rendah | Menjalankan arsitektur Docker Compose untuk memastikan konsistensi dan kemudahan *restart/rollback*. | Mitigated |
