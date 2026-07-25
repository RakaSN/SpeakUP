# Rencana Implementasi Sprint 1 — Core Business Features (Revisi Akhir)

## User Review Required

> [!IMPORTANT]
> Dokumen ini telah direvisi sesuai seluruh *feedback* Anda (Modular Seed, Super Admin via .env, Server Actions, dan UI Componentization). Silakan tinjau kembali daftar ini. Jika sudah sesuai dengan visi Anda untuk *Definition of Done (DoD)* Sprint 1, silakan klik **Proceed** dan eksekusi akan segera dimulai.

## Proposed Changes

### 1. Modular Seed Data (`prisma/seed`)
Alih-alih satu file raksasa, seed data akan dipecah menjadi modul independen yang dipanggil oleh `prisma/seed.ts`:
- **[NEW]** `prisma/seed/permissions.ts`: `ticket.create`, `ticket.read`, `ticket.read.all`, `ticket.update`, `ticket.assign`, `ticket.resolve`, `ticket.close`, `ticket.delete`, `master.manage`, `users.manage`, `dashboard.read`, `notification.read`.
- **[NEW]** `prisma/seed/roles.ts`: `Super Admin`, `Admin`, `BK`, `Wakasek`, `Kepsek`, `Pelapor`.
- **[NEW]** `prisma/seed/role-permissions.ts`: Pemetaan relasi role dan permission.
- **[NEW]** `prisma/seed/ticket-statuses.ts`: `Draft`, `Submitted`, `Verified`, `Assigned`, `In Progress`, `Waiting Response`, `Resolved`, `Closed`, `Rejected`.
- **[NEW]** `prisma/seed/ticket-types.ts`, `ticket-categories.ts`, `ticket-priorities.ts`.
- **[NEW]** `prisma/seed/super-admin.ts`: Menggunakan variabel `.env` (`SUPER_ADMIN_EMAIL` & `SUPER_ADMIN_PASSWORD`).

### 2. Authentication UI & Authorization
- **[NEW]** `src/app/login/page.tsx`: Login dengan UI shadcn/ui.
- **[NEW]** `src/app/unauthorized/page.tsx`: Halaman peringatan/pencegahan bagi *user* yang tidak memiliki akses *dashboard* (misal: Pelapor biasa).
- **[MODIFY]** `src/middleware.ts` & `src/features/auth/server/authorize.ts`: Perlindungan route yang dikombinasikan dengan pengecekan RBAC yang ketat.

### 3. Dashboard Shell (`src/app/dashboard`)
- **[NEW]** `src/app/dashboard/layout.tsx`: Sidebar & Header terintegrasi.
- **[NEW]** `src/app/dashboard/page.tsx`: Metrik tiket sederhana (`Total`, `New`, `In Progress`, `Resolved`). *Tanpa chart di Sprint 1.*

### 4. Ticket Service Layer
- **[NEW]** `src/features/tickets/server/ticket.service.ts`: Seluruh logika `create`, `assign`, `change status`, `resolve`, `close` dipusatkan di sini menggunakan *Transaction Wrapper*. Tidak ada akses Prisma mentah di luar service ini.

### 5. Ticket Management UI (via Server Actions)
- **[NEW]** `src/app/dashboard/tickets/page.tsx`: Tabel/List tiket dengan **Server-side Search, Filter, & Pagination**. Menggunakan URL *search params* alih-alih *client state*.
- **[NEW]** `src/app/dashboard/tickets/create/page.tsx`: Form pembuatan tiket menggunakan `react-hook-form` + `zod` + **Server Action** (bukan API Route). Mendukung **Attachment Upload** ke folder lokal sementara (`storage/local`).
- **[NEW]** `src/app/dashboard/tickets/[id]/page.tsx`: Halaman detail tiket yang dipecah ke berbagai komponen UI:
  - `TicketHeader`
  - `TicketInfoCard`
  - `ActivityTimeline`
  - `AssignmentHistory`
  - `AttachmentList`
- **[NEW]** `src/components/tickets/ticket-disposition-modal.tsx`: Modal disposisi (*Assignment*) dengan kolom `note`.

## Verification Plan & Definition of Done (DoD)
- `npm run lint`, `npm test`, dan `npm run build` harus berstatus **Hijau (Clean)**.
- Semua alur Authentication (Login, Logout, RBAC) berfungsi sesuai spesifikasi.
- Mampu membuat Tiket beserta Attachment secara fungsional (tersimpan di database dan local storage).
- *List*, *Search*, *Filter*, dan *Pagination* pada halaman tiket menggunakan Server Actions berjalan mulus.
- Alur *Assignment*, pergantian status, pencatatan histori aktivitas, dan *Event Bus* berhasil dieksekusi melalui `ticket.service.ts`.
