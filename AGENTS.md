# Agent Directives: React Native Template TypeScript Plus

Welcome to the resurrection and modernization workspace for `react-native-template-ts-plus`.

## Key Objectives
- Modernize the React Native template from legacy RN `0.70.7` to current stable React Native `0.87.x`.
- Preserve the template's signature developer experience:
  - TypeScript-first `src/` app shell with `~/` alias imports
  - MobX-State-Tree root store with persistence
  - React Navigation structure with typed routes
  - React Native Paper theming (light/dark/system auto-toggle)
  - React Native BootSplash startup flow & asset generator
  - Safe-area & keyboard-avoiding container components
  - Deep linking out-of-the-box
  - Version bump automation & generated project README

## Operating Principles
1. **Scaffold-First Rebuild**: Base the native template on official `@react-native-community/cli` scaffolding for React Native `0.87.x`.
2. **Java 17 Requirement**: Android builds must use Java 17 via `JAVA_HOME=/usr/lib/jvm/zulu-17`.
3. **Template Placeholders**: Preserve `HelloWorld` placeholder name across all template files.
4. **Preserve Decision History**: All architectural and package migration choices must be recorded in `docs/adr/`.
5. **No Regressions**: Verify changes with lint, TypeScript compilation, Jest testing, and local smoke app initialization.
