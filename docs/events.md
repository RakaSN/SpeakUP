# Event Catalog - SpeakUp

Dokumen ini memetakan seluruh *Domain Event* yang dipublikasikan oleh *Service Layer* dan dikonsumsi oleh *Event Listeners* (Notifikasi, Audit, dsb.).

| Event Name | Publisher | Listener(s) | Deskripsi |
|---|---|---|---|
| `TICKET_CREATED` | `TicketService` | `NotificationListener` | Dipicu saat pelapor berhasil membuat tiket baru. |
| `TICKET_STATUS_CHANGED` | `TicketService` | `NotificationListener` | Dipicu saat status tiket diperbarui (Resolved, Closed, Rejected). |
| `TICKET_ASSIGNED` | `TicketService` | `NotificationListener` | Dipicu saat tiket didisposisikan ke petugas baru. |
| `AUTH_LOGIN` | `AuthService` | `AuditListener` | Dipicu saat pengguna berhasil login ke sistem. |
| `AUTH_LOGOUT` | `AuthService` | `AuditListener` | Dipicu saat pengguna melakukan logout. |
| `AUTH_PASSWORD_RESET` | `UserService` | `AuditListener`, `NotificationListener` | Dipicu saat admin melakukan reset password user. |
| `USER_ROLE_CHANGED` | `UserService` | `AuditListener`, `NotificationListener` | Dipicu saat role user diperbarui oleh admin. |
| `USER_STATUS_CHANGED` | `UserService` | `AuditListener` | Dipicu saat status akun user diubah (Active, Inactive, Locked). |
| `MASTER_DATA_UPDATED` | `MasterDataService` | `AuditListener` | Dipicu saat ada mutasi pada tabel referensi master data. |
