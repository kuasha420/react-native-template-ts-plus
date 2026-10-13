---
name: psl-test-node
description: >-
  Modular Node.js and TypeScript test runner skill for Google Antigravity harnesses.
  Codifies vitest, jest, and pnpm test contracts, hermetic environment isolation, ESM/CJS compatibility,
  and sub-second execution invariants.
---
<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright (c) 2026 Arafat Zahan (@kuasha420) -->
<!-- Corporate Stewardship & Infrastructure: Purrfect Software Limited (PSL) -->
<!-- Governed by: ICARO-42/b Ordinance (Company-Supported Personal IP Framework) -->

# PSL Test Skill: Node.js & TypeScript Test Runner

This skill establishes standardized execution contracts and hermetic testing standards for Node.js and TypeScript test suites across Google Antigravity harnesses.

---

## 1. Test Runner Invariants

### 1.1 Hermetic Test Invocation
- Execute tests via standard package scripts or direct hermetic runner commands:
  ```bash
  # Fast package manager invocation
  pnpm test

  # Vitest runner (preferred for Vite/ESM projects)
  pnpm vitest run --reporter=verbose

  # Jest runner (for CommonJS/legacy suites)
  pnpm jest --runInBand --colors=false
  ```
- Always ensure node process runs with `set -euo pipefail` in wrapper shell scripts.

### 1.2 Isolation & Memory Teardown
- Restore environment variables and reset mocks after each test suite:
  ```typescript
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  ```
- Clean up any temporary files or sockets created in system directories (`/tmp` or OS temp).
- Avoid unhandled promise rejections (`UnhandledPromiseRejection`); all asynchronous operations must be explicitly awaited or caught.

---

## 2. Failure Transparency & Exit Codes

- The test process must exit with non-zero exit code immediately upon test failure.
- Never pipe runner outputs to commands that swallow exit codes (`pnpm test | cat` masks failure under bash without `pipefail`).
- Maintain sub-second benchmark execution for unit suites using in-memory virtual mocks.
