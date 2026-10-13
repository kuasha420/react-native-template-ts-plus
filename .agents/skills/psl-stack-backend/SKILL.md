---
name: psl-stack-backend
description: >-
  Backend architectural patterns, multi-tenant isolation, and data layer safety invariants.
  Use when designing backend services, database migrations, API routes, or data access repositories.
---
<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright (c) 2026 Arafat Zahan (@kuasha420) -->
<!-- Corporate Stewardship & Infrastructure: Purrfect Software Limited (PSL) -->
<!-- Governed by: ICARO-42/b Ordinance (Company-Supported Personal IP Framework) -->

# PSL Stack Skill: Backend Architecture, Isolation & Data Integrity

This skill codifies backend engineering patterns, multi-tenant isolation guarantees, and database migration safety invariants for scalable distributed services.

---

## 1. Multi-Tenant Query & Mutation Isolation

### 1.1 Mandatory Tenant Scoping
- In multi-tenant systems, every database query, update, and deletion MUST explicitly scope to the authenticated tenant/workspace/organization identifier.
- Never write unbounded queries that omit tenant filters:
  ```sql
  -- BAD: Cross-tenant data leakage vulnerability
  SELECT * FROM documents WHERE id = 'doc-123';

  -- GOOD: Strictly isolated tenant scope
  SELECT * FROM documents WHERE id = 'doc-123' AND tenant_id = 'org-456';
  ```
- In ORMs or repositories, enforce tenancy at the repository base or query context layer, making tenant omissions impossible at compile or runtime.

### 1.2 Authorization at the Gate
- Verify tenant membership before executing any service operation.
- Token claims or session tenant IDs must originate from verified cryptographic signatures, never from unvalidated user client request bodies or query params.

---

## 2. Database Migrations & Schema Evolution

### 2.1 Forward-Compatible, Non-Destructive Migrations
- All schema migrations must be forward-compatible and executable without service downtime.
- Follow the expand-contract pattern:
  1. **Expand**: Add new nullable columns or tables. Deploy application code reading both old and new columns, writing to both.
  2. **Backfill**: Backfill historical rows in small batches with transaction timeouts.
  3. **Contract**: Remove legacy column references from application code. Drop old columns in a subsequent release.
- Never drop columns, rename tables, or add `NOT NULL` columns without default values in a single breaking migration.

### 2.2 Atomic Migration Execution
- Wrap migration steps in transactions where supported by the database engine (e.g. PostgreSQL DDL transactions).
- For large indexes, use concurrent creation (`CREATE INDEX CONCURRENTLY`) outside transaction blocks to prevent locking production tables.

---

## 3. Layered Architectural Separation

### 3.1 Controller-Service-Repository Segregation
Maintain strict separation of responsibilities:
- **Controllers / Routers**: Responsible for HTTP/RPC transport, input deserialization, boundary validation (via schemas), authentication, and HTTP status codes. No database calls or business rules.
- **Services**: Responsible for business workflows, domain validation, orchestration, and transactional units of work. Independent of HTTP transport.
- **Repositories**: Responsible for database access, SQL construction, query optimization, and tenant scoping. No HTTP objects.

### 3.2 Null and Undefined Normalization
- Normalize database `NULL` values to application domain models consistently.
- Explicitly map optional fields when serializing JSON responses (`data.bio ?? null` or omit via schema).

---

## 4. Backend Verification Checklist

1. [ ] All database queries include `tenant_id` or equivalent tenancy filter.
2. [ ] Database migrations are additive, forward-compatible, and non-blocking.
3. [ ] Business logic isolated in Services, away from Controllers and Repositories.
4. [ ] Nullable values normalized consistently across API boundaries.
5. [ ] Batch operations bounded with limits and timeouts.
