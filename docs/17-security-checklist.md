# 17. Security Checklist

## 1. Authentication
- [ ] Auth.js (NextAuth) is used for all session management.
- [ ] Passwords are hashed using `bcryptjs` with a salt round of 10.
- [ ] No plaintext passwords exist in logs, database, or API responses.
- [ ] Default test accounts have strong passwords enforced before production.

## 2. Authorization (RBAC)
- [ ] Route Handlers (`/api/...`) enforce session validation.
- [ ] Server Actions use `requirePermission(Role)` or session checks before executing logic.
- [ ] Direct URL manipulation (e.g., a Reporter trying to access `/dashboard/users`) results in a `403 Forbidden` or redirect.
- [ ] Users can only view/edit tickets belonging to them or their allowed scope.

## 3. Session Management
- [ ] Session tokens are HTTP-only and secure in production (`__Secure-next-auth.session-token`).
- [ ] Session expiry is reasonably set (e.g., 24 hours).
- [ ] Logout functionality completely invalidates the session cookie.

## 4. Input Validation
- [ ] All incoming payloads in Server Actions are validated using **Zod**.
- [ ] Type coercion and strict typing are applied to IDs (e.g., UUID validation).
- [ ] Protection against XSS: Next.js and React automatically escape variables in JSX.

## 5. Audit & Traceability
- [ ] Sensitive actions (Login, Delete, Status Change, Role Change) trigger the `AuditService`.
- [ ] The `AuditLog` captures user IP address, User Agent, and data deltas (`oldValue`, `newValue`).
- [ ] Errors are properly obfuscated from the client (no raw stack traces in UI).
