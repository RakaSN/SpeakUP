# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.0-RC1] - 2026-07-26
### Added
- **Authentication**: JWT-based session management using Auth.js (NextAuth v5).
- **User Management**: Admin CRUD users, Role-Based Access Control (Admin, Guru BK, Kepsek, Reporter).
- **Core Ticketing Workflow**: Create, Assign, Status Update (Open, In Progress, Resolved, Closed), and Delete.
- **SLA Engine**: Automated SLA calculation based on Priority rules (`targetResolutionAt`), with Visual Badges (On Track, At Risk, Overdue).
- **Event-Driven Audit Logging**: `AuditService` tracks entities, field deltas (`oldValue` to `newValue`), and IP addresses asynchronously.
- **Notification Center**: Centralized inbox and top-nav notification bell with "Mark All As Read" functionality.
- **Dashboard Strategy Pattern**: Segregated dashboards per role (Strategic vs Operational vs Personal views).
- **Analytics & Export**: Dedicated `AnalyticsService` for metrics and `ReportService` for CSV UTF-8 BOM exports.
- **Master Data Management**: Category, Priority, and Status management with Soft-Delete Guardrails.
- **Docker Infrastructure**: Containerization support for DB and Application (`Dockerfile`, `docker-compose.yml`).
- **Volume Seeding**: `npm run seed:volume` for RC performance tests.

### Changed
- Refactored all data-access to bypass UI completely (Server Actions -> Service Layer -> Prisma).
- Replaced monolithic `TicketService` by extracting `SlaService`, `DashboardService`, and `AnalyticsService`.
- Replaced Prisma `db push` policy with rigorous `migrate dev` schema versioning policy.

### Fixed
- Fixed Next.js build errors related to missing Next.js 15 Server Action typing (`void` return requirement).
- Zero TypeScript and ESLint warnings in production build.
- Fixed N+1 queries in dashboard by using Prisma `include` clauses and optimized aggregations.

### Security
- Protected all Server Actions with strict Role-based authorization checks.
- Guarded Route Handlers and API paths against unauthenticated requests.
- Prevented unauthorized assignment of tickets using domain authorization logic.
