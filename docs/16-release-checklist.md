# 16. Release Checklist

This checklist must be fully executed before marking a release as Production Ready.

## 1. Production Environment Variables Verification
- [ ] `NODE_ENV` is set to `production`
- [ ] `APP_URL` matches the production domain
- [ ] `DATABASE_URL` is pointing to the production database instance
- [ ] `AUTH_SECRET` is generated using a secure random string (not default)
- [ ] `LOG_LEVEL` (if applicable) is set to `warn` or `error`

## 2. Pre-Flight Checks
- [ ] Code is frozen on the `release/vX.X.X` branch
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run build` completes successfully
- [ ] Security Checklist (`17-security-checklist.md`) signed off

## 3. Deployment Steps
- [ ] Take a manual backup of the Database (`pg_dump`).
- [ ] Run Database Migrations: `npx prisma migrate deploy`
- [ ] Deploy the Application (Docker / VM)
- [ ] Verify application starts and connects to DB (no crash loops)

## 4. Smoke Test (Post-Deploy)
Perform a manual walkthrough of the critical path in the live staging/production environment:
- [ ] Login as Admin
- [ ] View Dashboard metrics
- [ ] Create a Ticket (as Reporter)
- [ ] Assign Ticket (as BK)
- [ ] Resolve Ticket (as BK)
- [ ] Verify Notifications appear in the Notification Bell
- [ ] View Analytics Page
- [ ] Export CSV Report

## 5. Rollback Mitigation (If Smoke Test Fails)
If critical errors are discovered:
1. Revert deployment to previous application version container/build.
2. If database schema was corrupted/incompatible, restore the `pg_dump` backup.
3. Verify system restoration via the Smoke Test.
