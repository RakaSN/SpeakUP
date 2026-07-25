# SpeakUp - API Specification (REST)

*Base URL: `/api/v1`*

## 1. Authentication
### `POST /auth/login`
- **Body**: `{ email, password }`
- **Response**: `200 OK { token, user: { id, name, role } }`

## 2. Master Data (Public & Admin Access)
### `GET /master/types` , `GET /master/categories` , `GET /master/statuses`
- **Desc**: Mengambil data master (biasanya di-fetch saat frontend me-render *dropdown* form).
- **Response**: `200 OK [ { id, name, description } ]`

### `POST /master/categories` (Role: Super Admin)
- **Desc**: Menambah kategori masalah baru tanpa harus *deploy* ulang kode.
- **Body**: `{ name: "Cyber Bullying", description: "..." }`

## 3. Tickets (Pelapor)
### `GET /tickets/my-tickets`
- **Desc**: Mengambil tiket milik user yang login.
### `POST /tickets`
- **Desc**: Membuat tiket laporan baru menggunakan ID dari master data.
- **Body**: 
  ```json
  { 
    "type_id": 1, 
    "category_id": 5, 
    "title": "Perundungan di Kelas", 
    "description": "...",
    "is_anonymous": true,
    "visibility": "STRICTLY_CONFIDENTIAL"
  }
  ```
- **Response**: `201 Created { ticket_number, message }`

## 4. Ticket Management (Pengelola)
### `GET /admin/tickets`
- **Desc**: Mengambil daftar tiket yang berhak diakses (difilter dari tabel assignments & visibility).

### `POST /admin/tickets/:id/assignments`
- **Desc**: Melakukan disposisi tiket (Bukan di PATCH langsung, melainkan menambah ke tabel assignments).
- **Body**: `{ assignee_id: 8, note: "Tolong tangani kasus ini segera" }`

### `PATCH /admin/tickets/:id/status`
- **Desc**: Memperbarui status (*progress*) tiket.
- **Body**: `{ status_id: 3, note: "Sedang diusut oleh pihak sekolah." }`

## 5. Notifications
### `GET /notifications`
- **Desc**: Mengambil daftar notifikasi yang belum terbaca milik pengguna.
### `PATCH /notifications/:id/read`
- **Desc**: Menandai notifikasi sebagai telah dibaca.
