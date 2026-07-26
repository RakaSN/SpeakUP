---
Version: 1.3
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x & v2.x (AI Evaluation & Quality Analytics)
---

# ADR-009: AI Model Evaluation & Quality Tracking Architecture

## 📄 Status
`Accepted` (Telah diimplementasikan dan ditutup pada Sprint 4C)

---

## 🏛️ Konteks & Problem Statement
Sebelum Sprint 4C, platform SpeakUp telah memiliki fondasi AI runtime yang lengkap (inferensi, rekomendasi, auditability, dan capability registry). Namun, belum ada pemisahan tegas antara analisis **Adopsi (Penggunaan)** dan **Kualitas Model (Akurasi & Presisi)**.

Tanpa evaluasi kualitas yang terstruktur:
1. Sulit membedakan apakah AI tidak dipakai karena pengguna tidak percaya (*adoption issue*) atau karena rekomendasi AI tidak akurat (*quality issue*).
2. Metrik presisi ML klasik membutuhkan *ground truth* berlabel, sedangkan keputusan operasional sekolah bersifat dinamis (*human-in-the-loop*).
3. Tidak ada pengujian kalibrasi antara tingkat kepercayaan AI (*confidence score*) dan penerimaan oleh petugas.

---

## ⚖️ Keputusan Arsitektur

### 1. Complete AI Evaluation Loop
Evolusi arsitektur AI runtime mencapai siklus hidup utuh:

```
Capability Registry
        │
        ▼
Capability Contract (AICapability<TInput, TOutput>)
        │
        ▼
Prompt Registry & AI Provider
        │
        ▼
Recommendation Generated
        │
        ▼
Human Decision (ACCEPTED / OVERRIDDEN / REJECTED)
        │
        ▼
AI Model Evaluation Service (Quality & Productivity Analysis)
```

### 2. Explicit Domain Separation (Adoption vs Quality)
- **Domain Adopsi (Adoption)**: Mengukur kuantitas penggunaan (`totalGenerated`, `acceptedCount`, `overriddenCount`, `rejectedCount`, `acceptanceRatePercentage`, `overrideRatePercentage`).
- **Domain Kualitas (Quality)**:
  - **`Estimated Operational Precision`**: Dihitung dari `Accepted / (Accepted + Overridden + Rejected)`.
  - **`Confidence Calibration Buckets`**: Pengelompokan sampel dalam 5 ember (*0–20%, 21–40%, 41–60%, 61–80%, 81–100%*) untuk menguji apakah *confidence score* tinggi selaras dengan tingkat penerimaan petugas.
- **Domain Produktivitas (Productivity)**:
  - **`Time-to-Accept`**: Menghitung selisih waktu dari penerbitan rekomendasi AI (`createdAt`) hingga tindakan petugas manusia untuk mengukur efisiensi kerja organisasi.

### 3. Capability Lifecycle & Dependencies Metadata
Metadata capability diperluas dengan:
- **`lifecycleState`**: Status penggunaan (`ACTIVE`, `EXPERIMENTAL`, `DEPRECATED`).
- **`dependencies`**: Komponen pendukung (`['TicketAnalyticsRepository', 'PromptRegistry', 'GeminiAIProvider']`).

---

## 🔮 Manfaat Utama
- **Keputusan Manajemen Tepat**: Membedakan intervensi apakah perlu sosialisasi adopsi atau penyempurnaan prompt/model.
- **Dapat Diukur**: Terujinya kalibrasi skor kepercayaan AI secara empiris dari keputusan operasional petugas.
- **Tingkat Kematangan Platform**: SpeakUp resmi berevolusi menjadi **Evaluated AI Platform**.
