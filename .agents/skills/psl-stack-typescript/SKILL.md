---
name: psl-stack-typescript
description: >-
  Strict TypeScript development standards and architectural invariants for enterprise applications.
  Use when authoring or reviewing TypeScript/JavaScript code, defining data transfer contracts,
  or establishing bounded module boundaries.
---
<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright (c) 2026 Arafat Zahan (@kuasha420) -->
<!-- Corporate Stewardship & Infrastructure: Purrfect Software Limited (PSL) -->
<!-- Governed by: ICARO-42/b Ordinance (Company-Supported Personal IP Framework) -->

# PSL Stack Skill: TypeScript & Strict Type Safety Invariants

This skill codifies the TypeScript development standards and architectural invariants derived from high-performing enterprise repositories across the fleet.

---

## 1. Type Safety Invariants

### 1.1 Absolute Ban on `any`
- The `any` type is strictly prohibited in production code, internal interfaces, and test fixtures.
- When input types are uncertain or external, declare them as `unknown` and perform explicit runtime narrowing:
  ```typescript
  // BAD: Unsound any bypasses compiler guarantees
  function handlePayload(data: any): void {
    console.log(data.userId.toUpperCase());
  }

  // GOOD: unknown with runtime narrowing or Zod schema
  function handlePayload(data: unknown): void {
    const parsed = UserPayloadSchema.parse(data);
    console.log(parsed.userId.toUpperCase());
  }
  ```
- Compiler requirements: `strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`.

### 1.2 Boundary Validation with Zod
All external boundaries (HTTP request bodies, query params, environment variables, RPC payloads, file inputs) must be parsed through runtime schema validation before domain logic execution:
```typescript
import { z } from "zod";

export const UserRegistrationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]),
  displayName: z.string().min(1).max(100),
  metadata: z.record(z.unknown()).optional(),
});

export type UserRegistrationDTO = z.infer<typeof UserRegistrationSchema>;
```
- Never cast unvalidated input using `as UserRegistrationDTO`.
- Use `.safeParse()` when returning formatted validation error responses to callers.

---

## 2. Architectural Boundaries & Sovereignty

### 2.1 Single Source of Truth for DTO Contracts
- Define contract types via Zod schemas and derive TypeScript types using `z.infer<typeof Schema>`.
- Shared contracts must be isolated in dedicated contract packages or `/dto` modules, never entangled with database entities (ORM models) or private domain classes.

### 2.2 Cross-Domain Sovereignty
- Modules and bounded contexts must maintain strict sovereignty.
- Never import internal database models, private services, or implementation details across domain boundaries.
- Cross-domain communication must strictly traverse public service APIs or validated DTO contracts:
  ```
  [Controller / Router] ──(DTO Validation)──> [Domain Service] ──> [Repository / DB]
  ```

### 2.3 Null and Undefined Normalization
- Avoid inconsistent mixing of `null` and `undefined`.
- At API and DTO boundaries, normalize missing fields to `undefined` or explicit schemas:
  ```typescript
  const normalized = rawValue ?? undefined;
  ```
- Use TypeScript utility types (`NonNullable<T>`, `Readonly<T>`) to make invariants explicit.

---

## 3. Node Script Module Hygiene (ESM vs CommonJS)

### 3.1 Strict Extension Discipline in ESM Packages
When a repository is configured with `"type": "module"` in `package.json`:
- All standard `.js` and `.ts` files are treated as ECMAScript Modules (ESM).
- CommonJS module patterns (`require()`, `module.exports`, `exports.`) are syntax errors or runtime failures when executed in standard Node `.js` contexts under ESM.
- Any legacy, migration, or utility scripts that require CommonJS semantics MUST use the explicit `.cjs` file extension.
- Never mix CommonJS globals (`__dirname`, `__filename`, `require`) inside `.js` or `.mjs` files in `"type": "module"` projects without standard ESM equivalents (`import.meta.url`).

### 3.2 Dual Module Strategy & Migration
- Production scripts and packages should prefer standard ESM syntax (`import`, `export`).
- When authoring standalone CLI scripts or build tools that must use synchronous module resolution, name them explicitly with `.cjs`.
- Automated diagnostics (`psl doctor`) enforce this invariant by auditing `.js` files for CommonJS patterns when `"type": "module"` is declared.

---

## 4. Verification & Compliance Checklist

1. [ ] Zero occurrences of `: any` or `as any` in changed files.
2. [ ] All boundary inputs validated with Zod schemas (`safeParse` or `parse`).
3. [ ] Types derived from Zod schemas via `z.infer` rather than duplicate manual interfaces.
4. [ ] No internal database entities exposed across domain boundaries.
5. [ ] Strict null/undefined normalization applied at IO edges.
6. [ ] Node scripts in `"type": "module"` packages use ESM syntax or explicit `.cjs` extension.
