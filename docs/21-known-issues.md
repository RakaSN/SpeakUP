# 21. Known Issues (Issue Tracking)

This document tracks known issues discovered during RC validation, Smoke Testing, and Pilot phases that need addressing.

## Issue List

| ID | Severity | Area | Deskripsi | Status | Workaround | Target Fix |
|---|---|---|---|---|---|---|
| KI-001 | Low | UI/UX | Saat resolusi layar sangat kecil (< 320px), tombol sidebar sedikit overlap. | Open | Gunakan perangkat dengan layar standar (Mobile > 360px). | v1.0.1 (Patch) |
| KI-002 | Medium | Export | Ekspor CSV bisa lama jika lebih dari 10,000 baris. | Open | Filter tanggal sebelum ekspor. | v1.1.0 |
| KI-003 | High | RBAC | Contoh Isu Tinggi: Role tertentu bisa melihat log tiket yang bukan wewenangnya. | Closed | Perbaikan pada `TicketService` di-merge di RC1. | v1.0.0-RC1 |

> **Aturan**: Segala isu berstatus `High` atau `Critical` **WAJIB** berada dalam status `Closed` sebelum rilis menuju v1.0.0 Production (Berdasarkan *Release Approval Rule*).
