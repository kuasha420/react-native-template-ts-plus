---
name: psl-test-node
description: >-
  Modular Node.js and TypeScript test runner skill for Agyis Harness.
  Codifies vitest, jest, and package manager test contracts, hermetic environment isolation, ESM/CJS compatibility,
  and sub-second execution invariants.
---
<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) 2026 Arafat Zahan (@kuasha420) -->
<!-- Corporate Stewardship & Infrastructure: Purrfect Software Limited (PSL) -->
<!-- Governed by: ICARO-42/b Ordinance (Company-Supported Personal IP Framework) -->

# PSL Test Skill: Node.js & TypeScript Test Runner

This skill establishes standardized execution contracts and hermetic testing standards for Node.js and TypeScript test suites across Agyis Harness.

---

## 1. Test Runner Invariants

### 1.1 Hermetic Test Invocation
- Execute tests via standard package scripts or direct hermetic runner commands across supported package managers (pnpm, yarn, npm):
  ```bash
  # Fast package manager invocation
  pnpm test
  yarn test
  npm test

  # Vitest runner (preferred for Vite/ESM projects)
  pnpm vitest run --reporter=verbose
  yarn vitest run --reporter=verbose
  npx vitest run --reporter=verbose

  # Jest runner (for CommonJS/legacy suites)
  pnpm jest --runInBand --colors=false
  yarn jest --runInBand --colors=false
  npx jest --runInBand --colors=false
  ```
- Always ensure wrapper shell scripts use `bash` (not POSIX `sh`) with `pipefail` enabled:
  ```bash
  #!/usr/bin/env bash
  set -euo pipefail
  ```

### 1.2 Isolation & Memory Teardown
- Restore environment variables and reset mocks after each test suite (Vitest or Jest):
  ```typescript
  // Vitest
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  // Jest
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  ```
- Clean up any temporary files or sockets created in system directories (`/tmp` or OS temp).
- Avoid unhandled promise rejections (`UnhandledPromiseRejection`); all asynchronous operations must be explicitly awaited or caught.

---

## 2. Failure Transparency & Exit Codes

- The test process must exit with non-zero exit code immediately upon test failure.
- Never pipe runner outputs to commands that swallow exit codes (`pnpm test | cat` masks failure under bash without `pipefail`).
- Maintain sub-second benchmark execution for unit suites using in-memory virtual mocks.
