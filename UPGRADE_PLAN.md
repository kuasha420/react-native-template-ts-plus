# React Native Template Modernization Plan

Last updated: 2026-04-18

## Current baseline

- Template package version: `5.1.0`
- Generated app React Native version: `0.70.7`
- Generated app React version: `18.1.0`
- Root `.nvmrc`: `18`
- Template `.nvmrc`: `16`
- Template Ruby pin: `2.7.5`

## Verified modern React Native baseline

- Latest stable React Native on npm: `0.85.1`
- Current active release line in the official release docs: `0.85.x`
- React Native `0.76` made the New Architecture the default on `2024-10-23`
- React Native `0.82` made the New Architecture the only architecture on `2025-10-08`
- React Native `0.85` was released on `2026-04-07`

## What this template already does well

These are the parts worth preserving while we modernize the base:

- TypeScript-first scaffold with code living under `src/`
- Prebuilt app shell instead of the stock welcome screen
- `mobx-state-tree` root store with persistence
- React Navigation shell with typed params
- Deep linking and universal/app link wiring
- `react-native-paper` theme integration with light/dark/system preference
- BootSplash branding flow
- Safe-area-aware container primitives and keyboard-aware form container
- `~/` absolute import alias
- Version bump automation and a generated-project README

## Main gaps versus the current template

### Core platform/template gaps

- Android is still on the pre-`com.facebook.react` Gradle setup and pre-Kotlin template shape.
- iOS is still on the pre-Swift template shape with the older `AppDelegate.mm` bridge bootstrap.
- Tooling still uses old preset packages:
  - `metro-react-native-babel-preset`
  - `@react-native-community/eslint-config`
  - inline `jest` config instead of `@react-native/jest-preset`
  - custom TS config instead of `@react-native/typescript-config`
- Native minimums are behind the current baseline:
  - iOS `12.4` vs official `15.1+`
  - Android SDK `23/31` era vs official SDK `24/36` era
- The template still carries legacy New Architecture opt-in wiring from RN `0.70`, but modern RN expects the new architecture by default and then exclusively after `0.82`.

### Library/ecosystem gaps

- `react-native-vector-icons` is now deprecated in favor of per-icon-family packages.
- `@react-navigation/material-bottom-tabs` is still on the React Navigation 6 line and blocks a clean full move to Navigation 7.
- `react-native-reanimated` will need the modern 4.x setup and its companion `react-native-worklets`.
- `@types/react-native` should be removed because RN ships its own types.
- `@aladdinstudios/react-native-immersive-bars`, `react-native-keyboard-aware-scroll-view`, and `react-native-version` are comparatively stale and need explicit keep/replace decisions.

### Template-specific native refit work

- BootSplash needs to be re-integrated onto the current Swift/Kotlin native entrypoints.
- Deep linking needs to be ported onto the current iOS app delegate flow and modern Android manifest/template layout.
- Vector icon setup needs to move from the old monolithic package and old Gradle/font wiring.
- The current iOS associated-domains entitlements file appears present but not fully wired into the target settings.
- Old Flipper-era and OpenSSL/Protobuf filesystem workarounds should be re-evaluated instead of carried forward blindly.

## Recommended upgrade strategy

Use a scaffold-first rebuild strategy instead of an in-place historical upgrade.

Working approach:

1. Replace the contents of `template/` with a fresh React Native `0.85.1` community CLI scaffold.
2. Reintroduce this template's opinionated DX and libraries on top of that clean baseline.
3. Diff against the current `master` branch to selectively port anything still valuable.

Why this is now the preferred path:

- It avoids carrying forward obsolete Gradle, Podfile, AppDelegate, Babel, Metro, Jest, and TypeScript setup.
- It keeps us close to the official RN `0.85.1` template, which lowers future maintenance cost.
- It turns the task from "upgrade every old file correctly" into "start from the known-good modern baseline, then add value back intentionally."
- It is easier to review in atomic commits because each commit becomes additive and purpose-driven.

Important constraint:

- We should reset `template/` and generated-template files, not blindly rewrite the whole repo. Root-level template package files such as the published package metadata, `template.config.js`, release automation, and top-level docs still need to be preserved and then updated intentionally.

## Phase plan

### Phase 0: Tracking and baseline capture

Goal:
- Lock the plan and baseline so later commits stay reviewable.

Deliverables:
- This plan file
- Recorded modern baseline references:
  - official current template
  - Upgrade Helper checkpoints
  - package/version inventory

Suggested commit:
- `docs: add modernization upgrade plan`

### Phase 1: Tooling foundation and repository hygiene

Goal:
- Align repo-level tooling before changing template behavior.

Work:
- Unify Node expectations around Node 22 LTS
- Refresh `.nvmrc` and package engine metadata
- Refresh Ruby/CocoaPods constraints to the current RN template style
- Decide what to keep pinned in `.ruby-version` versus Gemfile only
- Add or refresh verification scripts for:
  - lint
  - typecheck
  - test
  - template smoke generation
  - optional clean/doctor helpers
- Revisit template packaging ignores and generated-file hygiene

Suggested commit:
- `chore: modernize repo toolchain and verification scripts`

### Phase 2: Replace `template/` with a fresh RN 0.85.1 baseline

Goal:
- Rebase the generated app onto the official modern template in one clean move.

Work:
- Generate a clean RN `0.85.1` reference app
- Replace old files under `template/` with the new scaffold
- Preserve template-specific packaging requirements:
  - placeholder handling
  - published template structure
  - generated project README entry point
- Keep the modern official Android/iOS/Babel/Metro/Jest/TS baseline intact as much as possible
- Remove legacy files that only existed for the old scaffold

Verification:
- Fresh scaffold matches the official RN `0.85.1` shape
- Template installs cleanly
- Generated sample app boots on at least one platform

Suggested commit:
- `feat: replace template scaffold with react-native 0.85.1 baseline`

### Phase 3: Restore template app shell and JS DX

Goal:
- Reapply the template's opinionated JavaScript and UX layer on top of the clean baseline.

Work:
- Rebuild `src/` app shell:
  - MST store and persistence
  - typed navigation
  - theming
  - containers and shared components
  - generated README improvements
  - alias imports
- Reintroduce only the libraries we intend to keep
- Update code to current package APIs instead of preserving old patterns verbatim

Verification:
- Typecheck/lint/test pass
- App shell renders and navigation works

Suggested commit:
- `feat: restore template app shell and javascript dx`

### Phase 4: Restore native integrations intentionally

Goal:
- Reapply native behavior only where it still makes sense on RN `0.85.1`.

Work:
- Re-integrate BootSplash on the current Swift/Kotlin entrypoints
- Rewire deep linking and associated domains/app links
- Refit any system bar / edge-to-edge behavior
- Reconfigure vector icons using the modern package strategy
- Keep native diffs as small as possible relative to the fresh RN `0.85.1` scaffold

Verification:
- Android and iOS startup
- BootSplash handoff
- deep links
- theme/system-bar behavior

Suggested commit:
- `feat: restore native integrations on rn 0.85.1 scaffold`

### Phase 5: Library refit and DX restoration

Goal:
- Finalize the retained dependency set and stabilize everything together.

Work:
- Upgrade retained libraries to latest or latest-compatible versions
- Reapply and verify:
  - MST persistence
  - Paper theme integration
  - typed navigation
  - deep linking
  - BootSplash
  - keyboard-aware container
  - versioning workflow
  - alias imports
- Resolve special cases:
  - replace deprecated `react-native-vector-icons` package usage
  - decide whether to preserve Material bottom tabs literally or modernize the demo to unlock Navigation 7
  - decide whether to keep or replace immersive bar handling
  - decide whether `react-native-version` still earns its place
- remove any integrations that no longer justify their maintenance cost

Suggested commit:
- `feat: restore template integrations on modern react native`

### Phase 6: Modern DX and AI-friendly maintenance

Goal:
- Add the “new era DX” layer after the baseline is stable.

Work:
- Add concise architecture notes for generated apps
- Add AI-agent-friendly maintenance docs where useful
- Refresh generated README with modern run/debug instructions
- Document React Native DevTools and current debugging flow
- Consider opt-in scripts such as `doctor`, `clean`, `verify`, and local smoke app generation
- Revisit whether to opt into newer TS/RN surface APIs only where they improve maintainability without making the template fragile

Suggested commit:
- `docs: refresh generated docs and modern developer experience`

## Decision points to resolve during implementation

### Navigation strategy

Recommended:
- Move toward React Navigation 7 and replace the material-bottom-tab demo with a maintained equivalent.

Why:
- `@react-navigation/material-bottom-tabs` still peers against Navigation 6.
- Keeping it exactly as-is likely forces the whole navigation stack to stay on the older major.

Fallback:
- Keep Navigation 6 temporarily if preserving that exact package matters more than ecosystem alignment.

### Native language alignment

Recommended:
- Follow the current template and migrate app entrypoints to Kotlin and Swift.

Why:
- This keeps the template closer to official RN output and reduces future diff size.

Fallback:
- Preserve Java/Obj-C entrypoints only if a library integration makes Swift/Kotlin migration materially harder.

### Stale utility libraries

Needs explicit review:
- `@aladdinstudios/react-native-immersive-bars`
- `react-native-keyboard-aware-scroll-view`
- `react-native-version`

Approach:
- keep only if they still provide clear value on RN `0.85.1`
- otherwise replace with maintained alternatives or lean on core/platform features

## Tools to use during execution

- Official React Native docs
- Official community CLI template generated locally
- React Native Upgrade Helper
- `reactnative.directory` for New Architecture compatibility checks
- `npm view` peer/version checks for dependency decisions
- Fresh local smoke apps generated from the template after each major phase

## Working assumptions

- We are intentionally keeping this as a bare/community-CLI React Native template, not converting it to Expo.
- Preserving the template’s opinionated app shell matters more than preserving every original package choice.
- Staying close to the current official template is the best way to reduce future maintenance cost.
