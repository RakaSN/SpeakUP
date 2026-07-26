---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 03. Sequence Diagrams

Dokumen ini memvisualisasikan urutan pemanggilan metode dan aliran data (*flow*) untuk proses-proses inti aplikasi.

## 1. Authentication & RBAC Flow
*Alur bagaimana pengguna masuk, sesinya dikelola, dan hak aksesnya diverifikasi.*

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware
    participant Auth.js
    participant ServerAction
    participant DB

    User->>Browser: Masukkan kredensial & Submit
    Browser->>Auth.js: POST /api/auth/callback/credentials
    Auth.js->>DB: Cari User berdasarkan Email
    DB-->>Auth.js: Return Data User & Password Hash
    Auth.js->>Auth.js: Verifikasi bcrypt(password)
    Auth.js-->>Browser: Set Session Cookie (JWT)

    User->>Browser: Buka URL `/dashboard/users`
    Browser->>Middleware: Navigasi Halaman
    Middleware->>Middleware: Cek keberadaan Session Cookie
    
    alt Tidak Ada Sesi
        Middleware-->>Browser: Redirect ke `/login`
    else Ada Sesi
        Middleware->>ServerAction: Teruskan Request ke `page.tsx`
        ServerAction->>ServerAction: Panggil `requirePermission(Role.ADMIN)`
        
        alt Bukan Admin
            ServerAction-->>Browser: Tampilkan `403 Forbidden` / Redirect
        else Admin
            ServerAction->>DB: Ambil Data Dashboard
            DB-->>ServerAction: Data
            ServerAction-->>Browser: Render UI Halaman Dasbor
        end
    end
```

---

## 2. Ticket Creation & Event Propagation
*Alur ketika Pelapor membuat tiket baru, memicu sistem SLA dan penyebaran notifikasi latar belakang.*

```mermaid
sequenceDiagram
    actor Pelapor
    participant UI as Ticket Form (UI)
    participant Action as Server Action
    participant Svc as TicketService
    participant EventBus as EventBus
    participant DB as Prisma (DB)
    participant Listener as Background Listeners

    Pelapor->>UI: Isi form keluhan & Submit
    UI->>Action: POST Data (Zod Validation)
    Action->>Svc: createTicket(payload)
    
    Svc->>DB: Fetch Priority (untuk SLA Freeze)
    DB-->>Svc: SLA = 24 jam
    
    Svc->>Svc: Kalkulasi targetResolutionAt (Now + 24 jam)
    
    Svc->>DB: prisma.ticket.create()
    DB-->>Svc: Tiket Baru Dibuat (ID)
    
    Svc->>EventBus: emit('TICKET_CREATED', ticketData)
    
    Svc-->>Action: Sukses
    Action-->>UI: Redirect ke halaman detail tiket
    
    %% Background Process
    EventBus-->>Listener: Asynchronous Trigger
    par Audit Logging
        Listener->>DB: Insert ke tabel AuditLog (Action: CREATE)
    and Notifications
        Listener->>DB: Insert ke tabel Notification (Target: Admin/BK)
    end
```

---

## 3. SLA Evaluation Flow (Ticket Resolution)
*Alur ketika Guru BK/Admin menyelesaikan tiket, sistem mengevaluasi apakah penyelesaian tepat waktu atau terlambat.*

```mermaid
sequenceDiagram
    actor BK as Guru BK
    participant Action as Server Action
    participant Svc as TicketService
    participant DB as Prisma (DB)

    BK->>Action: Ubah Status ke "RESOLVED"
    Action->>Svc: changeTicketStatus(id, RESOLVED)
    
    Svc->>DB: Ambil data tiket saat ini (fetch)
    DB-->>Svc: Ticket { targetResolutionAt: DateTime }
    
    Svc->>Svc: Set resolvedAt = Waktu Saat Ini
    
    alt resolvedAt <= targetResolutionAt
        Svc->>Svc: slaStatus = 'RESOLVED_ON_TIME'
    else resolvedAt > targetResolutionAt
        Svc->>Svc: slaStatus = 'RESOLVED_LATE'
    end
    
    Svc->>DB: Update Ticket (status, resolvedAt, slaStatus)
    DB-->>Svc: Sukses
    
    Svc->>EventBus: emit('TICKET_RESOLVED', ...)
    Svc-->>Action: Selesai
    Action-->>BK: UI Terupdate
```
