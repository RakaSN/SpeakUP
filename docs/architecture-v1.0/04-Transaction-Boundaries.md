---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 04. Transaction Boundaries

Dokumen ini memetakan batasan eksekusi database (*Transaction Boundary*) untuk memastikan integritas data. Konsep inti di SpeakUp adalah memastikan setiap mutasi data yang melibatkan lebih dari satu operasi (misal: *Update Ticket* + *Insert Audit Log*) dieksekusi dalam satu *Transaction Wrapper*. Jika salah satu operasi gagal, seluruh operasi akan dibatalkan (*Rollback*).

## Konsep `prisma.$transaction`

```mermaid
block-beta
  columns 1
  space
  block:TransactionWrapper
    columns 1
    Start(("Start $transaction()"))
    space
    block:Operations
      columns 3
      OperationA["Update Table A"]
      space
      OperationB["Insert Table B"]
    end
    space
    Commit(("Commit / Rollback"))
  end
  
  Start --> OperationA
  OperationA --> OperationB
  OperationB --> Commit
```

## Contoh Nyata: Alur Penugasan Tiket (Assignment)

Ketika Admin menugaskan sebuah tiket kepada Guru BK, terjadi beberapa mutasi di database. Keseluruhan proses ini **wajib** dikurung dalam satu transaksi agar tidak terjadi data inkonsisten (misalnya tiket sudah berpindah nama petugas, tetapi log tidak tercatat).

```mermaid
sequenceDiagram
    participant Svc as TicketService
    participant DB as Prisma Client
    participant Ticket as Table: Ticket
    participant Audit as Table: AuditLog

    Svc->>DB: prisma.$transaction(async (tx) => { ... })
    activate DB
    Note over DB: Transaksi Dimulai
    
    DB->>Ticket: tx.ticket.update( assigneeId = newUserId )
    Ticket-->>DB: Sukses
    
    DB->>Audit: tx.auditLog.create( entity: 'Ticket', action: 'ASSIGN' )
    Audit-->>DB: Sukses
    
    alt Semua Operasi Berhasil
        Note over DB: COMMIT Transaksi
        DB-->>Svc: Kembalikan Data Hasil
    else Terjadi Error (e.g. Invalid Data / Timeout)
        Note over DB: ROLLBACK Transaksi
        DB--xSvc: Lempar Error (Exception)
    end
    deactivate DB
```

### Pedoman Penggunaan Transaksi di SpeakUp:
1. **Dilarang di UI/Server Actions**: Transaksi hanya boleh dipanggil dan dikelola di dalam layar `Service` (contoh: `ticket.service.ts`). Server Actions tidak boleh tahu apakah ada `$transaction` atau tidak.
2. **Ketergantungan Eksternal**: Jangan masukkan panggilan API eksternal (misalnya mengirim email) ke dalam blok `$transaction`, karena ini akan menahan koneksi database terlalu lama (kunci baris / *row locks*). Kirim email melalui *EventBus* **setelah** transaksi berhasil di-*commit*.
