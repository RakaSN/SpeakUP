---
Version: 1.2
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x & v2.x (AI Operations & Runtime Infrastructure)
---

# ADR-008: AI Runtime & Capability Registry Architecture

## 📄 Status
`Accepted` (Telah diimplementasikan dan ditutup pada Sprint 4B)

---

## 🏛️ Konteks & Problem Statement
Seiring berkembangnya fitur AI dari sekadar pembantu operasional tiket individual (Sprint 3C-1) menjadi analitik platform (Sprint 3C-2) dan *predictive risk* (Sprint 3C-3), jumlah *capability* AI meningkat pesat.

Tanpa abstraksi runtime yang terstruktur:
1. *Background Jobs* dan *Server Actions* bergantung secara langsung (*direct coupling*) pada kelas *capability* individual.
2. Format keluaran (*output*) setiap *capability* bervariasi sehingga menyulitkan observabilitas dan evaluasi model.
3. Telemetri eksekusi (latensi, penggunaan token, estimasi biaya, error) terpisah dan sulit dipantau secara otomatis.

---

## ⚖️ Keputusan Arsitektur

### 1. Unified Decoupled Architecture Flow
Evolusi arsitektur AI runtime dipisahkan secara tegas ke dalam rantai berikut:

```
Business Job / Action
        │
        ▼
Capability Registry (Service Discovery)
        │
        ▼
Capability Contract (Standardized AICapability<TInput, TOutput>)
        │
        ▼
Prompt Registry (Versioned Prompts)
        │
        ▼
AI Provider (Telemetry Decorator Wrapped)
        │
        ▼
Inference Output
```

### 2. Standardized Capability Contract (`AICapability<TInput, TOutput>`)
Setiap kapabilitas AI wajib mengimplementasikan interface `AICapability`:
- **`metadata`**: `capabilityId`, `name`, `description`, `version`, `providerName`, `promptId`, `enabled`, `tags`.
- **`execute(input)`**: Mengembalikan wrapper `AICapabilityResult<T>` yang seragam (`success`, `data`, `confidence`, `reasoning`, `provider`, `model`, `promptVersion`).
- **`checkHealth()`**: Inspeksi kesehatan 3-state (`HEALTHY`, `DEGRADED`, `UNAVAILABLE`) beserta latensi dan konektivitas provider.

### 3. Service Discovery via `AICapabilityRegistry`
Seluruh konsumen AI (*Job* / *Action*) dilarang melakukan instansiasi `new CapabilityClass()` secara langsung. Konsumen AI wajib mengambil *instance* dari registry:
`AICapabilityRegistry.getInstance().get<TInput, TOutput>(AiCapabilityType.TYPE)`

### 4. Automated Telemetry Decorator (`TelemetryAIProvider`)
Setiap panggilan *inference* dibungkus oleh `TelemetryAIProvider` yang secara otomatis mencatat `AiTelemetryLog` (latensi *ms*, token *count*, biaya *USD*, status *error*) tanpa mengubah *business logic* kapabilitas.

---

## 🔮 Manfaat Utama
- **Observabilitas Terukur (AIOps)**: Penggunaan token, estimasi biaya, dan *failure rate* terpantau secara *real-time* di Admin Dashboard.
- **Zero Coupling**: *Background Job* tidak mengetahui kelas konkrit *capability*; penambahan *capability* baru di masa depan cukup didaftarkan ke registry.
- **Siap Evaluasi Model (Sprint 4C)**: Seluruh keluaran AI mengembalikan struktur metadata dan *confidence score* yang seragam.
