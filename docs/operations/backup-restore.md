# Prosedur Backup & Restore Database (Disaster Recovery v1.0)

## Overview
Panduan ini menjabarkan prosedur pemeliharaan cadangan data (*backup*) dan pemulihan (*disaster recovery*) untuk database PostgreSQL platform SpeakUp.

---

## 💾 1. Prosedur Backup Database (Automated / Manual)

### Backup Manual via `pg_dump`
Jalankan perintah berikut di server produksi:
```bash
pg_dump -U postgres -h localhost -d speakup_prod -F c -b -v -f /backups/speakup_prod_$(date +%Y%m%d_%H%M%S).dump
```

### Cronjob Backup Otomatis Harian (Setiap jam 02:00 Pagi)
Tambahkan entri berikut pada `crontab -e`:
```cron
0 2 * * * pg_dump -U postgres -d speakup_prod -F c -f /backups/speakup_daily_$(date +\%Y\%m\%d).dump
```

---

## 🔄 2. Prosedur Pemulihan (Restore Database)

Jika terjadi insiden atau migrasi server:

### Step 1: Hentikan Service Aplikasi
```bash
pm2 stop speakup-v1
```

### Step 2: Restore Database dari File Backup
```bash
pg_restore -U postgres -h localhost -d speakup_prod -v /backups/speakup_daily_20260726.dump
```

### Step 3: Verifikasi Prisma Migration State
```bash
npx prisma migrate status
```

### Step 4: Jalankan Kembali Aplikasi
```bash
pm2 restart speakup-v1
```
