# Panduan Deployment Server Produksi (Deployment Guide v1.0)

## Overview
Dokumen ini menceritakan langkah-langkah deployment aplikasi **SpeakUp v1.0** ke lingkungan produksi (Server Linux / Docker / Node.js).

---

## 📋 Prasyarat Sistem (System Requirements)
- **Node.js**: v20.x LTS atau lebih baru.
- **Database**: PostgreSQL v15+ dengan adapter `@prisma/adapter-pg`.
- **Memory Minimal**: 2 GB RAM (Rekomendasi: 4 GB RAM).
- **Storage**: 20 GB SSD Storage.

---

## ⚙️ 1. Pengaturan Environment Variables (`.env`)
Salin file `.env.example` ke `.env` di server produksi:

```bash
cp .env.example .env
```

Pastikan variabel kunci berikut terisi di lingkungan produksi:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/speakup_prod?schema=public"
AUTH_SECRET="masukkan-random-secret-key-32-karakter"
NEXTAUTH_URL="https://speakup.smkkampungjawa.sch.id"
NODE_ENV="production"

# AI Provider Credentials (Opsional / Active)
GEMINI_API_KEY="your-production-gemini-api-key"
```

---

## 🛠️ 2. Langkah Kompilasi & Build Produksi

### Step 1: Install Dependencies
```bash
npm ci --only=production
```

### Step 2: Migrasi Database Prisma
```bash
npx prisma migrate deploy
```

### Step 3: Kompilasi Next.js Production Build
```bash
npm run build
```

---

## 🚀 3. Menjalankan Aplikasi (PM2 / Systemd)

Menggunakan PM2 Process Manager:
```bash
npm install -g pm2
pm2 start npm --name "speakup-v1" -- start
pm2 save
pm2 startup
```

---

## 🔍 4. Verifikasi Health Check
Setelah aplikasi berjalan, buka endpoint health check:
```bash
curl https://speakup.smkkampungjawa.sch.id/api/health
```
Respons yang diharapkan: `{"status":"ok","timestamp":"..."}`.
