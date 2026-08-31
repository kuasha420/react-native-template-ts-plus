# 2. Clean Scaffold Reset to React Native 0.87.1 Baseline

Date: 2026-08-31
Status: Accepted

## Context
The legacy template contained extensive configuration and native code drift accumulated since React Native 0.70 (including legacy Flipper CocoaPods hooks, APFS OpenSSL workarounds, Old Architecture C++ JNI bindings, Java entrypoints, and deprecated Babel presets).

To achieve maximum reliability and maintainability, Phase 2 completely replaces the contents of `template/` with the pristine `@react-native-community/template@0.87.1` baseline.

## Decision
1. **Pristine Base**: Unpack `@react-native-community/template@0.87.1` directly into `template/`.
2. **Native Layers**:
   - Android: Pure Kotlin `MainActivity.kt` and `MainApplication.kt` targeting Android SDK 35/36 with AGP 8.x and Gradle 8.x wrapper.
   - iOS: Pure Swift `AppDelegate.swift`, `PrivacyInfo.xcprivacy`, and modern clean `Podfile`.
3. **Tooling Presets**:
   - Babel: `@react-native/babel-preset`
   - Metro: `@react-native/metro-config`
   - Jest: `@react-native/jest-preset`
   - TypeScript: `@react-native/typescript-config`
   - ESLint: `@react-native/eslint-config`
4. **Scaffold Separation**:
   - `src/` app shell backed up and prepared for modular restoration in Phase 3.

## Consequences
- All legacy workarounds, obsolete JNI files, and deprecated presets are eliminated.
- The template starts from an official, fully tested, New Architecture baseline.
