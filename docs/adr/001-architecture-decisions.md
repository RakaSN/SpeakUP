# Architecture Decision Record (ADR)

## ADR 001: Separation of Service Layers & Analytics
- **Status**: Approved
- **Context**: Modul analitik dan dashboard sebelumnya berisiko membebani `TicketService`.
- **Decision**: Dipisahkan menjadi `AnalyticsService` dan `DashboardService`. `DashboardService` mengevaluasi hak akses via `PermissionService` sebelum mengambil statistik.

---

## ADR 002: Event-Driven Audit & Side Effects
- **Status**: Approved
- **Context**: Efek samping seperti notifikasi dan jejak audit (*Audit Log*) dapat mencemari transaksi bisnis utama.
- **Decision**: Menggunakan Pub/Sub `EventBus`. `TicketService` hanya memublikasikan event domain (`TICKET_CREATED`, dll.), sedangkan `NotificationListener` dan `AuditListener` memproses efek samping secara terisolasi.

---

## ADR 003: Structured Metadata-Driven Audit Log
- **Status**: Approved
- **Context**: Membutuhkan jejak audit yang tidak hanya untuk log audit biasa, tetapi juga untuk keperluan *troubleshooting* (delta perubahan).
- **Decision**: Skema `AuditLog` menyimpan `entity`, `entityId`, `oldValue`, `newValue`, `ipAddress`, dan `userAgent`.

---

## ADR 004: SLA & Target Resolution Strategy
- **Status**: Approved
- **Context**: Setiap tiket memerlukan kepastian waktu penyelesaian berbasis tingkat prioritas.
- **Decision**: Ditambahkan parameter `slaHours` pada `MasterTicketPriority`. Saat tiket disubmit, `TicketService` langsung mengalkulasi dan menyimpan timestamp absolut `targetResolutionAt` tanpa melakukan kalkulasi berulang di antarmuka UI.
