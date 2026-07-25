# 15. Deployment and Operation Guide

## 1. System Requirements
- **Node.js**: v20+
- **Database**: PostgreSQL 15+
- **OS**: Linux (Ubuntu 22.04 recommended) or Windows Server

## 2. Environment Variables (`.env`)
Create a `.env` file in the project root:
```env
# Database Connection
DATABASE_URL="postgresql://speakup_admin:speakup_password@localhost:5432/speakup_db?schema=public"

# Auth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="generate-a-secure-random-string-here" # Run: npx auth secret

# Application
NODE_ENV="production"
```

## 3. Installation & Build (Bare Metal / VM)
1. **Install Dependencies**: `npm ci`
2. **Generate Prisma Client**: `npx prisma generate`
3. **Run Migrations**: `npx prisma migrate deploy`
4. **Seed Database (Optional)**: `npm run seed`
5. **Build Application**: `npm run build`
6. **Start Application**: `npm start` (Runs on port 3000)

## 4. Docker Deployment (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Edit `.env` or inject environment variables.
3. Run: `docker-compose up -d --build`
4. The app will be available on `http://localhost:3000`.

## 5. Backup & Restore Procedures

### Backup Database
To back up the PostgreSQL database:
```bash
# Using pg_dump
pg_dump -U speakup_admin -h localhost -d speakup_db -F c -f /backups/speakup_backup_$(date +%Y%m%d).dump
```

### Restore Database
> **WARNING**: Restoring a database will overwrite current data.
1. Drop existing database (or run in empty DB):
```bash
# Using pg_restore
pg_restore -U speakup_admin -h localhost -d speakup_db -1 /backups/speakup_backup_YYYYMMDD.dump
```

### Restore Verification
1. Log into the SpeakUp application as Admin.
2. Verify Dashboard Ticket counts match expected backup state.
3. Verify Audit Log contains the latest historical events prior to the crash.
