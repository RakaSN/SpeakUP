---
Version: 1.0
Last Updated: 2026-07-26
Applies To: SpeakUp v1.x
---

# 02. C4 Model (Context, Container, Component, Deployment)

Diagram arsitektur menggunakan standar C4 Model untuk memberikan berbagai tingkat abstraksi (*zoom level*) dari sistem SpeakUp. Semua diagram dirender menggunakan `mermaid-c4`.

## Level 1: System Context Diagram
*Pandangan tingkat atas (*helicopter view*) yang menunjukkan interaksi aktor-aktor dengan sistem.*

```mermaid
C4Context
  title SpeakUp (Sistem Pengaduan Digital) - System Context

  Person(student, "Pelapor / Siswa", "Melaporkan masalah, memantau status tiket miliknya sendiri.")
  Person(admin, "Super Admin", "Mengelola Master Data, User, dan konfigurasi sistem.")
  Person(bk, "Guru BK / Petugas", "Menerima penugasan tiket, merespons, dan menyelesaikan masalah.")
  Person(kepsek, "Kepala Sekolah", "Memantau metrik performa (SLA), mengunduh laporan ekspor.")

  System(speakup, "SpeakUp System", "Platform sentral penerimaan pengaduan, evaluasi SLA, dan notifikasi.")

  Rel(student, speakup, "Submit laporan & lihat status")
  Rel(admin, speakup, "Kelola data & pengguna")
  Rel(bk, speakup, "Selesaikan tiket yang ditugaskan")
  Rel(kepsek, speakup, "Lihat metrik dasbor & ekspor laporan")
```

---

## Level 2: Container Diagram
*Membedah sistem menjadi kontainer fungsional (Aplikasi, Database).*

```mermaid
C4Container
  title SpeakUp - Container Diagram

  Person(user, "User (Semua Peran)", "Pengguna aplikasi")

  System_Boundary(c1, "SpeakUp Platform") {
    Container(browser, "Web Frontend (Client)", "React, Tailwind", "RSC & Client Components untuk UI.")
    Container(server, "Next.js Server", "Node.js, Next.js", "Menangani Server Actions, autentikasi, dan logika bisnis.")
    ContainerDb(db, "PostgreSQL Database", "Relational DB", "Menyimpan seluruh tabel relasional (Ticket, User, Master, Audit).")
  }

  Rel(user, browser, "Berinteraksi via UI", "HTTPS")
  Rel(browser, server, "Submit data via Server Actions", "HTTPS / JSON")
  Rel(server, db, "Read/Write data (Prisma ORM)", "TCP")
```

---

## Level 3: Component Diagram (Next.js Server)
*Membedah kontainer Server menjadi blok-blok penyusun internal.*

```mermaid
C4Component
  title SpeakUp - Component Diagram (Server Container)

  Container_Boundary(server, "Next.js Server") {
    Component(actions, "Server Actions", "Controller", "Validasi Zod & Otorisasi RBAC.")
    
    Boundary(services, "Service Layer (Business Logic)") {
      Component(ticketSvc, "TicketService", "Class", "Pembuatan & Mutasi Tiket.")
      Component(slaSvc, "SlaService", "Class", "Kalkulasi SLA & Tenggat Waktu.")
      Component(dashboardSvc, "DashboardService", "Class", "Strategy Pattern penyajian Dasbor.")
    }

    Component(eventBus, "EventBus", "Pub/Sub", "Menyiarkan event (TICKET_CREATED).")
    
    Boundary(listeners, "Background Listeners") {
      Component(auditList, "AuditListener", "Class", "Merekam jejak audit.")
      Component(notifList, "NotificationListener", "Class", "Mengirim notifikasi inbox.")
    }

    Component(prisma, "Prisma Client", "ORM", "Akses Data (DAL).")
  }

  Rel(actions, ticketSvc, "Memanggil logika bisnis")
  Rel(actions, dashboardSvc, "Mengambil data dasbor")
  
  Rel(ticketSvc, slaSvc, "Mengkalkulasi SLA")
  Rel(ticketSvc, eventBus, "Memancarkan Domain Event")
  
  Rel(eventBus, auditList, "Asinkronus")
  Rel(eventBus, notifList, "Asinkronus")

  Rel(ticketSvc, prisma, "Write/Read")
  Rel(dashboardSvc, prisma, "Read (Optimized Queries)")
  Rel(auditList, prisma, "Write Audit Log")
  Rel(notifList, prisma, "Write Notification")
```

---

## Deployment View
*Peta arsitektur bagaimana sistem dideploy ke environment Production.*

```mermaid
graph TD
  User((Browser/User))
  Cloudflare[Cloudflare (DNS, CDN, SSL)]
  Nginx[Nginx Reverse Proxy]
  
  subgraph Docker Environment (VM)
    Next[Next.js App Container]
    PG[(PostgreSQL 15 Container)]
    Uploads[Local Storage Volume]
  end

  User -- HTTPS --> Cloudflare
  Cloudflare -- HTTPS --> Nginx
  Nginx -- HTTP (3000) --> Next
  Next -- TCP (5432) --> PG
  Next -- File I/O --> Uploads
```
